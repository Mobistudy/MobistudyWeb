export default {
  privacyPolicy: {
    collectedData: `<p>To conduct this study, we need to collect some data from you using the Mobistudy app.</p>
    <p>
    <b>What personal data will be collected?</b>
    <ul>
  <li> Your general profile information like email address, name, surname, date of birth, sex, country, language, main health conditions, long-term treatments, weight and height.
These are needed to identify you and to create statistics about those who participate in this study.</li>
  <li>Your participation in the study and the times you complete a task.
These are needed to assess your level of involvement into the study.</li>
  <li>Technical information related to access of the server (like logins).
These are needed for security and auditing.</li>
  <li> The brand, model and operating system of your phone.
These are needed to study how data changes from phone to phone.</li>
  <li> Data collected within the tasks assigned in this study, specifically:
<ul>
`,
    collectedDataForm: '    \u2022 Answers given to {formName} form.',
    collectedDataQuery: '    \u2022 {dataType} from GoogleFit (Android phones) or HealthKit (iPhones).',
    collectedDataQCST: '    \u2022 Heart rate and steps collected during a Queens College Step Test.',
    collectedDataSMWT: '    \u2022 Your geographical position, distance and motion during the 6-minute Walk Test',
    collectedDataMiband3: '    \u2022 Your heart rate, activity level, steps and activity type collected by the MiBand3 fitness tracker.',
    collectedDataPO60: '    \u2022 Your blood oxygen saturation and heart rate measured by the pulseoximeter.',
    collectedDataPeakFlow: '    \u2022 Your peak flow measured by the smart peak flow meter.',
    collectedDataPosition: '    \u2022 Your geographical position.',
    collectedDataFingerTapping: '    \u2022 The time you tap on the screen during the finger tapping task.',
    collectedDataTUGT: '    \u2022 The acceleration and orientation of the phone and steps walked during the Timed up and go test.',
    collectedDataHoldPhone: '    \u2022 The acceleration and orientation of the phone during the hold the phone test.',
    collectedDataVocalization: '    \u2022 Your voice recorded during the vocalization test.',
    collectedDataDrawing: '    \u2022 Your drawing coordinates will be saved during the drawing test.',
    collectedDatajStyle: '    \u2022 Your heart rate, oxygen level, activity, sleep, and temperature measured by the JStyle smartwatch.',
    collectedDataReason: '</ul></li></ul>These data are needed to fulfil the aims of the research. [ADD REASONS FOR WHY THESE DATA ARE NEEDED IN THE SPECIFIC STUDY]',
    legalBasis: 'The data will be used for scientific purposes, therefore the legal basis for the processing of this data is public interest (Art. 6 and Art. 89 of the GDPR).',
    storage: `</p><p>
    <b>Where will my data be stored?</b><br>
All these data will be stored on the Mobistudy server, which is managed by Malmö University in Sweden. Your phone will only keep your profile and data about which studies you are participating in.
</p>
<p>
<b>For how long will this data be kept?</b><br>
Your profile and participation in a study will be kept for as long as you will keep an account on Mobistudy.
Data collected within the tasks assigned in this study will be kept on the Mobistudy server until the end of the study, on {studyEndDate}.
Technical logs will be deleted after 1 year they are produced.

[SPECIFY FOR HOW LONG STUDY DATA WILL BE KEPT BY RESEARCHERS]
</p>
`,
    access: `<p><b>Who will have access to this data?</b>
    <ul>
<li> Personnel from Malmö University for technical maintenance and auditing (Malmö University is the processor of your personal information).</li>`,
    accessInstitution: '<li> {institution}',
    accessReason: ' for {reason} ({institution} is the controller of your personal information). </li>',
    rights: `</ul></p>
    <p><b>What are your rights?</b><br>
    <ul>
<li> You can withdraw from this study whenever you want from the “studies” section of the app. Data you have produced so far within the study will be kept, but if you want such data to be removed also, please contact mobistudy@mau.se.</li>
<li> You can remove your account from Mobistudy from the “profile” section of the app. This will remove all your data collected by Mobistudy except the technical logs, which will be deleted after 1 year. Be aware that data already downloaded by institutions involved in this or past studies may still be kept after you have removed your account. If you want these data to be deleted also, please contact mobistudy@mau.se.</li>
<li> You can ask the processing of your data to be stopped or restricted (even without deleting your account). In this case contact mobistudy@mau.se.</li>
<li> You can find out what has been registered about you and download the data in a machine-readable format by contacting mobistudy@mau.se.</li>
<li>You can ask for errors in your data to be corrected. In this case, contact mobistudy@mau.se.</li>
<li> If you have complaints that cannot be resolved with Malmö University you may submit these to Integritetsskyddsmyndigheten.</li>`,
    contacts: `</ul></p>
    <p>For questions about how data is processed by each institution involved in the study please contact:<ul>
<li> Malmö University's data protection officer at dataskyddsombud@mau.se</li>`,
    piContact: '<li> {name} at: {contact}</li>'
  },
  consent: {
    taskItemDataQuery: 'I agree to send my data about {dataType}, {scheduling}',
    taskItemForm: 'I agree to answer the "{formName}" form, {scheduling}',
    taskItemMiBand3: 'I agree to send my data collected by the MiBand3 fitness tracker, {scheduling}',
    taskItemQCST: 'I agree to perform the Queen\'s College step test, {scheduling}',
    taskItemSMWT: 'I agree to perform the Six-minute walk test, {scheduling}',
    taskItemPO60: 'I agree to measure my pulse-oximetry, {scheduling}',
    taskItemPeakFlow: 'I agree to perform a Peak flow measurement, {scheduling}',
    taskItemPosition: 'I agree to send my location, {scheduling}',
    taskItemFingerTapping: 'I agree to perform the Finger tapping test, {scheduling}',
    taskItemTUGT: 'I agree to perform the "Timed up and go" test, {scheduling}',
    taskItemHoldPhone: 'I agree to perform "Hold the phone" test, {scheduling}',
    taskItemVocalization: 'I agree to perform "Vocalization" test, {scheduling}',
    taskItemDrawing: 'I agree to perform "Drawing" test, {scheduling}',
    taskItemjStyle: 'I agree to send my data collected by the JStyle smartwatch, {scheduling}'
  },
  scheduling: {
    notDefined: 'Not yet defined',
    afterTaskExecution: 'After task {n} is completed',
    alwaysOn: 'Always available',
    fromDaysConsented: 'The day after I have consented | {n} days after I have consented',
    fromTaskExecuted: '{days} days after I have completed task {taskId}',
    untilDaysConsented: 'Until {days} days after I have consented',
    untilTaskExecuted: 'Until {days} days after I have completed task {taskId}',
    occurrences: 'Repeated {occurrences} times',
    repeatedDays: 'Repeated daily | Repeated every {n} days',
    repeatedWeeks: 'Repeated weekly | Repeated every {n} weeks',
    repeatedMonths: 'Repeated monthly | Repeated every {n} months',
    repeatedYears: 'Repeated every year | Repeated every {n} years',
    onMonths: 'In the following month(s)',
    atHours: 'At the following hours',
    onDaysMonth: 'On the following day(s) of the month',
    onDaysWeek: 'On the following day(s) of the week'
  },
  months: {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  },
  weekDays: {
    mo: 'Monday',
    tu: 'Tuesday',
    we: 'Wednesday',
    th: 'Thursday',
    fr: 'Friday',
    sa: 'Saturday',
    su: 'Sunday'
  },
  healthDataTypes: {
    steps: 'Steps',
    weight: 'Weight',
    height: 'Height',
    activity: 'Activity',
    heart_rate: 'Heart rate',
    heart_rate_variability: 'Heart rate variability',
    calories: 'Calories',
    distance: 'Distance walked or run'
  },
  miband3: {
    dataDownload: 'Downloading data',
    dataDownloadError: 'Could not retrieve data from the band, please retry or cancel.',
    dataSending: 'Sending data',
    chartsIntro: 'The following charts summarize the data that have been retrieved from the band.',
    lineChart: 'Activity over time',
    hrs: 'heart rate',
    intensities: 'intensity',
    steps: 'steps',
    pieChart: 'Time spent in each activity',
    hours: 'hours',
    activityTypes: {
      walk: 'Walking',
      charging: 'Charging',
      not_worn: 'Not worn',
      sedentary: 'Sedentary',
      running: 'Running',
      activity_high: 'Intense activity',
      activity_low: 'Low activity',
      sleep: 'Sleeping',
      unknown: 'Unknown'
    }
  },
  smwt: {
    dataDownload: 'Downloading data',
    dataDownloadError: 'Could not retrieve data from the band, please retry or cancel.',
    dataSending: 'Sending data',
    chartsIntro: 'The following charts summarize the data that have been retrieved from the band.',
    lineChart: 'Accelerations over time',
    x: 'Acceleration in x',
    y: 'Acceleration in y',
    z: 'Acceleration in z',
    hours: 'hours',
    activityTypes: {
      walk: 'Walking',
      charging: 'Charging',
      not_worn: 'Not worn',
      sedentary: 'Sedentary',
      running: 'Running',
      activity_high: 'Intense activity',
      activity_low: 'Low activity',
      sleep: 'Sleeping',
      unknown: 'Unknown'
    }
  }
}
