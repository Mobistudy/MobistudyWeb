
const routes = [
  {
    path: '/',
    component: () => import('components/usermgmt/LoginPage.vue')
  },
  {
    path: '/login',
    component: () => import('components/usermgmt/LoginPage.vue')
  },
  {
    path: '/resetPassword',
    component: () => import('components/usermgmt/ResetPasswordPage.vue')
  },
  {
    path: '/newuser',
    component: () => import('components/usermgmt/NewuserPage.vue')
  },
  {
    path: '/admin',
    component: () => import('components/HomeLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('components/admin/AdminHome.vue')
      }
    ]
  },
  {
    path: '/researcher',
    component: () => import('components/HomeLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('components/researcher/ResearcherHome.vue')
      },
      {
        path: '/studyDesign/:propTeamKey',
        component: () => import('components/researcher/studydesign/StudyDesignPage.vue'),
        props: true
      },
      {
        path: '/studyDesign/:propTeamKey/:propStudyKey',
        component: () => import('src/components/researcher/studydesign/StudyDesignPage.vue'),
        props: true
      },
      {
        path: '/studyMonitor/:studyKey',
        component: () => import('components/researcher/studymonitor/StudyMonitorPage.vue'),
        props: true
      }
    ]
  },
  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/components/Error404Page.vue')
  }
]

export default routes
