<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(completed) }}</p>
  </div>
  {{ this.data && this.data }}
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
      completed: null,
      data: null
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTaskAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[0])
        this.completed = this.taskData.createdTS
        this.data = this.taskData
        console.log('Kinetic', this.getKineticMotion())
        console.log('Postural', this.getPosturalMotion())
        console.log('Resting', this.getRestingMotion())
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
    getKineticMotion () {
      return this.data.kinetic
    },
    getPosturalMotion () {
      return this.data.postural
    },
    getRestingMotion () {
      return this.data.resting
    }
  }
}
</script>

<style>

</style>
