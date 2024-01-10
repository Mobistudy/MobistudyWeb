<template>
  <div class="po60_container">
    <div>
      <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
    </div>
    <q-table :rows="this.getRows()" :columns="this.getColumns()" row-key="field" :dense="true" class="q-mt-md" :hide-pagination="true" style="height: 100%; width: 100%;" />
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
        this.data = this.taskData.po60Data
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
    getColumns () {
      return [
        { name: 'value', align: 'left', label: 'Health Data', field: 'value' },
        { name: 'po60', align: 'left', label: 'Value', field: 'po60' }
      ]
    },
    getRows () {
      return [
        { value: 'Max HR', po60: this.data ? this.data.hrMax : 0 },
        { value: 'Min HR', po60: this.data ? this.data.hrMin : 0 },
        { value: 'Avg HR', po60: this.data ? this.data.hrAvg : 0 },
        { value: 'Max SPO2', po60: this.data ? this.data.SPO2Max : 0 },
        { value: 'Min SPO2', po60: this.data ? this.data.SPO2Min : 0 },
        { value: 'Avg SPO2', po60: this.data ? this.data.SPO2Avg : 0 }
      ]
    }
  }
}
</script>

<style>
.po60_container {
  min-height: 400px;
  min-height: 400px;
}
</style>
