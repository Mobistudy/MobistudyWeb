<template>
    <div>
        MiBand Summery
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
      taskData: null
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = this.taskData.filter(task => task.taskType === 'miband')
        console.log(filteredTaskData)
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
<style>
  canvas {
    margin: 50px 0;
  }
</style>
