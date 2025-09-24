/**
 * Converts a task type to a readable name (in English)
 **/
export function taskTypeToString (taskType) {
  if (taskType === 'form') {
    return 'Form'
  } else if (taskType === 'fingerTapping') {
    return 'Finger Tapping'
  } else if (taskType === 'holdPhone') {
    return 'Hold The Phone'
  } else if (taskType === 'tugt') {
    return 'Timed Up and Go Test'
  } else if (taskType === 'peakFlow') {
    return 'Peak Flow'
  } else if (taskType === 'miband') {
    return 'Mi-Band wearable'
  } else if (taskType === 'smwt') {
    return 'Six Minute Walk Test'
  } else if (taskType === 'position') {
    return 'Position and environment'
  } else if (taskType === 'qcst') {
    return 'Queen\'s College Step Test'
  } else if (taskType === 'po60') {
    return 'Pulseoxmetry'
  }
  return taskType.charAt(0).toUpperCase() + taskType.slice(1)
}

export function signalToString (signal) {
  if (signal === 'steps') {
    return 'Steps'
  } else if (signal === 'activeMinutes') {
    return 'Active Minutes'
  } else if (signal === 'exerciseMinutes') {
    return 'Exercise Minutes'
  } else if (signal === 'distance') {
    return 'Distance (meters)'
  }
  return signal.charAt(0).toUpperCase() + signal.slice(1)
}

export function signalToUnitString (signal) {
  if (signal === 'steps') {
    return 'steps'
  } else if (signal === 'activeMinutes') {
    return 'minutes'
  } else if (signal === 'exerciseMinutes') {
    return 'minutes'
  } else if (signal === 'distance') {
    return 'meters'
  }
  return ''
}
