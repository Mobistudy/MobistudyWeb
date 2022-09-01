<template>
  <q-dialog v-model="opened">
    <q-card style="width: 800px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6 q-mb-md">Form builder</div>
        <div
          class="q-ma-md"
          v-show="langselect"
        >
          Select the language:
          <q-select
            v-model="language"
            :options="languages"
            label="Standard"
          />
        </div>
        <div v-show="!finished && !langselect">
          <div class="row">
            <div class="col-2 text-bold">Question ID:</div>
            <div class="col">{{ currentQuestion.id }}</div>
          </div>
          <div
            align="center"
            class="text-h6"
          >
            {{ currentQuestion.text[language] }}
          </div>
          <div
            align="center"
            class="text-weight-light"
          >
            {{ currentQuestion.helper[language] }}
          </div>
          <!-- Answers -->
          <q-card
            class="bg-green-2 q-ma-md"
            v-if="currentQuestion.type !== 'textOnly'"
          >

            <!-- freetext -->
            <q-input
              v-if="currentQuestion.type === 'freetext'"
              class="q-ma-sm"
              v-model="currentAnswerFreeText"
              align="center"
              type="textarea"
              rows="3"
              clearable
            />

            <!-- number -->
            <q-input
              v-if="currentQuestion.type === 'number'"
              class="q-ma-sm"
              v-model.number="currentAnswerNumber"
              align="center"
              type="number"
              :rules="[
                (val) => val >= currentQuestion.min || 'Number is too small',
                (val) => val <= currentQuestion.max || 'Number is too big',
              ]"
              clearable
            />

            <!-- slider -->
            <div
              v-if="currentQuestion.type === 'slider'"
              class="text-center"
            >
              <div class="row justify-center">
                <q-slider
                  v-model.number="currentAnswerNumber"
                  :min="currentQuestion.min"
                  :max="currentQuestion.max"
                  :vertical="currentQuestion.vertical"
                  :reverse="currentQuestion.vertical"
                />
              </div>
            </div>

            <!-- single choice -->
            <div
              class="q-ma-sm"
              v-if="currentQuestion.type === 'singleChoice'"
            >
              <div
                v-for="(answerChoice, index) in currentQuestion.answerChoices"
                :key="index"
              >
                <q-radio
                  v-model="currentAnswerSingleChoice"
                  :val="answerChoice.id"
                  :label="answerChoice.text[language]"
                />
                <q-input
                  v-show="answerChoice.includeFreeText"
                  :disable="currentAnswerSingleChoice !== answerChoice.id"
                  v-model="currentAnswerSingleChoiceFreeText"
                  type="textarea"
                  :label="answerChoice.text[language]"
                  rows="1"
                  clearable
                />
              </div>
            </div>

            <!-- multi choice -->
            <div
              class="q-ma-sm"
              v-if="currentQuestion.type === 'multiChoice'"
            >
              <div
                v-for="(answerChoice, index) in currentQuestion.answerChoices"
                :key="index"
              >
                <q-checkbox
                  v-model="currentAnswerMultiChoice"
                  :val="answerChoice.id"
                  :label="answerChoice.text[language]"
                />
                <q-input
                  v-show="answerChoice.includeFreeText"
                  :disable="!currentAnswerMultiChoice.includes(answerChoice.id)"
                  v-model="currentAnswerMultiChoiceFreeText[index]"
                  type="textarea"
                  :label="answerChoice.text[language]"
                  rows="1"
                  clearable
                />
              </div>
            </div>
          </q-card>
        </div>

        <div
          class="q-ma-md"
          v-show="finished"
        >COMPLETED</div>
        <q-btn
          v-show="langselect"
          color="primary"
          @click="start()"
          label="Next"
        />
        <q-btn
          v-show="!finished && !langselect"
          color="primary"
          @click="next()"
          label="Next"
        />
        <q-btn
          v-show="finished"
          color="primary"
          @click="restart()"
          label="Restart"
        />
        <q-btn
          color="secondary"
          @click="close()"
          label="Close"
        />

        <div align="center">
          {{ currentQuestion.footer[language] }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'FormViewer',
  props: ['form', 'languages'],
  data () {
    return {
      tempViewerHolder: '',
      opened: false,
      currentIndex: 0,
      currentQuestion: {
        id: undefined,
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
        answerChoices: []
      },
      currentAnswerSingleChoice: undefined,
      currentAnswerSingleChoiceFreeText: undefined,
      currentAnswerMultiChoice: [],
      currentAnswerMultiChoiceFreeText: [],
      currentAnswerFreeText: undefined,
      currentAnswerNumber: undefined,
      langselect: true,
      language: this.languages[0],
      footer: { en: '' },
      finished: false
    }
  },
  methods: {
    show () {
      this.finished = false
      this.langselect = true
      this.currentIndex = 0
      this.currentQuestion = this.form.questions[0]
      this.currentAnswerSingleChoice = undefined
      this.currentAnswerSingleChoiceFreeText = undefined
      this.currentAnswerMultiChoice = []
      this.currentAnswerMultiChoiceFreeText = []
      this.currentAnswerFreeText = undefined
      this.currentAnswerNumber = undefined
      this.opened = true
    },
    start () {
      this.langselect = false
    },
    restart () {
      this.finished = false
      this.langselect = true
      this.currentIndex = 0
      this.currentQuestion = this.form.questions[0]
      this.currentAnswerSingleChoice = undefined
      this.currentAnswerSingleChoiceFreeText = undefined
      this.currentAnswerMultiChoice = []
      this.currentAnswerMultiChoiceFreeText = []
      this.currentAnswerFreeText = undefined
      this.currentAnswerNumber = undefined
    },
    close () {
      this.opened = false
      this.$emit('closed')
    },
    next () {
      const type = this.currentQuestion.type
      let nextQId
      if (type === 'freetext' || type === 'number' || type === 'multiChoice') {
        if (this.currentQuestion.nextDefaultId) { nextQId = this.currentQuestion.nextDefaultId }
      } else if (type === 'singleChoice') {
        if (this.currentAnswerSingleChoice) {
          const anschoice = this.currentQuestion.answerChoices.find((a) => {
            return a.id ? a.id === this.currentAnswerSingleChoice : false
          })
          if (anschoice && anschoice.nextQuestionId) {
            nextQId = anschoice.nextQuestionId
          } else {
            nextQId = this.currentQuestion.nextDefaultId
          }
        } else nextQId = this.currentQuestion.nextDefaultId
      }

      if (!nextQId) {
        if (this.currentIndex === this.form.questions.length - 1) { nextQId = 'ENDFORM' } else nextQId = 'Q' + (this.currentIndex + 2)
      }

      if (nextQId === 'ENDFORM') {
        this.finished = true
      } else {
        const nextQIdx = this.form.questions.findIndex((q) => {
          return q.id === nextQId
        })
        this.currentAnswerSingleChoice = undefined
        this.currentAnswerSingleChoiceFreeText = undefined
        this.currentAnswerMultiChoice = []
        this.currentAnswerMultiChoiceFreeText = []
        this.currentAnswerFreeText = undefined
        this.currentAnswerNumber = undefined
        this.currentIndex = nextQIdx
        this.currentQuestion = this.form.questions[nextQIdx]
      }
    }
  }
}
</script>
