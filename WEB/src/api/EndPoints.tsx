export const endPoints = {
  common: {
    termsAndConditions: "/logincms?page_url=terms-of-service",
    privacyPolicy: "/logincms?page_url=privacy-policy",
    help: "/logincms?page_url=help"
  },
  auth: {
    login: "/signin",
    forgotPassword: "/forgetpassword",
    changePassword: "/changepassword",
    ssoRequest: "saml/login",
    // SSORequestByAccountID: "User/SSORequestByAccountID",
  },
  projectCreation: {
    createProject: "/project/create",
    updateProject: "/project/update/:_id",
    deleteProject: "/project/delete/:_id'",
  },
  user: {
    create: "/user/create",
    list: "/users/list",
    searchList: "/users/list?search=",
    pagination: "/users/list?limit=10&page=",
    updates: "/user/update",
    delete: "/user/delete",
    sort: "/users/list?sort=",
    update: "/projects/rolemapping/update",
    statusupdate: "/manageuser/update",
    manageUpdate: "/manageuser/update",
    getManageUser: "/manage/user/list",
    expiry: "/users/pwdexpirationtime",
  },
  role: {
    project: "/projects/list",
    app: "/project/application/list",
    workload: "/project/workload/list",
    update: "/projects/rolemapping/update",
    roles: "/user/role",
  },

  account: {
    create: "User/UserRegistration",
    resetPassword: "User/UpdatePassword",
    profile: {
      get: "/userinfo",
      update: "/user/update",
      changePassword: "/password/edit",
      delete: "/user/delete",
      imageUpload: "/profileimage",
    },
    project: {
      get: "/projects/list",
      create: "/project/create",
      update: "/project/update",
      delete: "/project/delete",
    },
    projectInfo: {
      get: "/project/getinfo?_id=",
    },
    projectInfoInit: {
      get: "/project/getinfo",
    },
  },

  application: {
    create: "/app/create",
    get: "/project/application/list",
    getInfo: "/app/getInfo",
    update: "/app/update",
    delete: "/app/delete",
  },
  cloud: {
    getCount: "/clouds/count/list/",
    getUser: "/users/cloud/list",
    discovery:"/get_cloud_details",
    cloudDiscover :"/cloud/discovery",
    verifyConnection: "/verifyconnection",
	getRegion: "/getregions",
	getSubscriptions: '/get_subscriptions',
	cloudAccountCreate : '/cloud_account/create',
	cloudAccountEdit : '/cloud_account/edit',
	getCloudDetails : '/get_cloud_details',
  },
  workload: {
    cloudPlatformList: '/workload/cloud_platform/list',
    cloudCategory : '/workload/cloud_category/list',
    cloudResourceGroup: '/workload/resource_grouping/list',
    cloudResource: '/workload/resources/list',
      getWorkload: "/workload/list?application_id=",
      createMapping:"/workload/resource_mapping/create",
      getWorkloadInfo:"/workload/resource/info",
      editMapping:"/workload/resource_mapping/edit",
      viewWorkload: "/workload/resource_mapping/view",
      renameWorkload:"/workload/rename",
      newWorkload:"/workload/name/check",
      deleteWorkload: "/workload/resource_mapping/delete",
      getWorkloadPriceTagger: "/workload/resource_mapping/price_tagger",
      getCloudAccountName: "/workload/cloud/accountname"
  }
};
export const LoginType = {

  basic: "BASIC",
  social: "SOCIAL",
  sso: "SSO",
};
