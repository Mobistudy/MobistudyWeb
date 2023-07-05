<template>
  <q-card class="full-height">
    <q-card-section>
      <div class="row q-ma-lg justify-around">
        <q-btn
          color="secondary"
          icon-right="archive"
          label="Download study data"
          @click="downloadData()"
          :loading="creatingDownload"
        ></q-btn>
      </div>
    </q-card-section>
    <table-audit-log :studyKey="studyKey" />
  </q-card>
</template>

<script>
import API from '@shared/API'
import TableAuditLog from '@components/AuditLogTable'

export default {
  name: 'StudyStatsCard',
  props: ['studyKey'],
  components: {
    TableAuditLog
  },
  data () {
    return {
      creatingDownload: false
    }
  },
  methods: {
    async downloadData () {
      this.creatingDownload = true
      try {
        const filename = await API.downloadStudyData(this.studyKey)
        window.open('datadownload/' + filename)
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Cannot retrieve the study data. ' + error.message,
          icon: 'report_problem'
        })
      }
      this.creatingDownload = false
    }
  }
}
</script>
