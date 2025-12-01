export default {
  privacyPolicy: {
    collectedData: `<p>Per condurre questo studio, abbiamo bisogno di raccogliere alcuni dati da te utilizzando l'app Mobistudy.</p>
    <p>
    <b>Quali dati personali verranno raccolti?</b>
    <ul>
    <li> Le tue informazioni di profilo generali come indirizzo email, nome, cognome, data di nascita, sesso, paese, lingua, condizioni di salute principali, trattamenti a lungo termine, peso e altezza.
Questi sono necessari per identificarti e creare statistiche su chi partecipa a questo studio.</li>
    <li> La tua partecipazione allo studio e le volte in cui completi un'attività.
Questi sono necessari per valutare il tuo livello di coinvolgimento nello studio.</li>
    <li> Informazioni tecniche relative all'accesso al server (come i login).
Questi sono necessari per la sicurezza e l'auditing.</li>
    <li> La marca, il modello e il sistema operativo del tuo telefono.
Questi sono necessari per studiare come i dati cambiano da telefono a telefono.</li>
    <li> Dati raccolti all'interno delle attività assegnate in questo studio, specificamente:
        <ul>
`,
    collectedDataForm: '<li> Risposte date al modulo {formName}.</li>',
    collectedDataQuery: '<li> {dataType} da GoogleFit (telefoni Android) o HealthKit (iPhone).</li>',
    collectedDataQCST: '<li> Frequenza cardiaca e passi raccolti durante un Queens College Step Test.</li>',
    collectedDataSMWT: '<li> La tua posizione geografica, distanza e movimento durante il test di camminata di 6 minuti.</li>',
    collectedDataMiband3: '<li> La tua frequenza cardiaca, livello di attività, passi e tipo di attività raccolti dal fitness tracker MiBand3.</li>',
    collectedDataPO60: '<li> La tua saturazione di ossigeno nel sangue e frequenza cardiaca misurate dal pulsossimetro.</li>',
    collectedDataPeakFlow: '<li> Il tuo picco di flusso misurato dal misuratore smart di picco di flusso.</li>',
    collectedDataPosition: '<li> La tua posizione geografica.</li>',
    collectedDataFingerTapping: '<li> Il tempo in cui tocchi lo schermo durante l\'attività di finger tapping.</li>',
    collectedDataTUGT: '<li> L\'accelerazione e l\'orientamento del telefono e i passi compiuti durante il test Timed up and go.</li>',
    collectedDataHoldPhone: '<li> L\'accelerazione e l\'orientamento del telefono durante il test di mantenimento del telefono.</li>',
    collectedDataVocalization: '<li>La tua voce registrata durante il test di vocalizzazione.</li>',
    collectedDataDrawing: '<li>Le coordinate del tuo disegno saranno salvate durante il test di disegno.</li>',
    collectedDatajStyle: '<li>La tua frequenza cardiaca, livello di ossigeno, attività, sonno e temperatura misurati dal smartwatch JStyle.</li>',
    collectedDataReason: '</ul></ul>Questi dati sono necessari per raggiungere gli obiettivi della ricerca. [AGGIUNGERE LE RAGIONI PER CUI QUESTI DATI SONO NECESSARI NELLO STUDIO SPECIFICO] ',
    legalBasis: 'I dati saranno utilizzati per scopi scientifici, quindi la base legale per il trattamento di questi dati è l\'interesse pubblico (Art. 6 e Art. 89 del GDPR).',
    storage: `</p>
<p>
    <b>Dove saranno conservati i miei dati?</b>
    <br>
    Tutti questi dati saranno conservati sul server Mobistudy, gestito dall'Università di Malmö in Svezia. Il tuo telefono conserverà solo il tuo profilo e i dati sugli studi a cui partecipi.
</p>
<p>
<b>Per quanto tempo saranno conservati questi dati?</b>
<br>
Il tuo profilo e la tua partecipazione a uno studio saranno conservati finché manterrai un account su Mobistudy.
I dati raccolti all'interno delle attività assegnate in questo studio saranno conservati sul server Mobistudy fino alla fine dello studio, il {studyEndDate}.
I log tecnici saranno eliminati dopo 1 anno dalla loro produzione.

[SPECIFICARE PER QUANTO TEMPO I DATI DELLO STUDIO SARANNO CONSERVATI DAI RICERCATORI]
</p>
`,
    access: `<p><b>Chi avrà accesso a questi dati?</b>
    <ul>
    <li>Il personale dell'Università di Malmö per la manutenzione tecnica e l'auditing (l'Università di Malmö è il responsabile del trattamento delle tue informazioni personali).</li>`,
    accessInstitution: '<li> {institution}',
    accessReason: ' per {reason} ({institution} è il titolare del trattamento delle tue informazioni personali).</li>',
    rights: `</ul></p>
    <p><b>Quali sono i tuoi diritti?</b>
    <ul>
      <li> Puoi ritirarti da questo studio in qualsiasi momento dalla sezione "studi" dell'app. I dati che hai prodotto fino a quel momento nello studio saranno conservati, ma se desideri che tali dati siano rimossi, contatta mobistudy@mau.se.</li>
      <li> Puoi rimuovere il tuo account da Mobistudy dalla sezione "profilo" dell'app. Questo rimuoverà tutti i tuoi dati raccolti da Mobistudy tranne i log tecnici, che saranno eliminati dopo 1 anno. Sii consapevole che i dati già scaricati dalle istituzioni coinvolte in questo o in passati studi potrebbero essere conservati anche dopo aver rimosso il tuo account. Se desideri che questi dati siano eliminati, contatta mobistudy@mau.se.</li>
      <li> Puoi chiedere di limitare o interrompere il trattamento dei tuoi dati (anche senza eliminare il tuo account). In questo caso contatta mobistudy@mau.se.</li>
      <li> Puoi scoprire cosa è stato registrato su di te e scaricare i dati in un formato leggibile contattando mobistudy@mau.se.</li>
      <li> Puoi chiedere che vengano corretti errori nei tuoi dati. In questo caso, contatta mobistudy@mau.se.</li>
      <li> Se hai reclami che non possono essere risolti con l'Università di Malmö, puoi presentarli a Integritetsskyddsmyndigheten.</li>
</ul>`,
    contacts: `</p>
    <p>Per domande su come i dati sono trattati da ciascuna istituzione coinvolta nello studio, contatta:
    <ul>
      <li>Il responsabile della protezione dei dati dell'Università di Malmö a dataskyddsombud@mau.se</li>`,
    piContact: '<li> {name} presso: {contact}</li>'
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
    taskItemDrawing: 'Acconsento a eseguire il test "Drawing", {scheduling}',
    taskItemjStyle: 'Acconsento a inviare i miei dati raccolti dal smartwatch JStyle, {scheduling}'
  },
  scheduling: {
    notDefined: 'Non ancora definito',
    afterTaskExecution: 'Dopo il completamento dell\'attività {n}',
    alwaysOn: 'Sempre disponibile',
    fromDaysConsented: 'Il giorno dopo aver dato il consenso | {n} giorni dopo aver dato il consenso',
    fromTaskExecuted: '{days} giorni dopo aver completato l\'attività {taskId}',
    untilDaysConsented: 'Fino a {days} giorni dopo aver dato il consenso',
    untilTaskExecuted: 'Fino a {days} giorni dopo aver completato l\'attività {taskId}',
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
