<template>
  <div class="error-page">
    <div class="error-img"></div>
    <div class="error-text">{{warningText}}</div>
    <div class="back-home" @click="backHome">返回首页</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      warningText: '对不起，服务器连接失败…',
    };
  },
  methods: {
    backHome() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style>
.error-page {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -160px;
  margin-top: -183px;
  font-weight: 400;
}

.error-img {
  width: 320px;
  height: 280px;
  background: url(../assets/img/error500-pc.png) center no-repeat;
}

.error-text {
  font-size: 16px;
  color: #232D34;
  line-height: 24px;
}

.back-home {
  width: 88px;
  height: 32px;
  background: #19BB20;
  border-radius: 4px;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 32px;
  margin: 30px auto 0;
  cursor: pointer;
}

@media screen and (min-width: 320px) and (max-width: 980px) {
  .error-page {
    margin-left: -1.25rem;
    margin-top: -1.675rem;
  }

  .error-img {
    width: 2.5rem;
    height: 2.19rem;
    background: url(../assets/img/error500-mobile.png) center/2.5rem no-repeat;
  }

  .error-text {
    text-align: center;
    font-size: .16rem;
    line-height: .24rem;
    margin-top: .2rem;
  }

  .back-home {
    width: .88rem;
    height: .32rem;
    font-size: .14rem;
    line-height: .32rem;
    margin: .4rem auto 0;
  }
}
</style>
