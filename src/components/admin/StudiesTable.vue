<template>
  <div>
    <q-table title="Studies" ref="table" color="primary" :rows="studies" selection="none" :columns="columns"
      :filter="filter" row-key="_key" v-model:pagination="pagination" @request="loadStudies" :loading="loading">
      <template #top-right>
        <q-input v-model="filter.after" type="date" hint="From date" clearable class="q-mr-sm" />
        <q-input v-model="filter.before" type="date" hint="To date" clearable class="q-mr-sm" />
        <q-input type="text" v-model="filter.studyTitle" hint="Study Title" clearable debounce="500" />
      </template>
      <template #body-cell-studyTitle="props">
        <q-td :props="props">
          {{ getBestLocale(props.value) }}
        </q-td>
      </template>
      <template #body-cell-created="props">
        <q-td :props="props">
          {{ niceTimestamp(props.value) }}
        </q-td>
      </template>
      <template #body-cell-published="props">
        <q-td :props="props">
          {{ niceTimestamp(props.value) }}
        </q-td>
      </template>
      <template #body-cell-startDate="props">
        <q-td :props="props">
          {{ niceDate(props.value) }}
        </q-td>
      </template>
      <template #body-cell-endDate="props">
        <q-td :props="props">
          {{ niceDate(props.value) }}
        </q-td>
      </template>

      <template #body-cell-delete="props">
        <q-td :props="props">
          <q-btn label="Delete" color="negative" icon="remove" @click="deleteStudy(props.row)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import API from '@shared/API.js'
import { date } from 'quasar'
import { bestLocale } from '@mixins/bestLocale'

export default {
  name: 'StudiesTable',
  mixins: [bestLocale],
  data () {
    return {
      studies: [],
      pagination: { page: 1, rowsPerPage: 20, rowsNumber: 0, sortBy: 'published', descending: true },
      columns: [
        { name: 'studyKey', required: true, label: 'Study Key', align: 'left', field: '_key', sortable: false },
        { name: 'studyTitle', required: true, label: 'Title', align: 'left', field: 'title', sortable: true },
        // { name: 'teamName', required: true, label: 'Team Name', align: 'left', field: 'teamname', sortable: false },
        { name: 'created', required: true, label: 'Created', align: 'left', field: 'createdTS', sortable: true },
        { name: 'published', required: true, label: 'Published', align: 'left', field: 'publishedTS', sortable: true },
        { name: 'startDate', required: true, label: 'Start', align: 'left', field: 'startDate', sortable: false },
        { name: 'endDate', required: true, label: 'End', align: 'left', field: 'endDate', sortable: false },
        { name: 'delete', required: true, label: 'Delete Study', align: 'left', field: 'delete', sortable: false }
      ],
      filter: {
        after: undefined,
        before: undefined,
        studyTitle: undefined
      },
      loading: false
    }
  },
  async mounted () {
    this.loadStudies({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  methods: {
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    niceDate (dateStamp) {
      return date.formatDate(dateStamp, 'YYYY-MM-DD')
    },
    async loadStudies (params) {
      this.loading = true
      this.pagination = params.pagination
      try {
        const queryParams = {
          after: params.filter.after,
          before: params.filter.before ? new Date(new Date(params.filter.before).getTime() + 24 * 60 * 60 * 1000).toISOString().substr(0, 10) : undefined, // the before must add 24 hours to include the whole day
          studyTitle: params.filter.studyTitle,
          summary: true,
          sortDirection: params.pagination.descending ? 'DESC' : 'ASC',
          offset: (params.pagination.page - 1) * params.pagination.rowsPerPage,
          count: params.pagination.rowsPerPage
        }
        const studiesR = await API.getAllStudies(queryParams)
        console.log(studiesR)
        this.pagination.rowsNumber = studiesR.totalCount
        this.studies = studiesR.subset
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve studies list',
          icon: 'report_problem'
        })
      }
      this.loading = false
    },
    // Delete STUDY from Db
    async deleteStudy (study) {
      this.$q.dialog({
        title: 'Deleting Study',
        color: 'warning',
        message: 'You are deleting the study ' + study.studytitle.en + ' from the DB. This will affect participants of that study ' +
          ' and they will no longer be associated to that study. This cannot be undone. Would you like to continue?',
        ok: 'Yes, delete Study',
        cancel: 'Cancel'
      }).onOk(async () => {
        try {
          await API.deleteStudy(study.studykey)
          this.studies.splice(study, 1)
          this.$q.notify('Study ' + study.studytitle.en + ' Deleted')
          this.loadStudies({
            pagination: this.pagination,
            filter: this.filter
          })
        } catch (err) {
          this.$q.notify({
            color: 'negative',
            message: 'Cannot delete study ' + study.studytitle.en,
            icon: 'report_problem'
          })
        }
      })
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
</style>
