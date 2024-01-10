<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
    <div class="figureContainer">
      <div class="figureSquare">
        <p>Square</p><canvas class="drawingCanvas" ref="originalSquareCanvas"></canvas>
      </div>
      <div class="figureSquare">
        <p>User Square</p><canvas class="drawingCanvas" ref="userSquareCanvas"></canvas>
      </div>
    </div>
    <div class="figureContainer">
      <div class="figureSpiral">
        <p>Spiral</p><canvas class="drawingCanvas" ref="originalSpiralCanvas"></canvas>
      </div>
      <div class="figureSpiral">
        <p>User Spiral</p><canvas class="drawingCanvas" ref="userSpiralCanvas"></canvas>
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
      const canvas = this.$refs.originalSquareCanvas
      const ctx = canvas.getContext('2d')
      // Hardcoded square coordinates
      const originalSquare = [{ x: 300, y: 200 }, { x: 300, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 300 }, { x: 300, y: 300 }, { x: 300, y: 200 }]
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
    drawSpiral () {
      const canvas = this.$refs.originalSpiralCanvas
      const ctx = canvas.getContext('2d')
      // Hardcoded spiral coordinates
      const originalSpiral = [
        { x: 300, y: 200 }, { x: 300, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 300 }, { x: 250, y: 300 }, { x: 250, y: 100 },
        { x: 100, y: 100 }, { x: 100, y: 250 }, { x: 200, y: 250 }, { x: 200, y: 150 }, { x: 150, y: 150 }, { x: 150, y: 200 }
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
  width: 50%;
  box-sizing: border-box;
}
.drawingCanvas {
  width: 100%;
  height: 100%;
}
.figureSquare p, .figureSpiral p {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #459399;
}
</style>
