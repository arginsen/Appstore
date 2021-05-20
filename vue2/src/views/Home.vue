<template>
  <div class="app-home">
    <!-- 应用列表 -->
    <div class="app-list">
      <el-row :gutter="49.5">
        <template v-for="(app, index) in appList.list">
          <el-col :span="8" :key="index">
            <div class="app-item" @click="toAppDetail(app.APP_ID)">
              <div class="main-content">
                <img class="app-img" :src="app.APP_LOGO_URL">
                <div class="app-info">
                  <div class="app-name">
                    {{app.APP_NAME}}
                  </div>
                  <div class="main-content">
                    <div class="app-version">
                      <template v-for="v in sortApkType(app.APP_INFO)">
                        <div :title="v.APK_VERSION" :key="v.APK_TYPE">
                          {{v.APK_TYPE}}版本: {{v.APK_VERSION}}
                        </div>
                      </template>
                    </div>
                    <div class="app-download" @click.stop="toDownload(app)">下载</div>
                  </div>
                </div>
              </div>
              <div class="app-desc">{{app.APP_BRIEF}}</div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>

    <!-- 无应用提示图 -->
    <div v-if="appList.showNoDataTip" class="no-data">
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
  name: 'Home',
  components: {
    'app-qr': VueQR,
  },
  data() {
    return {
      showDownload: false, // 是否展示二维码
      showWeixinTip: false, // 微信下载提示
      apkType: [], // app版本组
      qrcodeUrl: null, // 二维码对应地址
      warningText: '对不起，暂无内容',
    };
  },
  computed: {
    appList() {
      let listObj = {};
      let appData = this.$store.getters.appData;
      let appTypeId = this.$store.getters.appTypeId;
      if (appData.length !== 0 && appTypeId) {
        listObj.list = appData.find((e) => e.APP_CATALOG_ID == appTypeId).APP_LIST; // 忽略字符串与数字
        listObj.showNoDataTip = false;
        if (listObj.list.length === 0) { // 计算app列表后再判断有无
          listObj.showNoDataTip = true;
        }
      }
      console.log(listObj);
      return listObj;
    },
  },
  methods: {
    sortApkType(type) { // app 版本排序
      let apkType = [...type]; // 不能直接对 $store 内的数据进行倒转操作，先复制
      if (apkType.length === 1 || apkType[0].APK_TYPE.toLowerCase() === 'ios') {
        return apkType;
      }
      return apkType.reverse();
    },
    toAppDetail(appId) { // 进入 app 详情页
      let appTypeId = this.$store.getters.appTypeId;
      this.$router.push({
        name: 'Detail',
        query: {
          appTypeId,
          appId,
        },
      });
    },
    toDownload(app) { // 下载按钮
      let apk = {};
      let appTypeId = this.$store.getters.appTypeId;
      this.qrcodeUrl = window.location.origin + '/#/detail?appTypeId=' + appTypeId + '&appId=' + app.APP_ID;
      this.apkType = this.sortApkType(app.APP_INFO);
      if (window.innerWidth >= 980) { // pc 弹出二维码
        this.showDownload = true;
      } else { // 辨别设备 跳转下载链接
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
.app-home {
  height: 100%;
}

.no-data {
  margin-top: 50px;
}

.no-data-img {
  width: 320px;
  height: 280px;
  background: url(../assets/img/no-content-pc.png) center no-repeat;
  margin: 0 auto;
}

.no-data-text {
  font-size: 16px;
  color: #232D34;
  line-height: 24px;
}

/* 自定义加载图标位置 */
.el-loading-spinner {
  position: fixed;
  top: 50%;
  left: 0;
}

.app-list {
  width: 960px;
  height: 100%;
  margin: 50px auto 0;
}

.app-item {
  width: 287px;
  text-align: left;
  margin-bottom: 62px;
  font-family: SourceHanSansSC-Normal, SourceHanSansSC;
  cursor: pointer;
}

.app-item .main-content {
  width: 100%;
  justify-content: flex-start;
}

.app-item a {
  text-decoration: none;
}

.app-img {
  width: 80px;
  height: 80px;
}

.app-info {
  flex: 1;
  margin-left: 14px;
}

.app-info .main-content {
  justify-content: space-between;
}

.app-name {
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  margin-bottom: 20px;
  opacity: .85;
}

.app-version {
  width: 127px;
  line-height: 20px;
  opacity: .25;
}

.app-version div,
.app-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.app-download {
  display: block;
  width: 47px;
  height: 26px;
  color: #31C971;
  font-family: PingFangSC-Regular, PingFang SC;
  line-height: 28px;
  text-align: center;
  background: #FFFFFF;
  border: 1px solid #00CD66;
  border-radius: 4px;
  margin-top: 6px;
  cursor: pointer;
  transition: all .1s ease-in-out;
}

.app-download.active,
.app-download:hover {
  color: #FFFFFF;
  opacity: .8;
  background: #31C971;
}

.app-desc {
  height: 48px;
  line-height: 24px;
  opacity: .45;
  margin-top: 10px;
}

.black-sheild {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.download-card {
  width: 673px;
  height: 378px;
  position: absolute;
  top: 50%;
  left: 50%;
  background: #FFFFFF;
  border-radius: 8px;
  margin-left: -336.5px;
  margin-top: -189px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.splitline {
  position: absolute;
  left: 50%;
  width: 1px;
  height: 298px;
  margin: 0px auto;
  padding: 0px;
  overflow: hidden;
  background: #000000;
  opacity: 0.09;
}

.close-card {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 22px;
  line-height: 22px;
  cursor: pointer;
  opacity: .65;
  transition: opacity .2s ease-in-out;
}

.close-card:hover {
  opacity: .95;
}

.download-qrcode {
  width: 176px;
  height: 176px;
  margin: 0 80px;
}

.download-type {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  opacity: .65;
  line-height: 22px;
  margin-top: 20px;
}
</style>
