<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>

    <!-- Square canvas and user sketch-->
    <div class="figureContainer">
      <div class="figureSquare">
        <p>Square: </p>
        <canvas class="drawingCanvas" ref="originalSquareCanvas"></canvas>
      </div>

      <div class="figureSquare">
        <p>User Square: </p>
        <canvas class="drawingCanvas" ref="userSquareCanvas"></canvas>
      </div>
    </div>

    <!-- Spiral canvas and the user sketch-->
    <div class="figureContainer">
      <div class="figureSpiral">
        <p>Spiral: </p>
        <canvas class="drawingCanvas" ref="originalSpiralCanvas"></canvas>
      </div>

      <div class="figureSpiral">
        <p>User Spiral: </p>
        <canvas class="drawingCanvas" ref="userSpiralCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['data', 'completed'],
  mounted() {
    this.initializeOriginalSquareChart()
    this.initializeUserSquareChart()
    this.initializeOriginalSpiralChart()
    this.initializeUserSpiralChart()
  },
  methods: {
    initializeOriginalSquareChart() {
      const canvas = this.$refs.originalSquareCanvas;
      const ctx = canvas.getContext('2d')

      // Hardcoded original square coordinates (replace with better values if any)
      const originalSquare = [
        { x: 50, y: 45 },
        { x: 300, y: 45 },
        { x: 300, y: 300 },
        { x: 50, y: 300 },
        { x: 50, y: 50 } // Closing the loop
      ]
      // adjust the width and height of the canvas to make more space around the sketches so more of the user sketches are visible
      canvas.width = 350
      canvas.height = 350

      // Draw the original square
      ctx.beginPath()
      ctx.moveTo(originalSquare[0].x, originalSquare[0].y)
      for (const point of originalSquare) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.closePath()
      ctx.stroke()
    },

    initializeUserSquareChart() {
      const canvas = this.$refs.userSquareCanvas;
      const ctx = canvas.getContext('2d')

      // Iterate through user's touchCoordinates and draw on the canvas
      const touchCoordinates = this.data.square.touchCoordinates

      // Find the min and max coordinates to calculate the bounding box
      const minX = Math.min(...touchCoordinates.map((point) => point.x))
      const minY = Math.min(...touchCoordinates.map((point) => point.y))
      const maxX = Math.max(...touchCoordinates.map((point) => point.x))
      const maxY = Math.max(...touchCoordinates.map((point) => point.y))

      // Calculate the scaling factors for the X and Y axes
      const scaleX = canvas.width / (maxX - minX)
      const scaleY = canvas.height / (maxY - minY)

      // adjust the width and height of the canvas to make more space around the sketches so more of the user sketches are visible
      canvas.width = 350
      canvas.height = 350
      
      const scale = 1

      // Choose the minimum scaling factor to maintain the aspect ratio

      // Translate to the center of the canvas and apply the scale
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(scale, scale)
      ctx.translate(-((maxX + minX) / 2), -((maxY + minY) / 2))

      // Draw the user's sketch
      ctx.beginPath()
      ctx.moveTo(touchCoordinates[0].x, touchCoordinates[0].y)
      for (const point of touchCoordinates) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    },

    initializeOriginalSpiralChart() {
      const canvas = this.$refs.originalSpiralCanvas;
      const ctx = canvas.getContext('2d')

      // Hardcoded original spiral coordinates (right now it's not a good example)
      const originalSpiral = [
        // Right
        { x: 310, y: 230 },
        { x: 310, y: 90 },

        // Up
        { x: 60, y: 90 },
        { x: 60, y: 90 },

        // down
        { x: 60, y: 270 },
        { x: 60, y: 90 },
      ]

      // adjust the width and height of the canvas to make more space around the sketches so more of the user sketches are visible
      canvas.width = 350
      canvas.height = 350

      // Draw the original square-like spiral
      ctx.beginPath()
      ctx.moveTo(originalSpiral[0].x, originalSpiral[0].y)
      for (const point of originalSpiral) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    },

    initializeUserSpiralChart() {
      const canvas = this.$refs.userSpiralCanvas;
      const ctx = canvas.getContext('2d')

      // Iterate through user's touchCoordinates and draw on the canvas
      const touchCoordinates = this.data.spiral.touchCoordinates

      // Find the min and max coordinates to calculate the bounding box
      const minX = Math.min(...touchCoordinates.map((point) => point.x))
      const minY = Math.min(...touchCoordinates.map((point) => point.y))
      const maxX = Math.max(...touchCoordinates.map((point) => point.x))
      const maxY = Math.max(...touchCoordinates.map((point) => point.y))

      // Calculate the scaling factors for the X and Y axes
      const scaleX = canvas.width / (maxX - minX)
      const scaleY = canvas.height / (maxY - minY)

      // adjust the width and height of the canvas to make more space around the sketches so more of the user sketches are visible
      canvas.width = 350
      canvas.height = 350

      // Choose the minimum scaling factor to maintain the aspect ratio
      const scale = 1

      // Translate to the center of the canvas and apply the scale
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(scale, scale)
      ctx.translate(-((maxX + minX) / 2), -((maxY + minY) / 2))

      // Draw the user's spiral
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
