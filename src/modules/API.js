import axios from 'axios'

const BASE_URL = 'api'
var axiosConfig = {}

export default {
  setToken (newtoken) {
    axiosConfig = {
      headers: {
        'Authorization': 'Bearer ' + newtoken
      }
    }
  },
  async login (email, password) {
    let resp = await axios.post(BASE_URL + '/login', { email: email, password: password })
    return resp.data
  },
  async askPasswordResetEmail (email) {
    return axios.post(BASE_URL + '/sendResetPasswordEmail', { email: email })
  },
  async resetPassword (token, newpassword) {
    return axios.post(BASE_URL + '/resetPassword', { token: token, password: newpassword })
  },
  async createUser (newuser) {
    return axios.post(BASE_URL + '/users', newuser)
  },
  async searchDiseaseConcept (disease, lang) {
    return axios.get(BASE_URL + '/vocabulary/' + lang + '/disorder/search?term=' + disease + '&limit=10')
  },
  async searchMedicationConcept (med, lang) {
    return axios.get(BASE_URL + '/vocabulary/' + lang + '/substance/search?term=' + med + '&limit=10')
  },
  /// ////////////////////////////////////
  // from here on, we need to use tokens
  /// ////////////////////////////////////
  async createTeam (teamName) {
    return axios.post(BASE_URL + '/teams', {
      name: teamName
    }, axiosConfig)
  },
  async getTeams () {
    let resp = await axios.get(BASE_URL + '/teams', axiosConfig)
    return resp.data
  },
  async generateTeamCode (teamKey) {
    let resp = await axios.get(BASE_URL + '/teams/invitationCode/' + teamKey, axiosConfig)
    return resp.data
  },
  async addUserToTeam (invitationCode) {
    return axios.post(BASE_URL + '/teams/researcher/add', { invitationCode: invitationCode }, axiosConfig)
  },
  async removeUserFromTeam (userRemoved) {
    return axios.post(BASE_URL + '/teams/researcher/remove', { userRemoved: userRemoved }, axiosConfig)
  },
  async deleteTeam (teamKey) {
    let resp = await axios.delete(BASE_URL + '/teams/' + teamKey, axiosConfig)
    return resp.data
  },
  // USER
  // NEW GET ROLE TYPES FUNCTION
  async getRoleTypes () {
    let resp = await axios.get(BASE_URL + '/users/roleTypes', axiosConfig)
    return resp.data
  },
  async getUserByKey (userKey) {
    let resp = await axios.get(BASE_URL + '/users/' + userKey, axiosConfig)
    return resp.data
  },
  // NEW GET USERS FUNCTION
  async getAllUsers (countOnly, filter) {
    let queryParams = ''
    let firstParam = true
    for (let param in filter) {
      if (filter[param] || filter[param] === 0) {
        queryParams += (firstParam ? '' : '&') + param + '=' + encodeURIComponent(filter[param])
        firstParam = false
      }
    }
    let URL = BASE_URL + '/getUsers' + (countOnly ? '/count' : '') + (firstParam ? '' : '?') + queryParams
    let resp = await axios.get(URL, axiosConfig)
    return resp.data
  },
  async updateUser (userKey, user) {
    return axios.patch(BASE_URL + '/users/' + userKey, user, axiosConfig)
  },
  async deleteUser (userKey) {
    let resp = await axios.delete(BASE_URL + '/users/' + userKey, axiosConfig)
    return resp.data
  },
  // STUDY
  async createStudy (design) {
    return axios.post(BASE_URL + '/studies', design, axiosConfig)
  },
  async updateStudy (studyKey, design) {
    return axios.put(BASE_URL + '/studies/' + studyKey, design, axiosConfig)
  },
  async getStudy (studyKey) {
    let resp = await axios.get(BASE_URL + '/studies/' + studyKey, axiosConfig)
    return resp.data
  },
  // NEW GET STUDIES FUNCTION FOR TableStudies.vue
  async getAllStudies (countOnly, filter) {
    let queryParams = ''
    let firstParam = true
    for (let param in filter) {
      if (filter[param] || filter[param] === 0) {
        queryParams += (firstParam ? '' : '&') + param + '=' + encodeURIComponent(filter[param])
        firstParam = false
      }
    }
    let URL = BASE_URL + '/getStudies' + (countOnly ? '/count' : '') + (firstParam ? '' : '?') + queryParams
    let resp = await axios.get(URL, axiosConfig)
    return resp.data
  },
  async getStudies () {
    let resp = await axios.get(BASE_URL + '/studies/', axiosConfig)
    return resp.data
  },
  async getAllTeamStudies (teamKey) {
    let resp = await axios.get(BASE_URL + '/studies?teamKey=' + teamKey, axiosConfig)
    return resp.data
  },
  async deleteStudy (studyKey) {
    let resp = await axios.delete(BASE_URL + '/studies/' + studyKey, axiosConfig)
    return resp.data
  },
  async getInvitationCode () {
    let resp = await axios.get(BASE_URL + '/newInvitationCode', axiosConfig)
    return resp.data
  },
  // FORMS
  async getSpecificForm (formKey) {
    let resp = await axios.get(BASE_URL + '/forms/' + formKey, axiosConfig)
    return resp.data
  },
  async getFormsList () {
    let resp = await axios.get(BASE_URL + '/forms?list=true', axiosConfig)
    return resp.data
  },
  async publishForm (form) {
    return axios.post(BASE_URL + '/forms', form, axiosConfig)
  },
  // PARTICIPANT
  async getOneParticipant (userKey) {
    let resp = await axios.get(BASE_URL + '/participants/byuserkey/' + userKey, axiosConfig)
    return resp.data
  },
  async getParticipants () {
    let resp = await axios.get(BASE_URL + '/participants', axiosConfig)
    return resp.data
  },
  async getParticipantsOfStudy (studyKey, currentStatus) {
    let resp
    if (currentStatus) {
      resp = await axios.get(BASE_URL + '/participants?studyKey=' + studyKey + '&currentStatus=' + currentStatus, axiosConfig)
    } else {
      resp = await axios.get(BASE_URL + '/participants?studyKey=' + studyKey, axiosConfig)
    }
    return resp.data
  },
  async deleteParticipant (participantKey) {
    let resp = await axios.delete(BASE_URL + '/participants/' + participantKey, axiosConfig)
    return resp.data
  },
  async getParticipantsStatusStats (studyKey) {
    let resp = await axios.get(BASE_URL + '/participants/statusStats/' + studyKey, axiosConfig)
    return resp.data
  },
  // Answers
  async getAnswersOfStudy (studyKey) {
    let resp = await axios.get(BASE_URL + '/answers?studyKey=' + studyKey, axiosConfig)
    return resp.data
  },
  // Health Store Data
  async getHealthStoreDataOfStudy (studyKey) {
    let resp = await axios.get(BASE_URL + '/healthStoreData?studyKey=' + studyKey, axiosConfig)
    return resp.data
  },
  // Audit LOG
  async getLogEventTypes () {
    let resp = await axios.get(BASE_URL + '/auditlog/eventTypes', axiosConfig)
    return resp.data
  },
  async getLogs (countOnly, filter) {
    let queryParams = ''
    let firstParam = true
    for (const param in filter) {
      if (filter[param] || filter[param] === 0) {
        queryParams += (firstParam ? '' : '&') + param + '=' + encodeURIComponent(filter[param])
        firstParam = false
      }
    }
    let URL = BASE_URL + '/auditlog' + (countOnly ? '/count' : '') + (firstParam ? '' : '?') + queryParams
    let resp = await axios.get(URL, axiosConfig)
    /* EXAMPLE RESPONSE DATA
      obj: Object
      _key: "105794"
      data: Null
      event: "userCreated"
      message: "New user created with email forreal@gmail.com"
      refData: "users"
      refKey: "105792"
      timestamp: "2020-11-19T16:31:03.623Z"
      email: "forreal@gmail.com"
    */
    return resp.data
  },
  async downloadStudyData (studyKey) {
    let resp = await axios.post(BASE_URL + '/studydatacreate/' + studyKey, {}, axiosConfig)
    return resp.data
  },
  // Test stuff
  async sendTestEmail (email, subject, content) {
    return axios.post(BASE_URL + '/tester/sendemail/', { address: email, subject: subject, content: content }, axiosConfig)
  }
}
