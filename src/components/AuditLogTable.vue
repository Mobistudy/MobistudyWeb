<template>
  <div>
    <q-table
      title="Audit logs"
      ref="table"
      color="primary"
      :rows="logs"
      selection="none"
      :columns="columns"
      :filter="filter"
      row-key="_key"
      v-model:pagination="pagination"
      @request="loadLogs"
      :loading="loading"
    >
      <template #top-right>
        <q-select
          emit-value
          map-options
          :options="eventTypesOpts"
          v-model="filter.eventType"
          hint="Event"
          @input="updateFilters()"
          class="q-mr-sm"
          style="width: 150px"
        />
        <q-input
          v-model="filter.after"
          type="date"
          hint="From date"
          clearable
          @input="updateFilters()"
          class="q-mr-sm"
        />
        <q-input
          v-model="filter.before"
          type="date"
          hint="To date"
          clearable
          @input="updateFilters()"
          class="q-mr-sm"
        />
        <q-input
          v-model="filter.userEmail"
          type="text"
          hint="User email"
          clearable
          @input="updateFilters()"
          debounce="500"
        />
      </template>
      <template #body-cell-timestamp="props">
        <q-td :props="props">
          {{ niceTimestamp(props.value) }}
        </q-td>
      </template>
      <template #body-cell-data="props">
        <q-td :props="props">
          <q-btn
            v-if="props.value"
            flat
            icon="info"
            @click="showLogData(props)"
          />
        </q-td>
      </template>
    </q-table>
    <q-dialog
      v-model="logDataModal"
      :content-css="{minWidth: '50vw'}"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">
            <span v-if="logDataType == 'raw'">Data:</span>
            <span v-if="logDataType == 'healthStoreData'"><span class="text-capitalize">{{ logDataModalContent.dataType }}</span> from Google Fit / HealthKit:</span>
            <span v-if="logDataType == 'answers'">Answers:</span>
          </div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section>
          <div v-if="logDataType == 'raw'">
            <pre>
              {{ logDataModalContent }}
            </pre>
          </div>
          <div v-if="logDataType == 'healthStoreData'">
            <div
              v-for="(hd, index) in logDataModalContent.healthData"
              :key="index"
              class="q-ma-md"
            >
              Start: {{ niceTimestamp(hd.startDate )}}<br />
              End: {{ niceTimestamp(hd.endDate) }}<br />
              Value: {{ hd.value }} {{ hd.unit }}
            </div>
          </div>
          <div v-if="logDataType == 'answers'">
            <div
              v-for="(answer, index) in logDataModalContent.responses"
              :key="index"
            >
              <p class="q-title">
                {{ answer.questionText }}
              </p>
              <p v-if="answer.questionType == 'freetext'">
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
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import API from '@shared/API.js'
import { date } from 'quasar'

export default {
  name: 'AuditLogTable',
  props: [
    'studyKey', // if set to -1, means that logs shouldn't be loaded until they are set a different value
    'taskId'
  ],
  data () {
    return {
      logs: [],
      pagination: { page: 1, rowsPerPage: 20, rowsNumber: 0, sortBy: 'timestamp', descending: true },
      columns: [
        { name: 'timestamp', required: true, label: 'Datetime', align: 'left', field: 'timestamp', sortable: true },
        { name: 'event', required: true, label: 'Event', align: 'left', field: 'event', sortable: false },
        { name: 'userEmail', required: true, label: 'User', align: 'left', field: 'userEmail', sortable: false },
        { name: 'message', required: true, label: 'Message', align: 'left', field: 'message', sortable: false },
        { name: 'data', required: false, label: 'Data', align: 'left', field: 'data', sortable: false }
      ],
      filter: {
        after: undefined,
        before: undefined,
        eventType: 'all',
        userEmail: undefined
      },
      eventTypesOpts: [],
      loading: false,
      logDataModal: false,
      logDataModalContent: undefined,
      logDataType: 'raw'
    }
  },
  async created () {
    this.getLogsEventTypes()
    if (this.studyKey && this.studyKey !== -1) {
      this.filter.studyKey = this.studyKey
    }
    this.loadLogs({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  watch: {
    // update the table if the study key changes
    async studyKey () {
      this.filter.studyKey = this.studyKey
      this.loadLogs({
        pagination: this.pagination,
        filter: this.filter
      })
    }
  },
  methods: {
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    async updateFilters () {
      this.loadLogs({
        filter: this.filter,
        pagination: this.pagination
      })
    },
    async loadLogs (params) {
      this.loading = true
      this.pagination = params.pagination
      try {
        const queryParams = {
          after: params.filter.after,
          before: params.filter.before ? new Date(new Date(params.filter.before).getTime() + 24 * 60 * 60 * 1000).toISOString().substr(0, 10) : undefined, // the before must add 24 hours to include the whole day
          eventType: params.filter.eventType === 'all' ? undefined : params.filter.eventType,
          studyKey: params.filter.studyKey,
          taskId: params.filter.taskId,
          userEmail: params.filter.userEmail,
          sortDirection: params.pagination.descending ? 'DESC' : 'ASC',
          offset: (params.pagination.page - 1) * params.pagination.rowsPerPage,
          rowsPerPage: params.pagination.rowsPerPage === 0 ? undefined : params.pagination.rowsPerPage
        }
        this.pagination.rowsNumber = await API.getLogs(true, queryParams)
        this.logs = await API.getLogs(false, queryParams)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve audit log' + err.message,
          icon: 'report_problem'
        })
      }
      this.loading = false
    },
    async getLogsEventTypes () {
      try {
        const types = await API.getLogEventTypes()
        if (types) {
          this.eventTypesOpts = types.map(evt => {
            return { label: evt, value: evt }
          })
        }
        this.eventTypesOpts.unshift({ label: 'All', value: 'all' })
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve logs event types',
          icon: 'report_problem'
        })
      }
    },
    showLogData (props) {
      this.logDataType = 'raw'
      this.logDataModalContent = JSON.stringify(props.value, null, 2)
      this.logDataModal = true
    }
  }
}
</script>

<style>
.q-table td {
  border-color: black;
}
.q-table th {
  border-bottom-color: black;
}
.q-table__bottom {
  border-top: 1px solid black;
}

.q-table__top {
  margin-bottom: 20px;
}
</style>
