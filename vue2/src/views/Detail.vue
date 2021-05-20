<template>
  <div class="app-detail">
    <div class="catalog">
      <div class="main-content">
        <div class="front-catalog">{{appTypeName}}<span>></span></div>
        <div class="current-catalog">{{app.APP_NAME}}</div>
      </div>
    </div>

    <!-- app详情 -->
    <div class="app-detail-body">
      <div class="main-content">
        <div class="app-detail-left">
          <img :src="app.APP_LOGO_URL" class="app-detail-logo">

          <div class="app-detail-downinfo-mobile">
            <div class="app-detail-name-mobile">{{app.APP_NAME}}</div>
            <a :href="judgeUrl" class="app-detail-down-mobile"
              @click="toDownloadMobile">直接下载</a>
          </div>

          <div class="app-detail-info">
            <div class="app-detail-name">{{app.APP_NAME}}</div>
            <div class="app-detail-type"></div>
            <div class="app-detail-version"><span>版本：</span>
              <template v-for="v in apkType">
                <span :key="v.APK_TYPE" :class="v.APK_TYPE.toLowerCase()">
                  {{v.APK_TYPE}}版本: {{v.APK_VERSION}}
                  <span v-if="apkType.length === 2" class="version-line">|</span>
                </span>
              </template>
            </div>
            <div class="app-detail-size"><span>大小：</span>
              <template v-for="v in apkType">
                <span :key="v.APK_TYPE" :class="v.APK_TYPE.toLowerCase()">
                  {{v.APK_TYPE}}: {{sizeChange(v.APK_FILE_SIZE)}}
                  <span v-if="apkType.length === 2" class="version-line">|</span>
                </span>
              </template>
            </div>
            <div class="app-detail-update">
              更新：{{dateChange(app.CREATE_DATE)}}
            </div>
          </div>
        </div>
        <div class="app-down-info" :style="{height: apkType.length * 40 + 'px'}">
          <template v-for="v in apkType">
            <div :key="v.APK_TYPE" :class="v.APK_TYPE.toLowerCase()" class="app-down-item">
              <a :href="v.APK_URL">
                <span class="app-down-type"></span>
                {{versionChange(v.APK_TYPE.toLowerCase())}}版下载
              </a>
              <div class="app-down-qrcode"
                @mouseenter="toDownCard($event)"
                @mouseleave="removeDownCard()">
                <div class="app-down-qrcode-border"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- app预览图 -->
    <div v-if="showPreview(app)" class="app-detail-preview">
      <div class="main-content">
        <template v-for="v in getAppPreview(app)">
          <img :src="app[v]" :key="v" class="app-preview-img">
        </template>
      </div>
    </div>

    <!-- app介绍 -->
    <div class="app-intro">
      <div class="main-content">
        <div class="app-intro-title">产品简介：</div>
        <div class="app-intro-body">{{app.APP_BRIEF}}</div>
      </div>
    </div>

    <!-- 下载二维码 -->
    <div v-if="showDownCard" class="app-down-card"
      :style="{left: appDownLeft, top: appDownTop}">
      <div class="app-card-triangle"></div>
      <div class="app-card-qrcode">
        <app-qr class="qrcode"
          :margin="0"
          :text="qrcodeUrl"
          :size="100">
        </app-qr>
        <span>手机扫描下载</span>
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
  name: 'Detail',
  components: {
    'app-qr': VueQR,
  },
  data() {
    return {
      showDownCard: false, // 是否展示二维码
      showWeixinTip: false, // 微信下载提示
      appDownLeft: '', // 二维码左边距离
      appDownTop: '', // 二维码顶部距离
      judgeUrl: null, // 设备对应的 apk 链接
    };
  },
  computed: {
    appTypeName() {
      let appData = this.$store.getters.appData;
      let appTypeId = this.$store.getters.appTypeId;
      if (appData.length !== 0 && appTypeId) {
        let name = appData.find((e) => e.APP_CATALOG_ID == appTypeId).CATALOG_NAME;
        return name;
      }
      return '';
    },
    app() {
      let appData = this.$store.getters.appData;
      let appTypeId = this.$route.query.appTypeId;
      let appId = this.$route.query.appId;
      if (appData.length !== 0 && appTypeId && appId) {
        let list = appData.find((e) => e.APP_CATALOG_ID == appTypeId).APP_LIST;
        let app = list.find((e) => e.APP_ID == appId);
        return app;
      }
      return {};
    },
    apkType() {
      if (this.app !== undefined && Object.keys(this.app).length !== 0) {
        let currApkType = this.sortApkType(this.app.APP_INFO);
        return currApkType;
      }
      return [];
    },
  },
  methods: {
    showPreview(app) { // 是否展示 app 预览图
      if (Object.keys(app).length !== 0) {
        if (this.getAppPreview(app).length !== 0) {
          return true;
        }
      }
      return false;
    },
    getAppPreview(app) { // 获取 app 预览图
      let appPreview = [];
      Object.keys(app).forEach((e) => {
        if (/APP_PREVIEW\d_URL/.test(e) && app[e]) {
          if (app[e].trim()) {
            appPreview.push(e);
          }
        }
      });
      appPreview.sort();
      return appPreview;
    },
    sortApkType(type) { // app 版本排序
      let apkType = [...type];
      if (apkType.length === 1 || apkType[0].APK_TYPE.toLowerCase() === 'ios') {
        return apkType;
      }
      return apkType.reverse();
    },
    sizeChange(size) {
      if (size) {
        return size + 'M';
      }
      return '无';
    },
    dateChange(date) {
      if (date) {
        return String(date).substring(0, 10).split('-').join('/');
      }
      return '无';
    },
    versionChange(type) {
      if (type === 'ios') return '苹果';
      return '安卓';
    },
    toDownCard(e) { // 详情页浮动二维码
      this.appDownLeft = `${e.target.offsetLeft + e.target.offsetWidth + 5}px`;
      this.appDownTop = `${e.target.offsetTop - ((163 / 2) - (e.target.offsetHeight / 2))}px`;
      this.qrcodeUrl = window.location.href;
      this.showDownCard = true;
    },
    removeDownCard() {
      this.showDownCard = false;
    },
    toDownloadMobile() { // 移动端 直接下载 判断设备
      let apk = {};
      const UA = navigator.userAgent.toLowerCase();
      if (UA.indexOf('micromessenger') !== -1) {
        this.showWeixinTip = true;
      }
      if (UA.indexOf('iphone') !== -1) {
        apk = this.apkType.find((e) => e.APK_TYPE.toLowerCase() === 'ios');
      } else {
        apk = this.apkType.find((e) => e.APK_TYPE.toLowerCase() === 'android');
      }
      if (apk) {
        this.judgeUrl = apk.APK_URL;
      } else {
        this.judgeUrl = '';
      }
    },
  },
};
</script>

<style>
.catalog {
  height: 40px;
  background: #f5f5f5;
}

.catalog .main-content {
  justify-content: flex-start;
}

.catalog .main-content div {
  line-height: 40px;
  font-family: PingFangSC-Regular, PingFang SC;
}

.front-catalog {
  opacity: .65;
}

.front-catalog span {
  margin: 0 10px;
}

.app-detail-body .main-content {
  padding-top: 50px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e8e8e8;
  align-items: flex-end;
}

.app-detail-left {
  display: flex;
  justify-content: flex-start;
  text-align: left;
}

.app-detail-logo {
  width: 130px;
  height: 130px;
}

.app-detail-info {
  font-family: PingFangSC-Regular, PingFang SC;
  margin-left: 23px;
}

.app-detail-info .app-detail-name {
  font-size: 24px;
  opacity: .85;
  line-height: 24px;
  margin-bottom: 42px;
}

.app-detail-info div {
  font-size: 14px;
  line-height: 20px;
  opacity: .45;
}

.android .version-line {
  display: none;
}

.app-down-info>div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;
  width: 153px;
  height: 32px;
  border-radius: 4px;
  margin-top: 8px;
}

.app-down-info a {
  color: #FFFFFF;
  width: 121px;
  height: 100%;
  text-align: left;
  text-decoration: none;
  line-height: 32px;
  display: flex;
  align-items: center;
}

.app-down-info a:hover {
  background: rgb(0 0 0 / 0.04);
  border-radius: 4px 0 0 4px;
}

.app-down-info .android {
  background: #FF7404;
}

.app-down-info .ios {
  background: #19BB21;
}

.app-down-info a span {
  width: 18px;
  height: 18px;
  background-size: 100%;
  background-repeat: no-repeat;
}

.app-down-info a span {
  margin: 0 7px 0 16px;
}

.app-down-info .android a span {
  background-image: url(../assets/img/app-down-android.svg);
}

.app-down-info .ios a span {
  background-image: url(../assets/img/app-down-iOS.svg);
}

.app-down-qrcode {
  flex: 1;
  height: 100%;
  background-size: 18px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(../assets/img/app-down-qrcode.svg);
  cursor: pointer;
}

.app-down-qrcode-border {
  width: 100%;
  height: 100%;
  opacity: .09;
  border-left: 1px solid #000000;
}

.app-detail-downinfo-mobile {
  display: none;
}

.app-detail-preview .main-content,
.app-intro {
  padding: 28px 0;
}

.app-detail-preview .main-content {
  width: 960px;
  justify-content: flex-start;
  overflow-x: auto;
  border-bottom: 1px solid #e8e8e8;
}

.app-preview-img {
  width: 217px;
  height: 100%;
}

.app-preview-img + .app-preview-img {
  margin-left: 30px;
}

.app-intro .main-content {
  display: block;
  text-align: left;
}

.app-intro-title {
  font-size: 16px;
  line-height: 16px;
  opacity: .85;
}

.app-intro-body {
  line-height: 24px;
  opacity: .45;
  margin-top: 18px;
}

.app-down-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 147px;
  height: 163px;
  position: absolute;
  background: transparent;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
}

.app-card-qrcode .qrcode {
  margin-bottom: 5px;
}

.app-card-qrcode span {
  display: block;
  font-size: 12px;
  line-height: 13px;
  opacity: .65;
}
</style>
