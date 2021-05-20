<template>
  <div class="app-frame">
    <div v-if="showHead" class="app-head">
      <div class="main-content">
        <div class="app-mobile-menu" @click="toNavMobile"></div>
        <router-link :to="{path: '/'}" class="app-title">
          <div class="app-logo">{{appTitle}}</div>
        </router-link>
        <div class="app-search">
          <el-input
            v-model="value"
            placeholder="请输入搜索内容"
            @keyup.enter.native="toSearch()">
            <i class="el-input__icon el-icon-search"
              slot="suffix"
              @click="toSearch()"></i>
          </el-input>
        </div>
        <div class="app-mobile-search"
          @click="toSearch()"></div>
      </div>
    </div>

    <div v-if="showNav" class="app-nav">
      <div class="main-content">
        <template v-for="v in appTypes">
          <div class="app-nav-item"
            :class="{active: isActive(v.APP_CATALOG_ID)}"
            :key="v.APP_CATALOG_ID">
            <router-link :to="{ name: 'Home', query: { appTypeId: v.APP_CATALOG_ID } }">
              {{v.CATALOG_NAME}}
            </router-link>
          </div>
        </template>
      </div>
    </div>

    <transition name="slide-fade-nav-mobile">
      <div v-if="showNavMobile" class="black-sheild"
        @click="showNavMobile=false" @touchmove.prevent @mousewheel.prevent>
        <div class="app-nav-mobile" @click.stop="showNavMobile=true">
          <div class="close-nav-mobile" @click.stop="closeNavMobile">×</div>
          <div class="all-nav-mobile">全部</div>
          <template v-for="v in appTypes">
            <div class="app-nav-item"  @click.stop="closeNavMobile"
              :class="{active: isActive(v.APP_CATALOG_ID)}"
              :key="v.APP_CATALOG_ID">
              <router-link :to="{ name: 'Home', query: { appTypeId: v.APP_CATALOG_ID } }">
                {{v.CATALOG_NAME}}
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </transition>

    <router-view v-loading="showLoading" />
  </div>
</template>

<script>
export default {
  name: 'Frame',
  data() {
    return {
      appTitle: 'IPU App Store',
      showNavMobile: false,
      appTypes: [],
      value: '',
    };
  },
  computed: {
    showHead() { // 是否展示头部
      return !(window.innerWidth < 980 && this.$route.path === '/search');
    },
    showNav() { // 是否展示
      return !(window.innerWidth < 980 && this.$route.path !== '/');
    },
    showLoading() {
      return this.appTypes.length === 0;
    },
  },
  created() {
    // 请求数据
    const typeId = this.$route.query.appTypeId;
    if (typeId) {
      this.$store.commit('setAppTypeId', typeId);
    }

    this.$http.get(servicePath)
      .then((res) => {
        this.appTypes = res.APP_TYPE;
        this.$store.commit('setAppData', res.APP_TYPE);
      })
      .catch((err) => {
        this.$router.push({ name: 'Error' });
      });
  },
  beforeRouteUpdate(to, from, next) { // 进入之前，更新state信息
    if (to.query.appTypeId) {
      this.$store.commit('setAppTypeId', to.query.appTypeId);
    } else {
      this.$store.commit('setAppTypeId', this.appTypes[0].APP_CATALOG_ID);
    }
    next();
  },
  methods: {
    isActive(typeId) {
      if (this.$route.name === 'Search') return false;
      let appTypeId = this.$store.getters.appTypeId;
      return appTypeId == typeId; // 忽略类型
    },
    toSearch() {
      let val = this.value.trim();
      this.$router.push({
        name: 'Search',
        query: { key: val },
      });
    },
    toNavMobile() {
      this.showNavMobile = true;
    },
    closeNavMobile() {
      this.showNavMobile = false;
    },
  },
};
</script>

<style>
.app-frame {
  height: 100%;
  z-index: 1;
  position: relative;
}

.app-head {
  height: 60px;
  background: #1F2230;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 28px;
}

.app-mobile-menu,
.app-mobile-search {
  display: none;
}

.app-title {
  color: #FFFFFF;
  text-decoration: none;
}

.app-logo {
  width: 180px;
  height: 100%;
  background: url(../assets/img/logo.png) center left/auto 32px no-repeat;
  text-align: right;
  line-height: 60px;
}

.app-nav {
  height: 40px;
  background: #3A4556;
}

/* 定制菜单 */
.app-nav .app-nav-item {
  height: 38px;
  color: #FFFFFF;
  font-family: PingFangSC-Medium, PingFang SC;
  line-height: 1;
  flex: 1;
  transition: background .2s ease-in-out;
}

.app-nav .app-nav-item.active {
  color: #19BB21;
  border-bottom: 2px solid #19BB21;
}

.app-nav .app-nav-item:hover {
  background-color: #424c58;
}

.app-nav .app-nav-item.active:hover {
  background-color: transparent;
}

.app-nav .app-nav-item a {
  display: inline-block;
  color: inherit;
  text-decoration: none;
  width: 100%;
  line-height: 40px;
}

.app-search {
  width: 200px;
}

/* 自定义搜索框样式 */
.el-input__inner {
  width: 200px;
  height: 32px;
  color: #000000;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 22px;
  border: 1px solid #000000;
  padding: 0 12px;
  background-color: #FFFFFF;
}

.el-icon-search {
  line-height: 32px;
  cursor: pointer;
}

</style>
