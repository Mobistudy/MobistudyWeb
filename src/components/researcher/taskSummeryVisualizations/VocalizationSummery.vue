<template>
    <div>
        Vocalization Summery
    </div>
</template>

<script>
import API from 'src/shared/API'

export default {
  props: ['studyKey', 'userKey'],
  mounted () {
    this.fetchTaskData()
  },
  data () {
    return {
      taskData: null,
      vocalizationResults: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = this.taskData.filter(task => task.taskId === 'vocalization')
        this.vocalizationResults = filteredTaskData
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    }
  }
}
</script>

<style>

</style>
