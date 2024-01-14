<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white q-pa-md">
      <q-toolbar-title>
        <strong>{{ participant.name }} {{ participant.surname }}</strong>
      </q-toolbar-title>
      <q-btn class="float-right q-mr-md" round color="black" icon="close" @click="closeTab()" />
    </q-toolbar>

    <div class="row">

      <div class="q-ma-md col">
        <q-table :rows="tasks" selection="none" :columns="columns" row-key="_key" v-model:pagination="pagination"
          @request="loadTasksSummary" :loading="loadingTasksSummary">
          <template #body-cell-data="props">
            <q-td :props="props">
              <q-btn flat icon="open_in_new" @click="showTaskData(props.row)" />
            </q-td>
          </template>
          <template #body-cell-formName="props">
            <q-td :props="props">
              {{ showTaskName(props.row.taskId) }}
            </q-td>
          </template>
          <template #body-cell-completedTS="props">
            <q-td :props="props">
              <div v-if="props.row.discarded">{{ niceTimestamp(props.row.createdTS) }}</div>
              <div v-else>{{ niceTimestamp(props.row.summary?.completedTS) }}</div>
            </q-td>
          </template>
          <template #body-cell-summary="props">
            <q-td :props="props">
              <div v-if="props.row.discarded">Discarded</div>
              <div v-else v-html="taskSummaryToString(props.row.summary, props.row.taskType)"></div>
            </q-td>
          </template>
        </q-table>
      </div>

      <q-card class="q-ma-md col">
        <q-card-section>
          <div class="text-h6">Progression</div>
          <q-select square outlined v-model="progrSelectedTasks" :options="progrTaskSelectOptions" label="Select task" />
          <div v-show="!progrSelectedTasks">
            No task selected
          </div>
          <div>
            <TaskProgressionCharts :studyDescription="studyDescription" :userKey="userKey"
              :selectedTasks="progrSelectedTasks" />
          </div>
        </q-card-section>
      </q-card>

    </div>

    <!-- <q-dialog v-model="taskDataModal" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card style="min-width: 400px; max-width: 900px;">
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
            <TugtVisualization :taskProps="taskProps" />
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
          <div v-if="taskDataType === 'miband3'">
            <MiBand3Visualization :studyKey="studyKey" :userKey="userKey" :taskDataContent="taskDataContent" />
          </div>
          <div v-if="taskDataType === 'smwt'">
            <div>
              <p class="q-title text-bold">Steps</p>
              <p>{{ smwtSteps }}</p>
              <p class="q-title text-bold">Distance</p>
              <p>{{ smwtDistance }} m</p>
            </div>
            <div>
              <q-option-group v-model="panel" inline :options="[
                { label: 'Map', value: 'map' },
                { label: 'Chart', value: 'chart' }
              ]" />
              <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
                <q-tab-panel name="map">
                  <SmwtMapVisualization :studyKey="studyKey" :userKey="userKey" :taskDataContent="taskDataContent">
                  </SmwtMapVisualization>
                </q-tab-panel>
                <q-tab-panel name="chart">
                  <SmwtChartVisualization :studyKey="studyKey" :userKey="userKey" :taskDataContent="taskDataContent">
                  </SmwtChartVisualization>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog> -->

  </q-page>
</template>

<script>
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'
import { taskTypeToString } from '@i18n/utils'
import { date } from 'quasar'

import AnswersDialog from './taskResultsDialogs/AnswersDialog.vue'
import DrawingDialog from './taskResultsDialogs/DrawingDialog.vue'

import TaskProgressionCharts from './TaskProgressionCharts.vue'

export default {
  name: 'ParticipantSummaryPage',
  props: ['studyKey', 'userKey'],
  mixins: [bestLocale],
  components: {
    TaskProgressionCharts
  },
  data () {
    return {
      participant: {},
      studyDescription: {},
      // for the summary table:
      tasks: [],
      columns: [
        { name: 'data', required: false, label: '', align: 'center', field: 'data', sortable: false },
        { name: 'formName', required: true, label: 'Task', align: 'center', field: 'formName' },
        { name: 'summary', required: true, label: 'Summary', align: 'center', field: 'summary', sortable: false },
        { name: 'completedTS', required: true, label: 'Completed', align: 'center', field: 'completedTS', sortable: false }
      ],
      pagination: { page: 1, rowsPerPage: 20, rowsNumber: 0 },
      loadingTasksSummary: false,

      // for progression charts:
      progrTaskSelectOptions: [],
      progrSelectedTasks: null

      // locale: this.$i18n.locale,
      // panel: ref('map'),
      // current: 0,
      // direction: 1,
      // transitionName: 'fade',
      // slides: [],
      // tasksToLoad: [],
      // currentIndex: 0,
      // isImageVisible: false,
      // fullscreen: ref(false),
      // activeTab: 'tab-chart',
      // taskDataType: undefined,
      // taskDataContent: undefined,
      // taskDataModal: false,
      // taskCompletedDate: undefined,
      // taskProps: null,
      // smwtDistance: undefined,
      // smwtSteps: undefined,
      // chartLoaded: false,
      // chartData: {
      //   labels: [],
      //   datasets: [
      //     {
      //       label: 'Pain',
      //       backgroundColor: 'rgba(255, 0, 0, 0.5)',
      //       data: []
      //     },
      //     {
      //       label: 'Temperature',
      //       backgroundColor: 'rgba(0, 0, 255, 0.5)',
      //       data: []
      //     }
      //   ]
      // },
      // chartOptions: {
      //   responsive: true,
      //   scales: {
      //     x: {
      //       title: {
      //         display: true,
      //         text: 'Date'
      //       }
      //     },
      //     y: {
      //       title: {
      //         display: true,
      //         text: 'Value'
      //       }
      //     }
      //   }
      // }
    }
  },
  async created () {
    try {
      this.participant = await API.getOneParticipant(this.userKey)
    } catch (err) {
      console.error(err)
      this.$q.notify({
        color: 'negative',
        message: 'Cannot retrieve participant information',
        icon: 'report_problem'
      })
    }

    try {
      this.studyDescription = await API.getStudy(this.studyKey)

      const taskOptions = []

      for (const task of this.studyDescription.tasks) {
        if (task.type === 'form') {
          // forms must be separated by form name
          taskOptions.push({
            label: this.getBestLocale(task.formName),
            value: {
              type: task.type,
              ids: [task.id]
            }
          })
        } else {
          // lump all non forms together
          const opt = taskOptions.find(t => t.value.type === task.type)
          if (!opt) {
            taskOptions.push({
              label: taskTypeToString(task.type),
              value: {
                type: task.type,
                ids: [task.id]
              }
            })
          } else {
            opt.value.ids.push(task.id)
          }
        }
      }
      this.progrTaskSelectOptions = taskOptions
    } catch (err) {
      console.error(err)
      this.$q.notify({
        color: 'negative',
        message: 'Cannot retrieve study plan',
        icon: 'report_problem'
      })
    }

    this.loadTasksSummary()
  },
  methods: {
    /**
     * Closes the current tab
     */
    closeTab () {
      window.close()
    },
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    firstLetterUpperCase (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    /**
     * Formats the task name in a readable string
     */
    showTaskName (taskId) {
      const task = this.studyDescription.tasks.find(t => t.id === taskId)
      if (!task) return 'Unknown task'
      if (task.customTitle) {
        return this.getBestLocale(task.customTitle)
      }
      const taskType = task.type
      if (taskType === 'form' && task.formName) return this.getBestLocale(task.formName)
      return this.firstLetterUpperCase(taskType)
    },
    /**
     * Loads the tasks summary table for that participant
     */
    async loadTasksSummary (params) {
      this.loadingTasksSummary = true
      if (params) this.pagination = params.pagination
      const offset = (this.pagination.page - 1) * this.pagination.rowsPerPage
      const count = this.pagination.rowsPerPage
      try {
        const resp = await API.getTasksResults(this.studyKey, this.userKey, null, offset, count)
        this.tasks = resp.subset
        this.pagination.rowsNumber = resp.totalCount
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve tasks',
          icon: 'report_problem'
        })
      }
      this.loadingTasksSummary = false
    },
    /**
     * Opens a dialog with the task results details
     */
    async showTaskData (taskResult) {
      let component
      if (taskResult.taskType === 'form') component = AnswersDialog
      if (taskResult.taskType === 'drawing') component = DrawingDialog
      this.$q.dialog({
        // component loaded into the dialog
        component,
        // props forwarded to custom component
        componentProps: {
          taskResult,
          taskName: this.showTaskName(taskResult.taskId)
        }
      })
    },
    /**
     * Formats the task summary to a readable string
     */
    taskSummaryToString (summary, taskType) {
      let retString = ''
      if (taskType === 'form') {
        retString += 'Answered: ' + summary.answered + ' of ' + summary.asked
        for (const prop in summary) {
          if (prop !== 'answered' &&
            prop !== 'asked' &&
            prop !== 'startedTS' &&
            prop !== 'completedTS') retString += this.firstLetterUpperCase(prop) + ': ' + summary[prop]
        }
      } else if (taskType === 'dataQuery') {
        retString += 'Type: ' + summary.type
      } else if (taskType === 'drawing') {
        retString += 'Square deviation: ' + summary.totalVariabilitySquare.toFixed(0) + '<br>'
        retString += 'Spiral deviation: ' + summary.totalVariabilitySpiral.toFixed(0) + '<br>'
      } else if (taskType === 'fingerTapping') {
        retString += 'Taps count: ' + summary.tappingCount + '<br>'
      } else if (taskType === 'vocalization') {
        for (const phase of summary.phases) {
          const timeDiffSecs = (new Date(phase.completedTS).getTime() - new Date(phase.startedTS).getTime()) / 1000
          retString += 'Vowel ' + phase.vocal.toUpperCase() + ' : ' + Math.round(timeDiffSecs) + ' sec <br>'
        }
      } else if (taskType === 'holdPhone') {
        retString += 'Resting accel variance L ' + summary.resting.left.accelerationVariance.toFixed(2)
        retString += ' - R ' + summary.resting.right.accelerationVariance.toFixed(2) + '<br>'
        retString += 'Postural accel variance L ' + summary.postural.left.accelerationVariance.toFixed(2)
        retString += ' - R ' + summary.postural.right.accelerationVariance.toFixed(2) + '<br>'
        retString += 'Kinetic accel variance L ' + summary.postural.left.accelerationVariance.toFixed(2)
        retString += ' - R ' + summary.kinetic.right.accelerationVariance.toFixed(2)
      } else if (taskType === 'tugt') {
        retString += 'Duration: ' + (summary.durationMs / 1000).toFixed(0) + ' sec'
      } else if (taskType === 'miband3') {
        retString += 'From: ' + summary.firstTS + ' to: ' + summary.lastTS + '<br>'
      } else if (taskType === 'peakFlow') {
        retString += 'PEF Max: ' + summary.pefMax + '<br>'
      } else if (taskType === 'po60') {
        retString += 'SPO2: ' + summary.spo2 + ', HR: ' + summary.hr + '<br>'
      } else if (taskType === 'position') {
        retString += 'Location: ' + summary.location + '<br>'
        retString += 'Weather: ' + summary.weather + '<br>'
        retString += 'Temperature: ' + summary.temperature + '<br>'
        retString += 'Air quality: ' + summary.aqi + '<br>'
      } else if (taskType === 'smwt') {
        retString += 'Distance: ' + summary.distance.toFixed(0) + 'm <br>'
      }
      return retString
    }

    // async loadNextImage () {
    //   console.log(this.currentIndex)
    //   if (this.currentIndex < this.tasksToLoad.length) {
    //     const taskToLoad = this.tasksToLoad[this.currentIndex]
    //     const taskId = taskToLoad.taskId
    //     const jsonId = taskToLoad.attachments[0]
    //     try {
    //       const response = await API.getTaskAttachment(this.studyKey, this.userKey, taskId, jsonId)
    //       if (Array.isArray(response)) { // Comprueba si response es un array
    //         const photo = response.find(item => item.questionType === 'photo')
    //         if (photo && photo.answer) {
    //           const slide = {
    //             date: photo.timeStamp,
    //             imageUrl: photo.answer
    //           }
    //           this.slides.push(slide)
    //           this.currentIndex++
    //         } else {
    //           // La tarea actual es de tipo "photo", pero no tiene respuesta.
    //           this.currentIndex++
    //           this.handleChange()
    //         }
    //       } else {
    //         // En caso de que response no sea un array
    //         console.error('La respuesta no es un array válido.')
    //         this.currentIndex++
    //         this.handleChange()
    //       }
    //     } catch (error) {
    //       console.error('Error al cargar la imagen:', error)
    //     }
    //   }
    // },
    // async handleChange () {
    //   if (this.tasks[this.currentIndex]) {
    //     const taskToLoad = this.tasks[this.currentIndex]
    //     this.tasksToLoad.push(taskToLoad)
    //     await this.loadNextImage()
    //   }
    // },
    // async slide (dir) {
    //   this.direction = dir
    //   if (dir === 1 && !this.slides[this.current + dir]) {
    //     console.log('load more images..')
    //     await this.handleChange()
    //   }
    //   dir === 1
    //     ? (this.transitionName = 'slide-next')
    //     : (this.transitionName = 'slide-prev')
    //   const len = this.slides.length
    //   this.current = (this.current + dir % len + len) % len
    // },
    // async updateChartData () {
    //   const chartData = []

    //   for (const task of this.tasks) {
    //     const taskId = task.taskId
    //     const jsonId = task.attachments[0]
    //     console.log(task)

    //     try {
    //       const taskAttachment = await API.getTaskAttachment(this.studyKey, this.userKey, taskId, jsonId)

    //       const filteredData = taskAttachment.filter(item => {
    //         return item.questionType === 'number' || item.questionType === 'slider'
    //       }).map(item => {
    //         return {
    //           type: this.getBestLocale(item.questionText),
    //           timestamp: task.summary.completedTS,
    //           value: item.answer
    //         }
    //       })
    //       chartData.push(...filteredData)
    //     } catch (error) {
    //       console.error('Error fetching task attachment:', error)
    //     }
    //   }
    //   // Group timestamps by day
    //   const uniqueDates = [...new Set(chartData.map(item => this.niceTimestamp(item.timestamp)))]

    //   // Initialize datasets with empty arrays
    //   const painData = Array(uniqueDates.length).fill(0)
    //   const temperatureData = Array(uniqueDates.length).fill(0)

    //   // Update dataset values based on the data
    //   chartData.forEach(item => {
    //     const dateIndex = uniqueDates.indexOf(this.niceTimestamp(item.timestamp))
    //     if (item.type === 'Pain') {
    //       painData[dateIndex] += item.value
    //     } else if (item.type === 'Temperature') {
    //       temperatureData[dateIndex] += item.value
    //     }
    //   })

    //   // Update the chartData object
    //   this.chartData.labels = uniqueDates
    //   this.chartData.datasets[0].data = painData
    //   this.chartData.datasets[1].data = temperatureData

    //   this.chartLoaded = true
    // },
    // getDateForChart (timeStamp) {
    //   const date = new Date(timeStamp)
    //   return date.toISOString().split('T')[0]
    // },
    // showImage () {
    //   this.isImageVisible = true
    //   document.body.style.overflow = 'hidden'
    // },
    // hideImage () {
    //   this.isImageVisible = false
    //   document.body.style.overflow = 'auto'
    // },
    // showImages () {
    //   this.activeTab = 'tab-images'
    // },

    // showChart () {
    //   this.activeTab = 'tab-chart'
    // },
    // changeTab (tab) {
    //   if (tab === 'tab-chart') {
    //     this.showChart = true
    //   } else if (tab === 'tab-images') {
    //     this.showChart = false
    //   }
    // }
  }
}
</script>

<style scoped>
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

.my-q-bar {
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
  height: 500px;
  /* Ajusta la altura según tus preferencias */
  font-size: 1.5rem;
  color: #f00;
  /* Color de texto rojo, puedes cambiarlo a tu preferencia */
  background-color: #fff;
  /* Color de fondo blanco, puedes cambiarlo según tu diseño */
  border: 1px solid #f00;
  /* Borde rojo, puedes cambiarlo según tu diseño */
  border-radius: 4px;
  /* Borde redondeado, ajusta según tus preferencias */
  margin: 20px;
  /* Márgenes alrededor del mensaje */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  /* Sombra, ajusta según tus preferencias */
}

.no-images-message:hover {
  background-color: #f5c6cb;
  /* Cambiar color de fondo al pasar el cursor */
  transition: background-color 0.3s ease-in-out;
}

/* CHART */
#my-chart-id {
  margin-top: 5px;
}
</style>
