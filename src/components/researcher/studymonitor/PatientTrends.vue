<template>
  <template v-if="studyStatsReady">
    <div class="patient-divider" />

    <!-- Study name -->
    <div v-if="studyTitle" class="patient-chip patient-chip--study">
      <q-icon name="science" size="14px" class="chip-icon" />
      <span class="chip-value">{{ studyTitle }}</span>
    </div>

    <!-- Days enrolled -->
    <div v-if="daysEnrolled !== null" class="patient-chip">
      <q-icon name="calendar_today" size="14px" class="chip-icon" />
      <span class="chip-label">Study day</span>
      <span class="chip-value">{{ daysEnrolled }}</span>
    </div>

    <!-- Total tasks completed -->
    <div v-if="totalTaskCount !== null" class="patient-chip">
      <q-icon name="assignment_turned_in" size="14px" class="chip-icon" />
      <span class="chip-label">Tasks</span>
      <span class="chip-value">{{ totalTaskCount }}</span>
    </div>

    <!-- Last active -->
    <div v-if="lastActiveLabel" class="patient-chip">
      <q-icon name="access_time" size="14px" class="chip-icon" />
      <span class="chip-label">Last active</span>
      <span class="chip-value">{{ lastActiveLabel }}</span>
    </div>
  </template>
</template>

<script>
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'

// Summary meta-fields that are never patient metrics
const SUMMARY_SKIP = new Set(['asked', 'answered', 'completedTS', 'startedTS', 'type'])

// Convert camelCase / dot-separated field name to a readable label
function fieldToLabel (field) {
  return field
    .replace(/\./g, ' › ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

const JSTYLE_LABELS = {
  jstyle__avgSteps: 'Avg. daily steps',
  jstyle__avgDistance: 'Avg. daily distance (m)',
  jstyle__avgCalories: 'Avg. daily calories',
  jstyle__avgExerciseMinutes: 'Avg. exercise min.'
}

export default {
  name: 'PatientTrends',
  props: ['studyKey', 'userKey', 'studyDescription', 'participant'],
  mixins: [bestLocale],
  emits: ['trendsLoaded'],
  data () {
    return {
      allTrendData: {},
      availableTrends: [],
      totalTaskCount: null,
      latestResultDate: null,
      loaded: false
    }
  },
  computed: {
    studyStatsReady () {
      return this.loaded
    },
    studyTitle () {
      const title = this.studyDescription?.generalities?.title
      if (!title) return null
      return this.getBestLocale(title) || Object.values(title)[0] || null
    },
    daysEnrolled () {
      const study = this.participant?.studies?.find(s => String(s.studyKey) === String(this.studyKey))
      if (!study?.acceptedTS) return null
      return Math.floor((Date.now() - new Date(study.acceptedTS)) / (1000 * 60 * 60 * 24))
    },
    lastActiveLabel () {
      if (!this.latestResultDate) return null
      const days = Math.floor((Date.now() - this.latestResultDate) / (1000 * 60 * 60 * 24))
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      return `${days}d ago`
    }
  },
  async created () {
    await this.loadLatestTrends()
  },
  methods: {
    /**
     * Fetches the most recent task results to discover available trends and compute trend directions.
     * Limited to the last 10 results. Emits trendsLoaded for the stat cards on the page.
     */
    async loadLatestTrends () {
      if (!this.studyDescription?.tasks?.length) {
        this.loaded = true
        return
      }
      try {
        const allTaskIds = this.studyDescription.tasks.map(t => t.id)
        const resp = await API.getTasksResults(this.studyKey, this.userKey, allTaskIds, 0, 10)
        const allResults = resp.subset
        this.totalTaskCount = resp.totalCount ?? null

        if (!allResults?.length) {
          this.loaded = true
          this.$emit('trendsLoaded', { allTrendData: {}, availableTrends: [] })
          return
        }

        // Find the most recent completed task date across fetched results
        let maxDate = null
        for (const r of allResults) {
          const d = new Date(r.summary?.completedTS || r.createdTS)
          if (!maxDate || d > maxDate) maxDate = d
        }
        this.latestResultDate = maxDate

        // ── Fetch form definitions for all form tasks ───────────────────
        const formDefsByKey = {}
        const taskFormDefMap = {} // taskId → formDef
        for (const task of this.studyDescription.tasks) {
          if (task.type === 'form' && task.formKey) {
            if (!formDefsByKey[task.formKey]) {
              try {
                formDefsByKey[task.formKey] = await API.getForm(task.formKey)
              } catch (err) {
                console.error('Cannot load form definition', task.formKey, err)
              }
            }
            taskFormDefMap[task.id] = formDefsByKey[task.formKey]
          }
        }

        // ── Pre-build form field metadata from summaryFunctionDescription ─
        const formFieldMeta = {}
        for (const formDef of Object.values(formDefsByKey)) {
          if (!formDef?.summaryFunctionDescription) continue
          for (const [field, desc] of Object.entries(formDef.summaryFunctionDescription)) {
            const key = `form__${field}`
            if (formFieldMeta[key]) continue
            const nameText = Object.values(desc.name || {}).join(' ').toLowerCase()
            const descText = Object.values(desc.description || {}).join(' ').toLowerCase()
            formFieldMeta[key] = {
              label: this.getBestLocale(desc.name) || fieldToLabel(field),
              isPain: ['pain', 'ache', 'discomfort', 'vas', 'nrs'].some(kw => (nameText + ' ' + descText).includes(kw))
            }
          }
        }

        // ── Collect time-series per trend key ──────────────────────────
        const collections = {}
        for (const result of allResults) {
          if (result.discarded || !result.summary) continue
          const taskType = result.taskType
          const entryDate = new Date(result.summary.completedTS || result.createdTS)

          // Special case: jstyle stores daily data in an array — aggregate to averages
          if (taskType === 'jstyle' && Array.isArray(result.summary.activitySummary) && result.summary.activitySummary.length) {
            const days = result.summary.activitySummary
            const avg = field => Math.round(days.reduce((s, d) => s + (d[field] || 0), 0) / days.length)
            const jstyleFields = { avgSteps: avg('steps'), avgDistance: avg('distance'), avgCalories: avg('calories'), avgExerciseMinutes: avg('exerciseMinutes') }
            for (const [field, value] of Object.entries(jstyleFields)) {
              if (!value) continue
              const key = `jstyle__${field}`
              if (!collections[key]) collections[key] = []
              collections[key].push({ value, date: entryDate })
            }
            continue
          }

          const fields = this._extractNumericFields(result.summary)
          for (const [field, value] of Object.entries(fields)) {
            if (taskType === 'form') {
              const formDef = taskFormDefMap[result.taskId]
              if (!formDef?.summaryFunctionDescription || !(field in formDef.summaryFunctionDescription)) continue
            }
            const key = `${taskType}__${field}`
            if (!collections[key]) collections[key] = []
            collections[key].push({ value, date: entryDate })
          }
        }

        // ── Build allTrendData from the collections ────────────────────
        const newData = {}
        for (const [key, entries] of Object.entries(collections)) {
          entries.sort((a, b) => b.date - a.date)
          const latest = entries[0].value
          const prev = entries.length > 1 ? entries[1].value : null
          const trend = prev === null ? 'stable' : latest > prev ? 'up' : latest < prev ? 'down' : 'stable'
          const fieldName = key.split('__')[1]
          const fMeta = formFieldMeta[key] || {}
          newData[key] = {
            label: fMeta.label || JSTYLE_LABELS[key] || fieldToLabel(fieldName),
            value: latest,
            unit: '',
            icon: 'show_chart',
            iconColor: '',
            trend,
            isPain: fMeta.isPain ?? false
          }
        }

        this.allTrendData = newData
        this.availableTrends = Object.keys(newData)
        this.loaded = true

        this.$emit('trendsLoaded', { allTrendData: this.allTrendData, availableTrends: this.availableTrends })
      } catch (err) {
        console.error('Cannot load trends:', err)
        this.loaded = true
      }
    },
    _extractNumericFields (obj, prefix = '', depth = 0) {
      const result = {}
      if (depth > 3 || typeof obj !== 'object' || obj === null) return result
      for (const [k, v] of Object.entries(obj)) {
        if (SUMMARY_SKIP.has(k) || Array.isArray(v)) continue
        const key = prefix ? `${prefix}.${k}` : k
        if (typeof v === 'number') result[key] = v
        else if (typeof v === 'object') Object.assign(result, this._extractNumericFields(v, key, depth + 1))
      }
      return result
    }
  }
}
</script>

<style scoped>
.patient-divider {
  width: 1px;
  height: 26px;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.patient-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 13px;
  border-radius: 9999px;
  font-size: 0.8125rem;
  background: rgba(255, 255, 255, 0.15);
  white-space: nowrap;
  cursor: default;
  user-select: none;
}

.chip-label {
  color: rgba(255, 255, 255, 0.85);
}

.chip-value {
  color: #ffffff;
  font-weight: 500;
}

.chip-icon {
  color: rgba(255, 255, 255, 0.8);
}

.patient-chip--study {
  background: rgba(255, 255, 255, 0.25);
  outline: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
