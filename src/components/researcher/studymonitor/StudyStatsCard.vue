<template>
  <q-card>
    <q-card-section>
      <div class="text-h5"> Participants </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-around">
        <div>
          <div class="text-h5">
            Joined
          </div>
          <div class="text-h4">
            {{ participants.joined }}
          </div>
        </div>
        <div>
          <div class="text-h5">
            Active
          </div>
          <div class="text-h4">
            {{ participants.active }}
          </div>
        </div>
        <div>
          <div class="text-h5">
            Completed
          </div>
          <div class="text-h4">
            {{ participants.completed }}
          </div>
        </div>
        <div>
          <div class="text-h5">
            Withdrawn
          </div>
          <div class="text-h4">
            {{ participants.withdrawn }}
          </div>
        </div>
      </div>

      <div class="row q-ma-lg justify-around">
        <q-btn
          color="secondary"
          icon-right="archive"
          label="Download study data"
          @click="downloadData()"
          :loading="creatingDownload"
        ></q-btn>
      </div>

      <table-audit-log :studyKey="studyKey" />
    </q-card-section>
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
      participants: {
        joined: 0,
        active: 0,
        completed: 0,
        withdrawn: 0
      },
      creatingDownload: false
    }
  },
  async created () {
    try {
      const stats = await API.getParticipantsStatusStats(this.studyKey)
      for (const stat of stats) {
        if (stat.status === 'accepted') {
          this.participants.joined += stat.count
          this.participants.active = stat.count
        }
        if (stat.status === 'completed') {
          this.participants.joined += stat.count
          this.participants.completed = stat.count
        }
        if (stat.status === 'withdrawn') {
          this.participants.joined += stat.count
          this.participants.withdrawn = stat.count
        }
      }
    } catch (err) {
      this.$q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Cannot retrieve the study statistics. ' + err.message,
        icon: 'report_problem'
      })
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
