<template>
  <div>
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5">Generalities</div>
        <div class="text-subtitle1">General information about the study.</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Invitational
            </div>
            <div class="text-caption">
              Optional.
              If set to Yes, this study will only be available to pariticipants that have an invitation code.
              The invitation code will be available in the study summary after the study has been published.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-field>
              <div class="q-gutter-sm q-items-end">
                <q-checkbox v-model="studyDesign.invitational" @click="getInvitationCode()" val="true" label="Yes" />
                <q-badge align="middle" v-if="studyDesign.invitationCode" class="invitation-code q-ml-auto">
                  Invitation Code: {{ studyDesign.invitationCode }}
                </q-badge>
              </div>
            </q-field>
          </div>

        </div>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Supported languages:
            </div>
            <div class="text-caption">
              Translations will have to be provided for each supported language.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-field :error="studyDesign.generalities.languages.length == 0"
              error-message="At least one language must be specified">
              <q-checkbox v-model="studyDesign.generalities.languages" @input="update()" val="en" label="English" />
              <q-checkbox v-model="studyDesign.generalities.languages" @input="update()" val="sv" label="Swedish" />
              <q-checkbox v-model="studyDesign.generalities.languages" @input="update()" val="es" label="Spanish" />
              <q-checkbox v-model="studyDesign.generalities.languages" @input="update()" val="it" label="Italian" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Title:
            </div>
            <div class="text-caption">
              Short name of the study
            </div>
          </div>
          <div class="col q-pl-sm">
            <multilang-input v-model="studyDesign.generalities.title" @input="update()"
              :languages="studyDesign.generalities.languages" required />
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Short description:
            </div>
            <div class="text-caption">
              Describe the study in one brief sentence. This appears with the notification inviting the participant to
              check the study. Make it appealing!
            </div>
          </div>
          <div class="col q-pl-sm">
            <multilang-input v-model="studyDesign.generalities.shortDescription" @input="update()"
              :languages="studyDesign.generalities.languages" required />
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Long description:
            </div>
            <div class="text-caption">
              A longer description (few sentences) of the study, in layman terms. This is shown when the participant
              wants to know more about the study.
            </div>
          </div>
          <div class="col q-pl-sm">
            <multilang-editor type="textarea" v-model="studyDesign.generalities.longDescription" @input="update()"
              :languages="studyDesign.generalities.languages" required />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!-- Gen Info Tab: Principal Investigator Card -->
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5"> Principal Investigator(s) </div>
        <div class="text-subtitle1"> Principal investigators of this study. </div>
      </q-card-section>
      <q-card-section>
        <div v-for="(pi, index) in studyDesign.generalities.principalInvestigators" :key="index">
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Name:
              </div>
              <div class="text-caption">
                Principal Investigator name &amp; title.
              </div>
            </div>
            <div class="col q-pl-sm">
              <q-input type="text" hint="Same text for all languages" v-model.trim="pi.name"
                @update:model-value="update()" :rules="[val => !!val || 'Field is required']" />
            </div>
          </div>
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Contact:
              </div>
              <div class="text-caption">
                Contact details, like email, telephone and address.
              </div>
            </div>
            <div class="col q-pl-sm">
              <q-input type="textarea" autogrow hint="Same text for all languages" v-model.trim="pi.contact"
                @update:model-value="update()" :rules="[val => !!val || 'Field is required']" />
            </div>
          </div>
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Institution:
              </div>
              <div class="text-caption">
                Name of institution the PI belongs to. The institution must be also present in the list of Institutions
                below.
              </div>
            </div>
            <div class="col q-pl-sm">
              <q-input type="text" hint="Same text for all languages" v-model.trim="pi.institution"
                @update:model-value="update()" :rules="[val => !!val || 'Field is required']" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-btn v-show="index != 0" label="Remove PI" color="negative" icon="remove"
                @click="removeRowInvestigator(index)" />
            </div>
            <div class="col">
              <q-btn class="float-right" v-show="index == studyDesign.generalities.principalInvestigators.length - 1"
                label="Add PI" color="primary" icon="add" @click="addRowInvestigator(index)" />
            </div>
          </div>
          <q-separator color="primary" spaced="xl"
            v-show="index != studyDesign.generalities.principalInvestigators.length - 1" />
        </div>
      </q-card-section>
    </q-card>
    <!-- Gen Info Tab: Institutions Card -->
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5">Institution(s)</div>
        <div class="text-subtitle1"> Involved institutions and data access rules. </div>
      </q-card-section>
      <q-card-section>
        <div v-for="(inst, index) in studyDesign.generalities.institutions" :key="index">
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Name of the Institution:
              </div>
              <div class="text-caption">
                Full name of the involved instituion.
              </div>
            </div>
            <div class="col q-pl-sm">
              <q-input type="text" hint="Same text for all languages." v-model="inst.name"
                @update:model-value="update()" :rules="[val => !!val || 'Field is required']" />
            </div>
          </div>
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Contact:
              </div>
              <div class="text-caption">
                Official contact details of the institution, like an email or and address.
              </div>
            </div>
            <div class="col q-pl-sm">
              <q-input type="textarea" autogrow hint="Same text for all languages." v-model="inst.contact"
                @update:model-value="update()" :rules="[val => !!val || 'Field is required']" />
            </div>
          </div>
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Data Access:
              </div>
              <div class="text-caption">
                Level of data access granted to this instituion.
              </div>
            </div>
            <div class="col q-pl-sm">
              <q-field class="q-mt-md" :error="inst.dataAccess === undefined"
                error-message="The level of data access is required">
                <q-radio v-model="inst.dataAccess" val="no" color="secondary" label="No Access"
                  @update:model-value="update()" />
                <q-radio v-model="inst.dataAccess" val="anonymised" color="secondary" label="Anonymised"
                  @update:model-value="update()" style="margin-left: 10px" />
                <q-radio v-model="inst.dataAccess" val="full" color="secondary" label="Full"
                  @update:model-value="update()" style="margin-left: 10px" />
              </q-field>
            </div>
          </div>
          <div class="row">
            <div class="col-4 q-pt-lg">
              <div class="text-bold">
                Reason for Data Access:
              </div>
              <div class="text-caption">
                Provide a brief justification of why this level of data access has to be granted.
              </div>
            </div>
            <div class="col q-pl-sm">
              <multilang-input type="textarea" v-model="inst.reasonForDataAccess" :readonly="inst.dataAccess === 'no'"
                @input="update()" :languages="studyDesign.generalities.languages"
                :required="inst.dataAccess !== 'no'" />
            </div>
          </div>
          <div class="row justify-center">
            <div class="col">
              <q-btn v-show="index != 0" label="Remove Institution" color="negative" icon="remove"
                @click="removeRowInstitution(index)" />
            </div>
            <div class="col">
              <q-btn class="float-right" v-show="index == studyDesign.generalities.institutions.length - 1"
                label="Add Institution" color="primary" icon="add" @click="addRowInstitution(index)" />
            </div>
          </div>
          <q-separator v-show="index != studyDesign.generalities.institutions.length - 1" />
        </div>
      </q-card-section>
    </q-card>
    <!-- Gen Info Tab: Date Card -->
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h5">Dates</div>
        <div class="text-subtitle1">The start and end dates of the study.</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              Start date:
            </div>
            <div class="text-caption">
              Date the study officially starts.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input type="date" format="D-MMM-YYYY" v-model="studyDesign.generalities.startDate" @input="update()"
              :rules="[val => !!val || 'Field is required']" />
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pt-lg">
            <div class="text-bold">
              End date:
            </div>
            <div class="text-caption">
              Date the study officially ends. No data collection is possible after this date.
            </div>
          </div>
          <div class="col q-pl-sm">
            <q-input type="date" format="D-MMM-YYYY" v-model="studyDesign.generalities.endDate" @input="update()"
              :rules="[val => !!val || 'Field is required']" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import MultilangInput from '@components/MultilangInput'
import MultilangEditor from '@components/MultilangEditor'
import API from '@shared/API.js'

export default {
  name: 'StudyDesignGeneralities',
  // modelValue here contains the whole study design object
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    MultilangInput, MultilangEditor
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
  methods: {
    update () {
      this.$emit('update:modelValue', this.modelValue)
    },
    addRowInvestigator (index) {
      // increment the id
      this.studyDesign.generalities.principalInvestigators.push({
        name: '',
        contact: '',
        institution: ''
      })
    },
    removeRowInvestigator (index) {
      this.studyDesign.generalities.principalInvestigators.splice(index, 1)
    },
    addRowInstitution (index) {
      // increment the id
      this.studyDesign.generalities.institutions.push({
        name: '',
        contact: '',
        dataAccess: '',
        reasonForDataAccess: {
          en: '',
          sv: '',
          es: '',
          it: ''
        }
      })
    },
    removeRowInstitution (index) {
      this.studyDesign.generalities.institutions.splice(index, 1)
    },
    async getInvitationCode () {
      // If the study is invitational only, generate a new invitational code.
      console.log('El método getInvitationCode está siendo llamado')
      if (this.studyDesign.invitational && !this.studyDesign.invitationCode) {
        try {
          this.studyDesign.invitationCode = await API.getInvitationCode()
          this.update()
          return this.studyDesign.invitationCode
        } catch (err) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'Error. Invitation code could not be generated.',
            icon: 'report_problem'
          })
        }
      } else {
        this.studyDesign.invitationCode = undefined
        this.update()
        return this.studyDesign.invitationCode
      }
    }
  }
}
</script>
