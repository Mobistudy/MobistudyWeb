<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white q-pa-md">
      <q-toolbar-title>
        <strong>{{ getBestLocale(studyDesign.generalities.title) }}</strong>
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
      class="bg-white text-secondary shadow-2"
      align="justify"
    >
      <q-tab
        name="tab-summary"
        icon="group"
        label="Summary"
      />
      <q-tab
        name="tab-description"
        icon="subject"
        label="Description"
      />
      <q-tab
        name="tab-log"
        icon="bar_chart"
        label="Audit log"
      />
    </q-tabs>
    <q-tabs color="secondary">
      <q-tab-panels
        v-model="statsTab"
        keep-alive
        class="full-width"
      >
        <q-tab-panel name="tab-summary">
          <study-summary :studyKey="studyKey" />
        </q-tab-panel>
        <q-tab-panel name="tab-description">
          <study-description :studyDesign="studyDesign" />
        </q-tab-panel>
        <q-tab-panel name="tab-log">
          <table-audit-log :studyKey="studyKey" />
        </q-tab-panel>
      </q-tab-panels>
    </q-tabs>
  </q-page>
</template>

<script>
import API from '@shared/API.js'
import TableAuditLog from '@components/AuditLogTable'
import StudySummary from '@components/researcher/studymonitor/StudySummary'
import StudyDescription from '@components/researcher/studymonitor/StudyDescription'
import { bestLocale } from '@mixins/bestLocale'

export default {
  name: 'StudyMonitor',
  props: ['studyKey'],
  mixins: [bestLocale],
  components: {
    TableAuditLog, StudySummary, StudyDescription
  },
  data () {
    return {
      statsTab: 'tab-summary',
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
  }
}

</script>
