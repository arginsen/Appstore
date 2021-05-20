import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    appTypeId: null,
    appData: [], // APP_TYPE []
  },
  getters: {
    appData: (state) => state.appData, // 获取接口下 app 数据字段
    appTypeId: (state) => state.appTypeId, // 获取当前配置的 类别
  },
  mutations: {
    setAppData(state, data) { // 设置接口 app 数据
      state.appData = data;
      if (state.appTypeId === null && data[0]) { // 设置默认 appTypeId
        state.appTypeId = data[0].APP_CATALOG_ID;
      }
    },
    setAppTypeId(state, typeId) { // 设置 appTypeId
      state.appTypeId = typeId;
    },
  },
  actions: {},
});
