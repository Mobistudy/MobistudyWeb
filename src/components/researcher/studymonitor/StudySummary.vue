<template>
  <q-card>
    <q-card-section>
      <div class="text-h5 text-center q-my-sm"> Participants </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-around">
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
    <table-participants :studyKey="studyKey" />
  </q-card>
</template>

<script>
import API from '@shared/API'
import TableParticipants from '@components/ParticipantsTable'

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
