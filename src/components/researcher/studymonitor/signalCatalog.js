/**
 * Signal taxonomy shared by ParticipantSummaryPage (signal picker) and
 * TaskProgressionCharts (chart rendering).
 *
 * Pure functions — no Vue, no i18n. `name` and `unit` in describeSignal may
 * be either plain strings (hardcoded non-form signals) or locale-object
 * dictionaries straight from a form definition; the caller is responsible
 * for resolving locale via the bestLocale mixin.
 */

// Direct signal lists per non-form task type. po60 is handled separately
// in listSignalsForTask() because it also gets the synthetic __range
// aliases, so it doesn't appear here.
const TASK_TYPE_SIGNALS = {
  tugt: ['durationMs'],
  fingerTapping: ['tappingCount'],
  drawing: ['totalVariabilitySquare', 'totalVariabilitySpiral'],
  holdPhone: [
    'resting.left.accelerationVariance', 'resting.right.accelerationVariance',
    'postural.left.accelerationVariance', 'postural.right.accelerationVariance',
    'kinetic.left.accelerationVariance', 'kinetic.right.accelerationVariance'
  ],
  peakFlow: ['pefMax'],
  smwt: ['distance'],
  jstyle: ['steps', 'activeMinutes', 'exerciseMinutes', 'sleepDurationMins']
}

const SIGNAL_DEFAULTS = {
  steps: { label: 'Steps', unit: 'steps' },
  activeMinutes: { label: 'Active Minutes', unit: 'min' },
  exerciseMinutes: { label: 'Exercise Minutes', unit: 'min' },
  sleepDurationMins: { label: 'Sleep Duration', unit: 'min' },
  distance: { label: 'Distance', unit: 'm' },
  durationMs: { label: 'TUGT Duration', unit: 'ms' },
  tappingCount: { label: 'Tap Count', unit: 'count' },
  totalVariabilitySquare: { label: 'Drawing Variability (Square)', unit: '' },
  totalVariabilitySpiral: { label: 'Drawing Variability (Spiral)', unit: '' },
  pefMax: { label: 'Peak Flow', unit: 'L/min' },
  spo2: { label: 'SpO2', unit: '%' },
  hr: { label: 'Heart Rate', unit: 'bpm' }
}

// Synthetic signal aliases: not real data fields, they tell the chart
// engine to render a multi-subscale form in a special way.
//   __alltrends — every numerical subscale as its own line over time
// Only added when the form has ≥3 numerical subscales.
const ALLTRENDS_ALIAS = '__alltrends'
// Suffix for daily min–max range view of a numerical signal (po60).
const RANGE_SUFFIX = '__range'

function _numericalSubscaleCount (formDef) {
  if (!formDef || !formDef.summaryFunctionDescription) return 0
  return Object.values(formDef.summaryFunctionDescription)
    .filter(sfd => sfd && sfd.type !== 'category')
    .length
}

export function listSignalsForTask (taskType, formDef) {
  if (taskType === 'form') {
    if (!formDef || !formDef.summaryFunctionDescription) return []
    const keys = Object.keys(formDef.summaryFunctionDescription)
    const extras = []
    // Multi-subscale presentations only make sense with several numerical
    // subscales (e.g. EORTC QLQ-C30, NCI-PRO-CTCAE).
    if (_numericalSubscaleCount(formDef) >= 3) {
      extras.push(ALLTRENDS_ALIAS)
    }
    return [...extras, ...keys]
  }
  if (taskType === 'po60') {
    // Per-task summaries are single readings; aggregate into daily
    // min–max ranges as a separate signal alias.
    return ['spo2', 'hr', `hr${RANGE_SUFFIX}`, `spo2${RANGE_SUFFIX}`]
  }
  return TASK_TYPE_SIGNALS[taskType] || []
}

export function describeSignal (taskType, signalKey, formDef) {
  if (signalKey === ALLTRENDS_ALIAS) {
    return {
      name: 'All subscales (trends)',
      unit: '',
      description: 'Each subscale plotted as its own line over time',
      isCategorical: false,
      categories: null,
      synthetic: 'alltrends'
    }
  }
  if (typeof signalKey === 'string' && signalKey.endsWith(RANGE_SUFFIX)) {
    const base = signalKey.slice(0, -RANGE_SUFFIX.length)
    const baseDesc = describeSignal(taskType, base, formDef)
    return {
      ...baseDesc,
      name: typeof baseDesc.name === 'string' ? `${baseDesc.name} (daily range)` : baseDesc.name,
      description: 'Daily min–max range',
      synthetic: 'range',
      rangeBaseSignal: base
    }
  }
  if (taskType === 'form' && formDef && formDef.summaryFunctionDescription && formDef.summaryFunctionDescription[signalKey]) {
    const sfd = formDef.summaryFunctionDescription[signalKey]
    const isCategorical = sfd.type === 'category'
    return {
      name: sfd.name || signalKey,
      unit: sfd.unit || '',
      description: sfd.description || '',
      isCategorical,
      categories: isCategorical ? sfd.categories : null
    }
  }
  const def = SIGNAL_DEFAULTS[signalKey]
  if (def) {
    return { name: def.label, unit: def.unit, description: '', isCategorical: false, categories: null }
  }
  const last = signalKey.split('.').pop()
  return {
    name: last.charAt(0).toUpperCase() + last.slice(1),
    unit: '',
    description: '',
    isCategorical: false,
    categories: null
  }
}

/**
 * Returns the keys of the numerical subscales of a form, used by the
 * "all subscales (trends)" view when the user picks the __alltrends alias.
 */
export function listNumericalSubscales (formDef) {
  if (!formDef || !formDef.summaryFunctionDescription) return []
  return Object.keys(formDef.summaryFunctionDescription)
    .filter(k => formDef.summaryFunctionDescription[k].type !== 'category')
}
