import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  reg,
} from '../../../api/user';
import { setToken, clearToken } from '../../../utils/auth'
import { removeRouteListener } from '../../../utils/route-listener';
import { RegistryParamsI, UserState } from '../../../types/user';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
  }),

  // // 开启数据持久化
  // persist: {
  //   key: 'userinfo',
  //   storage: window.localStorage,
  // },

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    async getUserInfoStore() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);   
        setToken(res.data.token);
        localStorage.setItem('CompanyId',res.data.mainCompanyId);
        localStorage.setItem('CompanyName',res.data.mainCompanyName);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    async regitsry(registryForm: RegistryParamsI) {
      try {
        const res = await reg(registryForm);   
        setToken(res.data.token);
        localStorage.setItem('CompanyId',res.data.mainCompanyId);
        localStorage.setItem('CompanyName',res.data.mainCompanyName);
      } catch(e) {
        clearToken();
        throw e;
      }
    },
    
    logoutCallBack() {
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
