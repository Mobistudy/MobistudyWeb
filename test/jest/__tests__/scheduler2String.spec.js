import { schedulingToString } from '../../../src/shared/scheduling.js'

import { describe, expect, it } from '@jest/globals'

describe('Scheduler to String', () => {
  it('until 5 days after consent', () => {
    const sch = {
      startEvent: 'consent',
      startDelaySecs: 0,
      untilSecs: 5 * 24 * 60 * 60,
      intervalType: 'd',
      months: [],
      monthDays: [],
      weekDays: [],
      interval: 0
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('Until 5 days after I have consented. ')
  })

  it('from 5 days after consent', () => {
    const sch = {
      startEvent: 'consent',
      startDelaySecs: 5 * 24 * 60 * 60,
      untilSecs: 0,
      intervalType: 'd',
      months: [],
      monthDays: [],
      weekDays: [],
      interval: 0
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('5 days after I have consented. ')
  })

  it('Daily', () => {
    const sch = {
      startEvent: 'consent',
      startDelaySecs: 0,
      untilSecs: 0,
      intervalType: 'd',
      months: [],
      monthDays: [],
      weekDays: [],
      interval: 1
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('Repeated daily. ')
  })

  it('every 3 days', () => {
    const sch = {
      startEvent: 'consent',
      startDelaySecs: 0,
      untilSecs: 0,
      intervalType: 'd',
      months: [],
      monthDays: [],
      weekDays: [],
      interval: 3
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('Repeated every 3 days. ')
  })

  it('every 3 weeks', () => {
    const sch = {
      startEvent: 'consent',
      startDelaySecs: 0,
      untilSecs: 0,
      intervalType: 'w',
      months: [],
      monthDays: [],
      weekDays: [],
      interval: 3
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('Repeated every 3 weeks. ')
  })

  it('daily, on mondays', () => {
    const sch = {
      startEvent: 'consent',
      startDelaySecs: 0,
      untilSecs: 0,
      intervalType: 'd',
      months: [],
      monthDays: [],
      weekDays: ['mo'],
      interval: 1
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('Repeated daily. On the following day(s) of the week: Monday. ')
  })

  it('daily, in September and November', () => {
    const sch = {
      startEvent: 'consent',
      startDelaySecs: 0,
      untilSecs: 0,
      intervalType: 'd',
      months: [9, 11],
      monthDays: [],
      weekDays: [],
      interval: 1
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('Repeated daily. In the following month(s): September, November. ')
  })

  it('1 day after task 2 is executed', () => {
    const sch = {
      startEvent: 'taskExecution',
      eventTaskId: 2,
      startDelaySecs: 24 * 60 * 60,
      intervalType: 'd',
      interval: 0
    }
    const string = schedulingToString(sch, 'en')
    expect(string).toBe('1 days after I have completed task 2. ')
  })
})
