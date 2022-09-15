import { createPinia } from 'pinia';
import useUserStore from './modules/user';
import useAppStore from './modules/app';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export { useUserStore, useAppStore };
export default pinia;
