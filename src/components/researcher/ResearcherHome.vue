<template>
  <q-page>
    <q-card class="q-ma-lg q-pa-lg">
      <q-card-section>
        <div class="text-h5">Teams</div>
      </q-card-section>
      <q-card-section v-show="teamsListOptions.length === 0">
        <div class="text-subtitle">You are not a member of any team. Please contact your Mobistudy admin to be added to
          one.</div>
      </q-card-section>
      <q-card-section v-show="teamsListOptions.length > 0">
        <div class="text-subtitle">You are a member of the following team(s). Please select one from the List to
          continue:</div>
        <div class="row">
          <q-select emit-value map-options v-model="selectedTeamKey" :options="teamsListOptions"
            @update:model-value="selectTeam()" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn color="primary" label="Add me to a team" @click="promptAddTeam()" />
      </q-card-actions>
    </q-card>

    <q-card class="q-ma-lg q-pa-lg" v-show="teamsListOptions.length > 0">
      <q-card-section>
        <div class="text-h5">Studies</div>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle">List of studies for team {{ this.selectedTeamLabel }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div v-show="unpublishedStudies.length > 0">
          <p>
            Draft studies (not published):
          </p>
          <q-btn v-for="(pstudy, index) in unpublishedStudies" :key="'d' + index" class="q-ma-md"
            :label="getBestLocale(pstudy.title)" color="primary" @click="goToStudyDesigner(index)" />
        </div>

        <div v-show="publishedStudies.length > 0">
          <p>
            Published studies:
          </p>
          <q-btn v-for="(pstudy, index) in publishedStudies" :key="'p' + index" class="q-ma-md"
            :label="getBestLocale(pstudy.title)" color="secondary" @click="goToStudyStats(pstudy.study_key)" />
        </div>

        <div class="row q-mt-lg">
          <q-btn :label="'Create new study for Team: ' + selectedTeamLabel" color="primary" @click="createNewStudy()" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import userinfo from '@shared/userinfo'
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'

export default {
  name: 'ResearchersHomePage',
  mixins: [bestLocale],
  data () {
    return {
      unpublishedStudies: [],
      publishedStudies: [],
      teamsListOptions: [],
      selectedTeamKey: '',
      selectedTeamLabel: ''
    }
  },
  async created () {
    try {
      this.initTeams()
    } catch (err) {
      this.$q.notify({
        color: 'negative',
        message: 'Cannot initialise home page. Please check our connection.',
        icon: 'report_problem'
      })
    }
  },
  methods: {
    async promptAddTeam () {
      try {
        this.$q.dialog({
          title: 'New team',
          message: 'Paste your invitation code here',
          color: 'primary',
          ok: true,
          cancel: true,
          prompt: {
            model: '',
            type: 'text'
          }
        }).onOk((code) => {
          this.addToTeam(code)
        })
      } catch (e) {
        // nothing to do
      }
    },
    async initTeams () {
      const teams = await API.getTeams()
      if (teams.length > 0) {
        let foundTeam = false
        this.teamsListOptions = teams.map(t => {
          if (t._key === userinfo.user.teamKey) {
            foundTeam = true
            this.selectedTeamKey = t._key
            this.selectedTeamLabel = t.name
          }
          return {
            label: t.name,
            value: t._key
          }
        })
        if (!foundTeam) {
          // Set default value displayed to that of first element
          this.selectedTeamKey = teams[0]._key
          this.selectedTeamLabel = teams[0].name
        }
        this.getAllStudies()
      }
    },
    async addToTeam (invitationCode) {
      try {
        const res = await API.addUserToTeam(invitationCode)
        this.$q.dialog({
          title: 'User added to team',
          message: 'You have been added to the team ' + res.data.teamName + '.',
          ok: true,
          cancel: false,
          preventClose: true
        })
        this.initTeams()
      } catch (err) {
        console.error(err)
        if (err.response.status === 409) {
          this.$q.notify({
            color: 'positive',
            message: 'You are already a member of this team!'
          })
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Cannot add your account to the team. ' + err,
            icon: 'report_problem'
          })
        }
      }
    },
    selectTeam (index) {
      userinfo.user.teamKey = this.selectedTeamKey
      const result = this.teamsListOptions.find(opts => opts.value === this.selectedTeamKey)
      this.selectedTeamLabel = result.label
      this.getAllStudies()
      this.unpublishedStudies = []
      this.publishedStudies = []
    },
    async getAllStudies () {
      try {
        // All Studies for a team
        const studies = await API.getAllTeamStudies(this.selectedTeamKey)
        if (studies.length > 0) {
          // Get Published Studies
          this.publishedStudies = studies.filter(function (obj) {
            return obj.publishedTS && obj.publishedTS !== ''
          }).map(function (obj) {
            const pubObj = { title: obj.generalities.title, study_key: obj._key }
            return pubObj
          })
          // Get unpublished Studies
          this.unpublishedStudies = studies.filter(function (obj) {
            return !obj.publishedTS || obj.publishedTS === ''
          }).map(function (obj) {
            const unpubObj = { title: obj.generalities.title, study_key: obj._key }
            return unpubObj
          })
        }
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot get list of studies.',
          icon: 'report_problem'
        })
      }
    },
    createNewStudy () {
      // user has to select a team
      if (this.selectedTeamKey === '') {
        this.$q.notify({
          color: 'negative',
          message: 'You must select a team in order to create a study.',
          icon: 'report_problem'
        })
      } else {
        this.$router.push('/studyDesign/' + this.selectedTeamKey)
      }
    },
    goToStudyDesigner (index) {
      this.$router.push('/studyDesign/' + this.selectedTeamKey + '/' + this.unpublishedStudies[index].study_key)
    },
    goToStudyStats (studyKey) {
      this.$router.push('/studyMonitor/' + studyKey)
    }
  }
}
</script>
