<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section class="card-title">
        <div class="text-h6 text-secondary text-bold text-uppercase">{{participant.name}} {{participant.surname}}</div>
      </q-card-section>
      <q-card-section class="card-content">
        <div class="page-content">
          <div class="left-section">
            <q-table
              :rows="tasks"
              selection="none"
              :columns="columns"
              :filter="filter"
              row-key="_key"
              v-model:pagination="pagination"
              @request="loadTasks"
              :loading="loading"
             >
              <template #body-cell-data="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    icon="open_in_new"
                    @click="showTaskData(props)"
                  />
                </q-td>
              </template>
              <template #body-cell-formName="props">
                <q-td :props="props">
                  <template v-if="props.row.taskType === 'form'">
                    <template v-if="getBestLocale(props.row.formName) === 'Unknown'">
                      form
                    </template>
                    <template v-else>
                      {{ getBestLocale(props.row.formName) }}
                    </template>
                  </template>
                  <template v-else>
                    {{ firstLetterUpperCase(props.row.taskType) }}
                  </template>
                </q-td>
              </template>
              <template #body-cell-completedTS="props">
                <q-td :props="props">
                  {{ niceTimestamp(props.row.summary.completedTS) }}
                </q-td>
              </template>
              <template #body-cell-summary="props">
                <q-td :props="props">
                  <p v-for="task, i in taskSummary(props.row.summary, props.row.taskType)" :key="i">
                    {{ task }}
                  </p>
                </q-td>
              </template>
            </q-table>
            <q-dialog v-model="taskDataModal" persistent transition-show="flip-down" transition-hide="flip-up">
              <q-card style="min-width: 300px">
                <q-bar class="my-q-bar bg-primary">
                  <div class="text-h6 text-white text-bold text-uppercase">
                    <span>{{ taskDataType }}</span>
                  </div>
                  <q-space />
                  <q-btn dense flat icon="close" v-close-popup class="material-symbols-outlined">
                    <q-tooltip class="bg-secondary text-white">Close</q-tooltip>
                  </q-btn>
                </q-bar>
                <q-card-section>
                  <div v-if="taskDataType === 'fingerTapping'">
                    <FingerTappingDrawingVisualization :taskProps="taskProps" />
                  </div>
                  <div v-if="taskDataType === 'holdPhone'">
                    <HoldPhoneVisualization :taskProps="taskProps" />
                  </div>
                  <div v-if="taskDataType === 'drawing'">
                    <DrawingVisualization :taskProps="taskProps" />
                  </div>
                  <div v-if="taskDataType === 'tugt'">
                    <TugtVisualization :data="taskDataContent" :completed="niceTimestamp(taskCompletedDate)" />
                  </div>
                  <div v-if="taskDataType === 'vocalization'">
                    <VocalizationVisualization :taskProps="taskProps" />
                  </div>
                  <div v-if="taskDataType === 'peakFlow'">
                    <PeakFlowVisualization :taskProps="taskProps" />
                  </div>
                  <div v-if="taskDataType === 'position'">
                    <PositionVisualization :taskProps="taskProps" />
                  </div>
                  <div v-if="taskDataType === 'miband'">
                    <MibandVisualization :taskProps="taskProps" />
                  </div>
                  <div v-if="taskDataType === 'po60'">
                    <Po60Visualization :taskProps="taskProps" />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
          <div class="right-section">
            <q-tabs class="bg-white text-secondary" align="justify" @change="changeTab" v-model="activeTab">
              <q-tab name="tab-images" icon="photo_library" label="Images" @click="showImages" />
              <q-tab name="tab-chart" icon="bar_chart" label="Chart" @click="showChart" />
            </q-tabs>
            <div>
              <div v-if="activeTab === 'tab-chart'">
                <canvas id="myChart"></canvas>
              </div>

              <div v-else>
                <div id="slider">
                  <transition-group tag="div" :name="transitionName" class="slides-group">
                    <div v-if="slides.length === 0" class="no-images-message">
                      There are no images available in the tasks.
                    </div>
                    <div v-else :key="current" class="slide">
                      <q-img :src="slides[current].imageUrl" alt="Image" class="slide-image">
                        <div class="absolute-bottom text-subtitle1 text-center">
                          <span>{{ niceTimestamp(slides[current].date) }}</span>
                        </div>
                      </q-img>
                    </div>
                  </transition-group>
                  <q-btn v-if="slides.length > 0" class="btn btn-prev" round color="secondary" icon="navigate_before" aria-label="Previous slide" @click="slide(-1)"/>
                  <q-btn v-if="slides.length > 0" class="btn btn-next" round color="secondary" icon="navigate_next" aria-label="Next slide" @click="slide(1)"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'
import { date } from 'quasar'
import { ref } from 'vue'
import Chart from 'chart.js/auto'
import FingerTappingDrawingVisualization from '../taskvisualizations/FingerTappingDrawingVisualization.vue'
import HoldPhoneVisualization from '../taskvisualizations/HoldPhoneVisualization.vue'
import DrawingVisualization from '../taskvisualizations/DrawingVisualization.vue'
import TugtVisualization from '../taskvisualizations/TugtVisualization.vue'
import VocalizationVisualization from '../taskvisualizations/VocalizationVisualization.vue'
import PeakFlowVisualization from '../taskvisualizations/PeakFlowVisualization.vue'
import PositionVisualization from '../taskvisualizations/PositionVisualization.vue'
import MibandVisualization from '../taskvisualizations/MibandVisualization.vue'
import Po60Visualization from '../taskvisualizations/Po60Visualization.vue'

export default {
  name: 'StudyParticipant',
  props: ['studyKey', 'userKey'],
  mixins: [bestLocale],
  components: {
    FingerTappingDrawingVisualization,
    HoldPhoneVisualization,
    DrawingVisualization,
    TugtVisualization,
    VocalizationVisualization,
    PeakFlowVisualization,
    PositionVisualization,
    MibandVisualization,
    Po60Visualization
  },
  data () {
    return {
      locale: this.$i18n.locale,
      current: 0,
      direction: 1,
      transitionName: 'fade',
      show: false,
      slides: [],
      tasksToLoad: [],
      currentIndex: 0,
      tasks: [],
      isImageVisible: false,
      fullscreen: ref(false),
      activeTab: 'tab-chart',
      pagination: { page: 1, rowsPerPage: 10, rowsNumber: 0, sortBy: 'createdTS', descending: true },
      columns: [
        { name: 'data', required: false, label: '', align: 'center', field: 'data', sortable: false },
        { name: 'formName', required: true, label: 'Task', align: 'center', field: 'formName' },
        { name: 'summary', required: true, label: 'Summary', align: 'center', field: 'summary', sortable: false },
        { name: 'completedTS', required: true, label: 'Completed', align: 'center', field: 'completedTS', sortable: true }
      ],
      filter: {},
      participant: '',
      taskDataType: undefined,
      taskDataContent: undefined,
      taskDataModal: false,
      taskCompletedDate: undefined,
      taskProps: null,
      loading: false
    }
  },
  async created () {
    if (this.studyKey && this.studyKey !== -1) {
      this.filter.studyKey = this.studyKey
    }
    if (this.userKey) {
      this.filter.userKey = this.userKey
    }
    this.loadTasks({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  watch: {
    // update the table if the study key changes
    async studyKey () {
      this.filter.studyKey = this.studyKey
      this.loadTasks({
        pagination: this.pagination,
        filter: this.filter
      })
    },
    tasks: {
      immediate: true, // Carga la primera imagen cuando `tasks` cambia por primera vez
      handler (newTasks) {
        if (newTasks.length > 0) {
          this.loadFirstImage()
        }
      }
    }
  },
  mounted () {
    this.getParticipant()
    this.initializeChart()
    this.show = true
  },
  methods: {
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    firstLetterUpperCase (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    async loadTasks (params) {
      this.loading = true
      try {
        const queryParams = {
          studyKey: params.filter.studyKey,
          userKey: params.filter.userKey
        }
        this.tasks = await API.getTasksResults(queryParams.studyKey, queryParams.userKey)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve tasks',
          icon: 'report_problem'
        })
      }
      this.loading = false
    },
    async showTaskData (props) {
      try {
        this.taskDataContent = await API.getTaskAttachment(this.studyKey, this.userKey, props.row.taskId, props.row.attachments[0])
        this.taskDataType = props.row.taskType
        this.taskCompletedDate = props.row.summary.completedTS
        this.taskDataModal = true
        this.taskProps = props
        this.getParticipant()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    async getParticipant () {
      try {
        this.participant = await API.getOneParticipant(this.userKey)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve participant',
          icon: 'report_problem'
        })
      }
    },
    taskSummary (props, data) {
      const list = []
      const { startedTS, completedTS, ...theRest } = props
      const keys = Object.keys(theRest)

      for (let key of keys) {
        let value = theRest[key]
        if (data === 'vocalization') {
          for (const v in value) {
            key = 'Vocal ' + (value[v].vocal).toUpperCase()
            const start = ((value[v].startedTS).slice(11, 23))
            const stop = ((value[v].completedTS).slice(11, 23))
            const time = this.calcDifferenceInTime(start, stop)
            list.push(`${key}: ${time}`)
          }
          return list
        } else if (data === 'holdPhone') {
          const left = value.left.accelerationVariance
          const right = value.right.accelerationVariance
          const average = left + right / 2
          key = key + 'AccelerationVariance'
          value = (Math.round(average * 100) / 100).toString()
        } else if (data === 'tugt') {
          key = key.slice(0, 8)
          value = Math.round(Number(value) / 1000) + ' sec'
        }

        if (data === 'drawing' || data === 'fingerTapping') {
          value = Math.round(Number(value))
          value.toString()
        }
        key = this.firstLetterUpperCase(key)
        key = key.match(/[A-Z][a-z]+|[0-9]+/g).join(' ')
        list.push(`${key}: ${value}`)
      }
      return list
    },
    calcDifferenceInTime (start, stop) {
      start = start.replaceAll(':', '')
      start = start.replaceAll('.', '')
      stop = stop.replaceAll(':', '')
      stop = stop.replaceAll('.', '')
      const time = Math.round((stop - start) / 1000)
      return time + ' sec'
    },
    async loadFirstImage () {
      // Verifica si hay tareas disponibles
      if (this.tasks.length > 0) {
        const firstTaskToLoad = this.tasks[0]
        this.tasksToLoad.push(firstTaskToLoad)
        await this.loadNextImage()
      }
    },
    async loadNextImage () {
      if (this.currentIndex < this.tasksToLoad.length) {
        const taskToLoad = this.tasksToLoad[this.currentIndex]
        const taskId = taskToLoad.taskId
        const jsonId = taskToLoad.attachments[0]
        try {
          const response = await API.getTaskAttachment(this.studyKey, this.userKey, taskId, jsonId)
          const photo = response.find(item => item.questionType === 'photo')
          if (photo) {
            const slide = {
              date: photo.timeStamp,
              imageUrl: photo.answer
            }
            this.slides.push(slide)
            console.log(this.slides)
            this.currentIndex++
          } else {
            this.currentIndex++
            this.handleChange()
            console.error('No se encontró una pregunta de tipo "photo" en los datos.')
          }
        } catch (error) {
          console.error('Error al cargar la imagen:', error)
        }
      }
    },
    async handleChange () {
      if (this.tasks[this.currentIndex]) {
        const taskToLoad = this.tasks[this.currentIndex]
        this.tasksToLoad.push(taskToLoad)
        await this.loadNextImage()
      }
    },
    async slide (dir) {
      this.direction = dir
      if (dir === 1 && !this.slides[this.current + dir]) {
        console.log('load more images..')
        await this.handleChange()
      }
      dir === 1
        ? (this.transitionName = 'slide-next')
        : (this.transitionName = 'slide-prev')
      const len = this.slides.length
      this.current = (this.current + dir % len + len) % len
    },
    showImage () {
      this.isImageVisible = true
      document.body.style.overflow = 'hidden'
    },
    hideImage () {
      this.isImageVisible = false
      document.body.style.overflow = 'auto'
    },
    initializeChart () {
      const ctx = document.getElementById('myChart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['2023-06-04', '2023-06-07', '2023-06-19', '2023-06-25'],
          datasets: [{
            label: 'Pain',
            data: [5, 3, 3, 1],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    },
    showImages () {
      this.activeTab = 'tab-images'
    },

    showChart () {
      this.activeTab = 'tab-chart'
    },
    changeTab (tab) {
      if (tab === 'tab-chart') {
        this.showChart = true
      } else if (tab === 'tab-images') {
        this.showChart = false
      }
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
.full-height {
  height: 100%;
}
.fullscreen-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.fullscreen-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 2rem;
  color: white;
  cursor: pointer;
}

.card-title {
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 16px;
}

.page-content {
  display: flex;
  flex: 1;
}

.left-section {
  flex: 1;
  padding: 16px;
}

.right-section {
  flex: 1;
  padding: 16px;
}
.my-dialog {
  min-width: 400px;
  max-width: 800px;
}

.my-dialog-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.24);
}

.my-dialog-header {
  background-color: #f5f5f5;
  padding: 16px;
  border-bottom: 1px solid #ccc;
}

.my-dialog-content {
  padding: 16px;
}
.my-q-bar{
  padding: 30px 20px 30px 20px;
  border-bottom: 1px solid #ccc;
}
.material-symbols-outlined {
  color: white;
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}

/* CAROUSEL */

/* FADE IN */
.fade-enter-active {
  transition: opacity 1s;
}
.fade-enter {
  opacity: 0;
}

/* GO TO NEXT SLIDE */
.slide-next-enter-active,
.slide-next-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-next-enter {
  transform: translate(100%);
}
.slide-next-leave-to {
  transform: translate(-100%);
}

/* GO TO PREVIOUS SLIDE */
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-prev-enter {
  transform: translate(-100%);
}
.slide-prev-leave-to {
  transform: translate(100%);
}

/* SLIDES CLASSES */
#slider {
  margin-top: 5px;
  width: 100%;
  position: relative;
}
.slide {
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image {
  max-width: 100%;
  max-height: 100%;
}
.btn {
  z-index: 10;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(50% - 35px);
  left: 1%;
  transition: transform 0.3s ease-in-out;
  user-select: none;
}

.btn-next {
  left: auto;
  right: 1%;
}

.btn:hover {
  transform: scale(1.1);
}

/* CAROUSEL FALLBACK */
.no-images-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px; /* Ajusta la altura según tus preferencias */
  font-size: 1.5rem;
  color: #f00; /* Color de texto rojo, puedes cambiarlo a tu preferencia */
  background-color: #fff; /* Color de fondo blanco, puedes cambiarlo según tu diseño */
  border: 1px solid #f00; /* Borde rojo, puedes cambiarlo según tu diseño */
  border-radius: 4px; /* Borde redondeado, ajusta según tus preferencias */
  margin: 20px; /* Márgenes alrededor del mensaje */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Sombra, ajusta según tus preferencias */
}
.no-images-message:hover {
  background-color: #f5c6cb; /* Cambiar color de fondo al pasar el cursor */
  transition: background-color 0.3s ease-in-out;
}
</style>
