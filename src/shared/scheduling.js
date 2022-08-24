import { i18n } from '../boot/i18n'

export function schedulingToString (sc, lang) {
  if (!sc.startEvent) return i18n.global.t('scheduling.notDefined', lang)
  let s = ''

  if (sc.startDelaySecs) {
    const daysFromConsent = Math.floor(sc.startDelaySecs / (24 * 60 * 60))
    if (sc.startEvent === 'consent') {
      s += i18n.global.tc('scheduling.fromDaysConsented', daysFromConsent, lang) + '. '
    } else if (sc.startEvent === 'taskExecution') {
      s += i18n.global.tc('scheduling.fromTaskExecuted', lang, { days: daysFromConsent, taskId: sc.eventTaskId }) + '. '
    }
  } else {
    if (sc.startEvent === 'taskExecution') {
      s += i18n.global.tc('scheduling.afterTaskExecution', sc.eventTaskId, lang) + '. '
    }
  }
  if (sc.untilSecs) {
    const untilFromConsent = Math.floor(sc.untilSecs / (24 * 60 * 60))
    if (sc.startEvent === 'consent') {
      s += i18n.global.t('scheduling.untilDaysConsented', lang, { days: untilFromConsent }) + '. '
    } else if (sc.startEvent === 'taskExecution') {
      s += i18n.global.tc('scheduling.untilTaskExecuted', lang, { days: untilFromConsent, taskId: sc.eventTaskId }) + '. '
    }
  }
  if (sc.alwaysOn) {
    s = i18n.global.t('scheduling.alwaysOn', lang) + '. ' + s
    return s
  }
  if (sc.occurrences) {
    s += i18n.global.t('scheduling.occurrences', lang, { occurrences: sc.occurrences }) + '. '
  }
  if (sc.intervalType === 'd' && sc.interval) {
    s += i18n.global.tc('scheduling.repeatedDays', sc.interval, lang) + '. '
  } else if (sc.intervalType === 'w' && sc.interval) {
    s += i18n.global.tc('scheduling.repeatedWeeks', sc.interval, lang) + '. '
  } else if (sc.intervalType === 'm' && sc.interval) {
    s += i18n.global.tc('scheduling.repeatedMonths', sc.interval, lang) + '. '
  } else if (sc.intervalType === 'y' && sc.interval) {
    s += i18n.global.tc('scheduling.repeatedYears', sc.interval, lang) + '. '
  }
  if (sc.hours && sc.hours.length) {
    const hours = sc.hours.reduce((acc, val) => { return acc + ', ' + val })
    s += i18n.global.tc('scheduling.atHours', lang) + ': ' + hours + '. '
  }
  if (sc.months && sc.months.length) {
    s += i18n.global.t('scheduling.onMonths', lang) + ': '
    const mths = sc.months.reduce((acc, d, index) => {
      const r = index === 0 ? '' : ', '
      return (acc += r + i18n.global.t('months.' + d, lang))
    }, '')
    s += mths + '. '
  }
  if (sc.monthDays && sc.monthDays.length) {
    s += i18n.global.t('scheduling.onDaysMonth', lang) + ': '
    const days = sc.monthDays.reduce((acc, d, index) => {
      const r = index === 0 ? '' : ', '
      return (acc += r + d)
    }, '')
    s += days + '. '
  }
  if (sc.weekDays && sc.weekDays.length) {
    s += i18n.global.t('scheduling.onDaysWeek', lang) + ': '
    const days = sc.weekDays.reduce((acc, d, index) => {
      const r = index === 0 ? '' : ', '
      return (acc += r + i18n.global.t('weekDays.' + d, lang))
    }, '')
    s += days + '. '
  }

  return s
}
