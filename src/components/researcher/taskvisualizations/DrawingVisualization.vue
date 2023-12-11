<template>
  <div class="container">
    <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
    <div class="figureContainer">
      <div class="figureContainerWrapper">
        <p>Square</p>
        <canvas class="drawingCanvas" ref="squareCanvas"></canvas>
      </div>
      <div class="figureContainerWrapper">
        <p>Spiral</p>
        <canvas class="drawingCanvas" ref="spiralCanvas"></canvas>
      </div>
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
      data: null
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTaskAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[0])
        this.data = this.taskData
        this.drawSquare()
        this.drawSpiral()
        this.drawUserSquare()
        this.drawUserSpiral()
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
    drawSquare () {
      const canvas = this.$refs.squareCanvas
      const ctx = canvas.getContext('2d')
      const originalSquare = [
        { x: 300, y: 200 }, { x: 300, y: 50 }, { x: 50, y: 50 },
        { x: 50, y: 300 }, { x: 300, y: 300 }, { x: 300, y: 200 }
      ]
      canvas.width = 350
      canvas.height = 350
      ctx.beginPath()
      ctx.moveTo(originalSquare[0].x, originalSquare[0].y)
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2
      for (const point of originalSquare) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.closePath()
      ctx.stroke()
      const userSquareCoordinates = this.data.square.touchCoordinates
      ctx.beginPath()
      ctx.moveTo(userSquareCoordinates[0].x, userSquareCoordinates[0].y)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      for (const point of userSquareCoordinates) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    },
    drawSpiral () {
      const canvas = this.$refs.spiralCanvas
      const ctx = canvas.getContext('2d')
      const originalSpiral = [
        { x: 300, y: 200 }, { x: 300, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 300 }, { x: 250, y: 300 }, { x: 250, y: 100 },
        { x: 100, y: 100 }, { x: 100, y: 250 }, { x: 200, y: 250 }, { x: 200, y: 150 }, { x: 150, y: 150 }, { x: 150, y: 200 }
      ]
      canvas.width = 350
      canvas.height = 350
      ctx.beginPath()
      ctx.moveTo(originalSpiral[0].x, originalSpiral[0].y)
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2
      for (const point of originalSpiral) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()

      const userSpiralCoordinates = this.data.spiral.touchCoordinates
      ctx.beginPath()
      ctx.moveTo(userSpiralCoordinates[0].x, userSpiralCoordinates[0].y)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      for (const point of userSpiralCoordinates) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    },
    drawUserSquare () {
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
    drawUserSpiral () {
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
.container {
  display: flex;
  flex-wrap: wrap;
}

.taskVisualizationHeader {
  width: 100%;
  text-align: center;
  font-weight: bold;
  color: #459399;
}
.figureContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.drawingCanvas {
  width: 100%;
  height: 100%;
}
.figureContainer p {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #459399;
}
</style>
