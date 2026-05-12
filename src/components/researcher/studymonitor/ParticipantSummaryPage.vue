<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white patient-toolbar">
      <q-toolbar-title>
        <div class="row items-center no-wrap q-gutter-x-lg">
          <span class="patient-name">{{ participant.name }} {{ participant.surname }}</span>
          <span v-if="participant._key" class="patient-id">· #P-{{ participant._key }}</span>

          <patient-trends v-if="studyDescription.tasks" :study-key="studyKey" :user-key="userKey"
            :study-description="studyDescription" :participant="participant" @trends-loaded="onTrendsLoaded" />
        </div>
        <div v-if="participant.dateOfBirth || participant.sex || participant.weight || participant.height"
          class="patient-meta">
          <span v-if="participant.dateOfBirth">{{ new Date(participant.dateOfBirth).toLocaleDateString('sv-SE')
            }}</span>
          <span v-if="participant.dateOfBirth && participant.sex"> · </span>
          <span v-if="participant.sex">{{ participant.sex }}</span>
          <template v-if="participant.weight || participant.height">
            <span v-if="participant.dateOfBirth || participant.sex"> · </span>
            <span v-if="participant.weight">{{ participant.weight }} kg</span>
            <span v-if="participant.weight && participant.height"> · </span>
            <span v-if="participant.height">{{ participant.height }} cm</span>
          </template>
        </div>
        <div v-if="participant.diseases?.length || participant.medications?.length" class="patient-conditions">
          <span v-for="d in participant.diseases" :key="d.conceptId" class="condition-chip condition-chip--disease">
            <q-icon name="medical_information" size="11px" />
            {{ d.term }}
          </span>
          <span v-for="m in participant.medications" :key="m.conceptId" class="condition-chip condition-chip--med">
            <q-icon name="medication" size="11px" />
            {{ m.term }}
          </span>
        </div>
      </q-toolbar-title>
      <q-btn round color="black" icon="close" @click="closeTab()" />
    </q-toolbar>

    <!-- Tab navigation bar -->
    <div class="tab-nav-bar">
      <q-tabs v-model="activeTab" align="left" active-color="secondary" indicator-color="secondary" no-caps
        class="tab-nav-tabs q-px-lg" style="min-height: 56px">
        <q-tab name="progression" icon="ssid_chart" label="Progression" />
        <q-tab name="activity" icon="list_alt" label="Activity Log" />
        <q-tab name="notes" icon="sticky_note_2" label="Clinical Notes" disable/>
        <q-tab name="external" icon="link" label="External Systems" disable />
      </q-tabs>
    </div>

    <!-- Tab content -->
    <!-- keep-alive preserves panel state (e.g. progression chart, selected task) when switching tabs -->
    <q-tab-panels v-model="activeTab" animated keep-alive class="tab-panels-bg">

      <!-- Progression -->
      <q-tab-panel name="progression" class="q-pa-none">

        <!-- Stats overview cards (customizable, 4 slots) -->
        <div v-if="selectedStatKeys.length" class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div v-for="(card, idx) in statCardDefs" :key="card.key" class="col-3">
              <q-card flat bordered class="stat-card fit" :class="card.isAlert ? 'stat-card--alert' : ''">
                <q-card-section class="q-pa-md">
                  <div class="row justify-between items-start q-mb-sm">
                    <div class="stat-icon-wrap"
                      :class="card.isAlert ? 'stat-icon-wrap--alert' : 'stat-icon-wrap--default'">
                      <q-icon :name="card.icon" size="18px" :color="card.isAlert ? 'negative' : 'secondary'" />
                    </div>
                    <div class="stat-trend-badge" :class="card.trendBadgeClass">
                      <q-icon :name="card.trendIcon" size="12px" />
                    </div>
                  </div>
                  <div class="stat-value">{{ card.value }}</div>
                  <div class="text-caption text-grey-5">{{ card.label }}</div>
                  <div class="stat-footer row justify-between items-center">
                    <span>{{ card.footer }}</span>
                    <!-- Per-card picker: replace this slot with another metric -->
                    <q-btn flat round dense icon="tune" size="xs" color="grey-5">
                      <q-menu>
                        <div class="q-pa-sm text-caption text-grey-6">Replace card</div>
                        <q-list dense style="min-width: 200px">
                          <q-item v-for="k in availableStatTrends" :key="k" clickable dense v-close-popup
                            :active="card.key === k" active-class="text-secondary" @click="setStatCard(idx, k)">
                            <q-item-section>
                              <q-item-label>{{ allTrendData[k]?.label || k }}</q-item-label>
                              <q-item-label caption class="text-grey-5">
                                {{ allTrendData[k] ? (Number.isInteger(allTrendData[k].value) ? allTrendData[k].value :
                                  allTrendData[k].value?.toFixed(1)) + allTrendData[k].unit : '–' }}
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-icon v-if="card.key === k" name="check" size="14px" color="secondary" />
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="q-px-lg q-pb-lg">
          <div class="progression-content">
            <div class="text-h6 q-mb-sm">Progression</div>
            <q-select square outlined bg-color="white" v-model="progrSelectedTasks" :options="progrTaskSelectOptions"
              label="Select task" :popup-content-style="{ maxHeight: '260px' }" />
            <div v-show="!progrSelectedTasks" class="text-grey-7 q-mt-md">
              No task selected
            </div>
            <div class="progression-charts q-mt-md">
              <TaskProgressionCharts :studyDescription="studyDescription" :userKey="userKey"
                :selectedTasks="progrSelectedTasks" />
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- Activity Log -->
      <q-tab-panel name="activity" class="q-pa-none">
        <participant-activity-log :study-key="studyKey" :user-key="userKey" :study-description="studyDescription" />
      </q-tab-panel>

      <!-- Clinical Notes — not yet implemented -->
      <!-- External Systems — not yet implemented -->

    </q-tab-panels>

  </q-page>
</template>

<script>
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'
import { taskTypeToString } from '@i18n/utils'

import TaskProgressionCharts from './TaskProgressionCharts.vue'
import PatientTrends from './PatientTrends.vue'
import ParticipantActivityLog from './ParticipantActivityLog.vue'

export default {
  name: 'ParticipantSummaryPage',
  props: ['studyKey', 'userKey'],
  mixins: [bestLocale],
  components: {
    TaskProgressionCharts,
    PatientTrends,
    ParticipantActivityLog
  },
  data () {
    return {
      participant: {},
      studyDescription: {},

      // for progression charts:
      progrTaskSelectOptions: [],
      progrSelectedTasks: null,

      // trend data populated by ParticipantTrendsBar via @trendsLoaded
      allTrendData: {},
      availableTrends: [],

      // which 4 keys to show in the stat cards (customizable, persisted)
      selectedStatKeys: [],

      // tab navigation
      activeTab: 'progression'
    }
  },
  computed: {
    availableStatTrends () {
      return this.availableTrends.filter(k => this.allTrendData[k])
    },
    // Display-ready configs for the 4 selected stat cards
    statCardDefs () {
      return this.selectedStatKeys.map(key => {
        const m = this.allTrendData[key]
        const v = m && typeof m.value === 'number' && !Number.isInteger(m.value) ? m.value.toFixed(1) : m?.value
        return {
          key,
          label: m ? m.label : key,
          value: m ? `${v}${m.unit}` : '—',
          icon: m?.icon || 'show_chart',
          trend: m?.trend || 'stable',
          trendIcon: m?.trend === 'up' ? 'trending_up' : m?.trend === 'down' ? 'trending_down' : 'remove',
          isAlert: m?.isPain && m.value >= 5,
          trendBadgeClass: this._statTrendBadgeClass(key),
          footer: m ? this._statCardFooter(key) : 'No data yet'
        }
      })
    }
  },
  async created () {
    try {
      this.participant = await API.getOneParticipant(this.userKey)
    } catch (err) {
      console.error(err)
      this.$q.notify({
        color: 'negative',
        message: 'Cannot retrieve participant information',
        icon: 'report_problem'
      })
    }

    try {
      this.studyDescription = await API.getStudy(this.studyKey)

      const taskOptions = []

      for (const task of this.studyDescription.tasks) {
        if (task.type === 'form') {
          // forms must be separated by form name
          taskOptions.push({
            label: this.getBestLocale(task.formName),
            value: {
              type: task.type,
              ids: [task.id]
            }
          })
        } else {
          // lump all non forms together
          const opt = taskOptions.find(t => t.value.type === task.type)
          if (!opt) {
            taskOptions.push({
              label: taskTypeToString(task.type),
              value: {
                type: task.type,
                ids: [task.id]
              }
            })
          } else {
            opt.value.ids.push(task.id)
          }
        }
      }
      this.progrTaskSelectOptions = taskOptions
    } catch (err) {
      console.error(err)
      this.$q.notify({
        color: 'negative',
        message: 'Cannot retrieve study plan',
        icon: 'report_problem'
      })
    }
  },
  methods: {
    onTrendsLoaded ({ allTrendData, availableTrends }) {
      this.allTrendData = allTrendData
      this.availableTrends = availableTrends
      const statStorageKey = `stat-cards-${this.studyKey}-${this.userKey}`
      const defaultStatKeys = availableTrends.slice(0, 4)
      try {
        const saved = JSON.parse(localStorage.getItem(statStorageKey))
        if (Array.isArray(saved)) {
          const valid = saved.filter(k => availableTrends.includes(k)).slice(0, 4)
          const extras = availableTrends.filter(k => !valid.includes(k))
          this.selectedStatKeys = [...valid, ...extras].slice(0, 4)
        } else {
          this.selectedStatKeys = defaultStatKeys
        }
      } catch {
        this.selectedStatKeys = defaultStatKeys
      }
    },
    _statTrendBadgeClass (key) {
      const m = this.allTrendData[key]
      if (!m) return 'stat-trend-badge--stable'
      if (m.isPain) return m.trend === 'up' ? 'stat-trend-badge--up-alert' : m.trend === 'down' ? 'stat-trend-badge--down-good' : 'stat-trend-badge--stable'
      return m.trend === 'up' ? 'stat-trend-badge--up-good' : m.trend === 'down' ? 'stat-trend-badge--down-bad' : 'stat-trend-badge--stable'
    },
    _statCardFooter (key) {
      const m = this.allTrendData[key]
      if (!m) return 'No data yet'
      if (m.isPain) {
        const map = { up: 'Worsening trend', down: 'Improving trend', stable: 'Stable' }
        return map[m.trend] || 'Stable'
      }
      const map = { up: 'Increasing', down: 'Decreasing', stable: 'Stable' }
      return map[m.trend] || 'Stable'
    },
    setStatCard (idx, newKey) {
      this.selectedStatKeys.splice(idx, 1, newKey)
      localStorage.setItem(
        `stat-cards-${this.studyKey}-${this.userKey}`,
        JSON.stringify(this.selectedStatKeys)
      )
    },
    /**
     * Closes the current tab
     */
    closeTab () {
      window.close()
    }
  }
}
</script>

<style scoped>
.tab-nav-bar {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  min-height: 56px;
}

/* Make each tab wider and give them more breathing room */
.tab-nav-tabs :deep(.q-tab) {
  padding: 0 28px;
  min-width: 160px;
  font-size: 0.9375rem;
  letter-spacing: 0.01em;
}

.tab-panels-bg {
  background: #f3f4f6;
  /* q-tab-panels adds overflow-hidden internally; override so position:sticky works */
  overflow: visible !important;
}

.tab-panels-bg :deep(.q-panel-parent),
.tab-panels-bg :deep(.q-panel) {
  overflow: visible !important;
}

/* ── Stats overview cards ───────────────────────────────────────────── */
.stat-card {
  background: #ffffff;
  border-color: #e5e7eb !important;
  border-radius: 6px !important;
}

.stat-card--alert {
  border-color: #fecaca !important;
  background: rgba(254, 242, 242, 0.4) !important;
}

.stat-icon-wrap {
  padding: 6px;
  border-radius: 6px;
}

.stat-icon-wrap--default {
  background: rgba(95, 141, 152, 0.1);
}

.stat-icon-wrap--alert {
  background: rgba(239, 68, 68, 0.1);
}

.stat-trend-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 9999px;
}

.stat-trend-badge--up-good {
  background: #dcfce7;
  color: #16a34a;
}

.stat-trend-badge--down-bad {
  background: #fef3c7;
  color: #b45309;
}

.stat-trend-badge--down-good {
  background: #dcfce7;
  color: #16a34a;
}

.stat-trend-badge--up-alert {
  background: #fee2e2;
  color: #dc2626;
}

.stat-trend-badge--stable {
  background: #f3f4f6;
  color: #6b7280;
}

.stat-value {
  font-size: 1.25rem;
  color: #1f2937;
  margin-top: 4px;
}

.stat-footer {
  font-size: 0.72rem;
  color: #9ca3af;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid #f3f4f6;
}

/* ── Progression tab ───────────────────────────────────────────────── */
.progression-content {
  width: 100%;
}

.progression-charts {
  max-width: 760px;
}

.patient-toolbar {
  min-height: 90px;
  padding: 8px 28px;
  height: auto;
  align-items: flex-start;
}

.patient-name {
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
}

.patient-id {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
}

.patient-meta {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 2px;
}

.patient-conditions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 6px;
}

.condition-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 9px;
  border-radius: 9999px;
  font-size: 0.72rem;
  white-space: nowrap;
  user-select: none;
}

.condition-chip--disease {
  background: rgba(239, 68, 68, 0.25);
  color: rgba(255, 200, 200, 0.95);
}

.condition-chip--med {
  background: rgba(96, 165, 250, 0.2);
  color: rgba(180, 220, 255, 0.95);
}
</style>
