<template>
  <div>
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5">Tasks</div>
        <div class="text-subtitle1">At least one task has to be specified.</div>
      </q-card-section>
      <q-card-section>
        <q-btn-dropdown
          split
          label="Add task"
        >
          <!-- dropdown content -->
          <q-list link>
            <q-item
              clickable
              v-close-popup
              @click.native="addDT()"
            >
              <q-item-section>
                <q-item-label>Data query</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addFormT()"
            >
              <q-item-section>
                <q-item-label>Form</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addMiband3T()"
            >
              <q-item-section>
                <q-item-label>Wearable (MiBand3) data collection</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addQCSTT()"
            >
              <q-item-section>
                <q-item-label>Queen's college step test</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addSMWTT()"
            >
              <q-item-section>
                <q-item-label>Six minute walk test</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addPulseOximeterT()"
            >
              <q-item-section>
                <q-item-label>Pulse oximeter</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addPeakFlowT()"
            >
              <q-item-section>
                <q-item-label>Peak Flow</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addPositionT()"
            >
              <q-item-section>
                <q-item-label>Position</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click.native="addTappingT()"
            >
              <q-item-section>
                <q-item-label>Finger tapping</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click.native="addTUGT()"
            >
              <q-item-section>
                <q-item-label>Timed up and go test</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click.native="addHoldPhone()"
            >
              <q-item-section>
                <q-item-label>Hold the phone (tremor) test</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click.native="addVocalization()"
            >
              <q-item-section>
                <q-item-label>Vocalization test</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-btn-dropdown>
      </q-card-section>
    </q-card>
    <!-- Tasks -->
    <q-card
      v-for="(task, index) in value.tasks"
      :key="index"
      class="form-card q-my-md"
    >
      <q-card-section>
        <div
          class="text-h5"
          v-if="task.type === 'dataQuery'"
        >Data Query Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'form'"
        >Form Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'miband3'"
        >Miband3 Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'po60'"
        >Pulse Oximeter Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'qcst'"
        >QCST Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'smwt'"
        >SMWT Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'peakFlow'"
        >Peak Flow Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'position'"
        >Position Task</div>
        <div
          class="text-h5"
          v-if="task.type === 'fingerTapping'"
        >Finger tapping</div>
        <div
          class="text-h5"
          v-if="task.type === 'tugt'"
        >Timed up and go test</div>
        <div
          class="text-h5"
          v-if="task.type === 'holdPhone'"
        >Hold the phone test</div>
        <div
          class="text-h5"
          v-if="task.type === 'Vocalization'"
        >Vocalization test</div>
        Task Id: {{task.id}}
      </q-card-section>
      <q-card-section>
        <div
          v-if="task.type === 'dataQuery'"
          class="row"
        >
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Data type:
            </div>
            <div class="text-caption">
              Data type to be collected.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select
              v-model="task.dataType"
              emit-value
              map-options
              :options="selectOptionsDataTypeForQuery"
              @input="update()"
            />
          </div>
        </div>
        <div
          v-if="task.type === 'dataQuery' && allowAggregated(task.dataType)"
          class="row"
        >
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Aggregation:
            </div>
            <div class="text-caption">
              Optional. If aggregated, the data will be summed over the entire period or per bucket.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-checkbox
              v-model="task.aggregated"
              @input="update()"
            />
          </div>
        </div>

        <div
          v-if="task.type === 'dataQuery' && allowAggregated(task.dataType)"
          class="row"
        >
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Bucket:
            </div>
            <div class="text-caption">
              You can sum the data into buckets of given length.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select
              v-model="task.bucket"
              emit-value
              map-options
              :options="selectOptionsBucketForQuery"
              :readonly="!task.aggregated"
              :disable="!task.aggregated"
              @input="update()"
            />
          </div>
        </div>

        <q-btn
          v-if="task.type === 'form'"
          label="Create new Form"
          @click="createForm()"
        />

        <div
          v-if="task.type === 'form'"
          class="row"
        >
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Form:
            </div>
            <div class="text-caption">
              Select the form from the list or create a new one.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select
              v-model="task.formKey"
              emit-value
              map-options
              :options="selectOptionsFormsList"
              @input="changeFormName(task, $event)"
            />
          </div>
        </div>

        <!-- Miband3 task -->
        <div
          v-if="task.type === 'miband3'"
          class="row"
        >
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Heart rate interval:
            </div>
            <div class="text-caption">
              How often the heart rate must be measured in minutes.
              The more often its measured the more the battery is used.
              <!-- TODO: it would be nice to have more specific information about battery life -->
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input
              v-model="task.hrInterval"
              emit-value
              type="number"
              min="0"
              max="255"
              @input="update()"
            />
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
            <q-expansion-item
              expand-separator
              :label="schedulingToString(task.scheduling)"
            >
              <scheduler
                v-model="task.scheduling"
                :taskIds="value.tasks.map(t => t.id).filter(i => i != task.id)"
              ></scheduler>
            </q-expansion-item>
          </div>
        </div>
        <q-btn
          label="Remove this task"
          color="negative"
          icon="remove"
          @click="removeTask(index)"
          class="q-mt-sm"
        />
      </q-card-section>
    </q-card>

    <formbuilder
      ref="formbuilder"
      v-model="newForm"
      @simulateForm="openFormSimulator()"
      @saved="getForms()"
      :languages="value.generalities.languages"
    ></formbuilder>
    <formsimulator
      ref="formsimulator"
      :form='newForm'
      @closed="openFormBuilder()"
      :languages="value.generalities.languages"
    ></formsimulator>
  </div>
</template>

<script>
import Scheduler from 'components/CardScheduler.vue'
import { schedulingToString } from '../modules/Scheduling.js'
import API from '../modules/API.js'
import FormBuilder from 'components/DialogFormBuilder.vue'
import FormSimulator from 'components/DialogFormSimulator.vue'
import HealthDataTypesEnum from '../modules/healthDataTypesEnum.js'

let healthDataTypesEnum2String = function (type) {
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
    'scheduler': Scheduler,
    'formbuilder': FormBuilder,
    'formsimulator': FormSimulator
  },
  name: 'StudyDesignTasks',
  // value here is the whole study design
  props: ['value', 'teamKey'],
  data () {
    let data = {
      selectOptionsFormsList: [],
      newForm: {
        teamKey: this.teamKey,
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

    return data
  },
  async created () {
    this.getForms()
  },
  methods: {
    update () {
      this.$emit('input', this.value)
    },
    async getForms () {
      try {
        let forms = await API.getFormsList()
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
      let state = HealthDataTypesEnum.allowsAggregated(v)
      return state
    },
    addDT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'dataQuery',
        scheduling: defaultScheduling,
        dataType: undefined,
        aggregated: false,
        bucket: 'none'
      })
      this.update()
    },
    addMiband3T () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'miband3',
        scheduling: defaultScheduling,
        hrInterval: 1
      })
      this.update()
    },
    addQCSTT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'qcst',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addSMWTT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'smwt',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addPulseOximeterT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'po60',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addPeakFlowT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'peakFlow',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addPositionT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'position',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addFormT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'form',
        scheduling: defaultScheduling,
        formKey: undefined,
        // this is mainly used for the consent tab, it can be discarded when the object is sent to the server
        formName: undefined
      })
      this.update()
    },
    addTappingT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'fingerTapping',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addTUGT () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'tugt',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addHoldPhone () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'holdPhone',
        scheduling: defaultScheduling
      })
      this.update()
    },
    addVocalization () {
      this.value.tasks.push({
        id: this.value.tasks.length + 1,
        type: 'vocalization',
        scheduling: defaultScheduling
      })
      this.update()
    },
    removeTask (index) {
      this.value.tasks.splice(index, 1)
      // update task id
      for (let i = 0; i < this.value.tasks.length; i++) {
        // update the task ids after the one that has been removed
        if (i >= index) this.value.tasks[i].id = this.value.tasks[i].id - 1
      }
      this.update()
    },
    visualizeFormName (name) {
      for (let lan of Object.keys(name)) {
        if (name[lan]) return name[lan]
      }
    },
    changeFormName (task, formKey) {
      let option = this.selectOptionsFormsList.find((opt) => {
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
