<template>
  <q-page>
    <q-form ref="studyDesignForm">
      <q-toolbar class="bg-info text-black">
        <q-toolbar-title>
          Study Designer
        </q-toolbar-title>
        <q-btn
          class="q-mr-md"
          v-show="studyKey && !studyDesign.publishedTS"
          color="negative"
          label="Delete Draft"
          @click="removeDraftStudy()"
        />
        <q-btn
          class="q-mr-md"
          v-show="!studyDesign.publishedTS"
          color="warning"
          label="Save Draft"
          @click="saveProgress()"
        />
        <q-btn
          class="float-right q-mr-md"
          v-show="!studyDesign.publishedTS"
          color="positive"
          label="Publish"
          @click="publish()"
        />
        <q-btn
          class="float-right q-mr-md"
          v-show="studyDesign.publishedTS"
          disabled
          color="blue"
          label="Published"
        />
        <q-btn
          class="float-right q-mr-md"
          round
          color="black"
          icon="close"
          @click="exitDesigner"
        />
      </q-toolbar>

      <q-tabs
        v-model="studyTab"
        class="bg-info text-black shadow-2"
        active-color="brown-5"
        switch-indicator
        align="justify"
      >
        <q-tab
          name="tab-gen"
          icon="subject"
          label="Generalities"
        />
        <!-- ADD :class="vuelidate.studyDesign.generalities.$error? 'text-red': ''" -->
        <!-- <q-tab
        name="tab-crit"
        icon="fingerprint"
        label="Inclusion Criteria"
        :class="vuelidate.studyDesign.inclusionCriteria.$error? 'text-red': ''"
      />
      <q-tab
        name="tab-tasks"
        icon="list"
        label="Tasks"
        :class="vuelidate.studyDesign.tasks.$error? 'text-red': ''"
      />
      <q-tab
        name="tab-consent"
        icon="verified_user"
        label="Consent"
        :class="vuelidate.studyDesign.consent.$error? 'text-red': ''"
      /> -->
      </q-tabs>
      <q-tab-panels
        v-model="studyTab"
        animated
      >
        <q-tab-panel name="tab-gen">
          <study-design-generalities v-model="studyDesign" />
        </q-tab-panel>
        <!-- <q-tab-panel name="tab-crit">
        TODO: pass the whole study design to this component and remove languages
      <study-design-criteria
        v-model="studyDesign"
        :v="vuelidate.studyDesign"
      />
      </q-tab-panel>
      <q-tab-panel name="tab-tasks">
        <study-design-tasks
          v-model="studyDesign"
          :teamKey="studyDesign.teamKey"
          :v="vuelidate.studyDesign.tasks"
        />
      </q-tab-panel>
      <q-tab-panel name="tab-consent">
        <study-design-consent
          v-model="studyDesign"
          :v="vuelidate.studyDesign"
        />
      </q-tab-panel> -->
      </q-tab-panels>
    </q-form>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn
        class="shadow-10"
        fab
        icon="keyboard_arrow_up"
        color="secondary"
      />
    </q-page-scroller>
  </q-page>
</template>

<script>
import StudyDesignGeneralities from '@components/researcher/studydesign/StudyDesignGeneralities'
// import StudyDesignCriteria from '@components/researcher/studydesign/StudyDesignCriteria'
// import StudyDesignTasks from '@components/researcher/studydesign/StudyDesignTasks'
// import StudyDesignConsent from '@components/researcher/studydesign/StudyDesignConsent'
import API from '@shared/API.js'

export default {
  name: 'StudyDesignLayout',
  props: ['propStudyKey', 'propTeamKey'],
  components: {
    StudyDesignGeneralities
    // StudyDesignCriteria,
    // StudyDesignTasks,
    // StudyDesignConsent
  },
  data () {
    return {
      keyOfStudy: undefined,
      studyTab: 'tab-gen',
      studyDesign: {
        teamKey: this.propTeamKey,
        invitationCode: undefined,
        invitational: false,
        publishedTS: undefined,
        generalities: {
          languages: ['en'],
          title: {
            en: '',
            sv: '',
            es: ''
          },
          shortDescription: {
            en: '',
            sv: '',
            es: ''
          },
          longDescription: {
            en: '',
            sv: '',
            es: ''
          },
          startDate: undefined,
          endDate: undefined,
          principalInvestigators: [
            {
              name: '',
              contact: '',
              institution: ''
            }
          ],
          institutions: [
            {
              name: '',
              contact: '',
              dataAccess: '',
              reasonForDataAccess: {
                en: '',
                sv: '',
                es: ''
              }
            }
          ]
        },
        inclusionCriteria: {
          countries: ['se'],
          minAge: undefined,
          maxAge: undefined,
          sex: [
            'male',
            'female',
            'other'
          ],
          numberOfParticipants: undefined,
          criteriaQuestions: [],
          diseases: [],
          minBMI: undefined,
          maxBMI: undefined,
          medications: []
        },
        tasks: [],
        consent: {
          invitation: {
            en: '',
            sv: '',
            es: ''
          },
          privacyPolicy: {
            en: '',
            sv: '',
            es: ''
          },
          taskItems: [],
          extraItems: []
        }
      }
    }
  },
  // validations: {
  //   studyDesign: {
  //     invitational: { required },
  //     inclusionCriteria: {
  //       countries: { required },
  //       minAge: { required, minValue: minValue(0), maxValue: maxValue(150) },
  //       maxAge: { required, minValue: minValue(0), maxValue: maxValue(150) },
  //       sex: { required },
  //       minBMI: { required, minValue: minValue(5), maxValue: maxValue(210) },
  //       maxBMI: { required, minValue: minValue(5), maxValue: maxValue(210) }
  //     },
  //     tasks: {
  //       required,
  //       minLength: minLength(1)
  //     },
  //     consent: {
  //       invitation: { required },
  //       privacyPolicy: { required }
  //     }
  //   }
  // },
  computed: {
    studyKey () {
      let key = false
      // If there is a propStudykey, use that as the key and update the study only
      // If there is no propStudykey, then use the keyOfStudy after creating a new study to update
      if (this.propStudyKey) {
        key = this.propStudyKey
      } else if (this.propStudyKey === undefined && this.keyOfStudy) {
        key = this.keyOfStudy
      }
      return key
    }
  },
  async created () {
    // Populate Study if it has already been created before
    if (this.propStudyKey) {
      try {
        this.studyDesign = await API.getStudy(this.propStudyKey)
        console.log('LOADED STUDY DESIGN FROM DB', this.studyDesign)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Cannot retrieve the study description. Please check the connection',
          icon: 'report_problem'
        })
      }
    }
  },
  methods: {
    checkValidation: function () {
      // Checking for Errors only in tabs generalities and Error
      let errors = false
      this.vuelidate.studyDesign.$touch()
      this.vuelidate.studyDesign.generalities.$touch()
      this.vuelidate.studyDesign.inclusionCriteria.$touch()
      this.vuelidate.studyDesign.tasks.$touch()
      this.vuelidate.studyDesign.consent.$touch()
      // Check for errors from validation
      if (this.vuelidate.studyDesign.generalities.$error) {
        this.$q.notify('Please correct the fields in the Generalities tab.')
        errors = true
      } else if (this.vuelidate.studyDesign.inclusionCriteria.$error) {
        this.$q.notify('Please correct the fields in the Inclusion criteria tab.')
        errors = true
      } else if (this.vuelidate.studyDesign.tasks.$error) {
        this.$q.notify('Please correct the fields in the Tasks tab.')
        errors = true
      } else if (this.vuelidate.studyDesign.consent.$error) {
        this.$q.notify('Please correct the fields in the Consent tab.')
        errors = true
      }
      // If there are any validation errors, the validation check has failed
      return !errors
    },
    async publish () {
      // If published not empty, study has already been published
      if (this.studyDesign.publishedTS) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'This study has already been published.',
          icon: 'report_problem'
        })
      } else {
        if (this.checkValidation() !== false) {
          try {
            this.studyDesign.publishedTS = new Date()
            if (this.studyKey) {
              // If there is a studyKey, a draft exists
              await API.updateStudy(this.studyKey, this.studyDesign)
              this.$q.notify({
                color: 'primary',
                position: 'bottom',
                message: 'Study has been published.',
                icon: 'done'
              })
            } else {
              // If no studyKey, publish directly
              await API.createStudy(this.studyDesign)
              this.$q.notify({
                color: 'primary',
                position: 'bottom',
                message: 'Study has been published.',
                icon: 'done'
              })
            }
            this.$router.push('/researcher')
          } catch (err) {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Error. Please check the connection.',
              icon: 'report_problem'
            })
          }
        }
      }
    },
    async saveProgress () {
      if (this.studyKey) {
        try {
          await API.updateStudy(this.studyKey, this.studyDesign)
          this.$q.notify({
            color: 'primary',
            position: 'bottom',
            message: 'Updated draft and saved Progress',
            icon: 'done'
          })
        } catch (err) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'Cannot update and save progress. Please check the connection.',
            icon: 'report_problem'
          })
        }
      } else {
        try {
          // If no studyKey in the prop, then save the study for the 1st time
          this.studyDesign.createdTS = new Date()
          const response = await API.createStudy(this.studyDesign)
          this.keyOfStudy = response.data._key
          this.$q.notify({
            color: 'primary',
            position: 'bottom',
            message: 'Updated draft and saved Progress',
            icon: 'done'
          })
        } catch (err) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'Cannot save progress. Please check the connection.',
            icon: 'report_problem'
          })
        }
      }
    },
    async removeDraftStudy () {
      if (this.studyKey && !this.studyDesign.publishedTS) {
        try {
          await this.$q.dialog({
            title: 'Remove Study',
            color: 'warning',
            message: 'You are deleting the draft Study. Would you like to continue?',
            ok: 'Yes, delete the study.',
            cancel: 'Cancel'
          })
          // Remove from db
          try {
            await API.deleteStudy(this.studyKey)
            this.$router.push('/researcher')
          } catch (error) {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Cannot delete the study: ' + error.message,
              icon: 'report_problem'
            })
          }
        } catch (error) {
          // nothing to do
        }
      }
    },
    exitDesigner () {
      if (this.keyOfStudy === '') {
        this.$q.dialog({
          title: 'Exit',
          color: 'warning',
          message: 'You have not saved this draft. Would you like to continue exiting?',
          ok: 'Yes, exit without saving',
          cancel: 'Cancel'
        }).then(() => {
          this.$router.push('/researcher')
        }).catch(() => {
          this.$q.notify('Cancel')
        })
      } else {
        this.$router.push('/researcher')
      }
    }
  }
}
</script>
