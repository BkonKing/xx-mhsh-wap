<template>
  <div class="tf-bg-white tf-body">
    <van-nav-bar
      :title="infoData.type_name"
      :fixed="true"
      placeholder
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    >
    </van-nav-bar>
    <div class="tf-body-container">
      <div class="header-block">
        <div class="task-status bg-FEBF00" :class="{'bg-FE8900': infoData.task_status < 3, 'bg-FF6555' : infoData.task_status == 4, 'bg-ccc' : infoData.task_status > 4}">{{ infoData.task_status_name }}</div>
        <img class="header-bg" src="@/assets/img/task_01.png" />
        <div class="task-tit">{{ infoData.task_title }}</div>
        <div class="task-coin tf-row-vertical-center">
          <img src="@/assets/img/task_02.png" />
          <div class="coin-num">{{ infoData.reward_happiness }}</div>
          <div class="coin-unit">幸福币/人</div>
        </div>
        <div class="task-label tf-row">
          <div v-for="(item, index) in infoData.task_tag" :key="index" class="lable-item">{{ item }}</div>
        </div>
      </div>
      <div class="body-cont">
        <div class="task-session">
          <div class="session-tit">任务来源</div>
          <div class="release-user tf-row">
            <img :src="infoData.rwf_avatar" />
            <div class="tf-row-space-between">
              <div class="release-name van-ellipsis">{{ infoData.rwf_nickname }}</div>
              <div class="release-time">{{ infoData.task_ctime }}</div>
            </div>
          </div>
          <div v-if="!isUp" class="complain-tip tf-row-space-between">
            <div>凡涉及到内容有违法信息传播。收费不合理， 请您警惕并手机关联证据向我们举报。</div>
            <div @click="complaint">投诉</div>
          </div>
        </div>
        <div v-if="!isUp && receiverInfo && receiverInfo.is_already == 1" class="task-session">
          <div class="session-tit tf-row-space-between">接单用户<div class="tit-right tf-row-vertical-center" @click="goSchedule">查看<img src="@/assets/img/task_09.png" /></div></div>
          <div class="release-user tf-row">
            <img :src="receiverInfo.jdf_avatar" />
            <div class="tf-row-space-between">
              <div class="release-name van-ellipsis">{{ receiverInfo.jdf_nickname }}</div>
              <div class="release-time" :class="{'color-FF5240' : receiverInfo.progress_status != 2}">{{ receiverInfo.progress_status_name }}</div>
            </div>
            <div @click="deliverTask" v-if="receiverInfo.is_deliver == 1" class="finish-btn">交付任务</div>
          </div>
          <div v-if="receiverInfo.taskflow_list.length" class="progress-step">
            <div v-for="(item, index) in receiverInfo.taskflow_list" :key="index">{{ item.ctime + ' ' + item.progress_title }}</div>
            <!-- <div>03-21 12:00 接单成功，任务进行中</div> -->
          </div>
        </div>
        <div class="task-session">
          <div class="session-tit">任务要求</div>
          <div class="ask-list">
            <div class="ask-item">需要人数：{{ infoData.need_people_text }}</div>
            <div class="ask-item">完成时间：{{ infoData.task_time }}</div>
            <div v-if="isUp" class="ask-item">可见范围：{{ infoData.range_type_name }}</div>
          </div>
        </div>
        <div v-if="infoData.address" class="task-session">
          <div class="session-tit">完成地点</div>
          <div class="task-address tf-vertical-center">
            <div class="van-ellipsis">{{ infoData.address }}</div>
            <div class="van-ellipsis">{{ infoData.address_province + ' ' + infoData.address_city + ' ' + infoData.address_area }}</div>
            <img class="address-arrow" src="@/assets/img/task_04.png" />
            <img class="address-bg" src="@/assets/img/task_03.png" />
          </div>
        </div>
        <div class="task-session">
          <div class="session-tit tf-row-space-between">任务说明<span class="tit-right" v-if="infoData.renew_day > 0">更新：{{ infoData.renew_day }}天前</span></div>
          <div class="detai-cont">
            <div class="cont-text" :class="{'text-hidden': isOver&&!isDown}" ref="textCont">{{ infoData.task_desc }}<div @click="showToggle" v-show="isOver" class="more-down" :class="{'down-up' : isDown}">{{ isDown ? '收起' : '展开' }}</div></div>
            <div v-if="infoData.task_image && infoData.task_image.length" class="cont-pic tf-row-wrap">
              <img @click="previewPic(index)" v-for="(item, index) in infoData.task_image" :key="index" :src="item" />
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
            font-size: 16px">在APP内打开</div>
          </script>
        </wx-open-launch-app>
      </button>
      <button v-else class="app-btn" @click="goApp">在APP内打开</button>
      <confirm-model v-model="confirmShow" :modelTit="confirm.modelTit" :modelSubTit="confirm.modelSubTit" :cancelTxt="confirm.cancelTxt" :yesTxt="confirm.yesTxt" :cancel="confirm.cancel"></confirm-model>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  ImagePreview
} from 'vant'
import { getTaskInfo } from '@/api/share.js'
import confirmModel from '../components/confirm-model'
import { openApp, isWx, txJssdk } from '@/utils/util.js'
export default {
  components: {
    [NavBar.name]: NavBar,
    [ImagePreview.name]: ImagePreview,
    confirmModel
  },
  data () {
    return {
      taskId: '',
      isOver: false, // 内容是否超出行数
      isDown: false,
      infoData: '',
      receiverInfo: '',
      isUp: true, // 是否是发布者
      confirmShow: false,
      confirm: {
        modelTit: '是否确定接单？',
        modelSubTit: '',
        cancelTxt: '取消',
        yesTxt: '接单',
        cancel: true
      },
      isBack: false,
      shieldInfo: {}, // 屏蔽信息
      extinfo: '',
      isWx: false
    }
  },
  created () {
    this.taskId = this.$route.query.taskId
    this.getData()
    this.extinfo = 'page_type=5&taskId=' + this.taskId
    this.isWx = isWx()
    txJssdk()
  },
  mounted () {

  },
  methods: {
    getData () {
      getTaskInfo({ linli_task_id: this.taskId }).then(res => {
        this.shieldInfo = {
          uid: res.data.uid,
          nickname: res.data.rwf_nickname,
          content: res.data.task_title,
          id: res.data.task_id
        }
        this.infoData = res.data
        this.getShareInfo()
        if (!this.isUp) {
          this.receiverInfo = res.data.user_task_data
        }
        if (!this.isUp && res.popup_data.is_popup == 1) {
          this.isBack = true
          this.confirmShow = true
          this.confirm.modelTit = res.popup_data.popup_text
          this.confirm.modelSubTit = res.popup_data.popup_text2
          this.confirm.yesTxt = '我知道了'
          this.confirm.cancel = false
        }
        this.$nextTick(() => {
          this.getTextOver()
        })
      })
    },
    getTextOver () {
      const textCont = this.$refs.textCont
      const textHeight = textCont.clientHeight * 750 / document.documentElement.clientWidth
      console.log(textHeight)
      if (textHeight > 48 * 6) {
        this.isOver = true
      }
    },
    showToggle () {
      this.isDown = !this.isDown
    },
    // 预览大图
    previewPic (index) {
      const imagesArr = this.infoData.task_image
      ImagePreview({
        images: imagesArr,
        startPosition: index,
        closeOnPopstate: true,
        onClose () {
          // do something
        }
      })
    },
    // 分享
    share () {
      this.$refs.taskop.share()
    },
    // 跳转到app
    goApp () {
      const params = 'page_type=5&taskId=' + this.taskId
      openApp(params)
    }
  },
  watch: {
    confirmShow (val) {
      console.log(111, val, this.isBack)
      if (!val) {
        if (this.isBack) {
          this.$router.go(-1)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tf-body-container{
  font-size: 28px;
  color: #333;
  background-color: #F7F7F7;
}
/deep/.van-nav-bar {
  background-color: #FFD34D;
  .van-nav-bar__right .van-icon {
    font-size: 44px;
  }
}
.header-block {
  background-color: #F7F7F7;
  padding: 38px 0 20px 50px;
  background: linear-gradient(0deg, #FEBF00 0%, #FFD34D 100%);
  position: relative;
  margin-bottom: 30px;
  .task-tit {
    font-size: 44px;
    font-weight: 500;
    color: #2A334A;
    line-height: 60px;
    width: 486px;
    margin-bottom: 10px;
  }
  .task-coin {
    height: 56px;
    line-height: 56px;
    color: #2A334A;
    margin-bottom: 30px;
    img {
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }
    .coin-num {
      font-size: 40px;
      font-weight: 500;
      margin-right: 10px;
    }
    .coin-unit {
      font-size: 24px;
    }
  }
  .task-label {
    position: relative;
    z-index: 5;
    .lable-item {
      background-color: #FCD86E;
      height: 48px;
      line-height: 48px;
      border-radius: 10px;
      padding: 0 18px;
      font-size: 24px;
      color: #A46400;
      margin: 0 10px 20px 0;
    }
  }
  .header-bg {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 250px;
    height: 241px;
  }
  .task-status {
    position: absolute;
    right: 0;
    top: 38px;
    width: 140px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    border-radius: 32px 0px 0px 32px;
    font-size: 26px;
    font-weight: 500;
    color: #FFFFFF;
    z-index: 3;
    &.bg-ccc {
      background: #CCCCCC;
    }
    &.bg-FF6555 {
      background: #FF6555;
    }
    &.bg-FEBF00 {
      background: #FEBF00;
    }
    &.bg-FE8900 {
      background: #FE8900;
    }
  }
}
.task-session {
  width: 710px;
  margin: 0 auto 30px;
  background-color: #fff;
  overflow: hidden;
  padding: 0 30px;
  border-radius: 10px;
  .session-tit {
    font-size: 32px;
    font-weight: 500;
    color: #000000;
    height: 100px;
    padding-top: 10px;
    line-height: 90px;
    .tit-right {
      font-size: 24px;
      color: #8F8F94;
      line-height: 90px;
      img {
        width: 36px;
        height: 36px;
        margin-left: 8px;
      }
    }
  }
}
.release-user {
  height: 80px;
  margin: 10px 0 40px;
  align-items: stretch;
  img {
    width: 80px;
    height: 100%;
    border-radius: 50%;
    margin-right: 30px;
  }
  & > div.tf-row-space-between {
    max-width: 398px;
    flex-grow: 1;
    flex-direction: column;
  }
  .release-name {
    font-weight: 500;
    color: #000000;
    line-height: 36px;
  }
  .release-time {
    font-size: 24px;
    color: #8F8F94;
    line-height: 30px;
    &.color-FF5240 {
      color: #FF5240;
    }
  }
  .finish-btn {
    width: 143px;
    text-align: center;
    height: 64px;
    line-height: 64px;
    background: #FF6555;
    border-radius: 10px;
    font-size: 24px;
    color: #FFFFFF;
    justify-content: flex-start;
    flex-shrink: 0;
  }
}
.ask-list {
  margin-bottom: 30px;
  div {
    line-height: 44px;
    font-size: 26px;
    color: #000000;
  }
}
.task-address {
  height: 128px;
  background: linear-gradient(90deg, #F7F7F7 0%, #FFFFFF 100%);
  border-radius: 10px;
  margin-bottom: 40px;
  position: relative;
  padding-left: 30px;
  div {
    position: relative;
    z-index: 5;
    line-height: 44px;
    max-width: 530px;
  }
  div:nth-child(1) {
    font-size: 26px;
    color: #000000;
  }
  div:nth-child(2) {
    font-size: 24px;
    color: #8F8F94;
  }
  img {
    position: absolute;
  }
  .address-arrow {
    right: 30px;
    top: 40px;
    width: 48px;
    height: 48px;
    z-index: 3;
  }
  .address-bg {
    right: 0;
    top: 0;
    width: 314px;
    height: 100%;
  }
}
.detai-cont {
  .cont-text {
    color: #8F8F94;
    line-height: 48px;
    font-size: 30px;
    position: relative;
    margin-bottom: 30px;
    &.text-hidden {
      height: 288px;
      overflow: hidden;
    }
  }
  .cont-pic {
    img {
      width: 150px;
      height: 150px;
      margin: 0 16px 16px 0;
      object-fit: cover;
    }
    img:nth-child(4n) {
      margin-right: 0;
    }
    margin-bottom: 24px;
  }
}
.complain-tip {
  height: 112px;
  align-items: center;
  background: #F7F7F7;
  margin: -10px 0 40px;
  padding: 0 16px 0 28px;
  font-size: 24px;
  div:nth-child(1) {
    width: 480px;
    color: #8F8F94;
  }
  div:nth-child(2) {
    width: 100px;
    height: 48px;
    text-align: center;
    line-height: 44px;
    border: 1PX solid #FF6555;
    border-radius: 10px;
    color: #FF6555;
  }
}
.progress-step {
  background: #FFF6F5;
  border-radius: 10px;
  padding: 28px 20px 28px 0;
  font-size: 24px;
  color: #8F8F94;
  margin-bottom: 40px;
  div {
    line-height: 48px;
    position: relative;
    padding-left: 60px;
    &::before {
      content: '';
      position: absolute;
      left: 30px;
      top: 19px;
      width: 10px;
      height: 10px;
      background: #8F8F94;
      border-radius: 50%;
    }
    &:first-child {
      color: #000000;
      &::before {
        background: #000000;
      }
    }
  }
}
.app-btn {
  width: 4rem;
  height: 1.2rem;
  position: absolute;
  bottom: 40px;
  left: 50%;
  margin-left: -2rem;
  border: none;
  border-radius: 0.6rem;
  background-image: linear-gradient(to right, #f9866b, #eb5841);
  color: #fff;
  font-size: 0.4rem;
  text-align: center;
  z-index: 2;
  box-shadow: 0.15rem 0.15rem 0.3rem #999;
}
</style>
