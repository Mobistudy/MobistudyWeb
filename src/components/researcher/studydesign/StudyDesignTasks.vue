<template>
  <div>
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5">Tasks</div>
        <div class="text-subtitle1">At least one task has to be specified.</div>
      </q-card-section>
      <q-card-section>
        <q-btn-dropdown split label="Add task">
          <!-- dropdown content -->
          <q-list link>
            <q-item clickable v-close-popup @click="addTask('dataQuery')">
              <q-item-section>
                <q-item-label>Data query</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('form')">
              <q-item-section>
                <q-item-label>Form</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('miband3')">
              <q-item-section>
                <q-item-label>Wearable (MiBand3) data collection</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('qcst')">
              <q-item-section>
                <q-item-label>Queen's college step test</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('smwt')">
              <q-item-section>
                <q-item-label>Six minute walk test</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('po60')">
              <q-item-section>
                <q-item-label>Pulse oximeter</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('peakFlow')">
              <q-item-section>
                <q-item-label>Peak Flow</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('position')">
              <q-item-section>
                <q-item-label>Position</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="addTask('fingerTapping')">
              <q-item-section>
                <q-item-label>Finger tapping</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="addTask('tugt')">
              <q-item-section>
                <q-item-label>Timed up and go test</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="addTask('holdPhone')">
              <q-item-section>
                <q-item-label>Hold the phone (tremor) test</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="addTask('vocalization')">
              <q-item-section>
                <q-item-label>Vocalization test</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="addTask('drawing')">
              <q-item-section>
                <q-item-label>Drawing test</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="addTask('jstyle')">
              <q-item-section>
                <q-item-label>Wearable (JStyle) data collection</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-btn-dropdown>
      </q-card-section>
    </q-card>
    <!-- Tasks -->
    <q-card v-for="(task, index) in studyDesign.tasks" :key="index" class="form-card q-my-md">
      <q-card-section>
        <div class="text-h5" v-if="task.type === 'dataQuery'">Data Query Task</div>
        <div class="text-h5" v-if="task.type === 'form'">Form Task</div>
        <div class="text-h5" v-if="task.type === 'miband3'">Miband3 Task</div>
        <div class="text-h5" v-if="task.type === 'po60'">Pulse Oximeter Task</div>
        <div class="text-h5" v-if="task.type === 'qcst'">QCST Task</div>
        <div class="text-h5" v-if="task.type === 'smwt'">SMWT Task</div>
        <div class="text-h5" v-if="task.type === 'peakFlow'">Peak Flow Task</div>
        <div class="text-h5" v-if="task.type === 'position'">Position Task</div>
        <div class="text-h5" v-if="task.type === 'fingerTapping'">Finger tapping</div>
        <div class="text-h5" v-if="task.type === 'tugt'">Timed up and go test</div>
        <div class="text-h5" v-if="task.type === 'holdPhone'">Hold the phone test</div>
        <div class="text-h5" v-if="task.type === 'vocalization'">Vocalization test</div>
        <div class="text-h5" v-if="task.type === 'drawing'">Drawing test</div>
        <div class="text-h5" v-if="task.type === 'jstyle'">JStyle Task</div>
        Task Id: {{ task.id }}
      </q-card-section>
      <q-card-section>
        <div v-if="task.type === 'dataQuery'" class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Data type:
            </div>
            <div class="text-caption">
              Data type to be collected.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select v-model="task.dataType" emit-value map-options :options="selectOptionsDataTypeForQuery"
              @input="update()" />
          </div>
        </div>
        <div v-if="task.type === 'dataQuery' && allowAggregated(task.dataType)" class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Aggregation:
            </div>
            <div class="text-caption">
              Optional. If aggregated, the data will be summed over the entire period or per bucket.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-checkbox v-model="task.aggregated" @input="update()" />
          </div>
        </div>

        <div v-if="task.type === 'dataQuery' && allowAggregated(task.dataType)" class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Bucket:
            </div>
            <div class="text-caption">
              You can sum the data into buckets of given length.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select v-model="task.bucket" emit-value map-options :options="selectOptionsBucketForQuery"
              :readonly="!task.aggregated" :disable="!task.aggregated" @input="update()" />
          </div>
        </div>

        <q-btn v-if="task.type === 'form'" label="Create new Form" @click="createForm()" />

        <div v-if="task.type === 'form'" class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Form:
            </div>
            <div class="text-caption">
              Select the form from the list or create a new one.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select v-model="task.formKey" emit-value map-options :options="selectOptionsFormsList"
              @input="changeFormName(task, $event)" />
          </div>
        </div>

        <!-- Miband3 task -->
        <div v-if="task.type === 'miband3'" class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Heart rate interval:
            </div>
            <div class="text-caption">
              How often the heart rate must be measured in minutes.
              The more often its measured the more the battery is used.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input v-model="task.hrInterval" emit-value type="number" min="0" max="255" @input="update()" />
          </div>
        </div>

        <!-- jStyle task -->
        <div v-if="task.type === 'jstyle'" class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Heart rate interval:
            </div>
            <div class="text-caption">
              How often the heart rate must be measured in minutes.
              The more often its measured the more the battery is used.
              Use 0 for no measurement.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input v-model="task.hrInterval" emit-value type="number" min="0" max="255" @input="update()" />
          </div>

          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Heart rate variability and blood pressure interval:
            </div>
            <div class="text-caption">
              How often the heart rate variability and blood pressure must be measured in minutes.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input v-model="task.hrvInterval" emit-value type="number" min="0" max="255" @input="update()" />
          </div>

          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              SPO2 interval:
            </div>
            <div class="text-caption">
              How often the SPO2 must be measured in minutes.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input v-model="task.spo2Interval" emit-value type="number" min="0" max="255" @input="update()" />
          </div>

          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Temperature interval:
            </div>
            <div class="text-caption">
              How often the temperature must be measured in minutes.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input v-model="task.tempInterval" emit-value type="number" min="0" max="255" @input="update()" />
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Scheduling:
            </div>
            <div class="text-caption">
              Scheduling of the task. Click the down-arrow to expand.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-expansion-item expand-separator :label="schedulingToString(task.scheduling)">
              <scheduler v-model="task.scheduling"
                :taskIds="studyDesign.tasks.map(t => t.id).filter(i => i != task.id)"></scheduler>
            </q-expansion-item>
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Custom title:
            </div>
            <div class="text-caption">
              This can be used to show a user-friendly name, or to specify the scope of the task
              (e.g. "after medication"). Optional.
            </div>
          </div>
          <div class="col q-pl-sm">
            <div class="row">
              <q-checkbox class="col-4" label="Use custom name" v-model="task.useCustomTitle" />
              <multilang-input class="col" v-model="task.customTitle" @input="update()"
                :languages="studyDesign.generalities.languages" :required="task.useCustomTitle"
                :disable="!task.useCustomTitle" />
            </div>
          </div>
        </div>

        <q-btn label="Remove this task" color="negative" icon="remove" @click="removeTask(index)" class="q-mt-sm" />
      </q-card-section>
    </q-card>

    <formbuilder ref="formbuilder" v-model="newForm" @simulateForm="openFormSimulator()" @saved="getForms()"
      :languages="studyDesign.generalities.languages"></formbuilder>
    <formsimulator ref="formsimulator" :form='newForm' @closed="openFormBuilder()"
      :languages="studyDesign.generalities.languages"></formsimulator>
  </div>
</template>

<script>
import userinfo from '@shared/userinfo'
import Scheduler from '@components/researcher/studydesign/SchedulerCard'
import { schedulingToString } from '@shared/scheduling'
import API from '@shared/API'
import MultilangInput from '@components/MultilangInput'

import FormBuilder from '@components/researcher/studydesign/FormBuilder'
import FormSimulator from '@components/researcher/studydesign/FormSimulator'
import HealthDataTypesEnum from '@shared/healthDataTypesEnum'

const healthDataTypesEnum2String = function (type) {
  if (type === 'steps') return 'Steps'
  if (type === 'weight') return 'Weight'
  if (type === 'height') return 'Height'
  if (type === 'bmi') return 'Body Mass Index (BMI)'
  if (type === 'activity') return 'Activity (incl. walking, running, biking, sleeping, sport, ...)'
  if (type === 'heart_rate') return 'Heart rate (cannot aggregate)'
  if (type === 'heart_rate_variability') return 'Heart Rate Variability (iPhones only, cannot aggregate)'
  if (type === 'calories') return 'Calories'
  if (type === 'distance') return 'Distance'
  return '???'
}

const defaultScheduling = {
  startEvent: 'consent',
  eventTaskId: undefined,
  startDelaySecs: undefined,
  untilSecs: undefined,
  occurrences: undefined,
  intervalType: 'd',
  interval: 1,
  hours: [],
  months: [],
  monthDays: [],
  weekDays: [],
  alwaysOn: false
}

export default {
  components: {
    Scheduler,
    MultilangInput,
    formbuilder: FormBuilder,
    formsimulator: FormSimulator
  },
  name: 'StudyDesignTasks',
  // modelValue here is the whole study design
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data () {
    return {
      selectOptionsFormsList: [],
      newForm: {
        teamKey: userinfo.user.teamKey,
        name: {
          en: '',
          sv: '',
          es: ''
        },
        description: {
          en: '',
          sv: '',
          es: ''
        },
        questions: [{
          id: 'Q1',
          text: {
            en: '',
            sv: '',
            es: ''
          },
          helper: {
            en: '',
            sv: '',
            es: ''
          },
          footer: {
            en: '',
            sv: '',
            es: ''
          },
          type: 'freetext',
          nextDefaultId: undefined,
          answerChoices: [{
            id: 'Q1A1',
            text: {
              en: '',
              sv: '',
              es: ''
            },
            nextQuestionId: undefined
          }]
        }]
      },
      selectOptionsDataTypeForQuery: HealthDataTypesEnum.values.map((v) => {
        return {
          label: healthDataTypesEnum2String(v),
          value: v
        }
      }),
      selectOptionsBucketForQuery: [
        {
          value: 'none',
          label: 'None'
        },
        {
          value: 'hour',
          label: 'Hour'
        },
        {
          value: 'day',
          label: 'Day'
        },
        {
          value: 'week',
          label: 'Week'
        },
        {
          value: 'month',
          label: 'Month'
        },
        {
          value: 'year',
          label: 'Year'
        }
      ]
    }
  },
  computed: {
    studyDesign: {
      get () {
        return this.modelValue
      },
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      }
    }
  },
  async created () {
    this.getForms()
  },
  methods: {
    update () {
      this.$emit('update:modelValue', this.modelValue)
    },
    async getForms () {
      try {
        const forms = await API.getFormsList()
        if (!forms) return
        this.selectOptionsFormsList = forms.map((f) => {
          return {
            name: f.name,
            label: this.visualizeFormName(f.name),
            value: f._key
          }
        })
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Cannot retrieve the forms. Check the connection and reload the page.',
          icon: 'report_problem'
        })
      }
    },
    schedulingToString (sc) {
      return schedulingToString(sc, 'en')
    },
    allowAggregated (v) {
      const state = HealthDataTypesEnum.allowsAggregated(v)
      return state
    },
    addTask (type) {
      const newTask = {
        id: this.studyDesign.tasks.length + 1,
        type,
        scheduling: defaultScheduling,
        useCustomTitle: false,
        customTitle: undefined
      }
      if (type === 'form') {
        newTask.formKey = undefined
        // this is mainly used for the consent tab, it can be discarded when the object is sent to the server
        newTask.formName = undefined
      }
      if (type === 'dataQuery') {
        newTask.dataType = undefined
        newTask.aggregated = false
        newTask.bucket = 'none'
      }
      if (type === 'miband3') {
        newTask.hrInterval = 1
      }
      if (type === 'jstyle') {
        newTask.hrInterval = 5
        newTask.spo2Interval = 5
        newTask.tempInterval = 5
        newTask.hrvInterval = 5
      }
      this.studyDesign.tasks.push(newTask)
      this.update()
    },

    removeTask (index) {
      this.studyDesign.tasks.splice(index, 1)
      // update task id
      for (let i = 0; i < this.studyDesign.tasks.length; i++) {
        // update the task ids after the one that has been removed
        if (i >= index) this.studyDesign.tasks[i].id = this.studyDesign.tasks[i].id - 1
      }
      this.update()
    },
    visualizeFormName (name) {
      for (const lan of Object.keys(name)) {
        if (name[lan]) return name[lan]
      }
    },
    changeFormName (task, formKey) {
      const option = this.selectOptionsFormsList.find((opt) => {
        return opt.value === formKey
      })
      task.formName = option.name
      this.update()
    },
    createForm () {
      this.$refs.formbuilder.show()
    },
    openFormBuilder () {
      this.$refs.formbuilder.show()
    },
    openFormSimulator () {
      this.$refs.formsimulator.show()
    }
  }
}
</script>
