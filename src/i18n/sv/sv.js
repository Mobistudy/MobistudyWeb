export default {
  privacyPolicy: {
    collectedData: `För att genomföra denna studie behöver vi samla data från din användning av Mobistudy.
    Vilken personlig data kommer samlas in?
\u2022 Din generella profil med information som mejladdress, namn, efternamn, födelsedatum, kön, land, språk, huvudsakliga hälsoproblem, långsiktiga behandlingar, vikt och längd.
Denna information behövs för att identifiera dig och för att skapa statistik angående de som deltar i studien.
\u2022 Ditt deltagande i studien och tid när du slutför uppgifter.
Denna information är nödvändig för att bedöma din nivå av deltagande i studien.
\u2022 Märket, modellen och versionen av operativsystem av din telefon.
Dessa behövs för att studera hur data förändras från telefon till telefon.
\u2022 Teknisk information relaterat till access av servern (exempelvis inloggning).
Denna information är nödvändig för säkerhets- och granskningssyften.
\u2022 Datainsamling relaterad till uppgifter att utföra i studien, specifikt:
`,
    collectedDataForm: `    \u2022 Svar på {formName} formuläret.`,
    collectedDataQuery: `    \u2022 {dataType} från GoogleFit (Android-telefoner) eller HealthKit (iPhones).`,
    collectedDataQCST: `    \u2022 Hjärtfrekvens och stegräkning under ett Queens College Step Test.`,
    collectedDataSMWT: `    \u2022 Din geografiska position, distans och antal steg under ett 6-minuters gångtest`,
    collectedDataMiband3: `    \u2022 Hjärtfrekvens, aktivitetsnivå, steg and aktivitetstyp insamlad av en MiBand3 hälsoklocka.`,
    collectedDataPO60: `    \u2022 Hjärtfrekvens och syrehalt i blodet, insamlat av en pulsoximeter.`,
    collectedDataPeakFlow: `    \u2022 Ditt toppflöde mätt med den smarta toppflödesmätaren.`,
    collectedDataPosition: `    \u2022 Din geografiska position.`,
    collectedDataFingerTapping: `    \u2022 Tiden du trycker på skärmen under fingeravtryckningsuppgiften.`,
    collectedDataTUGT: `    \u2022 Telefonens acceleration och orientering och steg som du gick under testet Timed up and go.`,
    collectedDataHoldPhone: `    \u2022 Acceleration och riktning av din telefon under testet Hålla telefonen.`,
    collectedDataVocalization: `    \u2022 Din röst under vokaliseringstestet.`,
    collectedDataDrawing: `    \u2022 Strecken du gör på skärmen under figurtestet.`,
    collectedDataReason: ` Den insamlade datan är nödvändig för att uppnå forskningssyftet. [LÄGG TILL ANLEDNINGEN FÖR INSAMLINGEN AV SPECIFIKT DEN HÄR DATAN]`,
    storage: `Var kommer min data att lagras?
All data kommer lagras på Mobistudys egen server, vilken hanteras av Malmö Universitet i Sverige. Din telefon lagrar enbart din profil samt data om deltagande vilka studier du deltar i.

Hur länge kommer denna data förvaras?
Din profil och deltagande i en studie kommer att förvaras så länge du har ett konto på Mobistudy.
Data insamlag inom de olika uppgifter som ska utföras i en studie kommer att förvaras på Mobistudy:s server till slutet av studien, {studyEndDate}.
Teknisk data (loggar) kommer att tas bort 1 år efter de producerats.

[SPECIFIERA HUR LÄNGE STUDIENS INSAMLADE DATA KOMMER ATT BEHÅLLAS AV FORSKARNA]
`,
    access: `Vem kommer att ha tillgång till datan?
\u2022 Personal från Malmö Universitet för tekniskt underhåll och granskning (Malmö Universitet är handläggare av din personliga information).`,
    accessInstitution: `\u2022 {institution}`,
    accessReason: ` för {reason} ({institution} är den som hanterar din personliga information).`,
    rights: `Vad är mina rättigheter?
\u2022 Du kan avbryta ditt deltagande i studien när du än vill från sektionen “studier” i appen. Data du har producerat fram till detta inom studien kommer att behållas, men om du vill ta bort även den, vänligen kontakta mobistudy@mau.se.
\u2022 Du kan ta bort ditt konto från Mobistudy från sektionen "profil" i appen. Detta kommer att ta bort all din data insamlad av Mobistudy förutom tekniska loggar, vilka tas bort efter ett år. Var medveten om att den redan nedladdade datan av instutitioner inblandare i den här eller eller förflutna studier kan behållas efter att du tagit bort ditt konto. Om du vill att den datan också blir borttagen, vänligen kontakta mobistudy@mau.se.
\u2022 Du kan be att behandling av din data stoppas eller begränsas (även utan att ta bort ditt konto). I det här fallet, kontakta mobistudy@mau.se.
\u2022 Du kan få svar på vad som registrerats om dig och ladda ned datan i ett maskinläsligt format genom att kontakta mobistudy@mau.se.
\u2022 Du kan be om att fel i din insamlade data blir rättade. I det här fallet, kontakta mobistudy@mau.se.
\u2022 Om du har klagomål som inte kan åtgärdas med Malmö Universitet kan dessa skickas till Integritetsskyddsmyndigheten.`,
    contacts: `För frågor gällande hur insamlad data är hanterad av respektive involverad institution i studien, var god kontakta:
\u2022 Malmö Universitets dataskyddsombud via dataskyddsombud@mau.se`,
    piContact: `\u2022 {name} hos: {contact}`
  },
  consent: {
    taskItemDataQuery: `Jag godkänner att skicka min data gällande {dataType}, {scheduling}`,
    taskItemForm: `Jag godkänner att svara på {formName} form, {scheduling}`,
    taskItemMiBand3: `Jag godkänner att skicka min data insamlad av MiBand3-hälsoklockan, {scheduling}`,
    taskItemQCST: 'Jag godkänner att utföra Queen\'s College step test, {scheduling}',
    taskItemSMWT: 'Jag godkänner att utföra 6-minuters gångtest, {scheduling}',
    taskItemPO60: 'Jag godkänner att skicka data insamlad av Beurer PO60 pulsoximetern, {scheduling}',
    taskItemPeakFlow: 'Jag godkänner att utföra en  Smart Peak Flow Meter, {scheduling}',
    taskItemPosition: 'Jag accepterar att skicka min plats, {scheduling}',
    taskItemFingerTapping: 'Jag godkänner att utföra en fingeravtryckningsuppgiften, {scheduling}',
    taskItemTUGT: 'Jag godkänner att utföra ett "Timed up and Go" test, {scheduling}',
    taskItemHoldPhone: 'Jag går med på att utföra "Håll i telefonen"-testet, {scheduling}'
  },
  scheduling: {
    notDefined: 'Icke ännu definierad',
    afterTaskExecution: 'Efter att uppgiften {n} är klar',
    alwaysOn: 'Alltid tillgänglig',
    fromDaysConsented: `Dagen efter du har gett ditt samtycke | {n} dagar efter att du har gett ditt samtycke`,
    fromTaskExecuted: `{days} dagar efter att du har slutfört uppgiften {taskId}`,
    untilDaysConsented: `Till {days} dagar efter att du har gett ditt samtycke`,
    untilTaskExecuted: `Till {days} dagar efter att du har slutfört uppgiften {taskId}`,
    occurrences: `Upprepad {occurrences} gånger`,
    repeatedDays: `Upprepad dagligen | Upprepad varje {n} dagar`,
    repeatedWeeks: `Upprepad veckovis | Upprepad varje {n} veckor`,
    repeatedMonths: `Upprepad månadsvis | Upprepad varje {n} månade`,
    repeatedYears: `Upprepad årligen | Upprepad varje {n} år`,
    onMonths: `På följande månad(er)`,
    atHours: `Vid följande tider`,
    onDaysMonth: `På följande dag(ar) i månaden`,
    onDaysWeek: `På följande dag(ar) i månaden`
  },
  months: {
    '1': 'Januari',
    '2': 'Februari',
    '3': 'Mars',
    '4': 'April',
    '5': 'Maj',
    '6': 'Juni',
    '7': 'Juli',
    '8': 'Augusti',
    '9': 'September',
    '10': 'Oktober',
    '11': 'November',
    '12': 'December'
  },
  weekDays: {
    mo: 'Måndag',
    tu: 'Tisdag',
    we: 'Onsdag',
    th: 'Torsdag',
    fr: 'Fredag',
    sa: 'Lördag',
    su: 'Söndag'
  },
  healthDataTypes: {
    steps: 'Steg',
    weight: 'Vikt',
    height: 'Längd',
    activity: 'Aktivitet',
    heart_rate: 'Hjärtfrekvens',
    heart_rate_variability: 'Variation i hjärtfrekvens',
    calories: 'Kalorier',
    distance: 'Avstånd som har gåtts eller sprungits'
  }
}
