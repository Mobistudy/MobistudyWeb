<template>
  <div v-if="loaded">
    <Line v-for="(dataset, signal) of chartDataSets" :key="signal" :data="{ labels, datasets: dataset }"
      :options="chartOptions[signal]" />
  </div>
  <h5 v-if="unsupported" style="q-mt-md">Task type currently unsupported</h5>
</template>

<script>
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'
import { taskTypeToString } from '@i18n/utils'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
]

export default {
  name: 'ParticipantSummaryPage',
  props: ['studyDescription', 'userKey', 'selectedTasks'],
  mixins: [bestLocale],
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Line
  },
  data () {
    return {
      loaded: false,
      unsupported: false,
      labels: [],
      chartDataSets: {},
      chartOptions: {}
    }
  },
  watch: {
    async selectedTasks (newTasks, oldTasks) {
      this.loaded = false
      this.unsupported = false

      const studykey = this.studyDescription._key
      // the task type should be the same for all task ids passed
      // we can just take the first
      const taskDescr = this.studyDescription.tasks.find(t => t.id === parseInt(newTasks.value.ids[0]))
      const taskType = taskDescr.type
      const signals = this.getSummarySignalsNames(taskType)
      if (!signals) {
        this.unsupported = true
        return
      }

      // initialize the dataset for each signal
      // labels can be different per task, but not per signal
      this.labels = [] // we only need one for all charts
      this.chartDataSets = {} // we need an array per signal
      // table relating the task id -> the dataset index in the datasets array
      const taskidDatasetIndex = {}

      for (const signal of signals) {
        // initialise datasets arrays
        this.chartDataSets[signal] = []

        // initialise the chart options
        this.chartOptions[signal] = {
          plugins: {
            title: {
              display: true,
              text: signal // TODO: print something nicer
            }
          }
          // responsive: true
        }
      }
      const resp = await API.getTasksResults(studykey, this.userKey, newTasks.value.ids)

      // for each task, populate the labels first
      for (const taskRes of resp) {
        if (!taskRes.discarded) {
          let date = ''
          if (taskRes.summary.completedTS) date = taskRes.summary.completedTS.slice(0, 10)
          else date = taskRes.createdTS.slice(0, 10)
          // add the date to the results, so we don't need to recalcuate it later
          taskRes.date = date

          // add the label (date) if not already present
          if (this.labels.indexOf(date) === -1) {
            this.labels.push(date)
            // results are sorted ascending from API, however each task comes with different dates, so we need to re-sort
            this.labels.sort()
          }
        }
      }
      // now re-iterate for the datapoints
      for (const taskRes of resp) {
        if (!taskRes.discarded) {
          const taskId = taskRes.taskId
          // index of the datapoint with respect to its date
          const Idx = this.labels.indexOf(taskRes.date)
          // get the name of the task
          let taskName = 'Unknown task'
          const task = this.studyDescription.tasks.find(t => t.id === parseInt(taskId))
          if (task.customTitle) {
            taskName = this.getBestLocale(task.customTitle)
          } else {
            if (taskType === 'form' && task.formName) taskName = this.getBestLocale(task.formName)
            else taskName = taskTypeToString(taskType)
          }

          // per each "signal" build up an array of datasets, one per taskId
          // each dataset contains all the datapoints for that task/signal
          for (const signal of signals) {
            // get the index this task id has in the sequence of datasets:
            let dataSetIndex
            if (taskId in taskidDatasetIndex) {
              dataSetIndex = taskidDatasetIndex[taskId]
            } else {
              // this is a new task we are adding, the index will be the one after the last available one
              dataSetIndex = this.chartDataSets[signal].length
              taskidDatasetIndex[taskId] = dataSetIndex
            }

            // initialise the dataset, there is one per signal and task id
            if (!this.chartDataSets[signal][dataSetIndex]) {
              this.chartDataSets[signal][dataSetIndex] = {
                taskId,
                label: taskName,
                borderColor: COLORS[taskId % COLORS.length],
                backgroundColor: COLORS[taskId % COLORS.length],
                showLine: false,
                data: []
              }
            }
            // add the datapoint inside the dataset at the position of the date
            const value = signal.split('.').reduce((p, c) => p?.[c], taskRes.summary)

            this.chartDataSets[signal][dataSetIndex].data[Idx] = value
          }
        }
      }
      this.loaded = true
    }
  },
  methods: {
    getSummarySignalsNames (taskType) {
      if (taskType === 'tugt') return ['durationMs']
      if (taskType === 'fingerTapping') return ['tappingCount']
      if (taskType === 'drawing') return ['totalVariabilitySquare', 'totalVariabilitySpiral']
      if (taskType === 'holdPhone') return ['resting.left.accelerationVariance', 'resting.right.accelerationVariance', 'postural.left.accelerationVariance', 'postural.right.accelerationVariance', 'kinetic.left.accelerationVariance', 'kinetic.right.accelerationVariance']
      if (taskType === 'peakFlow') return ['pefMax']
      if (taskType === 'po60') return ['spo2', 'hr']
      if (taskType === 'smwt') return ['distance']
    }
  }
}
</script>
