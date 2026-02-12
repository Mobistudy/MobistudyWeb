<template>
  <div v-if="loaded">
    <Scatter v-for="(dataset, signal) of chartDataSets" :key="signal" :data="{ labels, datasets: dataset }"
      :options="chartOptions[signal]" />
  </div>
  <h5 v-if="unsupported" style="q-mt-md">Task type currently unsupported</h5>
</template>

<script>
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'
import { taskTypeToString, signalToString, signalToUnitString } from '@i18n/utils'

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Scatter } from 'vue-chartjs'

import 'chartjs-adapter-luxon'
import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
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
    Scatter
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
    /**
     * Creates the charts for the selected tasks
     * @param newTasks - array of task ids, all tasks must be of the same type
     * @param oldTasks - unused
     */
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
      // we keep the same labels for all charts
      this.labels = []
      this.chartDataSets = {} // we need an array per signal
      // table relating the task id -> the dataset index in the datasets array
      const taskidDatasetIndex = {}

      const prepareForSignal = (signal) => {
        // initialise datasets arrays
        this.chartDataSets[signal] = []

        // initialise the chart options
        this.chartOptions[signal] = {
          responsive: true,
          // maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                minUnit: 'minute',
                unit: 'day',
                // Luxon format string
                tooltipFormat: 'DD T'
              },
              title: {
                display: true,
                text: 'time'
              }
            },
            y: {
              title: {
                display: true,
                text: signalToUnitString(signal)
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: signalToString(signal),
              color: '#459399',
              font: {
                size: 16
              }
            },
            legend: {
              display: newTasks.length > 1,
              position: 'top'
            }
          }
        }
      }

      for (const signal of signals) {
        prepareForSignal(signal)
      }

      // helper function to find a date in an array of dates
      function findDateInArray (array, value) {
        return array.findIndex(item => { return item.getTime() === value.getTime() })
      }

      // get indicators to show, this depends on the task type
      if (taskType === 'jstyle') {
        // retrieve the indicators
        // studyKey, userKey, taskIds, producer, offset, count
        let jstyleIndicators = []
        const dailyActivityIndicators = await API.getTaskResultsIndicators(studykey, this.userKey, newTasks.value.ids, 'jstyle-activity-daily-stats')
        jstyleIndicators = jstyleIndicators.concat(dailyActivityIndicators)
        const dailySleepIndicators = await API.getTaskResultsIndicators(studykey, this.userKey, newTasks.value.ids, 'jstyle-sleep-daily-stats')
        jstyleIndicators = jstyleIndicators.concat(dailySleepIndicators)
        if (!jstyleIndicators || jstyleIndicators.length === 0) {
          this.loaded = true
          return
        }
        // sort by date ascending
        jstyleIndicators.sort((a, b) => { return (new Date(a.indicatorsDate) - new Date(b.indicatorsDate)) })

        // jstyle indicators can be associated to multiple task ids, but it's meaningless to show multiple times the same datapoint
        // so we will just pick one task id to associate the datapoint to
        const taskId = newTasks.value.ids[0]

        // now populate the datasets
        // this.chartDataSets[signal][dataSetIndex] contains all the datapoints for that task/signal
        // for example, for signal 'steps', dataSetIndex 0 will contain the datapoints for the first task id
        for (const indicatorSet of jstyleIndicators) {
          // for each indicator, we need to add its date and the values to the datasets
          const date = new Date(indicatorSet.indicatorsDate)
          if (findDateInArray(this.labels, date) === -1) {
            this.labels.push(date)
          }
          for (const signal of signals) {
            // add the datapoint inside the dataset
            if (indicatorSet.indicators[signal]) {
              // as there is only one task id, the dataset index is always 0
              const dataSetIndex = 0

              // initialise the dataset, there is one per signal
              if (!this.chartDataSets[signal][dataSetIndex]) {
                this.chartDataSets[signal][dataSetIndex] = {
                  taskId,
                  label: 'JStyle Activity Monitor',
                  borderColor: COLORS[taskId % COLORS.length],
                  backgroundColor: COLORS[taskId % COLORS.length],
                  showLine: false,
                  data: []
                }
              }

              // add the signal to the dataset
              this.chartDataSets[signal][dataSetIndex].data.push(indicatorSet.indicators[signal])
            }
          }
        }
      } else {
        // other task types, use task results summaries to populate the charts
        const resp = await API.getTasksResults(studykey, this.userKey, newTasks.value.ids)

        // for each task, populate the labels first (the dates)
        for (const taskRes of resp) {
          if (!taskRes.discarded) {
            // if the task is a form, take the summary properties as signals to show
            if (taskType === 'form') {
              for (const prop in taskRes.summary) {
                if (!signals.includes(prop) &&
                  typeof taskRes.summary[prop] === 'number' &&
                  prop !== 'answered' &&
                  prop !== 'asked' &&
                  prop !== 'startedTS' &&
                  prop !== 'completedTS') {
                  signals.push(prop)
                  prepareForSignal(prop)
                }
              }
            }

            let date
            if (taskRes.summary.completedTS) date = new Date(taskRes.summary.completedTS)
            else date = new Date(taskRes.createdTS)
            // add the date to the results, so we don't need to recalcuate it later
            taskRes.date = date
            // add the label (date) if not already present
            if (findDateInArray(this.labels, date) === -1) {
              this.labels.push(date)
            }
          }
        }

        // at this stage all signals are identified, otherwise, set it to unsupported
        if (signals.length === 0) {
          this.unsupported = true
          return
        }

        // results are sorted ascending from API, however each task comes with different dates, so we need to re-sort
        this.labels.sort()
        // now re-iterate for the datapoints
        for (const taskRes of resp) {
          if (!taskRes.discarded) {
            const taskId = taskRes.taskId

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
              {
                // index of the datapoint with respect to its date
                const Idx = findDateInArray(this.labels, taskRes.date)
                const value = signal.split('.').reduce((p, c) => p?.[c], taskRes.summary)
                this.chartDataSets[signal][dataSetIndex].data[Idx] = value
              }
            }
          }
        }
      }

      this.loaded = true
    }
  },
  methods: {
    getDayString (aDate) {
      aDate = new Date(aDate)
      const offset = aDate.getTimezoneOffset()
      aDate = new Date(aDate.getTime() - (offset * 60 * 1000))
      return aDate.toISOString().split('T')[0]
    },
    getSummarySignalsNames (taskType) {
      if (taskType === 'form') return []
      if (taskType === 'tugt') return ['durationMs']
      if (taskType === 'fingerTapping') return ['tappingCount']
      if (taskType === 'drawing') return ['totalVariabilitySquare', 'totalVariabilitySpiral']
      if (taskType === 'holdPhone') return ['resting.left.accelerationVariance', 'resting.right.accelerationVariance', 'postural.left.accelerationVariance', 'postural.right.accelerationVariance', 'kinetic.left.accelerationVariance', 'kinetic.right.accelerationVariance']
      if (taskType === 'peakFlow') return ['pefMax']
      if (taskType === 'po60') return ['spo2', 'hr']
      if (taskType === 'smwt') return ['distance']
      if (taskType === 'jstyle') return ['steps', 'activeMinutes', 'exerciseMinutes', 'sleepDurationMins']
    }
  }
}
</script>
