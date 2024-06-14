export default {
  privacyPolicy: {
    collectedData: `Per condurre questo studio, abbiamo bisogno di raccogliere alcuni dati da te utilizzando l'app Mobistudy.
    Quali dati personali verranno raccolti?
\u2022 Le tue informazioni di profilo generali come indirizzo email, nome, cognome, data di nascita, sesso, paese, lingua, condizioni di salute principali, trattamenti a lungo termine, peso e altezza.
Questi sono necessari per identificarti e creare statistiche su chi partecipa a questo studio.
\u2022 La tua partecipazione allo studio e le volte in cui completi un compito.
Questi sono necessari per valutare il tuo livello di coinvolgimento nello studio.
\u2022 Informazioni tecniche relative all'accesso al server (come i login).
Questi sono necessari per la sicurezza e l'auditing.
\u2022 La marca, il modello e il sistema operativo del tuo telefono.
Questi sono necessari per studiare come i dati cambiano da telefono a telefono.
\u2022 Dati raccolti all'interno dei compiti assegnati in questo studio, specificamente:
`,
    collectedDataForm: '    \u2022 Risposte date al modulo {formName}.',
    collectedDataQuery: '    \u2022 {dataType} da GoogleFit (telefoni Android) o HealthKit (iPhone).',
    collectedDataQCST: '    \u2022 Frequenza cardiaca e passi raccolti durante un Queens College Step Test.',
    collectedDataSMWT: '    \u2022 La tua posizione geografica, distanza e movimento durante il test di camminata di 6 minuti.',
    collectedDataMiband3: '    \u2022 La tua frequenza cardiaca, livello di attività, passi e tipo di attività raccolti dal fitness tracker MiBand3.',
    collectedDataPO60: '    \u2022 La tua saturazione di ossigeno nel sangue e frequenza cardiaca misurate dal pulsossimetro.',
    collectedDataPeakFlow: '    \u2022 Il tuo picco di flusso misurato dal misuratore smart di picco di flusso.',
    collectedDataPosition: '    \u2022 La tua posizione geografica.',
    collectedDataFingerTapping: '    \u2022 Il tempo in cui tocchi lo schermo durante il compito di finger tapping.',
    collectedDataTUGT: '    \u2022 L\'accelerazione e l\'orientamento del telefono e i passi compiuti durante il test Timed up and go.',
    collectedDataHoldPhone: '    \u2022 L\'accelerazione e l\'orientamento del telefono durante il test di mantenimento del telefono.',
    collectedDataVocalization: '    \u2022 La tua voce registrata durante il test di vocalizzazione.',
    collectedDataDrawing: '    \u2022 Le coordinate del tuo disegno saranno salvate durante il test di disegno.',
    collectedDataReason: 'Questi dati sono necessari per raggiungere gli obiettivi della ricerca. [AGGIUNGERE LE RAGIONI PER CUI QUESTI DATI SONO NECESSARI NELLO STUDIO SPECIFICO]',
    legalBasis: 'I dati saranno utilizzati per scopi scientifici, quindi la base legale per il trattamento di questi dati è l\'interesse pubblico (Art. 6 e Art. 89 del GDPR).',
    storage: `Dove saranno conservati i miei dati?
Tutti questi dati saranno conservati sul server Mobistudy, gestito dall'Università di Malmö in Svezia. Il tuo telefono conserverà solo il tuo profilo e i dati sugli studi a cui partecipi.

Per quanto tempo saranno conservati questi dati?
Il tuo profilo e la tua partecipazione a uno studio saranno conservati finché manterrai un account su Mobistudy.
I dati raccolti all'interno dei compiti assegnati in questo studio saranno conservati sul server Mobistudy fino alla fine dello studio, il {studyEndDate}.
I log tecnici saranno eliminati dopo 1 anno dalla loro produzione.

[SPECIFICARE PER QUANTO TEMPO I DATI DELLO STUDIO SARANNO CONSERVATI DAI RICERCATORI]
`,
    access: `Chi avrà accesso a questi dati?
\u2022 Il personale dell'Università di Malmö per la manutenzione tecnica e l'auditing (l'Università di Malmö è il responsabile del trattamento delle tue informazioni personali).`,
    accessInstitution: '\u2022 {institution}',
    accessReason: ' per {reason} ({institution} è il titolare del trattamento delle tue informazioni personali).',
    rights: `Quali sono i miei diritti?
\u2022 Puoi ritirarti da questo studio in qualsiasi momento dalla sezione "studi" dell'app. I dati che hai prodotto fino a quel momento nello studio saranno conservati, ma se desideri che tali dati siano rimossi, contatta mobistudy@mau.se.
\u2022 Puoi rimuovere il tuo account da Mobistudy dalla sezione "profilo" dell'app. Questo rimuoverà tutti i tuoi dati raccolti da Mobistudy tranne i log tecnici, che saranno eliminati dopo 1 anno. Sii consapevole che i dati già scaricati dalle istituzioni coinvolte in questo o in passati studi potrebbero essere conservati anche dopo aver rimosso il tuo account. Se desideri che questi dati siano eliminati, contatta mobistudy@mau.se.
\u2022 Puoi chiedere di limitare o interrompere il trattamento dei tuoi dati (anche senza eliminare il tuo account). In questo caso contatta mobistudy@mau.se.
\u2022 Puoi scoprire cosa è stato registrato su di te e scaricare i dati in un formato leggibile contattando mobistudy@mau.se.
\u2022 Puoi chiedere che vengano corretti errori nei tuoi dati. In questo caso, contatta mobistudy@mau.se.
\u2022 Se hai reclami che non possono essere risolti con l'Università di Malmö, puoi presentarli a Integritetsskyddsmyndigheten.`,
    contacts: `Per domande su come i dati sono trattati da ciascuna istituzione coinvolta nello studio, contatta:
\u2022 Il responsabile della protezione dei dati dell'Università di Malmö a dataskyddsombud@mau.se`,
    piContact: '\u2022 {name} a: {contact}'
  },
  consent: {
    taskItemDataQuery: 'Acconsento a inviare i miei dati su {dataType}, {scheduling}',
    taskItemForm: 'Acconsento a rispondere al modulo "{formName}", {scheduling}',
    taskItemMiBand3: 'Acconsento a inviare i miei dati raccolti dal fitness tracker MiBand3, {scheduling}',
    taskItemQCST: 'Acconsento a eseguire il test del passo del Queen\'s College, {scheduling}',
    taskItemSMWT: 'Acconsento a eseguire il test di camminata di sei minuti, {scheduling}',
    taskItemPO60: 'Acconsento a misurare la mia saturazione di ossigeno, {scheduling}',
    taskItemPeakFlow: 'Acconsento a eseguire una misurazione del picco di flusso, {scheduling}',
    taskItemPosition: 'Acconsento a inviare la mia posizione, {scheduling}',
    taskItemFingerTapping: 'Acconsento a eseguire il test di tocco con le dita, {scheduling}',
    taskItemTUGT: 'Acconsento a eseguire il test "Timed up and go", {scheduling}',
    taskItemHoldPhone: 'Acconsento a eseguire il test "Hold the phone", {scheduling}',
    taskItemVocalization: 'Acconsento a eseguire il test "Vocalization", {scheduling}',
    taskItemDrawing: 'Acconsento a eseguire il test "Drawing", {scheduling}'
  },
  scheduling: {
    notDefined: 'Non ancora definito',
    afterTaskExecution: 'Dopo il completamento del compito {n}',
    alwaysOn: 'Sempre disponibile',
    fromDaysConsented: 'Il giorno dopo aver dato il consenso | {n} giorni dopo aver dato il consenso',
    fromTaskExecuted: '{days} giorni dopo aver completato il compito {taskId}',
    untilDaysConsented: 'Fino a {days} giorni dopo aver dato il consenso',
    untilTaskExecuted: 'Fino a {days} giorni dopo aver completato il compito {taskId}',
    occurrences: 'Ripetuto {occurrences} volte',
    repeatedDays: 'Ripetuto giornalmente | Ripetuto ogni {n} giorni',
    repeatedWeeks: 'Ripetuto settimanalmente | Ripetuto ogni {n} settimane',
    repeatedMonths: 'Ripetuto mensilmente | Ripetuto ogni {n} mesi',
    repeatedYears: 'Ripetuto ogni anno | Ripetuto ogni {n} anni',
    onMonths: 'Nei seguenti mesi',
    atHours: 'Alle seguenti ore',
    onDaysMonth: 'Nei seguenti giorni del mese',
    onDaysWeek: 'Nei seguenti giorni della settimana'
  },
  months: {
    1: 'Gennaio',
    2: 'Febbraio',
    3: 'Marzo',
    4: 'Aprile',
    5: 'Maggio',
    6: 'Giugno',
    7: 'Luglio',
    8: 'Agosto',
    9: 'Settembre',
    10: 'Ottobre',
    11: 'Novembre',
    12: 'Dicembre'
  },
  weekDays: {
    mo: 'Lunedì',
    tu: 'Martedì',
    we: 'Mercoledì',
    th: 'Giovedì',
    fr: 'Venerdì',
    sa: 'Sabato',
    su: 'Domenica'
  },
  healthDataTypes: {
    steps: 'Passi',
    weight: 'Peso',
    height: 'Altezza',
    activity: 'Attività',
    heart_rate: 'Frequenza cardiaca',
    heart_rate_variability: 'Variabilità della frequenza cardiaca',
    calories: 'Calorie',
    distance: 'Distanza camminata o corsa'
  },
  miband3: {
    dataDownload: 'Scaricamento dei dati',
    dataDownloadError: 'Impossibile recuperare i dati dal braccialetto, riprova o annulla.',
    dataSending: 'Invio dei dati',
    chartsIntro: 'I seguenti grafici riassumono i dati che sono stati recuperati dal braccialetto.',
    lineChart: 'Attività nel tempo',
    hrs: 'frequenza cardiaca',
    intensities: 'intensità',
    steps: 'passi',
    pieChart: 'Tempo trascorso in ogni attività',
    hours: 'ore',
    activityTypes: {
      walk: 'Camminata',
      charging: 'In carica',
      not_worn: 'Non indossato',
      sedentary: 'Sedentario',
      running: 'Corsa',
      activity_high: 'Attività intensa',
      activity_low: 'Attività leggera',
      sleep: 'Sonno',
      unknown: 'Sconosciuto'
    }
  },
  smwt: {
    dataDownload: 'Scaricamento dei dati',
    dataDownloadError: 'Impossibile recuperare i dati dal braccialetto, riprova o annulla.',
    dataSending: 'Invio dei dati',
    chartsIntro: 'I seguenti grafici riassumono i dati che sono stati recuperati dal braccialetto.',
    lineChart: 'Accelerazioni nel tempo',
    x: 'Accelerazione in x',
    y: 'Accelerazione in y',
    z: 'Accelerazione in z',
    hours: 'ore',
    activityTypes: {
      walk: 'Camminata',
      charging: 'In carica',
      not_worn: 'Non indossato',
      sedentary: 'Sedentario',
      running: 'Corsa',
      activity_high: 'Attività intensa',
      activity_low: 'Attività leggera',
      sleep: 'Sonno',
      unknown: 'Sconosciuto'
    }
  }
}
