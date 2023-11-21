<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(completed) }}</p>
    <div class="figureContainer">
      <div class="figureSquare">
        <p>Square: </p><canvas class="drawingCanvas" ref="originalSquareCanvas"></canvas>
      </div>
      <div class="figureSquare">
        <p>User Square: </p><canvas class="drawingCanvas" ref="userSquareCanvas"></canvas>
      </div>
    </div>
    <div class="figureContainer">
      <div class="figureSpiral">
        <p>Spiral: </p><canvas class="drawingCanvas" ref="originalSpiralCanvas"></canvas>
      </div>
      <div class="figureSpiral">
        <p>User Spiral: </p><canvas class="drawingCanvas" ref="userSpiralCanvas"></canvas>
      </div>
    </div>
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
        this.initializeOriginalSquareChart()
        this.initializeUserSquareChart()
        this.initializeOriginalSpiralChart()
        this.initializeUserSpiralChart()
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
    initializeOriginalSquareChart () {
      const canvas = this.$refs.originalSquareCanvas
      const ctx = canvas.getContext('2d')
      // Hardcoded square coordinates
      const originalSquare = [
        { x: 50, y: 45 },
        { x: 300, y: 45 },
        { x: 300, y: 300 },
        { x: 50, y: 300 },
        { x: 50, y: 50 }
      ]
      canvas.width = 350
      canvas.height = 350
      ctx.beginPath()
      ctx.moveTo(originalSquare[0].x, originalSquare[0].y)
      for (const point of originalSquare) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.closePath()
      ctx.stroke()
    },
    initializeUserSquareChart () {
      const canvas = this.$refs.userSquareCanvas
      const ctx = canvas.getContext('2d')
      const touchCoordinates = this.data.square.touchCoordinates
      const minX = Math.min(...touchCoordinates.map((point) => point.x))
      const minY = Math.min(...touchCoordinates.map((point) => point.y))
      const maxX = Math.max(...touchCoordinates.map((point) => point.x))
      const maxY = Math.max(...touchCoordinates.map((point) => point.y))
      canvas.width = 350
      canvas.height = 350
      const scale = 1
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(scale, scale)
      ctx.translate(-((maxX + minX) / 2), -((maxY + minY) / 2))
      ctx.beginPath()
      ctx.moveTo(touchCoordinates[0].x, touchCoordinates[0].y)
      for (const point of touchCoordinates) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    },
    initializeOriginalSpiralChart () {
      const canvas = this.$refs.originalSpiralCanvas
      const ctx = canvas.getContext('2d')
      // Hardcoded spiral coordinates
      const originalSpiral = [
        { x: 310, y: 230 },
        { x: 310, y: 90 },
        { x: 60, y: 90 },
        { x: 60, y: 90 },
        { x: 60, y: 270 },
        { x: 60, y: 90 }
      ]
      canvas.width = 350
      canvas.height = 350
      ctx.beginPath()
      ctx.moveTo(originalSpiral[0].x, originalSpiral[0].y)
      for (const point of originalSpiral) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    },
    initializeUserSpiralChart () {
      const canvas = this.$refs.userSpiralCanvas
      const ctx = canvas.getContext('2d')
      const touchCoordinates = this.data.spiral.touchCoordinates
      const minX = Math.min(...touchCoordinates.map((point) => point.x))
      const minY = Math.min(...touchCoordinates.map((point) => point.y))
      const maxX = Math.max(...touchCoordinates.map((point) => point.x))
      const maxY = Math.max(...touchCoordinates.map((point) => point.y))
      canvas.width = 350
      canvas.height = 350
      const scale = 1
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(scale, scale)
      ctx.translate(-((maxX + minX) / 2), -((maxY + minY) / 2))
      ctx.beginPath()
      ctx.moveTo(touchCoordinates[0].x, touchCoordinates[0].y)
      for (const point of touchCoordinates) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
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

.figureContainer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.figureSquare, .figureSpiral {
  width: 48%; /* Adjust as needed */
  box-sizing: border-box;
}

.drawingCanvas {
  width: 100%;
  height: 100%;
}

.figureSquare p, .figureSpiral p {
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  color: #459399;
}
</style>
