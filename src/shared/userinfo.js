/**
 * Simple object store where information about the user is stored.
 * It contains login information such as the role or the API token.
 * */
const userinfo = {
  user: {
    loggedin: false,
    role: undefined,
    teamKey: undefined,
    email: undefined,
    _key: undefined,
    token: undefined
  },
  login (newuser) {
    this.user.loggedin = true
    this.user._key = newuser._key
    this.user.role = newuser.role
    this.user.email = newuser.email
    this.user.token = newuser.token
    window.localStorage.setItem('user', JSON.stringify(this.user))
  },
  selectTeam (teamKey) {
    this.user.teamKey = teamKey
  },
  logout () {
    this.user = {
      loggedin: false,
      role: undefined,
      teamKey: undefined,
      email: undefined,
      _key: undefined,
      token: undefined
    }
    window.localStorage.removeItem('user')
  }
}

// try to get the user from localstorage, if available
const userstr = window.localStorage.getItem('user')
if (userstr) {
  try {
    userinfo.user = JSON.parse(userstr)
  } catch (err) {
    // just give up and relogin
  }
}

console.log('USER INITIALIZED')

export default userinfo
