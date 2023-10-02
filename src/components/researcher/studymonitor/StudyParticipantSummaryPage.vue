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
                    {{ props.row.taskType }}
                  </template>
                </q-td>
              </template>
              <template #body-cell-completedTS="props">
                <q-td :props="props">
                  {{ niceTimestamp(props.row.summary.completedTS) }}
                </q-td>
              </template>
              <template #body-cell-asked="props">
                <q-td :props="props">
                  {{ props.row.summary.asked }}
                </q-td>
              </template>

              <template #body-cell-answered="props">
                <q-td :props="props">
                  {{ props.row.summary.answered }}
                </q-td>
              </template>
            </q-table>
            <q-dialog v-model="taskDataModal" persistent transition-show="flip-down" transition-hide="flip-up">
              <q-card style="min-width: 300px">
                <q-bar class="my-q-bar bg-primary">
                  <div class="text-h6 text-white text-bold text-uppercase">
                    <span>{{ niceTimestamp(taskCompletedDate) }}</span>
                  </div>

                  <q-space />

                  <q-btn dense flat icon="close" v-close-popup class="material-symbols-outlined">
                    <q-tooltip class="bg-secondary text-white">Close</q-tooltip>
                  </q-btn>
                </q-bar>

                <q-card-section>
                  <div v-if="taskDataType === 'form'">
                    <div
                      v-for="(answer, index) in taskDataContent"
                      :key="index"
                    >
                      <p class="q-title text-bold">
                        {{ getBestLocale(answer.questionText) }}
                      </p>
                      <p v-if="answer.questionType == 'freetext'">
                        {{ answer.answer }}
                      </p>
                      <p v-if="answer.questionType == 'slider'">
                        {{ answer.answer }}
                      </p>
                      <p v-if="answer.questionType == 'number'">
                        {{ answer.answer }}
                      </p>
                      <p v-if="answer.questionType == 'singleChoice'">
                        {{ answer.answer.answerText }}
                      </p>
                      <div v-if="answer.questionType == 'multiChoice'">
                        <p
                          v-for="(subanswer, index1) in answer.answer"
                          :key="index1"
                        >
                          {{ subanswer.answerText }}
                        </p>
                      </div>
                      <q-img
                        v-if="answer.questionType === 'photo'"
                        :src="answer.answer"
                        @click="showImage"
                      />
                      <div v-show="isImageVisible" class="fullscreen-image">
                        <span class="close-btn" @click="hideImage">&times;</span>
                        <img :src="answer.answer" alt="Full screen Image" />
                      </div>
                    </div>
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
                <Carousel>
                  <!-- <Slide v-for="slide in 10" :key="slide">
                    <div class="carousel__item">{{ slide }}</div>
                  </Slide> -->
                  <Slide v-for="(imageUrl, index) in imageUrls" :key="index">
                    <div class="carousel__item">
                      <img :src="imageUrl" alt="Image" />
                    </div>
                  </Slide>

                  <template #addons>
                    <Navigation />
                    <Pagination />
                  </template>
                </Carousel>
                <!-- <q-carousel
                  swipeable
                  animated
                  arrows
                  draggable="false"
                  v-model="slide"
                  v-model:fullscreen="fullscreen"
                >
                  <q-carousel-slide :name="1" img-src="https://thumbs.dreamstime.com/z/mano-vendada-37116779.jpg"/>
                  <q-carousel-slide :name="2" img-src="https://www.elnacional.cat/uploads/s1/11/59/28/37/de-jong-ma-inflada-atmikkykiemeney_1_630x630.jpeg" />
                  <q-carousel-slide :name="3" img-src="https://media.istockphoto.com/id/682976484/es/foto/parte-hombre-del-cuerpo-con-la-mano-vendada.jpg?s=612x612&w=is&k=20&c=APAnkDXG4nMweVKVzH2W1uaBaNTLP2-1CZg3mWI1jDQ=" />
                  <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

                  <template v-slot:control>
                    <q-carousel-control
                      position="bottom-right"
                      :offset="[18, 18]"
                    >
                      <q-btn
                        push
                        round
                        dense
                        color="white"
                        text-color="secondary"
                        :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="fullscreen = !fullscreen"
                      />
                    </q-carousel-control>
                  </template>
                </q-carousel> -->
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
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

export default {
  name: 'StudyParticipant',
  props: ['studyKey', 'userKey'],
  mixins: [bestLocale],
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  data () {
    return {
      locale: this.$i18n.locale,
      imageUrls: [
        'https://thumbs.dreamstime.com/z/mano-vendada-37116779.jpg',
        'https://www.elnacional.cat/uploads/s1/11/59/28/37/de-jong-ma-inflada-atmikkykiemeney_1_630x630.jpeg',
        'https://media.istockphoto.com/id/682976484/es/foto/parte-hombre-del-cuerpo-con-la-mano-vendada.jpg?s=612x612&w=is&k=20&c=APAnkDXG4nMweVKVzH2W1uaBaNTLP2-1CZg3mWI1jDQ='
      ],
      tasks: [],
      slide: ref(1),
      isImageVisible: false,
      fullscreen: ref(false),
      activeTab: 'tab-chart',
      pagination: { page: 1, rowsPerPage: 10, rowsNumber: 0, sortBy: 'createdTS', descending: true },
      columns: [
        { name: 'data', required: false, label: '', align: 'center', field: 'data', sortable: false },
        { name: 'formName', required: true, label: 'Task', align: 'center', field: 'formName' },
        { name: 'asked', required: true, label: 'Asked', align: 'center', field: 'asked', sortable: true },
        { name: 'answered', required: true, label: 'Answered', align: 'center', field: 'answered', sortable: true },
        { name: 'completedTS', required: true, label: 'Completed', align: 'center', field: 'completedTS', sortable: true }
      ],
      filter: {},
      participant: '',
      taskDataType: undefined,
      taskDataContent: undefined,
      taskDataModal: false,
      taskCompletedDate: undefined,
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
    }
  },
  mounted () {
    this.getParticipant()
    this.initializeChart()
  },
  methods: {
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
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
  /* background-color: #f5f5f5; */
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

.carousel__item {
  height: 100%;
  width: 100%;
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__item > img{
  max-width:100% !important ;
  max-height: 900px !important ;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
  color: #ccc;
}
</style>
