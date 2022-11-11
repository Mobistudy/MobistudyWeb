<template>
  <div>
    <q-table
      title="Users"
      ref="table"
      color="primary"
      :rows="users"
      selection="none"
      :columns="columns"
      :filter="filter"
      row-key="_key"
      v-model:pagination="pagination"
      @request="loadUsers"
      :loading="loading"
    >
      <template #top-right>
        <q-select
          emit-value
          map-options
          :options="roleTypesOpts"
          v-model="filter.roleType"
          hint="Event"
          class="q-mr-sm"
          style="width: 150px"
        />
        <q-input
          type="text"
          v-model="filter.userEmail"
          hint="User email"
          clearable
          debounce="500"
        />
      </template>
      <template #body-cell-testuser="props">
        <q-td :props="props">
          <q-toggle
            :value="props.row.testUser"
            @input="toggleTestUser(props.row)"
          />
        </q-td>
      </template>
      <template #body-cell-delete="props">
        <q-td :props="props">
          <q-btn
            label="Delete"
            color="negative"
            icon="remove"
            @click="deleteUser(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import API from '@shared/API.js'

export default {
  name: 'UsersTable',
  // props: ['userKey'],
  data () {
    return {
      users: [],
      pagination: { page: 1, rowsPerPage: 20, rowsNumber: 0, sortBy: 'userkey', descending: true },
      columns: [
        { name: 'userkey', required: true, label: 'User Key', align: 'left', field: 'userkey', sortable: false }, // Change "_key" to "key" eventually
        { name: 'email', required: true, label: 'Email', align: 'left', field: 'email', sortable: true },
        { name: 'role', required: true, label: 'Role', align: 'left', field: 'role', sortable: false },
        { name: 'testuser', required: false, label: 'Test user', align: 'left', field: 'testUser', sortable: false },
        { name: 'delete', required: true, label: 'Delete user', align: 'left', field: 'delete', sortable: false }
      ],
      filter: {
        userEmail: undefined,
        roleType: 'All'
      },
      roleTypesOpts: ['All', 'admin', 'researcher', 'participant'],
      loading: false
    }
  },
  async mounted () {
    this.loadUsers({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  methods: {
    async loadUsers (params) {
      this.loading = true
      this.pagination = params.pagination
      try {
        const queryParams = {
          roleType: params.filter.roleType === 'All' ? undefined : params.filter.roleType,
          userEmail: params.filter.userEmail,
          sortDirection: params.pagination.descending ? 'DESC' : 'ASC',
          offset: (params.pagination.page - 1) * params.pagination.rowsPerPage,
          rowsPerPage: params.pagination.rowsPerPage === 0 ? undefined : params.pagination.rowsPerPage
        }
        this.pagination.rowsNumber = await API.getAllUsers(true, queryParams)
        this.users = await API.getAllUsers(false, queryParams)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve users' + err.message,
          icon: 'report_problem'
        })
      }
      this.loading = false
    },
    async toggleTestUser (user) {
      user.testUser = !user.testUser
      try {
        await API.updateUser(user.userkey, user)
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot update user' + err.message,
          icon: 'report_problem'
        })
      }
    },
    async deleteUser (user) {
      this.$q.dialog({
        title: 'Delete User',
        color: 'negative',
        message: 'You are deleting ' + user.role + ' ' + user.email + ' with all its data. This cannot be undone. Would you like to continue?',
        ok: 'Yes, delete user',
        cancel: 'Cancel'
      }).onOk(async () => {
        try {
          if (user.role === 'participant') {
            // Gets Participant from User's userkey
            const participant = await API.getOneParticipant(user.userkey)
            // Deletes entry in Participants and the corresponding one in Users
            const partKey = participant._key
            await API.deleteParticipant(partKey)
          } else {
            await API.deleteUser(user.userkey)
          }
          this.$q.notify('User ' + user.email + ' deleted')
          this.loadUsers({
            pagination: this.pagination,
            filter: this.filter
          })
        } catch (err) {
          this.$q.notify({
            color: 'negative',
            message: 'Cannot delete user ' + user.email,
            icon: 'report_problem'
          })
        }
      })
    }
  }
}

</script>

<style>
.q-table td {
  border-color: black;
}
.q-table th {
  border-bottom-color: black;
}
.q-table__bottom {
  border-top: 1px solid black;
}
</style>
