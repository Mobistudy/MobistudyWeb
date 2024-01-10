<template>
  <div class="peakflow_container">
    <div>
      <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
    </div>
    <q-table :rows="getRows()" :columns="getColumns()" row-key="field" :dense="true" class="q-mt-md" :hide-pagination="true" style="height: 100%; width: 100%;" />
  </div>
</template>

<script>
import API from 'src/shared/API'
import { date } from 'quasar'

export default {
  props: ['taskProps'],
  mounted () {
    this.fetchTaskData()
  },
  data () {
    return {
      data: null
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTaskAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[0])
        this.data = this.taskData.PEFs
        this.getRows()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    getValues () {
      const values = this.data
      return values.sort().reverse()
    },
    getColumns () {
      return [
        { name: 'value', align: 'left', label: 'Value', field: 'value' },
        { name: 'peakflow', align: 'left', label: 'PeakFlow', field: 'peakflow' }
      ]
    },
    getRows () {
      return [
        { value: 'Highest value', peakflow: this.data ? this.getValues()[0] : 0 },
        { value: 'Middle value', peakflow: this.data ? this.getValues()[1] : 0 },
        { value: 'Lowest value', peakflow: this.data ? this.getValues()[2] : 0 }
      ]
    }
  }
}
</script>

<style>
.peakflow_container {
  min-height: 400px;
  min-height: 400px;
}
</style>
