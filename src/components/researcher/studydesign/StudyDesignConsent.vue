<template>
  <div>
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5">Consent</div>
        <div class="text-subtitle1"> Consent information reviewed by participant </div>
      </q-card-section>
      <!-- Consent Tab: Invitation Message Card -->
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Invitation Message:
            </div>
            <div class="text-caption">
              An invitation message recevied by the participant.
            </div>
          </div>
          <div class="col q-pl-sm">
            <multilang-input
              type="textarea"
              v-model="studyDesign.consent.invitation"
              @blur="validation.consent.invitation.$touch"
              @input="update()"
              :languages="studyDesign.generalities.languages"
              required
            />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Privacy Policy:
            </div>
            <div class="text-caption">
              Edit the policy according to the study's characteristics. You can use the automatic example as a baseline.
            </div>
          </div>
          <div class="col q-pl-sm">
            <multilang-input
              type="textarea"
              v-model="studyDesign.consent.privacyPolicy"
              @blur="validation.consent.privacyPolicy.$touch"
              @input="update()"
              :languages="studyDesign.generalities.languages"
              required
            />
            <q-btn
              class="q-mt-sm"
              label="Generate example policy"
              color="primary"
              @click="generatePrivacy()"
            />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Tasks-related consent items:
            </div>
            <div class="text-caption">
              These are automatically generated items from tasks. You can rephrase them, but they will be overwritten each time you change the tasks. These consent items are not mandatory.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-list>
              <q-item
                v-for="(tt, tindex) in studyDesign.consent.taskItems"
                :key="tindex"
              >
                <q-item-section avatar>Task {{ (tindex + 1) }}</q-item-section>
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-10">
                      <multilang-input
                        type="textarea"
                        v-model="tt.description"
                        @input="update()"
                        :languages="studyDesign.generalities.languages"
                        required
                      />
                    </div>
                    <div class="col-2">
                      <q-checkbox
                        label="Optional"
                        v-model="alwaysTrue"
                        disable
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              class="q-mt-sm"
              label="Generate consent items"
              color="primary"
              @click="generateConsent(false)"
            />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Custom consent items:
            </div>
            <div class="text-caption">
              Use these if you have other items in addition to the ones listed above.
              For example if you have items that are not related to the mobile phone data collection, like visits or analysis.
              If an item is not set to "optional", participants cannot join the study if they do not consent to it.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-list class="q-mt-md">
              <q-item
                v-for="(et, eindex) in studyDesign.consent.extraItems"
                :key="eindex"
              >
                <q-item-section avatar>
                  Item {{ (eindex + 1) }}
                  <q-btn
                    round
                    icon="remove"
                    size="xs"
                    color="negative"
                    class="q-mt-xs"
                    @click="removeExtraItem(eindex)"
                  ></q-btn>
                </q-item-section>
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-10">
                      <multilang-input
                        type="textarea"
                        v-model="et.description"
                        @input="update()"
                        :languages="studyDesign.generalities.languages"
                        required
                      />
                    </div>
                    <div class="col-2">
                      <q-checkbox
                        label="Optional"
                        v-model="et.optional"
                        @input="update()"
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              icon="add"
              @click="addExtraItem()"
            >Add a custom item</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import MultilangInput from '@components/MultilangInput'
import { schedulingToString } from '@shared/scheduling.js'

export default {
  name: 'StudyDesignConsent',
  // value is the whole study design
  // vuelidate is the validation object
  props: ['modelValue', 'vuelidate'],
  emits: ['update:modelValue', 'update:validation'],
  components: {
    MultilangInput
  },
  data () {
    return {
      studyDesign: this.modelValue,
      validation: this.vuelidate,
      alwaysTrue: true
    }
  },
  created () {
    this.generateConsent(true)
  },
  methods: {
    update () {
      this.$emit('update:modelValue', this.studyDesign)
      this.$emit('update:validation', this.validation)
    },
    generateConsent (keepOld) {
      const consentItemList = []
      for (let i = 0; i < this.studyDesign.tasks.length; i++) {
        const task = this.studyDesign.tasks[i]
        const newTaskItem = {
          description: undefined,
          taskId: task.id,
          type: task.type
        }
        // check if exisiting task description
        const oldTask = this.studyDesign.consent.taskItems[i]
        if (!keepOld || (!oldTask || task.type !== oldTask.type)) {
          newTaskItem.description = {}
          for (const lang of this.studyDesign.generalities.languages) {
            if (task.type === 'dataQuery') {
              const localDatatype = this.$i18n.t('healthDataTypes.' + task.dataType, lang)
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemDataQuery', lang, {
                dataType: localDatatype, scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'form') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemForm', lang, {
                formName: task.formName[lang], scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'miband3') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemMiBand3', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'qcst') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemQCST', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'smwt') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemSMWT', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'po60') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemPO60', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'peakFlow') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemPeakFlow', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'position') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemPosition', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'fingerTapping') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemFingerTapping', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'tugt') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemTUGT', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'holdPhone') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemHoldPhone', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            } else if (task.type === 'vocalization') {
              newTaskItem.description[lang] = this.$i18n.t('consent.taskItemVocalization', lang, {
                scheduling: schedulingToString(task.scheduling, lang)
              })
            }
          }
        } else {
          newTaskItem.description = oldTask.description
        }
        consentItemList.push(newTaskItem)
      }
      this.studyDesign.consent.taskItems = consentItemList
    },
    addExtraItem () {
      this.studyDesign.consent.extraItems.push({
        description: {
          en: undefined,
          sv: undefined,
          es: undefined
        },
        optional: true
      })
    },
    removeExtraItem (index) {
      this.studyDesign.consent.extraItems.splice(index, 1)
    },
    generatePrivacy () {
      for (const lang of this.studyDesign.generalities.languages) {
        let string = this.$i18n.t('privacyPolicy.collectedData', lang)
        for (const task of this.studyDesign.tasks) {
          if (task.type === 'form') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataForm', lang, { formName: task.formName[lang] })
          } else if (task.type === 'dataQuery') {
            const localDatatype = this.$i18n.t('healthDataTypes.' + task.dataType, lang)
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataQuery', lang, { dataType: localDatatype })
          } else if (task.type === 'smwt') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataSMWT', lang)
          } else if (task.type === 'qcst') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataQCST', lang)
          } else if (task.type === 'miband3') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataMiband3', lang)
          } else if (task.type === 'qcst') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataQCST', lang)
          } else if (task.type === 'smwt') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataSMWT', lang)
          } else if (task.type === 'po60') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataPO60', lang)
          } else if (task.type === 'peakFlow') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataPeakFlow', lang)
          } else if (task.type === 'position') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataPosition', lang)
          } else if (task.type === 'fingerTapping') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataFingerTapping', lang)
          } else if (task.type === 'tugt') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataTUGT', lang)
          } else if (task.type === 'holdPhone') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataHoldPhone', lang)
          } else if (task.type === 'Vocalization') {
            string += '\n' + this.$i18n.t('privacyPolicy.collectedDataVocalization', lang)
          }
        }
        string += this.$i18n.t('privacyPolicy.collectedDataReason', lang)
        string += '\n\n' + this.$i18n.t('privacyPolicy.storage', lang, { studyEndDate: this.studyDesign.generalities.endDate })
        string += '\n\n' + this.$i18n.t('privacyPolicy.access', lang)
        for (const institution of this.studyDesign.generalities.institutions) {
          string += '\n' + this.$i18n.t('privacyPolicy.accessInstitution', lang, { institution: institution.name })
          if (institution.dataAccess !== 'no') {
            string += ', ' + this.$i18n.t('privacyPolicy.accessReason', lang, { institution: institution.name, reason: institution.reasonForDataAccess[lang] })
          }
        }
        string += '\n\n' + this.$i18n.t('privacyPolicy.rights', lang)
        string += '\n\n' + this.$i18n.t('privacyPolicy.contacts', lang)
        for (const pi of this.studyDesign.generalities.principalInvestigators) {
          string += '\n' + this.$i18n.t('privacyPolicy.piContact', lang, { name: pi.name, contact: pi.contact })
        }
        this.studyDesign.consent.privacyPolicy[lang] = string
      }
    }
  }
}
</script>
