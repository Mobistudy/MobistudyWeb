<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title>
        Statistics about <strong>{{ niceTitle(studyDesign.generalities.title) }}</strong>
      </q-toolbar-title>
      <q-btn
        class="float-right q-mr-md"
        round
        color="black"
        icon="close"
        @click="$router.push('/researcher')"
      />
    </q-toolbar>

    <q-tabs
      v-model="statsTab"
      class="bg-secondary text-white shadow-2"
      align="justify"
    >
      <q-tab
        name="tab-stats"
        icon="bar_chart"
        label="Study"
      />
      <q-tab
        name="tab-description"
        icon="subject"
        label="Description"
      />
    </q-tabs>
    <q-tabs color="secondary">
      <q-tab-panels
        v-model="statsTab"
        keep-alive
      >
        <q-tab-panel name="tab-stats">
          <study-stats :studyDesign="studyDesign" />
        </q-tab-panel>
        <q-tab-panel name="tab-description">
          <study-summary :studyDesign="studyDesign" />
        </q-tab-panel>
      </q-tab-panels>
    </q-tabs>
  </q-page>
</template>

<script>
import API from '@shared/API.js'
import StudyStats from '@components/researcher/studymonitor/StudyStatsCard'
import StudySummary from '@components/researcher/studymonitor/StudySummary'
import { getLocalTitle } from '@mixins/getLocalTitleMixin'

export default {
  name: 'StudyMonitor',
  props: ['studyKey'],
  mixins: [getLocalTitle],
  components: {
    StudyStats, StudySummary
  },
  data () {
    return {
      statsTab: 'tab-stats',
      studyDesign: {
        generalities: {
          title: ''
        },
        inclusionCriteria: {},
        tasks: {},
        consent: {}
      }
    }
  },
  async created () {
    try {
      this.studyDesign = await API.getStudy(this.studyKey)
    } catch (err) {
      this.$q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Cannot retrieve the study description. ' + err.message,
        icon: 'report_problem'
      })
    }
  },
  methods: {
    niceTitle (titles) {
      // Sends study titles object as a param and returns a single title
      return this.getFirstTitle(titles)
    }
  }
}

</script>
