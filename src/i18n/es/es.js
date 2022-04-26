export default {
  privacyPolicy: {
    collectedData: `Para realizar este estudio, necesitamos recopilar algunos datos suyos utilizando la aplicación Mobistudy.
     ¿Qué datos personales se recopilarán?
\u2022 Su información general de perfil como dirección de correo electrónico, nombre, apellido, fecha de nacimiento, sexo, país, idioma, principales condiciones de salud, tratamientos a largo plazo, peso y altura.
Estos son necesarios para identificarlo y crear estadísticas sobre quienes participan en este estudio.
\u2022 Tu participación en el estudio y las veces que completas una tarea.
Estos son necesarios para evaluar el nivel de participación en el estudio.
\u2022 La marca, modelo y versión del sistema operativo de tu teléfono.
Estos son necesarios para estudiar cómo cambian los datos de un teléfono a otro.
\u2022 Información técnica relacionada con el acceso al servidor (como inicios de sesión).
Estos son necesarios para la seguridad y la auditoría.
\u2022 Datos recogidos dentro de las tareas asignadas en este estudio, específicamente:
`,
    collectedDataForm: `    \u2022 Respuestas dadas al formulario de {formName} .`,
    collectedDataQuery: `    \u2022 {dataType} desde GoogleFit (Android phones) o HealthKit (iPhones).`,
    collectedDataQCST: `    \u2022 Frecuencia cardíaca y pasos recopilados durante el Queens College Step Test.`,
    collectedDataSMWT: `    \u2022 Su posición geográfica, distancia y pasos durante el 6-minute Walk Test`,
    collectedDataMiband3: `    \u2022 Su frecuencia cardíaca, nivel de actividad, pasos y tipo de actividad recopilados por el reloj inteligente.`,
    collectedDataPO60: `    \u2022 Su saturación de oxígeno en sangre y frecuencia cardíaca medida por el oxímetro de pulso.`,
    collectedDataPeakFlow: `    \u2022 Su flujo máximo medido por el medidor de flujo máximo inteligente.`,
    collectedDataPosition: `    \u2022 Su posición geográfica.`,
    collectedDataFingerTapping: `    \u2022 Los tiempos en los que tocas la pantalla durante la tarea de medición de movimiento de los dedos.`,
    collectedDataTUGT: `    \u2022 La aceleración y la orientación del teléfono y los pasos recorridos durante la prueba de levantarse y avanzar.`,
    collectedDataHoldPhone: `    \u2022 La aceleración y orientación de su teléfono durante la prueba de sostener el teléfono.`,
    collectedDataVocalization: `    \u2022 Tu voz durante la prueba de vocalización.`,
    collectedDataDrawing: `    \u2022 Los trazos que haces en la pantalla durante la prueba de dibujo.`,
    collectedDataReason: `Estos datos son necesarios para cumplir con los objetivos de la investigación. [ADD REASONS FOR WHY THESE DATA ARE NEEDED IN THE SPECIFIC STUDY]`,
    storage: `¿Dónde se almacenarán mis datos?
Todos estos datos se almacenarán en el servidor de Mobistudy, gestionado por la Universidad de Malmö en Suecia. Su teléfono solo conservará su perfil y datos sobre los estudios en los que está participando.

¿Durante cuánto tiempo se conservarán estos datos?
Su perfil y participación en un estudio se mantendrán mientras mantenga una cuenta en Mobistudy.
Los datos recopilados dentro de las tareas asignadas en este estudio se mantendrán en el servidor de Mobistudy hasta el final del estudio, en {studyEndDate}.
Los registros técnicos se eliminarán después de 1 año de su producción.

[SPECIFY FOR HOW LONG STUDY DATA WILL BE KEPT BY RESEARCHERS]
`,
    access: `¿Quién tendrá acceso a estos datos?
\u2022 Personal de la Universidad de Malmö para mantenimiento técnico y auditoría (la Universidad de Malmö es el procesador de su información personal).`,
    accessInstitution: `\u2022 {institution}`,
    accessReason: ` para {reason} ({institution} is the controller of your personal information).`,
    rights: `¿Cuáles son mis derechos?
\u2022 Puede retirarse de este estudio cuando lo desee desde la sección "estudios" de la aplicación. Los datos que haya producido hasta ahora dentro del estudio se conservarán, pero si desea que también se eliminen, comuníquese con mobistudy@mau.se.
\u2022 Puede eliminar su cuenta de Mobistudy desde la sección "perfil" de la aplicación. Esto eliminará todos sus datos recopilados por Mobistudy, excepto los registros técnicos, que se eliminarán después de 1 año. Tenga en cuenta que los datos ya descargados por las instituciones involucradas en este o en estudios anteriores aún pueden conservarse después de haber eliminado su cuenta. Si desea que también se eliminen estos datos, póngase en contacto con mobistudy@mau.se.
\u2022 Puede solicitar que se detenga o restrinja el procesamiento de sus datos (incluso sin eliminar su cuenta). En este caso, póngase en contacto con mobistudy@mau.se.
\u2022 Puede averiguar qué se ha registrado sobre usted y descargar los datos en un formato legible por máquina poniéndose en contacto con mobistudy@mau.se.
\u2022 Puede solicitar la corrección de errores en sus datos. En este caso, póngase en contacto con mobistudy@mau.se.
\u2022 Si tiene quejas que no se pueden resolver con la Universidad de Malmö, puede enviarlas a Integritetsskyddsmyndigheten.`,
    contacts: `Si tiene preguntas sobre cómo procesa los datos cada institución involucrada en el estudio, comuníquese con:
\u2022 Responsable de protección de datos de la Universidad de Malmö en dataskyddsombud@mau.se`,
    piContact: `\u2022 {name} at: {contact}`
  },
  consent: {
    taskItemDataQuery: `Acepto enviar mis datos sobre {dataType}, {scheduling}`,
    taskItemForm: `Acepto contestar el formulario {formName}, {scheduling}`,
    taskItemMiBand3: `Acepto enviar mis datos recopilados por el reloj inteligente, {scheduling}`,
    taskItemQCST: 'Acepto realizar la prueba Queen\'s College step test, {scheduling}',
    taskItemSMWT: 'Acepto realizar la prueba de camino de seis minutos, {scheduling}',
    taskItemPO60: 'Acepto emedir mi oximetría de pulso, {scheduling}',
    taskItemPeakFlow: 'Acepto realizar una prueba de flujo espiratorio máximo, {scheduling}',
    taskItemPosition: 'Acepto enviar mi posición geográfica, {scheduling}',
    taskItemFingerTapping: 'Acepto realizar la tarea de tocar la pantalla con el dedo, {scheduling}',
    taskItemTUGT: 'Acepto realizar la prueba "Levanta y anda", {scheduling}',
    taskItemHoldPhone: 'Acepto realizar la prueba "Sostén el teléfono", {scheduling}'
  },
  scheduling: {
    notDefined: 'Aún no definido',
    afterTaskExecution: 'Después que se complete la tarea {n}',
    alwaysOn: 'Siempre disponible',
    fromDaysConsented: `El día después de que he dado mi consentimiento| {n} días después de haber dado mi consentimiento`,
    fromTaskExecuted: `{days} días después de haber completado la tarea {taskId}`,
    untilDaysConsented: `Hasta {days} días después de haber dado mi consentimiento`,
    untilTaskExecuted: `Hasta {days} días después de haber completado la tarea {taskId}`,
    occurrences: `Repetidos {occurrences} veces`,
    repeatedDays: `Repetido diaramente | Repetido cada {n} día`,
    repeatedWeeks: `Repetido  semanalmente| Repetido cada {n} semana`,
    repeatedMonths: `Repetido mensualmente| Repetido cada {n} mes`,
    repeatedYears: `Repetido  cada año| Repetido cada {n} año`,
    onMonths: `En el mes (s) siguiente `,
    atHours: `En las siguientes horas`,
    onDaysMonth: `En los siguientes día(s) del mes`,
    onDaysWeek: `En los siguientes día(s) de la semana`
  },
  months: {
    '1': 'Enero',
    '2': 'Febrero',
    '3': 'Marzo',
    '4': 'Abril',
    '5': 'Mayo',
    '6': 'Junio',
    '7': 'Julio',
    '8': 'Agosto',
    '9': 'Septiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Deciembre'
  },
  weekDays: {
    mo: 'Lunes',
    tu: 'Martes',
    we: 'Miércoles',
    th: 'Jueves',
    fr: 'Viernes',
    sa: 'Sábado',
    su: 'Domingo'
  },
  healthDataTypes: {
    steps: 'Pasos',
    weight: 'Peso',
    height: 'Altura',
    activity: 'Actividad',
    heart_rate: 'Frecuencia Cardiaca',
    heart_rate_variability: 'Variabilidad de la frecuencia cardiaca',
    calories: 'Calorías',
    distance: 'Distancia caminada o andada'
  }
}
