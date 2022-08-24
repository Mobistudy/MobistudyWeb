<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h5">
          {{ studyDesign.generalities.title[locale] }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Description:</div>
          <div class="col">
            {{ studyDesign.generalities.longDescription[locale] }}
          </div>
        </div>
        <q-separator />
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Start Date of Study:</div>
          <div class="col">
            {{ niceDate(studyDesign.generalities.startDate) }}
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">End Date of Study:</div>
          <div class="col">
            {{ niceDate(studyDesign.generalities.endDate) }}
          </div>
        </div>
        <q-separator />
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Created on:</div>
          <div class="col">{{ niceDate(studyDesign.createdTS) }}</div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Published on:</div>
          <div class="col">{{ niceDate(studyDesign.publishedTS) }}</div>
        </div>
        <q-separator />
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Languages:</div>
          <div class="col">{{ studyDesign.generalities.languages }}</div>
        </div>
        <q-separator v-if="studyDesign.invitational" />
        <div
          class="row q-ma-sm"
          v-if="studyDesign.invitational"
        >
          <div class="col-2 text-bold">Invitation Code:</div>
          <div class="col">{{ studyDesign.invitationCode }}</div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h5">Principal Investigators</div>
      </q-card-section>
      <q-card-section>
        <div
          v-for="(pi, pIndex) in studyDesign.generalities
            .principalInvestigators"
          :key="pIndex"
        >
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">P.I. Name:</div>
            <div class="col">{{ pi.name }}</div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Contact Details:</div>
            <div class="col">{{ pi.contact }}</div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Institution:</div>
            <div class="col">{{ pi.institution }}</div>
          </div>
          <q-separator v-show="
              pIndex !=
                studyDesign.generalities.principalInvestigators.length - 1
            " />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h5">Institutions</div>
      </q-card-section>
      <q-card-section>
        <div
          v-for="(inst, inIndex) in studyDesign.generalities.institutions"
          :key="inIndex"
        >
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Name:</div>
            <div class="col">{{ inst.name }}</div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Contact Details:</div>
            <div class="col">{{ inst.contact }}</div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Data Access:</div>
            <div class="col">{{ inst.dataAccess }}</div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Reason for Data Access:</div>
            <div class="col">
              {{ inst.reasonForDataAccess[locale] }}
            </div>
          </div>
          <q-separator v-show="inIndex != studyDesign.generalities.institutions.length - 1" />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h5">Inclusion Criteria:</div>
      </q-card-section>
      <q-card-section>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Countries:</div>
          <div class="col">{{ studyDesign.inclusionCriteria.countries }}</div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Age range:</div>
          <div class="col">
            From {{ studyDesign.inclusionCriteria.minAge }} to
            {{ studyDesign.inclusionCriteria.maxAge }}
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Gender:</div>
          <div class="col">
            <div
              v-for="(ge, gIndex) in studyDesign.inclusionCriteria.gender"
              :key="gIndex"
            >
              {{ ge }}
            </div>
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Number Of Participants:</div>
          <div class="col">
            {{ studyDesign.inclusionCriteria.numberOfParticipants }}
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Diseases:</div>
          <div class="col">
            <div
              v-for="(dis, diIndex) in studyDesign.inclusionCriteria.diseases"
              :key="diIndex"
            >
              {{ dis.name }}
            </div>
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Medications:</div>
          <div class="col">
            <div
              v-for="(med, meIndex) in studyDesign.inclusionCriteria
                .medications"
              :key="meIndex"
            >
              {{ med.name }}
            </div>
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Extra Questions:</div>
          <div class="col">
            <div
              v-for="(qu, qIndex) in studyDesign.inclusionCriteria
                .criteriaQuestions"
              :key="qIndex"
            >
              <q-field label="Question:"> {{ qu.title }} </q-field>
              <q-field label="Answer:"> {{ qu.answer }} </q-field>
              <q-separator v-show="
                  qIndex !=
                    studyDesign.inclusionCriteria.criteriaQuestions.length - 1
                " />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h5">Tasks:</div>
      </q-card-section>
      <q-card-section>
        <div
          v-for="(task, taIndex) in studyDesign.tasks"
          :key="taIndex"
        >
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Task ID:</div>
            <div class="col">{{ task.id }}</div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Type:</div>
            <div class="col">{{ task.type }}</div>
          </div>
          <div v-if="task.type == 'dataQuery'">
            <div class="row q-ma-sm">
              <div class="col-2 text-bold">Data Type:</div>
              <div class="col">{{ task.dataType }}</div>
            </div>
            <div class="row q-ma-sm">
              <div class="col-2 text-bold">Aggregated:</div>
              <div class="col">{{ task.aggregated }}</div>
            </div>
            <div class="row q-ma-sm">
              <div class="col-2 text-bold">Bucket:</div>
              <div class="col">{{ task.bucket }}</div>
            </div>
          </div>
          <div v-if="task.type == 'form'">
            <div class="row q-ma-sm">
              <div class="col-2 text-bold">Key:</div>
              <div class="col">{{ task.formKey }}</div>
            </div>
            <div class="row q-ma-sm">
              <div class="col-2 text-bold">Name:</div>
              <div class="col">{{ task.formName[$root.$i18n.locale] }}</div>
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-2 text-bold">Scheduling:</div>
            <div class="col">{{ schedulingToString(task.scheduling) }}</div>
          </div>
          <q-separator v-show="taIndex != studyDesign.tasks.length - 1" />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h5">Consent:</div>
      </q-card-section>
      <q-card-section>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Invitation:</div>
          <div class="col">
            {{ studyDesign.consent.invitation[locale] }}
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Privacy Policy:</div>
          <div class="col">
            <div v-html="
                studyDesign.consent.privacyPolicy[locale].replace(
                  new RegExp('\n', 'g'),
                  '<br>'
                )
              " />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col-2 text-bold">Consent Items:</div>
          <div class="col">
            <div
              v-for="(tkItem, tsIndex) in studyDesign.consent.taskItems"
              :key="tsIndex"
            >
              <div class="row q-ma-sm">
                <div class="col-2 text-bold">Type:</div>
                <div class="col">Task-related item</div>
              </div>
              <div class="row q-ma-sm">
                <div class="col-2 text-bold">Task ID:</div>
                <div class="col">{{ tkItem.taskId }}</div>
              </div>
              <div class="row q-ma-sm">
                <div class="col-2 text-bold">Description:</div>
                <div class="col">
                  {{ tkItem.description[locale] }}
                </div>
              </div>
              <div class="row q-ma-sm">
                <div class="col-2 text-bold">Optional:</div>
                <div class="col">false</div>
              </div>
              <q-separator v-show="tsIndex != studyDesign.consent.taskItems.length - 1" />
            </div>
            <q-separator v-show="studyDesign.consent.extraItems.length" />
            <div
              v-for="(extItem, exIndex) in studyDesign.consent.extraItems"
              :key="exIndex"
            >
              <div class="row q-ma-sm">
                <div class="col-2 text-bold">Type:</div>
                <div class="col">Extra custom item</div>
              </div>
              <div class="row q-ma-sm">
                <div class="col-2 text-bold">Description:</div>
                <div class="col">{{ extItem.description }}</div>
              </div>
              <div class="row q-ma-sm">
                <div class="col-2 text-bold">Optional:</div>
                <div class="col">{{ extItem.optional }}</div>
              </div>
              <q-separator v-show="exIndex != studyDesign.consent.taskItems.length - 1" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { date } from 'quasar'
import { schedulingToString } from '@shared/scheduling.js'

export default {
  name: 'StudySummary',
  props: ['studyDesign'],

  data () {
    return {
      // prefer the locale set in i18n
      locale: this.$i18n.locale
    }
  },
  methods: {
    niceDate (timeStamp) {
      return date.formatDate(timeStamp, 'DD/MM/YYYY')
    },
    schedulingToString (sc) {
      return schedulingToString(sc, this.locale)
    }
  }
}
</script>
