<template>
  <div class="free-server">
    <div class="free-server-header">
      <div class="free-server-title">{{ projectName }}-免费服务</div>
      <div class="server-type">
        <div class="server-type-item">
          <img class="server-type-img" src="@/assets/imgs/artificial.png" alt="" /><span
            class="server-type-text"
            >人工服务({{ artificialCount }})</span
          >
        </div>
        <div class="server-type-item">
          <img class="server-type-img" src="@/assets/imgs/borrow.png" alt="" /><span
            class="server-type-text"
            >借用服务({{ borrowingCount }})</span
          >
        </div>
      </div>
    </div>
    <div class="service-card-box">
      <div
        v-for="item in data"
        :key="item.id"
        class="service-card"
        :class="{
          'service-card--disabled': item.is_stop == 1,
        }"
      >
        <div
          class="service-card-tag"
          :class="{
            'service-card-tag--blue': +item.category_type === 1,
            'service-card-tag--green': +item.category_type === 2,
          }"
        ></div>
        <div class="service-card-content">
          <div class="service-card-name">{{ item.category }}</div>
          <div v-if="item.is_stop == 1" class="service-card-info">
            暂停服务
          </div>
          <div v-else class="service-card-info">
            <span :class="{ 'tf-text-red': [2, 3].includes(item.server_status) }">{{
              item | pdText
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <button v-if="isWx" class="app-btn">
      <wx-open-launch-app
        id="id"
        class="launch-btn"
        appid="wx7245d2cb43a093db"
        :extinfo="extinfo"
        @error="handleErrorFn"
        @launch="handleLaunchFn"
      >
        <script type="text/wxtag-template">
          <div class="btn" style="color: #fff;
          font-size: 16px">打开APP 预约服务</div>
        </script>
      </wx-open-launch-app>
    </button>
    <button v-else class="app-btn" @click="goApp">打开APP 预约服务</button>
  </div>
</template>

<script>
// /butler/freeServer
import { getFreeServerList } from '@/api/share'
import { openApp, isWx, txJssdk } from '@/utils/util.js'

export default {
  data () {
    return {
      projectId: '',
      projectName: '',
      isWx: false,
      data: [],
      artificialCount: 0,
      borrowingCount: 0
    }
  },
  created () {
    this.projectId = this.$route.query.projectId
    this.extinfo = 'page_type=8'
    this.isWx = isWx()
    this.getFreeServerList()
  },
  methods: {
    getFreeServerList () {
      getFreeServerList({
        enter_project_id: this.projectId
      }).then(({ list, project_name, artificial_count, borrowing_count }) => {
        this.data = list
        this.projectName = project_name
        this.artificialCount = artificial_count || 0
        this.borrowingCount = borrowing_count || 0
        txJssdk({
          title: `"${this.projectName}"免费服务，让生活更美好！`,
          desc:
            '业主终身享受，案场游客可免费体验按摩、老人理发、洗车、义诊、小推车、工具箱借用等服务',
          imgUrl: '/library/img/app_img/freeserver.png'
        })
      })
    },
    goApp () {
      if (this.isWx) {
        return
      }
      openApp(this.extinfo)
    },
    handleLaunchFn (e) {
      // alert('成功')
      // alert(JSON.stringify(e.detail))
      console.log('success', e)
    },
    handleErrorFn (e) {
      console.log('fail', e.detail)
      this.$router.push({
        path: '/upload'
      })
    }
  },
  filters: {
    pdText ({
      category_type: type,
      appointment_count: appointmentCount,
      server_count: serverCount,
      remaining_count: remainingCount
    }) {
      // 借用需显示剩余数量
      const borrowRemain = type === 2 ? `(剩余${remainingCount || 0}个)` : ''
      // 有预约则显示预约
      return appointmentCount
        ? `${appointmentCount}人预约${borrowRemain}`
        : `累计服务${serverCount}人${borrowRemain}`
    }
  }
}
</script>

<style lang="less" scoped>
.free-server {
  height: 100%;
  overflow: auto;
  background: #f7f7f7;
  .free-server-header {
    padding: 30px 20px;
    background: #fff;
  }
  .free-server-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 710px;
    height: 80px;
    background: #f7f7f7;
    border-radius: 10px;
    font-size: 28px;
    color: #222222;
  }
  .server-type {
    display: flex;
    justify-content: space-between;
    padding: 40px 40px 10px;
    .server-type-item {
      display: flex;
      align-items: center;
      width: 280px;
      height: 64px;
      padding-left: 10px;
      background: #f7f7f7;
      border-radius: 32px;
    }
    .server-type-img {
      width: 48px;
      height: 48px;
      margin-right: 20px;
    }
    .server-type-text {
      font-size: 26px;
      color: #222222;
    }
  }
}
.service-card-box {
  @flex();
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px 20px 0;
}

.service-card {
  position: relative;
  width: 345px;
  min-height: 144px;
  padding: 0 18px;
  margin-bottom: @padding-lg;
  background: #fff;
  border-radius: 10px;
  .service-card-tag {
    position: absolute;
    left: 0;
    top: 22px;
    width: 6px;
    height: 32px;
    background: #00a0e9;
    border-radius: 3px;
  }
  .service-card-name {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 82px;
    padding: 4px 0;
    font-size: 26px;
    font-weight: bold;
    line-height: 36px;
    color: #222222;
    border-bottom: 2px dotted #cccccc;
  }
  .service-card-tag--blue {
    background-color: #00a0e9;
  }
  .service-card-tag--green {
    background-color: #6bc572;
  }
}

.service-card--disabled {
  background: #eeeeee;
  .service-card-tag {
    background-color: #bbbbbb;
  }
  .service-card-name {
    color: #8f8f94;
  }
}

.service-card-info {
  display: flex;
  align-items: center;
  height: 60px;
  font-size: 24px;
  color: @gray-7;
}
.tf-text-red {
  color: #ff6555;
}
.app-btn {
  width: 4.5rem;
  height: 1.05rem;
  position: fixed;
  bottom: 30px;
  left: 50%;
  margin-left: -2.25rem;
  border: none;
  border-radius: 0.525rem;
  background: #ff6555;
  color: #f7f7f7;
  font-size: 0.373rem;
  text-align: center;
  z-index: 2;
}
</style>
