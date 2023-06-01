<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section class="card-title">
        <div class="text-h6 text-secondary text-bold text-uppercase">Participante {{ `${userKey}` }}</div>
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
                  />
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
          </div>
          <div class="right-section">
            <div id="chart"></div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Highcharts from 'highcharts'
import API from '@shared/API.js'
import { date } from 'quasar'

export default {
  name: 'StudyParticipant',
  props: ['studyKey', 'userKey'],
  data () {
    return {
      tasks: [],
      pagination: { page: 1, rowsPerPage: 10, rowsNumber: 0, sortBy: 'createdTS', descending: true },
      columns: [
        { name: 'data', required: false, label: '', align: 'center', field: 'data', sortable: false },
        { name: 'taskType', required: true, label: 'Task', align: 'center', field: 'taskType' },
        { name: 'asked', required: true, label: 'Asked', align: 'center', field: 'asked', sortable: true },
        { name: 'answered', required: true, label: 'Answered', align: 'center', field: 'answered', sortable: true },
        { name: 'completedTS', required: true, label: 'Completed', align: 'center', field: 'completedTS', sortable: true }
      ],
      chartOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Task Count'
        },
        xAxis: {
          categories: ['John Doe', 'Jane Smith', 'Mike Johnson'], // Agrega más categorías según sea necesario
          title: {
            text: 'Participants'
          }
        },
        yAxis: {
          title: {
            text: 'Count'
          }
        },
        series: [
          {
            name: 'Task Count',
            data: [5, 10, 8] // Agrega más datos según sea necesario
          }
        ]
      },
      filter: {},
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
    Highcharts.chart('chart', this.chartOptions)
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
        console.log(this.tasks)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve participants',
          icon: 'report_problem'
        })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
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
</style>
