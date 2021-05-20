<template>
  <div class="app-search-page">
    <!-- 搜索栏 -->
    <div class="app-search-mobile">
      <!-- 搜索框 -->
      <div class="app-search-head">
        <el-input
          v-model="value" class="app-input-mobile"
          placeholder="搜索"
          @keyup.enter.native="submitSearch()">
          <i class="el-input__icon el-icon-search"
            slot="prefix"></i>
        </el-input>
        <router-link :to="{path: '/'}" class="app-search-cancel">取消</router-link>
      </div>

      <!-- 搜索历史 -->
      <div v-if="showHistory" class="app-search-history">
        <div class="app-search-history-info">
          <div class="app-search-history-title">历史搜索</div>
          <div @click="clearSearchHistory()" class="app-search-history-delete"></div>
        </div>
        <div class="app-search-history-list">
          <template v-for="(item, index) in hisArr">
            <div :key="index" class="app-search-history-item" @click="chooseSearchHistory(item)">
              {{item}}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="showResults" class="app-search-results">
      <template v-for="app in resultApps">
        <div :key="app.APP_ID"
          @click="toAppDetail(app.APP_ID)"
          class="app-search-item">
          <div class="main-content">
            <img class="app-img" :src="app.APP_LOGO_URL">
            <div class="app-info">
              <div class="app-name">
                {{app.APP_NAME}}
              </div>
              <div class="app-version">
                <template v-for="v in sortApkType(app.APP_INFO)">
                  <span :key="v.APK_TYPE" :class="v.APK_TYPE.toLowerCase()">
                    {{v.APK_TYPE}}版本: {{v.APK_VERSION}}
                    <span v-if="sortApkType(app.APP_INFO).length === 2"
                      class="version-line">|</span>
                  </span>
                </template>
              </div>
              <div class="app-desc">{{app.APP_BRIEF}}</div>
            </div>
            <div class="app-download" @click.stop="toDownload(app)">下载</div>
          </div>
        </div>
      </template>
    </div>

    <!-- 搜索结果为空提示图 -->
    <div v-else class="no-data">
      <div class="no-data-img"></div>
      <div class="no-data-text">{{warningText}}</div>
    </div>

    <!-- pc端下载显示二维码 -->
    <div v-if="showDownload">
      <div class="black-sheild">
        <div class="download-card">
          <div @click="closeDownload" class="close-card">×</div>
            <div class="download-item">
              <app-qr class="download-qrcode"
                :margin="0"
                :text="qrcodeUrl"
                :size="176">
              </app-qr>
              <div class="download-type">请使用手机浏览器扫码下载</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 微信下载时提示 -->
    <div v-if="showWeixinTip" class="black-sheild"
        @click="showWeixinTip=false" @touchmove.prevent @mousewheel.prevent>
        <div class="weixin-guide-text">请点击右上角，前往浏览器下载</div>
        <div class="weixin-guide-arrow"></div>
    </div>
  </div>
</template>

<script>
import VueQR from 'vue-qr';

export default {
  name: 'Search',
  components: {
    'app-qr': VueQR,
  },
  data() {
    return {
      showDownload: false, // 展示下载二维码
      showWeixinTip: false, // 微信下载提示
      apkType: [], // app 版本
      value: '',
      hisArr: [], // 搜索历史记录
      qrcodeUrl: null, // 二维码对应地址
      warningText: '对不起，没有找到您搜索的结果',
    };
  },
  computed: {
    resultApps() { // 搜索结果 app
      let allApps = [];
      let appData = this.$store.getters.appData;
      if (appData.length !== 0) {
        appData.forEach((e) => {
          allApps = allApps.concat(e.APP_LIST); // 将所有分类下 app 合并在一起
        });
        let resultApps = this.querySearch(allApps);
        return resultApps;
      }
      return [];
    },
    showResults() { // 展示搜索结果 如无则显示未查询到
      return !(this.resultApps.length === 0 && this.$route.query.key); // 有查询词且返回结果为空
    },
    showHistory() { // 展示搜索历史记录
      return (this.resultApps.length === 0 && !this.$route.query.key); // 移动端无查询时
    },
  },
  created() {
    this.updataSearchHistory();
  },
  watch: {
    value(val) { // 当输入框清空时展示搜索历史
      if (!val && this.$route.query.key) {
        this.$router.push({
          name: 'Search',
        });
        this.updataSearchHistory();
      }
    },
  },
  methods: {
    querySearch(allApps) { // 搜索
      let val = this.$route.query.key;
      if (val) {
        let results = allApps.filter((e) => {
          return e.APP_NAME.toLowerCase().indexOf(val.toLowerCase()) !== -1;
        });
        return results; // 搜索词有效时匹配数据（可能为空）
      }
      if (window.innerWidth >= 980) {
        return allApps; // pc 搜索词无效时展示所有 APP
      }
      return []; // 移动端不搜索时展示搜索记录
    },
    submitSearch() { // 移动端搜索页搜索：改变路由，记录搜索历史
      let val = this.value.trim();

      if (!val) { // 无效回退搜索页
        this.$router
          .push({
            name: 'Search',
          })
          .then(() => {
            return 0;
          })
          .catch((err) => {
          });
      }

      // 存入 localStorage
      let hisArr = [];
      if (localStorage.getItem('searchHistory')) {
        hisArr = JSON.parse(localStorage.getItem('searchHistory'));
      }
      // 超过尾部清除
      if (hisArr.length >= 10) {
        hisArr.pop();
      }
      // 向 localstoreage 添加新值
      if (val && hisArr.indexOf(val) === -1) {
        hisArr.unshift(val);
        localStorage.setItem('searchHistory', JSON.stringify(hisArr));
      }
      // 当前页面不跳转
      if (this.$route.query.key !== val) {
        this.$router.push({
          name: 'Search',
          query: { key: val },
        });
      }
      this.updataSearchHistory();
    },
    updataSearchHistory() { // 更新搜索历史
      this.hisArr = JSON.parse(localStorage.getItem('searchHistory'));
      this.hisArr = Object.assign({}, this.hisArr);
    },
    clearSearchHistory() { // 清空搜索历史记录
      localStorage.clear();
      this.updataSearchHistory();
    },
    chooseSearchHistory(val) { // 历史搜索记录点击搜索
      this.value = val;
      this.$router.push({
        name: 'Search',
        query: { key: val },
      });
    },
    queryAppTypeId(id) {
      let appData = this.$store.getters.appData;
      let appTypeId = '';
      appData.forEach((e) => {
        let type = e.APP_LIST.find((item) => item.APP_ID == id);
        if (type !== undefined) {
          appTypeId = e.APP_CATALOG_ID;
        }
      });
      return appTypeId;
    },
    toAppDetail(appId) { // 搜索到的 app 查看详情
      let appTypeId = this.queryAppTypeId(appId);
      this.$router.push({
        name: 'Detail',
        query: {
          appTypeId,
          appId,
        },
      });
    },
    sortApkType(type) { // app 版本排序
      let apkType = [...type];
      if (apkType.length === 1 || apkType[0].APK_TYPE.toLowerCase() === 'ios') {
        return apkType;
      }
      return apkType.reverse();
    },
    toDownload(app) { // 下载
      let apk = {};
      let appTypeId = this.queryAppTypeId(app.APP_ID);
      this.qrcodeUrl = window.location.origin + '/#/detail?appTypeId=' + appTypeId + '&appId=' + app.APP_ID;
      this.apkType = this.sortApkType(app.APP_INFO);
      if (window.innerWidth >= 980) { // pc 端启用二维码，移动端识别设备挂载链接
        this.showDownload = true;
      } else {
        const UA = navigator.userAgent.toLowerCase();
        if (UA.indexOf('micromessenger') !== -1) {
          this.showWeixinTip = true;
        }
        if (UA.indexOf('iphone') !== -1) {
          apk = this.apkType.find((item) => item.APK_TYPE.toLowerCase() === 'ios');
        } else {
          apk = this.apkType.find((item) => item.APK_TYPE.toLowerCase() === 'android');
        }
        if (apk) {
          window.location.href = apk.APK_URL;
        }
      }
    },
    closeDownload() {
      this.showDownload = false;
    },
  },
};
</script>

<style>
.app-search-mobile {
  display: none;
}

.app-search-results {
  width: 960px;
  height: 100%;
  margin: 20px auto 0;
}

.app-search-item + .app-search-item {
  border-top: 1px solid #e8e8e8;
}

.app-search-item {
  padding: 30px 0;
  cursor: pointer;
  text-align: left;
}

.app-search-item .app-version {
  display: inline;
}

.app-search-item .app-desc {
  width: 737px;
  height: inherit;
  line-height: 14px;
  margin-top: 6px;
}

.app-search-item .app-download {
  margin-top: 42px;
}

.app-search-page .no-data-img {
  background: url(../assets/img/no-search-pc.png) center no-repeat;
}
</style>
