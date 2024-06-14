<template>
  <div>
    <!-- Inclusion Criteria Tab Card -->
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5"> Inclusion Criteria </div>
        <div class="text-subtitle1"> These criteria are automatically matched against participants' profiles. </div>
      </q-card-section>

      <!-- Countries -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Countries:
            </div>
            <div class="text-caption">
              Countries where the participants can be resident in.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-field :error="studyDesign.inclusionCriteria.countries.length == 0"
              error-message="At least one country must be specified">
              <q-checkbox v-model="studyDesign.inclusionCriteria.countries" label="Sweden" val="se" @input="update()" />
              <q-checkbox v-model="studyDesign.inclusionCriteria.countries" label="United Kingdom" val="gb"
                @input="update()" />
              <q-checkbox v-model="studyDesign.inclusionCriteria.countries" label="Spain" val="es" @input="update()" />
            </q-field>
          </div>
        </div>
      </q-card-section>

      <!-- Age Range -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Age range:
            </div>
            <div class="text-caption">
              Minimum and maximum age range of the participants.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input type="number" min="18" v-model.number="studyDesign.inclusionCriteria.minAge" hint="Minimum age."
              @input="update()"
              :rules="[val => !!val || 'Field is required', val => (val && (val >= 18)) || 'A minimum age of 18 is required']" />
          </div>
          <div class="col q-ml-sm">
            <q-input type="number" min="18" v-model.number="studyDesign.inclusionCriteria.maxAge" hint="Maximum age."
              @input="update()"
              :rules="[val => !!val || 'Field is required', val => (val && (val >= 18)) || 'A minimum age of 18 is required']" />
          </div>
        </div>
      </q-card-section>

      <!-- Genders -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Sex:
            </div>
            <div class="text-caption">
              Desired sex of the participant. More than one option can be selected.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-field :error="studyDesign.inclusionCriteria.sex.length == 0"
              error-message="At least one sex must be specified">
              <q-checkbox v-model="studyDesign.inclusionCriteria.sex" label="Male" val="male" @input="update()" />
              <q-checkbox v-model="studyDesign.inclusionCriteria.sex" label="Female" val="female" @input="update()" />
              <q-checkbox v-model="studyDesign.inclusionCriteria.sex" label="Other" val="other" @input="update()" />
            </q-field>
          </div>
        </div>
      </q-card-section>

      <!-- Number of Participants -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Maximum number of participants:
            </div>
            <div class="text-caption">
              Optional. Mobistudy will stop proposing this study when this number of participants has joined this study.
              Withdrawals are included.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input type="number" min="1" v-model.number="studyDesign.numberOfParticipants"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57" clearable @input="update()" />
          </div>
        </div>
      </q-card-section>

      <!-- Diseases -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              List of diseases:
            </div>
            <div class="text-caption">
              Type in and select the list of diseases (in English) that the patient will need to have. The disease name
              is searched on SNOMED.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select ref="diseasesSelect" v-model="diseasesVue" use-input use-chips multiple :options="diseaseOptions"
              input-debounce="500" @filter="searchDisease" @input="clearDiseasesFilter">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No diseases found
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <!-- Medications -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              List of medications:
            </div>
            <div class="text-caption">
              Type in and select the list of medications the patient has to be taking (only generics). The medication
              name is
              searched on SNOMED.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-select ref="medsSelect" v-model="medsVue" use-input use-chips multiple :options="medsOptions"
              input-debounce="500" @filter="searchMeds" @input="clearMedsFilter">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No medications found </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <!-- BMI Range -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              BMI range:
            </div>
            <div class="text-caption">
              Minimum and maximum BMI range of the participants.
              Values must be between 5 and 210.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input type="number" min="5" max="210" v-model.number="studyDesign.inclusionCriteria.minBMI"
              hint="Minimum BMI." @input="update()"
              :rules="[val => !!val || 'Field is required', val => (val >= 5 && val <= 210) || 'A BMI between 5 and 210 is required']" />
          </div>
          <div class="col q-ml-sm">
            <q-input type="number" min="5" max="210" v-model.number="studyDesign.inclusionCriteria.maxBMI"
              hint="Maximum BMI." :input="update()"
              :rules="[val => !!val || 'Field is required', val => (val >= 5 && val <= 210) || 'A BMI between 5 and 210 is required']" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Custom Criteria Questions -->
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5"> Custom Criteria Questions </div>
        <div class="text-subtitle1"> Questions for additional custom inclusion criteria. </div>
      </q-card-section>
      <q-card-section>
        <div v-for="(criteriaQuestion, index) in studyDesign.inclusionCriteria.criteriaQuestions" :key="index">
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Criteria Question:
              </div>
              <div class="text-caption">
                Additional question, especially related to temporary conditions.
                The question must be of Yes/No type.
              </div>
            </div>
            <div class="col q-pl-sm">
              <multilang-input v-model="criteriaQuestion.title" @input="update()"
                :languages="studyDesign.generalities.languages" required />
            </div>
          </div>
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Answer for inclusion:
              </div>
              <div class="text-caption">
                This is the answer that makes the patient eligible.
              </div>
            </div>
            <div class="col q-pl-sm">
              <q-radio v-model="criteriaQuestion.answer" val="yes" label="Yes" @input="update()" />
              <q-radio v-model="criteriaQuestion.answer" val="no" label="No" @input="update()" />
            </div>
          </div>
          <div class="row justify-center">
            <div class="col">
              <q-btn class="float-left" label="Remove Question" color="negative" icon="remove"
                @click="removeRowCriteriaQuestion(index)" />
              <q-btn class="float-right" v-show="index == studyDesign.inclusionCriteria.criteriaQuestions.length - 1"
                label="Add Question" color="primary" icon="add" @click="addRowCriteriaQuestion()" />
            </div>
          </div>
          <q-separator class="q-mt-sm" v-show="index != studyDesign.inclusionCriteria.criteriaQuestions.length - 1" />
        </div>
        <div class="row">
          <div class="col">
            <q-btn class="float-right" v-show="studyDesign.inclusionCriteria.criteriaQuestions.length == 0"
              label="Add Question" color="primary" icon="add" @click="addRowCriteriaQuestion()" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import API from '@shared/API'
import MultilangInput from '@components/MultilangInput'

export default {
  name: 'StudyDesignCriteria',
  // modelValue here is the study design
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    MultilangInput
  },
  data () {
    return {
      diseaseOptions: [],
      medsOptions: []
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
    },
    // these are used to map label and value to term and conceptId
    diseasesVue: {
      get: function () {
        if (this.studyDesign.inclusionCriteria.diseases && this.studyDesign.inclusionCriteria.diseases.length) {
          return this.studyDesign.inclusionCriteria.diseases.map(x => {
            return {
              label: x.term,
              value: x.conceptId,
              vocabulary: x.vocabulary
            }
          })
        } else return []
      },
      set: function (diseasesOpts) {
        this.studyDesign.inclusionCriteria.diseases = diseasesOpts.map(x => {
          return {
            term: x.label,
            conceptId: x.value,
            vocabulary: x.vocabulary
          }
        })
      }
    },
    medsVue: {
      get: function () {
        if (this.studyDesign.inclusionCriteria.medications && this.studyDesign.inclusionCriteria.medications.length) {
          return this.studyDesign.inclusionCriteria.medications.map(x => {
            return {
              label: x.term,
              value: x.conceptId,
              vocabulary: x.vocabulary
            }
          })
        } else return []
      },
      set: function (medsOpts) {
        this.studyDesign.inclusionCriteria.medications = medsOpts.map(x => {
          return {
            term: x.label,
            conceptId: x.value,
            vocabulary: x.vocabulary
          }
        })
      }
    }
  },
  methods: {
    update () {
      this.$emit('update:modelValue', this.studyDesign)
    },
    async searchDisease (diseaseDescription, update, abort) {
      if (diseaseDescription.length < 2) {
        abort()
        return
      }
      const concepts = await API.searchDiseaseConcept(diseaseDescription, 'en')
      concepts.data = concepts.data.filter((concept) => {
        if (!this.conceptIdExistsInArrayOfObjects(this.studyDesign.inclusionCriteria.diseases, concept.conceptId)) {
          return true
        } else return false
      })
      if (concepts.data.length) {
        update(() => {
          this.diseaseOptions = concepts.data.map((c) => {
            return {
              label: c.term,
              value: c.conceptId,
              vocabulary: c.vocabulary
            }
          })
        })
      } else abort()
    },
    async searchMeds (medDescription, update, abort) {
      if (medDescription.length < 2) {
        abort()
        return
      }
      const concepts = await API.searchMedicationConcept(medDescription, 'en')
      concepts.data = concepts.data.filter((concept) => {
        if (!this.conceptIdExistsInArrayOfObjects(this.studyDesign.inclusionCriteria.medications, concept.conceptId)) {
          return true
        } else return false
      })
      if (concepts.data.length) {
        update(() => {
          this.medsOptions = concepts.data.map((c) => {
            return {
              label: c.term,
              value: c.conceptId,
              vocabulary: c.vocabulary
            }
          })
        })
      } else abort()
    },
    conceptIdExistsInArrayOfObjects (array, conceptId) {
      let exists = false
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of array.entries()) {
        if (value.inclusionCriteria.conceptId === conceptId) {
          exists = true
        }
      }
      return exists
    },
    clearDiseasesFilter () {
      if (this.$refs.diseasesSelect !== void 0) {
        this.$refs.diseasesSelect.updateInputValue('')
      }
      this.update()
    },
    clearMedsFilter () {
      if (this.$refs.medsSelect !== void 0) {
        this.$refs.medsSelect.updateInputValue('')
      }
      this.update()
    },
    addRowCriteriaQuestion () {
      this.studyDesign.inclusionCriteria.criteriaQuestions.push({
        title: {
          en: '',
          sv: '',
          es: '',
          it: ''
        },
        answer: 'yes'
      })
      this.update()
    },
    removeRowCriteriaQuestion (index) {
      this.studyDesign.inclusionCriteria.criteriaQuestions.splice(index, 1)
      this.update()
    }
  }
}
</script>
