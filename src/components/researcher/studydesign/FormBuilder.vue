<template>
  <q-dialog
    v-model="opened"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-form @submit="publish">
        <q-card-section class="row items-center">
          <div class="text-h5">
            Form builder
          </div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <!-- start of form editor -->
            <div class="row">
              <div class="col-3 q-pt-sm">
                <div class="text-bold">
                  Form name:
                </div>
                <div class="text-caption">
                  Short name of the form. This is used in several places of the user interface.
                </div>
              </div>
              <div class="col q-pl-sm">
                <multilang-input
                  v-model="formDescription.name"
                  type="text"
                  @input="update()"
                  :languages="languages"
                  required
                />
              </div>
            </div>
            <div class="row">
              <div class="col-3 q-pt-sm">
                <div class="text-bold">
                  Description:
                </div>
                <div class="text-caption">
                  Short description for the form. This is displayed to the user.
                </div>
              </div>
              <div class="col q-pl-sm">
                <multilang-input
                  v-model="formDescription.description"
                  type="textarea"
                  @input="update()"
                  :languages="languages"
                  required
                />
              </div>
            </div>

            <div class="text-h6"> Questions: </div>
            <!-- Question -->
            <div
              class="shadow-1 q-pa-md q-mt-lg"
              v-for="(question, qIndex) in formDescription.questions"
              :key="qIndex"
            >
              <div class="q-pa-sm text-bold"> Question </div>
              <div class="row">
                <div class="col-3">
                  ID.
                  <div class="text-caption">
                    Identifier of this question.
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <q-input
                    label="ID"
                    v-model="question.id"
                    hint="This is set automatically."
                    type="text"
                    readonly
                  />
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-3">
                  Question Type.
                  <div class="text-caption">
                    Type of question.
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <q-select
                    v-model="question.type"
                    emit-value
                    map-options
                    :options="questionTypeOptions"
                    @input="updateQuestionType(question)"
                  />
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-3">
                  Question text.
                  <div class="text-caption">
                    Text of the question.
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <!-- TODO: use a rich text editor instead -->
                  <multilang-input
                    v-model="question.text"
                    type="text"
                    @input="update()"
                    :languages="languages"
                    required
                  />
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-3">
                  Helper.
                  <div class="text-caption">
                    Optional. Short subcaption or helper.
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <multilang-input
                    label="Helper"
                    v-model="question.helper"
                    type="text"
                    @input="update()"
                    :languages="languages"
                  />
                </div>
              </div>
              <!-- number or slider answers -->
              <div
                class="row q-mt-sm"
                v-if="question.type == 'number' || question.type == 'slider'"
              >
                <div class="col-3">
                  Min and max.
                  <div class="text-caption">
                    Mandatory. Minimum and maximum values allowed.
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <div class="row justify-start">
                    <q-input
                      class="q-pr-lg"
                      hint="Minimum"
                      v-model.number="question.min"
                      type="number"
                      @input="update()"
                    />
                    <q-input
                      class="q-pl-lg"
                      hint="Maximum"
                      v-model.number="question.max"
                      type="number"
                      @input="update()"
                    />
                  </div>
                </div>
              </div>
              <div
                class="row q-mt-sm"
                v-if="question.type == 'slider'"
              >
                <div class="col-3">
                  Vertical.
                  <div class="text-caption">
                    Optional. Vertical slider or horizontal?
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <q-checkbox
                    v-model="question.vertical"
                    @input="update()"
                  />
                </div>
              </div>

              <div class="row q-mt-sm">
                <div class="col-3">
                  Footer.
                  <div class="text-caption">
                    Optional. Footer text, for example for copyright notes or references.
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <multilang-input
                    label="Footer"
                    v-model="question.footer"
                    type="text"
                    @input="update()"
                    :languages="languages"
                  />
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-3">
                  Next question ID.
                  <div class="text-caption">
                    If not specified, the next available question will be used.
                  </div>
                </div>
                <div class="col q-pl-sm">
                  <q-select
                    clearable
                    color="secondary"
                    v-model="question.nextDefaultId"
                    :options="defaultIdSelection"
                    hint="ENDFORM terminates the form."
                    @input="update()"
                  />
                </div>
              </div>

              <!-- single choice or multiple choice answers -->
              <div
                class="q-pa-lg q-mt-sm shadow-1 bg-info"
                v-show="question.type == 'multiChoice' || question.type == 'singleChoice'"
                v-for="(answerChoice, aIndex) in question.answerChoices"
                :key="aIndex"
              >
                <div class="q-pa-sm text-bold"> Answer </div>
                <div class="row q-mt-sm">
                  <div class="col-3">
                    Answer ID.
                    <div class="text-caption">
                      Identifier of this answer.
                    </div>
                  </div>
                  <div class="col q-pl-sm">
                    <q-input
                      label="Answer ID"
                      v-model="answerChoice.id"
                      type="text"
                      readonly
                      hint="This is auto generated."
                    />
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col-3">
                    Answer Text.
                    <div class="text-caption">
                      Text of this answer (e.g. 'Yes').
                    </div>
                  </div>
                  <div class="col q-pl-sm">
                    <multilang-input
                      label="Answer Text"
                      v-model="answerChoice.text"
                      type="text"
                      :languages="languages"
                    />
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col-3">
                    Allow free text.
                    <div class="text-caption">
                      Optional. Additional free text input (e.g. when asking "other")
                    </div>
                  </div>
                  <div class="col q-pl-sm">
                    <q-checkbox
                      v-model="answerChoice.includeFreeText"
                      label="Free text option"
                    />
                  </div>
                </div>
                <div
                  class="row q-mt-sm"
                  v-show="question.type !== 'multiChoice'"
                >
                  <div class="col-3">
                    Next Question ID.
                    <div class="text-caption">
                      Optional. This answer will be followed by the question with this ID.
                    </div>
                  </div>
                  <div class="col q-pl-sm">
                    <p
                      v-show="answerChoice.nextQuestionId == 'REMOVED'"
                      class="text-negative"
                    >THIS QUESTION HAS BEEN REMOVED!</p>
                    <q-select
                      v-model="answerChoice.nextQuestionId"
                      :options="defaultIdSelection"
                      hint="ENDFORM will terminate the form."
                      @input="update()"
                    />
                  </div>
                </div>
                <div class="row q-mt-md">
                  <div class="col-6">
                    <q-btn
                      v-if="aIndex !==0"
                      color="negative"
                      icon="remove"
                      label="Remove this answer"
                      @click="removeAnswerChoice(qIndex, aIndex)"
                    />
                  </div>
                  <div class="col-6">
                    <q-btn
                      v-if="aIndex === question.answerChoices.length-1"
                      color="primary"
                      label="Add an answer choice"
                      icon="add"
                      @click="addAnswerChoice(qIndex)"
                    />
                  </div>
                </div>
              </div>

              <div class="row q-mt-sm">
                <div class="col-6">
                  <q-btn
                    v-if="qIndex !==0"
                    color="negative"
                    icon="remove"
                    label="Remove this question"
                    @click="removeQuestion(qIndex)"
                  />
                </div>
                <div class="col-6">
                  <q-btn
                    v-if="qIndex === formDescription.questions.length-1"
                    label="Add a question"
                    color="primary"
                    icon="add"
                    @click="addQuestion()"
                  />
                </div>
              </div>
              <q-separator v-if="qIndex !== formDescription.questions.length-1" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col">
              <q-btn
                color="secondary"
                @click="openFormSimulator()"
                label="Simulate"
              />
            </div>
            <div class="col">
              <q-btn
                color="primary"
                type="submit"
                label="Publish"
              />
            </div>
            <div class="col">
              <q-btn
                color="primary"
                @click="cancelForm()"
                label="Cancel"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import API from '@shared/API.js'
import MultilangInput from '@components/MultilangInput'

export default {
  name: 'FormBuilder',
  props: ['modelValue', 'languages'],
  components: {
    MultilangInput
  },
  data () {
    return {
      formDescription: this.modelValue,
      questionsCounter: 0,
      questionTypeOptions: [{
        label: 'Only text (no question)',
        value: 'textOnly'
      },
      {
        label: 'Freetext',
        value: 'freetext'
      },
      {
        label: 'Number',
        value: 'number'
      },
      {
        label: 'Slider',
        value: 'slider'
      },
      {
        label: 'Single choice',
        value: 'singleChoice'
      }, {
        label: 'Multiple choice',
        value: 'multiChoice'
      }],
      opened: false
    }
  },
  computed: {
    defaultIdSelection () {
      const ret = ['ENDFORM']
      for (let i = 0; i < this.formDescription.questions.length; i++) {
        ret.push(this.formDescription.questions[i].id)
      }
      return ret
    }
  },
  methods: {
    update () {
      this.$emit('update:modelValue', this.formDescription)
    },
    show () {
      this.opened = true
    },
    openFormSimulator () {
      this.opened = false
      this.$emit('simulateForm', this.formDescription)
    },
    addQuestion () {
      const qid = 'Q' + (this.formDescription.questions.length + 1)
      const newQuestion = {
        id: qid,
        text: {},
        helper: {},
        footer: {},
        type: 'textOnly',
        nextDefaultId: undefined
      }
      for (const lang of this.languages) {
        newQuestion.text[lang] = ''
        newQuestion.helper[lang] = ''
      }
      this.formDescription.questions.push(newQuestion)

      this.update()
    },
    updateQuestionType (question) {
      if (question.type === 'singleChoice' || question.type === 'multiChoice') {
        this.$set(question, 'answerChoices', [{
          id: question.id + 'A1',
          text: {},
          nextQuestionId: undefined,
          includeFreeText: false
        }])
      }
      if (question.type === 'number') {
        this.$set(question, 'min', undefined)
        this.$set(question, 'max', undefined)
      }
      if (question.type === 'slider') {
        this.$set(question, 'min', undefined)
        this.$set(question, 'max', undefined)
        this.$set(question, 'vertical', false)
      }
      if (question.type === 'textOnly' || question.type === 'freetext') {
        delete question.answerChoices
        delete question.min
        delete question.max
      }

      this.update()
    },
    // removes a question and updates all question IDs, answerChoiceIDs and nextQuestionIDs
    removeQuestion (qIndex) {
      this.formDescription.questions.splice(qIndex, 1)

      // update all indexes
      for (let qi = 0; qi < this.formDescription.questions.length; qi++) {
        // update the indexes after the one that has been removed
        if (qi >= qIndex) this.formDescription.questions[qi].id = 'Q' + (qi + 1)
        // update the nextDefaultIds
        if (this.formDescription.questions[qi].nextDefaultId && this.formDescription.questions[qi].nextDefaultId.startsWith('Q')) {
          if (this.formDescription.questions[qi].nextDefaultId === 'Q' + (qIndex + 1)) {
            this.formDescription.questions[qi].nextDefaultId = 'REMOVED'
          } else {
            const qid = parseInt(this.formDescription.questions[qi].nextDefaultId.split(/Q/)[1])
            if (qid > qIndex + 1) this.formDescription.questions[qi].nextDefaultId = 'Q' + (qid - 1)
          }
        }
        // update the answer choices IDs
        if (this.formDescription.questions[qi].type === 'singleChoice' || this.formDescription.questions[qi].type === 'multipleChoice') {
          for (let ai = 0; ai < this.formDescription.questions[qi].answerChoices.length; ai++) {
            this.formDescription.questions[qi].answerChoices[ai].id = this.formDescription.questions[qi].id + 'A' + (ai + 1)
            // update the nextQuestionIds
            if (this.formDescription.questions[qi].answerChoices[ai].nextQuestionId && this.formDescription.questions[qi].answerChoices[ai].nextQuestionId.startsWith('Q')) {
              if (this.formDescription.questions[qi].answerChoices[ai].nextQuestionId === 'Q' + (qIndex + 1)) {
                this.formDescription.questions[qi].answerChoices[ai].nextQuestionId = 'REMOVED'
              } else {
                const qid = parseInt(this.formDescription.questions[qi].answerChoices[ai].nextQuestionId.split(/Q/)[1])
                if (qid > qIndex + 1) this.formDescription.questions[qi].answerChoices[ai].nextQuestionId = 'Q' + (qid - 1)
              }
            }
          }
        }
      }
      this.update()
    },
    // add an answer choice
    addAnswerChoice (qIndex) {
      if (!this.formDescription.questions[qIndex].answerChoices) {
        this.$set(this.formDescription.questions[qIndex], 'answerChoices', [])
      }
      const newAnswer = {
        id: this.formDescription.questions[qIndex].id + 'A' + (this.formDescription.questions[qIndex].answerChoices.length + 1),
        text: {},
        nextQuestionId: undefined,
        includeFreeText: false
      }
      for (const lang of this.languages) {
        newAnswer.text[lang] = ''
      }
      this.formDescription.questions[qIndex].answerChoices.push(newAnswer)
      this.update()
    },
    // removes an answer choice
    removeAnswerChoice (qIndex, aIndex) {
      this.formDescription.questions[qIndex].answerChoices.splice(aIndex, 1)
      for (let i = aIndex; i < this.formDescription.questions[qIndex].answerChoices.length; i++) {
        this.formDescription.questions[qIndex].answerChoices[i].id = this.formDescription.questions[qIndex].id + 'A' + (i + 1)
      }
      this.update()
    },
    // cancel the form
    cancelForm () {
      this.opened = false
      // TODO: Add logic to reset newForm
    },
    // publish the form
    async publish () {
      try {
        await API.publishForm(this.formDescription)
        this.$q.notify({
          color: 'primary',
          position: 'bottom',
          message: 'The form has been published.',
          icon: 'done'
        })
        this.$emit('saved', this.formDescription)
        this.opened = false
      } catch (err) {
        console.error('Err:', err)
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Cannot Publish the form. Check the connection and reload the page.',
          icon: 'report_problem'
        })
      }
    }
  }
}
</script>
