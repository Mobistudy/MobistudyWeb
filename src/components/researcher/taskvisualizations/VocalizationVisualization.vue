<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
    <div class="audioBox" v-for="d, i in this.data" :key="i">
      <p class="vocal"> {{ d.name }}</p>
      <audio controls>
        <source :src=d.url>
      </audio>
    </div>
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
      completed: null,
      data: null
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        const index = [0, 1, 2]
        const taskData = []
        for (const i in index) {
          this.taskData = await API.getAudioAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[i])
          const objectUrl = URL.createObjectURL(this.taskData)
          taskData.push({ url: objectUrl, name: `Vocal ${(this.taskProps.row.summary.phases[i].vocal).toUpperCase()}` })
        }
        this.completed = taskData.createdTS
        this.data = taskData
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
    }
  }
}
</script>

<style>
.taskVisualizationHeader {
  text-align: center;
  font-weight: bold;
  color: #459399;
}
.audioBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}
audio {
  margin-bottom: 20px;
}
audio::-webkit-media-controls-play-button,
  audio::-webkit-media-controls-panel {
  background-color:#459399;
  color: #459399;
}
.vocal {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #459399;
}
</style>
