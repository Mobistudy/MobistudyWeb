<template>
  <div class="tpc-container">
    <div v-if="loading" class="tpc-status">Loading…</div>
    <div v-else-if="unsupported" class="tpc-status">Task type currently unsupported</div>
    <div v-else-if="!hasRenderable" class="tpc-status">No data to display</div>
    <Scatter v-else :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import API from '@shared/API.js'
import { bestLocale } from '@mixins/bestLocale'
import { taskTypeToString } from '@i18n/utils'
import { describeSignal, listNumericalSubscales } from './signalCatalog.js'
import {
  classifySignal,
  chartTypeFor,
  buildDataset,
  aggregateDailyRange,
  ChartType
} from './chartRegistry.js'

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Scatter } from 'vue-chartjs'

import 'chartjs-adapter-luxon'
import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(
  TimeScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
)

// Palette used to colour distinct datasets. The first four are the
// default metric colours; the extras kick in when a form has many
// numerical subscales and we render each one as its own line (the
// __alltrends view). Chosen for strong value-contrast and to remain
// distinguishable in print or under varying lighting.
const COLORS = [
  '#5f8d98', // teal
  '#c2410c', // deep orange
  '#b91c1c', // red
  '#1d4ed8', // blue
  '#15803d', // green
  '#7e22ce', // purple
  '#0891b2', // cyan
  '#a16207', // amber-dark
  '#be185d', // pink
  '#374151' // gray-dark
]

export default {
  name: 'TaskProgressionCharts',
  props: {
    studyDescription: { type: Object, required: true },
    userKey: { type: String, required: true },
    // { id, metrics: [{ taskValue, signalKey }, ...] }
    slotConfig: { type: Object, required: true },
    // taskId -> formDef (preloaded by parent)
    formDefs: { type: Object, default: () => ({}) }
  },
  mixins: [bestLocale],
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Scatter
  },
  data () {
    return {
      loading: false,
      unsupported: false,
      hasRenderable: false,
      chartData: { datasets: [] },
      chartOptions: {},
      // cacheKey -> { points: [{ date, values }] }
      taskDataCache: {}
    }
  },
  watch: {
    slotConfig: {
      deep: true,
      handler () { this.rebuild() }
    }
  },
  created () { this.rebuild() },
  methods: {
    // ── Data fetching ────────────────────────────────────────────────
    _cacheKey (taskValue) {
      return `${taskValue.type}:${taskValue.ids.join(',')}`
    },
    async fetchTaskData (taskValue) {
      const key = this._cacheKey(taskValue)
      if (this.taskDataCache[key]) return this.taskDataCache[key]
      const studykey = this.studyDescription._key
      const ids = taskValue.ids
      const points = []

      if (taskValue.type === 'jstyle') {
        let inds = []
        const a = await API.getTaskResultsIndicators(studykey, this.userKey, ids, 'jstyle-activity-daily-stats')
        if (a) inds = inds.concat(a)
        const s = await API.getTaskResultsIndicators(studykey, this.userKey, ids, 'jstyle-sleep-daily-stats')
        if (s) inds = inds.concat(s)
        inds.sort((x, y) => new Date(x.indicatorsDate) - new Date(y.indicatorsDate))
        for (const indSet of inds) {
          points.push({ date: new Date(indSet.indicatorsDate), values: indSet.indicators || {} })
        }
      } else {
        const resp = await API.getTasksResults(studykey, this.userKey, ids)
        for (const taskRes of resp || []) {
          if (taskRes.discarded) continue
          const date = taskRes.summary && taskRes.summary.completedTS
            ? new Date(taskRes.summary.completedTS)
            : new Date(taskRes.createdTS)
          points.push({ date, values: taskRes.summary || {} })
        }
        points.sort((x, y) => x.date - y.date)
      }

      const out = { points }
      this.taskDataCache[key] = out
      return out
    },

    // ── Helpers ──────────────────────────────────────────────────────
    formDefFor (taskValue) {
      if (!taskValue || taskValue.type !== 'form') return null
      return this.formDefs[taskValue.ids[0]] || null
    },
    taskLabel (taskValue) {
      const firstId = taskValue.ids[0]
      const task = this.studyDescription.tasks && this.studyDescription.tasks.find(t => t.id === parseInt(firstId))
      if (!task) return 'Task'
      if (task.customTitle) return this.getBestLocale(task.customTitle)
      if (taskValue.type === 'form' && task.formName) return this.getBestLocale(task.formName)
      return taskTypeToString(taskValue.type)
    },
    resolveLocale (val) {
      if (!val) return ''
      if (typeof val === 'string') return val
      return this.getBestLocale(val) || ''
    },
    extractValue (values, signalKey) {
      return signalKey.split('.').reduce((p, c) => (p == null ? p : p[c]), values)
    },

    // ── Main build ───────────────────────────────────────────────────
    async rebuild () {
      const metrics = (this.slotConfig && this.slotConfig.metrics ? this.slotConfig.metrics : [])
        .filter(m => m && m.taskValue && m.signalKey)

      if (!metrics.length) {
        this.loading = false
        this.unsupported = false
        this.hasRenderable = false
        return
      }

      this.loading = true
      this.unsupported = false
      this.hasRenderable = false

      try {
        const primary = metrics[0]
        const primaryFormDef = this.formDefFor(primary.taskValue)
        const primaryDesc = describeSignal(primary.taskValue.type, primary.signalKey, primaryFormDef)
        const primaryChartType = chartTypeFor(classifySignal(primary.taskValue.type, primary.signalKey, primaryDesc))

        // "All subscale trends" takes over the entire slot — overlay
        // metrics are not visually meaningful here, so the parent page
        // disables the "add overlay" button for this chart type.
        if (primaryChartType === ChartType.MULTI_LINE_TRENDS) {
          await this._buildSymptomTrends(primary, primaryFormDef)
          return
        }

        await this._buildStandardChart(metrics)
      } catch (err) {
        console.error('TaskProgressionCharts.rebuild failed', err)
        this.unsupported = true
        this.loading = false
      }
    },

    // ── Standard time-axis chart (scatter+line / bar / status / range) ───
    async _buildStandardChart (metrics) {
      const datas = await Promise.all(metrics.map(m => this.fetchTaskData(m.taskValue)))
      const descriptors = metrics.map(m => describeSignal(m.taskValue.type, m.signalKey, this.formDefFor(m.taskValue)))
      const chartTypes = metrics.map((m, i) => chartTypeFor(classifySignal(m.taskValue.type, m.signalKey, descriptors[i])))

      // Build points per metric. Range-bar signals aggregate to daily
      // min/max tuples; everything else is one point per observation.
      const points = metrics.map((m, i) => {
        const desc = descriptors[i]
        if (chartTypes[i] === ChartType.RANGE_BAR) {
          const baseSignal = desc.rangeBaseSignal || m.signalKey
          const obs = []
          for (const p of datas[i].points) {
            const raw = this.extractValue(p.values, baseSignal)
            if (typeof raw === 'number' && !Number.isNaN(raw)) {
              obs.push({ date: p.date, value: raw })
            }
          }
          return aggregateDailyRange(obs)
        }
        const out = []
        for (const p of datas[i].points) {
          const raw = this.extractValue(p.values, m.signalKey)
          if (raw === undefined || raw === null) continue
          let y = raw
          if (desc.isCategorical && desc.categories && desc.categories[raw]) {
            y = this.getBestLocale(desc.categories[raw].name)
          }
          out.push({ x: p.date, y })
        }
        return out
      })

      // ── Axis assignment ─────────────────────────────────────────
      const primaryDesc = descriptors[0]
      const primaryType = chartTypes[0]
      const primaryCategorical = primaryDesc.isCategorical
      const primaryRange = this._numericRange(points[0], primaryType)

      const axisOf = ['y']
      for (let i = 1; i < metrics.length; i++) {
        const desc = descriptors[i]
        const oType = chartTypes[i]
        if (desc.isCategorical) {
          if (primaryCategorical && this._sameCategorySet(primaryDesc, desc)) axisOf.push('y')
          else axisOf.push(null)
        } else if (primaryCategorical) {
          axisOf.push('y1')
        } else if (primaryRange) {
          const oRange = this._numericRange(points[i], oType)
          if (!oRange) {
            axisOf.push('y')
          } else {
            const oSpan = Math.max(oRange.max - oRange.min, Math.abs(oRange.max)) || 1
            const pSpan = Math.max(primaryRange.max - primaryRange.min, Math.abs(primaryRange.max)) || 1
            const ratio = Math.max(oSpan / pSpan, pSpan / oSpan)
            axisOf.push(ratio > 5 ? 'y1' : 'y')
          }
        } else {
          axisOf.push('y')
        }
      }

      // ── Datasets ────────────────────────────────────────────────
      const datasets = []
      for (let i = 0; i < metrics.length; i++) {
        if (!axisOf[i]) continue
        if (!points[i].length) continue
        const desc = descriptors[i]
        const color = COLORS[i % COLORS.length]
        const sigLabel = this.resolveLocale(desc.name) || metrics[i].signalKey
        const taskLabel = this.taskLabel(metrics[i].taskValue)
        datasets.push(buildDataset({
          chartType: chartTypes[i],
          label: `${sigLabel} · ${taskLabel}`,
          points: points[i],
          color,
          yAxisID: axisOf[i]
        }))
      }

      if (!datasets.length) {
        this.hasRenderable = false
        this.loading = false
        return
      }

      // Scales
      const scales = {
        x: {
          type: 'time',
          time: { minUnit: 'minute', unit: 'day', tooltipFormat: 'DD T' },
          title: { display: true, text: 'Time' }
        }
      }
      if (primaryCategorical) {
        scales.y = {
          type: 'category',
          offset: true,
          labels: Object.values(primaryDesc.categories || {}).map(c => this.getBestLocale(c.name)),
          position: 'left',
          title: {
            display: true,
            text: this.resolveLocale(primaryDesc.unit) || this.resolveLocale(primaryDesc.name),
            color: COLORS[0]
          },
          ticks: { color: COLORS[0] }
        }
      } else {
        scales.y = {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: this.resolveLocale(primaryDesc.unit) || this.resolveLocale(primaryDesc.name),
            color: COLORS[0]
          },
          ticks: { color: COLORS[0] }
        }
      }
      const y1Index = axisOf.findIndex((a, i) => i > 0 && a === 'y1')
      if (y1Index >= 0) {
        const desc1 = descriptors[y1Index]
        const c1 = COLORS[y1Index % COLORS.length]
        scales.y1 = {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          title: {
            display: true,
            text: this.resolveLocale(desc1.unit) || this.resolveLocale(desc1.name),
            color: c1
          },
          ticks: { color: c1 }
        }
      }

      this.chartData = { datasets }
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            // 'x' axis mode picks one item from each dataset at the
            // hovered x-position. When the user compares two metrics,
            // the tooltip shows both values side-by-side instead of
            // only the nearest one.
            mode: 'x',
            axis: 'x',
            intersect: false,
            callbacks: {
              // Range bars carry y as [min, max] — format the tooltip
              // line to read "min – max" instead of the default array repr.
              label: (ctx) => {
                const ds = ctx.dataset || {}
                const raw = ctx.raw || {}
                if (Array.isArray(raw.y)) {
                  return `${ds.label}: ${raw.y[0]} – ${raw.y[1]}`
                }
                return `${ds.label}: ${ctx.formattedValue}`
              }
            }
          }
        },
        interaction: { mode: 'x', axis: 'x', intersect: false }
      }
      this.hasRenderable = true
      this.loading = false
    },

    _numericRange (points, chartType) {
      if (!points || !points.length) return null
      if (chartType === ChartType.RANGE_BAR) {
        // Each point's y is [min, max]
        const mins = points.map(p => Array.isArray(p.y) ? p.y[0] : null).filter(v => typeof v === 'number')
        const maxes = points.map(p => Array.isArray(p.y) ? p.y[1] : null).filter(v => typeof v === 'number')
        if (!mins.length || !maxes.length) return null
        return { min: Math.min(...mins), max: Math.max(...maxes) }
      }
      const nums = points.map(p => p.y).filter(v => typeof v === 'number')
      if (!nums.length) return null
      return { min: Math.min(...nums), max: Math.max(...nums) }
    },

    _sameCategorySet (descA, descB) {
      if (!descA.categories || !descB.categories) return false
      const a = Object.values(descA.categories).map(c => this.getBestLocale(c.name)).sort().join('|')
      const b = Object.values(descB.categories).map(c => this.getBestLocale(c.name)).sort().join('|')
      return a === b
    },

    // ── All subscales as separate line series ────────────────────────
    // Expands the form's numerical subscales into one Chart.js dataset
    // each, all sharing a single time axis.
    async _buildSymptomTrends (primary, formDef) {
      const subscaleKeys = listNumericalSubscales(formDef)
      if (subscaleKeys.length < 2) {
        this.hasRenderable = false
        this.loading = false
        return
      }
      const data = await this.fetchTaskData(primary.taskValue)
      const measurements = data.points || []
      if (!measurements.length) {
        this.hasRenderable = false
        this.loading = false
        return
      }

      const sorted = [...measurements].sort((a, b) => a.date - b.date)
      const taskLbl = this.taskLabel(primary.taskValue)

      const datasets = []
      let maxObserved = 0
      subscaleKeys.forEach((k, i) => {
        const desc = describeSignal('form', k, formDef)
        const pts = []
        for (const m of sorted) {
          const v = this.extractValue(m.values, k)
          if (typeof v !== 'number' || Number.isNaN(v)) continue
          pts.push({ x: m.date, y: v })
          if (v > maxObserved) maxObserved = v
        }
        if (!pts.length) return
        const color = COLORS[i % COLORS.length]
        const sigLabel = this.resolveLocale(desc.name) || k
        const ds = buildDataset({
          chartType: ChartType.SCATTER_LINE,
          label: sigLabel,
          points: pts,
          color,
          yAxisID: 'y'
        })
        // All trends start hidden — the user opts in by clicking the
        // legend, which keeps the chart readable on first paint when a
        // form has 10+ subscales.
        ds.hidden = true
        datasets.push(ds)
      })

      if (!datasets.length) {
        this.hasRenderable = false
        this.loading = false
        return
      }

      // Symptom forms commonly use 0–5 severity scales; anchor the y-axis
      // to 5 when values fit so charts are visually comparable across
      // patients. Otherwise round up to the nearest tens for readability.
      const yMax = maxObserved <= 5 ? 5 : Math.ceil(maxObserved / 10) * 10

      this.chartData = { datasets }
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: { minUnit: 'minute', unit: 'day', tooltipFormat: 'DD T' },
            title: { display: true, text: 'Time' }
          },
          y: {
            type: 'linear',
            position: 'left',
            // Hard min/max so the chart stays visually stable when every
            // dataset is hidden (otherwise Chart.js collapses the axis).
            min: 0,
            max: yMax,
            title: { display: true, text: `Score · ${taskLbl}` }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Click a subscale name below to show / hide its trend',
            position: 'top',
            align: 'center',
            color: '#6b7280',
            font: { size: 12, weight: 'normal', style: 'italic' },
            padding: { top: 2, bottom: 8 }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 12,
              boxWidth: 8
            },
            // Visual affordance — the cursor turns into a pointer when
            // hovering a legend label so the click interaction is
            // discoverable.
            onHover: (e) => {
              if (e.native && e.native.target) e.native.target.style.cursor = 'pointer'
            },
            onLeave: (e) => {
              if (e.native && e.native.target) e.native.target.style.cursor = 'default'
            }
          },
          tooltip: { mode: 'x', axis: 'x', intersect: false }
        },
        interaction: { mode: 'x', axis: 'x', intersect: false }
      }
      this.hasRenderable = true
      this.loading = false
    }
  }
}
</script>

<style scoped>
.tpc-container {
  position: relative;
  width: 100%;
  height: 320px;
}

.tpc-status {
  color: #6b7280;
  text-align: center;
  padding: 24px 16px;
}
</style>
