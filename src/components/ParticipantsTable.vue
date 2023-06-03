<template>
  <div>
    <q-table
      ref="table"
      color="primary"
      flat
      :rows="participants"
      selection="none"
      :columns="columns"
      :filter="filter"
      row-key="userKey"
      v-model:pagination="pagination"
      @request="loadParticipants"
      :loading="loading"
    >
      <template #top-left>
        <div class="text-h6 text-center q-my-sm text-secondary text-bold text-uppercase"> Participants </div>
      </template>
      <template #top-right>
        <q-select
          emit-value
          map-options
          outlined
          label="Study status"
          :options="statusTypesOpts"
          v-model="filter.statusType"
          @input="updateFilters()"
          class="q-mr-md"
          style="width: 200px"
        />
        <q-input
          v-model="filter.name"
          type="text"
          placeholder="Search a participant"
          clearable
          @input="updateFilters()"
          debounce="300"
          style="width: 200px;"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template #body-cell-lastTaskDate="props">
        <q-td :props="props">
          {{ niceTimestamp(props.value) }}
        </q-td>
      </template>
      <template #body-cell-data="props">
        <q-td :props="props">
          <q-btn
            flat
            icon="open_in_new"
            @click="openParticipantSummary(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import API from '@shared/API.js'
import { date } from 'quasar'

export default {
  name: 'StudyParticipantsTable',
  props: [
    'studyKey',
    'taskId'
  ],
  data () {
    return {
      participants: [],
      pagination: { page: 1, rowsPerPage: 20, rowsNumber: 0, sortBy: 'lastTaskDate', descending: true },
      columns: [
        { name: 'data', required: false, label: '', align: 'center', field: 'data', sortable: false },
        { name: 'FullName', required: true, label: 'Full Name', align: 'center', field: 'fullName', sortable: false, format: (value, row) => `${row.name} ${row.surname}` },
        { name: 'DOB', required: true, label: 'Birthdate', align: 'center', field: 'DOB', sortable: false },
        { name: 'userEmail', required: true, label: 'Email', align: 'center', field: 'userEmail', sortable: false },
        { name: 'status', required: true, label: 'Status', align: 'center', field: 'status', sortable: false },
        { name: 'taskResultCount', required: true, label: 'Task Count', align: 'center', field: 'taskResultCount', sortable: true },
        { name: 'lastTaskDate', required: true, label: 'Last task', align: 'center', field: 'lastTaskDate', sortable: true, sort: (a, b) => { if (a > b) return 1; else return -1 } }
      ],
      filter: {
        name: undefined,
        statusType: 'all'
      },
      statusTypesOpts: [
        'all', 'accepted', 'withdrawn', 'completed', 'excluded', 'rejected'
      ],
      loading: false
    }
  },
  async created () {
    if (this.studyKey && this.studyKey !== -1) {
      this.filter.studyKey = this.studyKey
    }
    this.loadParticipants({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  watch: {
    // update the table if the study key changes
    async studyKey () {
      this.filter.studyKey = this.studyKey
      this.loadParticipants({
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
      this.loadParticipants({
        filter: this.filter,
        pagination: this.pagination
      })
    },
    async loadParticipants (params) {
      this.loading = true
      this.pagination = params.pagination
      try {
        const queryParams = {
          studyKey: params.filter.studyKey,
          participantName: params.filter.name,
          statusType: params.filter.statusType === 'all' ? undefined : params.filter.statusType
        }
        this.participants = await API.getStudyStats(queryParams)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve participants',
          icon: 'report_problem'
        })
      }
      this.loading = false
    },
    openParticipantSummary (row) {
      const currentUrl = this.$route.fullPath
      const userKey = row.userKey
      console.log(userKey)
      const urlCompleta = `${window.location.origin}/#${currentUrl}/participant/${userKey}`
      window.open(urlCompleta, '_blank')
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
