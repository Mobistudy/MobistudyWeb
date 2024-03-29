<template>
  <q-card class="full-height">
    <q-card-section>
      <div class="text-h6 q-my-sm text-secondary text-bold text-uppercase"> Participants statistics</div>
    </q-card-section>
    <q-card-section class="q-mb-md">
      <div class="row justify-around ">
        <div>
          <div class="text-h6 q-pa-sm">
            Joined
          </div>
          <div align="middle" class="text-h4 q-pa-sm">
            {{ participants.joined }}
          </div>
        </div>
        <q-separator vertical inset />
        <div>
          <div class="text-h6 q-pa-sm">
            Active
          </div>
          <div align="middle" class="text-h4 q-pa-sm">
            {{ participants.active }}
          </div>
        </div>
        <q-separator vertical inset />
        <div>
          <div class="text-h6 q-pa-sm">
            Completed
          </div>
          <div align="middle" class="text-h4 q-pa-sm">
            {{ participants.completed }}
          </div>
        </div>
        <q-separator vertical inset />
        <div>
          <div class="text-h6 q-pa-sm">
            Withdrawn
          </div>
          <div align="middle" class="text-h4 q-pa-sm">
            {{ participants.withdrawn }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-ma-lg justify-around">
        <q-btn color="secondary" icon-right="archive" label="Download study data" @click="downloadData()"
          :loading="creatingDownload"></q-btn>
      </div>
    </q-card-section>
    <q-separator />
    <table-participants :studyKey="studyKey" />
  </q-card>
</template>

<script>
import API from '@shared/API'
import TableParticipants from '@components/researcher/studymonitor/ParticipantsSummaryTable'

export default {
  name: 'StudyParticipants',
  props: ['studyKey'],
  components: {
    TableParticipants
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
  }
}
</script>
