<template>
  <q-page>
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

    <q-form ref="studyDesignForm">
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
        <q-tab
          name="tab-crit"
          icon="fingerprint"
          label="Inclusion Criteria"
        />
        <q-tab
          name="tab-tasks"
          icon="list"
          label="Tasks"
        />
        <q-tab
          name="tab-consent"
          icon="verified_user"
          label="Consent"
        />
      </q-tabs>
      <q-tab-panels
        ref="tabs"
        v-model="studyTab"
        animated
        keep-alive
      >
        <q-tab-panel
          name="tab-gen"
          ref="panelGen"
        >
          <study-design-generalities v-model="studyDesign" />
        </q-tab-panel>
        <q-tab-panel
          name="tab-crit"
          ref="panelCrit"
        >
          <study-design-criteria v-model="studyDesign" />
        </q-tab-panel>

        <q-tab-panel
          name="tab-tasks"
          ref="panelTasks"
        >
          <study-design-tasks v-model="studyDesign" />
        </q-tab-panel>
        <q-tab-panel name="tab-consent">
          <study-design-consent v-model="studyDesign" />
        </q-tab-panel>
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
import StudyDesignCriteria from '@components/researcher/studydesign/StudyDesignCriteria'
import StudyDesignTasks from '@components/researcher/studydesign/StudyDesignTasks'
import StudyDesignConsent from '@components/researcher/studydesign/StudyDesignConsent'
import API from '@shared/API.js'

export default {
  name: 'StudyDesignLayout',
  props: ['propStudyKey', 'propTeamKey'],
  components: {
    StudyDesignGeneralities,
    StudyDesignCriteria,
    StudyDesignTasks,
    StudyDesignConsent
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
            en: ''
          },
          shortDescription: {
            en: ''
          },
          longDescription: {
            en: ''
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
                en: ''
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
            en: ''
          },
          privacyPolicy: {
            en: ''
          },
          taskItems: [],
          extraItems: []
        }
      }
    }
  },
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
    checkValidation: async function () {
      if (!this.$refs.panelGen || !this.$refs.panelCrit || !this.$refs.panelTasks) {
        this.$q.notify('Please review all tabs at least once before submitting')
        return false
      }
      const valid = await this.$refs.studyDesignForm.validate(true)
      if (!valid) {
        this.$q.notify('Please correct the highlighted fields before submitting')
      }
      return valid
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
        if (await this.checkValidation()) {
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
      this.$q.dialog({
        title: 'Remove Study',
        color: 'warning',
        message: 'You are deleting the draft Study. Would you like to continue?',
        ok: 'Yes, delete the study.',
        cancel: 'Cancel'
      }).onOk(async () => {
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
      })
    }
  },
  exitDesigner () {
    if (this.studyKey === '') {
      this.$q.dialog({
        title: 'Exit',
        color: 'warning',
        message: 'You have not saved this draft. Would you like to continue exiting?',
        ok: 'Yes, exit without saving',
        cancel: 'Cancel'
      }).onOk(() => {
        this.$router.push('/researcher')
      })
    } else this.$router.push('/researcher')
  }
}
}
</script>
