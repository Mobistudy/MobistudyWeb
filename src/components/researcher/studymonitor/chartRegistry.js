/**
 * Chart-type registry: maps Mobistudy signals to a default chart type
 * and produces Chart.js dataset objects with sensible encoding defaults.
 *
 */

// Internal taxonomy of data shapes the registry knows about. Not exported
// because no caller outside this module needs to reason about DataType
// directly — they go straight from a signal to a ChartType via
// chartTypeFor(classifySignal(...)).
const DataType = Object.freeze({
  // Continuous numerical longitudinal — e.g. PainLevel 0-10, EORTC scores,
  // weight, peak flow, TUGT duration, drawing variability.
  CONTINUOUS_NUMERICAL: 'continuous_numerical',
  // Daily aggregated counts/sums — e.g. jstyle steps, calories,
  // active/exercise minutes, sleep duration.
  DAILY_COUNT: 'daily_count',
  // Categorical state at a point in time — e.g. medication intake
  // (yes/no/unsure), side effects, treatments.
  CATEGORICAL_STATE: 'categorical_state',
  // Several numerical subscales captured together (form has ≥3 numerical
  // signals). Rendered as one line per subscale over time — a quick
  // "trend at a glance" view for symptom forms.
  MULTI_SUBSCALE_TRENDS: 'multi_subscale_trends',
  // Daily min–max range (multiple readings aggregated per day) — e.g.
  // po60 HR/SpO2 across a day's measurements.
  RANGE_MIN_MAX: 'range_min_max'
})

export const ChartType = Object.freeze({
  SCATTER_LINE: 'scatter_line',
  BAR: 'bar',
  STATUS_TIMELINE: 'status_timeline',
  MULTI_LINE_TRENDS: 'multi_line_trends',
  RANGE_BAR: 'range_bar'
})

const JSTYLE_DAILY_COUNT_SIGNALS = new Set([
  'steps',
  'activeMinutes',
  'exerciseMinutes',
  'sleepDurationMins'
])

/**
 * Decide the DataType for a (taskType, signalKey) pair. `signalDescriptor`
 * is the output of signalCatalog.describeSignal — used to detect
 * categorical form signals.
 */
export function classifySignal (taskType, signalKey, signalDescriptor) {
  if (signalDescriptor && signalDescriptor.synthetic === 'alltrends') return DataType.MULTI_SUBSCALE_TRENDS
  if (signalDescriptor && signalDescriptor.synthetic === 'range') return DataType.RANGE_MIN_MAX
  if (signalDescriptor && signalDescriptor.isCategorical) {
    return DataType.CATEGORICAL_STATE
  }
  if (taskType === 'jstyle' && JSTYLE_DAILY_COUNT_SIGNALS.has(signalKey)) {
    return DataType.DAILY_COUNT
  }
  return DataType.CONTINUOUS_NUMERICAL
}

export function chartTypeFor (dataType) {
  switch (dataType) {
    case DataType.MULTI_SUBSCALE_TRENDS: return ChartType.MULTI_LINE_TRENDS
    case DataType.RANGE_MIN_MAX: return ChartType.RANGE_BAR
    case DataType.DAILY_COUNT: return ChartType.BAR
    case DataType.CATEGORICAL_STATE: return ChartType.STATUS_TIMELINE
    case DataType.CONTINUOUS_NUMERICAL:
    default: return ChartType.SCATTER_LINE
  }
}

/**
 * Convert a #rrggbb color to an rgba() string with the given alpha.
 * Returns the original string unchanged if it doesn't look like a hex.
 */
function withAlpha (hex, alpha) {
  if (typeof hex !== 'string' || !hex.startsWith('#') || hex.length !== 7) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Build a Chart.js dataset object for one metric.
 *
 * `points` are { x: Date, y: number|string } objects. Caller is
 * responsible for axis assignment (yAxisID) and for already having
 * converted categorical raw values into category labels.
 */
export function buildDataset ({ chartType, label, points, color, yAxisID }) {
  switch (chartType) {
    case ChartType.BAR:
      return {
        type: 'bar',
        label,
        data: points,
        borderColor: color,
        // Lower alpha than before so an overlaid line can read against it
        backgroundColor: withAlpha(color, 0.45),
        borderWidth: 1.5,
        borderRadius: 3,
        // Cap bar width so sparse time series don't render as huge blocks
        maxBarThickness: 28,
        yAxisID
      }
    case ChartType.RANGE_BAR:
      // Each point's y is a [min, max] tuple; Chart.js renders a
      // floating bar between those two values for the given x.
      return {
        type: 'bar',
        label,
        data: points,
        borderColor: color,
        backgroundColor: withAlpha(color, 0.4),
        borderWidth: 1.5,
        borderRadius: 3,
        maxBarThickness: 22,
        // Guarantees that a day with a single measurement (min == max)
        // still renders as a visible mark.
        minBarLength: 4,
        yAxisID
      }
    case ChartType.STATUS_TIMELINE:
      return {
        type: 'scatter',
        label,
        data: points,
        borderColor: color,
        backgroundColor: withAlpha(color, 0.75),
        showLine: false,
        pointRadius: 9,
        pointHoverRadius: 11,
        pointStyle: 'rectRounded',
        // White outline so the marker stays readable even when it sits
        // on top of another dataset's bar or area.
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        borderWidth: 1.5,
        yAxisID
      }
    case ChartType.SCATTER_LINE:
    default:
      // type: 'line' (not 'scatter') so the line is drawn by default.
      // Chart.js v4's ScatterController has showLine: false hard-coded
      // in its defaults; combined with vue-chartjs's dataset re-use via
      // Object.assign, the per-dataset showLine: true override can be
      // lost across re-renders. type: 'line' has lines on by default
      // and works fine alongside type: 'bar' datasets in the same chart.
      return {
        type: 'line',
        label,
        data: points,
        borderColor: color,
        backgroundColor: color,
        showLine: true,
        tension: 0.2,
        // Larger and outlined points so the dataset is legible against
        // any underlying bar/area.
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3,
        yAxisID
      }
  }
}

/**
 * Aggregate a list of { date, value } observations into daily min–max
 * tuples, suitable as input to the RANGE_BAR dataset.
 * Returns [{ x: Date (start of day), y: [min, max] }, ...].
 */
export function aggregateDailyRange (observations) {
  if (!Array.isArray(observations) || !observations.length) return []
  const byDay = new Map()
  for (const obs of observations) {
    if (!obs || obs.value == null || typeof obs.value !== 'number' || Number.isNaN(obs.value)) continue
    const d = new Date(obs.date)
    if (Number.isNaN(d.getTime())) continue
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    const entry = byDay.get(dayKey)
    if (entry) {
      if (obs.value < entry.min) entry.min = obs.value
      if (obs.value > entry.max) entry.max = obs.value
    } else {
      byDay.set(dayKey, {
        x: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
        min: obs.value,
        max: obs.value
      })
    }
  }
  return Array.from(byDay.values())
    .sort((a, b) => a.x - b.x)
    .map(e => ({ x: e.x, y: [e.min, e.max] }))
}
