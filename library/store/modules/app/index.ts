import { defineStore } from 'pinia';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '../../../config/settings.json';
import { getMenuList } from '../../../api/user';
import { transformRoutes } from '../../../utils';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      try {
        const { data } = await getMenuList(); // 请求节点
        const menus = data.menuTree[0].children
        this.initMenu = transformRoutes(menus); // 入口初始化节点
        this.serverMenu = transformRoutes(menus); // 侧边动态菜单
      } catch (error) {}
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
    // 改变active_inlet值
    setActiveinlet(index: number) {
      this.active_inlet = index;
      this.fetchServerMenuConfig();
    },
  },
});

export default useAppStore;
