<template>
  <div class="tf-bg tf-body">
    <van-nav-bar title="分享" :fixed="true" placeholder> </van-nav-bar>
    <div class="tf-body-container">
      <div class="tf-card">
        <div
          class="tf-card-header"
          style="border-bottom:none"
          :class="{ 'border-none': articleType == 2 || articleType == 3 }"
        >
          <userInfo
            :avatar="info.avatar"
            :name="info.nickname"
            :time="info.ctime"
          >
            <template v-if="articleType == 3" v-slot:right>
              <div class="group-tag">{{ info.category }}</div>
            </template>
          </userInfo>
        </div>
        <template v-if="articleType == 1">
          <div class="article-title">{{ info.title }}</div>
          <div class="article-content" v-html="info.content"></div>
          <!-- <img class="activity-image" :src="info.thumbnail" /> -->
        </template>
        <template v-else-if="articleType == 3">
          <tf-alert
            v-if="info.status == 2"
            type="warning"
            content="该内容含有违规信息。"
            :showRight="false"
            :showIcon="false"
            size="sm"
          ></tf-alert>
          <div class="tf-card-content">{{ info.content }}</div>
          <template v-if="info.images && info.images.length">
            <img
              width="33%"
              :src="info.images[0]"
              v-if="info.images.length === 1"
            />
            <tf-image-list
              v-else
              :data="info.images"
              mode="show"
            ></tf-image-list>
          </template>
        </template>
        <template v-else-if="articleType == 2">
          <div class="article-title">{{ info.title }}</div>
          <div class="activity-content">
            <div class="tf-text tf-mb-lg" v-html="info.content"></div>
          </div>
        </template>
        <div class="activity-footer">
          <div
            class="tf-icon tf-icon-zan"
            :class="{ 'like-active': info.is_thumbsup }"
          >
            <span class="tf-text-sm">{{ info.thumbsups | numberText }}</span>
          </div>
          <div class="tf-icon tf-icon-pinglun">
            <span class="tf-text-sm">{{ info.comments | numberText }}</span>
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
  </div>
</template>

<script>
import { NavBar, Popup, Toast, Dialog } from 'vant'
import UserInfo from '@/components/user-info'
import TfAlert from '@/components/tf-alert'
import tfImageList from '@/components/tf-image-list'
import { getActivityInfo, getArticleInfo, getPostBarInfo } from '@/api/share'
import { openApp, isWx, txJssdk } from '@/utils/util.js'

export default {
  components: {
    [NavBar.name]: NavBar,
    [Popup.name]: Popup,
    UserInfo,
    TfAlert,
    tfImageList
  },
  data () {
    return {
      articleType: 3,
      id: '',
      moreShow: false,
      info: {
        id: '',
        content: '',
        images: [],
        category: '',
        nickname: '',
        avatar: '',
        thumbsups: '',
        comments: '',
        ctime: ''
      },
      isLoading: false,
      extinfo: '',
      isWx: false
    }
  },
  created () {
    const { articleType, id } = this.$route.query
    this.articleType = articleType
    this.id = id
    this.getInfo()
    this.extinfo = 'page_type=2&articleType=' + this.articleType + '&id=' + this.id
    this.isWx = isWx()
  },
  methods: {
    // 根据类型获取对应的详情
    getInfo () {
      switch (this.articleType) {
        case '1':
          this.getArticleInfo()
          break
        case '2':
          this.getActivityInfo()
          break
        case '3':
          this.getPostBarInfo()
          break
      }
    },
    /* 获取资讯详情 */
    getArticleInfo () {
      getArticleInfo({
        id: this.id
      }).then(({ data }) => {
        if (data.is_del === 1) {
          Dialog.alert({
            title: '该活动已被删除'
          })
          return
        }
        this.info = data
        this.txJssdk()
        this.isLoading = false
      })
    },
    /* 获取小组帖子详情 */
    getPostBarInfo () {
      getPostBarInfo({
        id: this.id
      })
        .then(({ data }) => {
          if (data.is_del === 1) {
            Dialog.alert({
              title: '该贴已被删除'
            })
            return
          }
          this.info = data
          this.txJssdk()
          this.info.id = this.id
          this.isLoading = false
        })
        .catch(({ message }) => {
          Toast.clear()
          Dialog.alert({
            title: message
          }).then(() => {
            this.$router.go(-1)
          })
        })
    },
    /* 获取活动详情 */
    getActivityInfo () {
      getActivityInfo({
        id: this.id
      }).then(({ data }) => {
        if (data.is_del === 1) {
          Dialog.alert({
            title: '该活动已被删除'
          })
          return
        }
        this.info = data
        this.txJssdk()
        this.isLoading = false
      })
    },
    txJssdk () {
      txJssdk({
        title: this.articleType == 3 ? this.info.content : this.info.title,
        desc:
          this.articleType == 3 ? this.info.content : this.info.title,
        imgUrl: this.info.share_img
      })
    },
    // 跳转到app
    goApp () {
      const params = 'page_type=2&articleType=' + this.articleType + '&id=' + this.id
      openApp(params)
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
    numberText (value) {
      let text = ''
      if (value < 10000 && value > 0) {
        text = value
      } else if (value >= 10000) {
        text = `${Math.floor(value / 10000)}万+`
      }
      return text
    }
  }
}
</script>

<style lang="less" scoped>
.tf-card-header {
  padding-bottom: 30px;
}
/deep/ .user-info__left-box {
  .tf-space-around {
    flex: 1;
    width: 0;
    .user-info--name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.tf-body-container {
  overflow: auto;
  background: #fff;
  -webkit-overflow-scrolling: touch;
  @flex-column();
  .tf-icon {
    color: #8f8f94;
  }
  .tf-card {
    margin-top: 40px;
    padding: 0 30px;
  }
}
.tf-image-box {
  justify-content: flex-start;
  .details-image {
    width: 200px;
    height: 200px;
    margin-right: 10px;
  }
}
.activity-footer {
  display: none;
  margin-top: 35px;
  // @flex();
  padding: 20px 0;
  border-top: 1px solid @divider-color;
  .tf-icon {
    flex: 1;
    font-size: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    .tf-text-sm {
      margin-left: 10px;
    }
  }
}
.border-none {
  border-bottom: none;
}
.article-title {
  font-size: 34px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 30px;
}
.article-content {
  padding: 40px 0 10px;
  border-top: 1px solid @divider-color;
  font-size: 28px;
  color: #666;
  /deep/ img {
    max-width: 100% !important;
  }
}
.activity-content {
  @flex-column();
  align-items: center;
  border-top: 1px solid @divider-color;
  padding-top: 30px;
  /deep/ img {
    max-width: 100% !important;
  }
  .apply-box {
    width: 100%;
    background: #ffffff;
    padding: 0 20px;
    box-shadow: 0px 6px 18px 0px rgba(201, 28, 0, 0.25);
    border-radius: 4px;
    .apply-title {
      @relative();
      height: 100px;
      line-height: 100px;
      font-size: 30px;
      border-bottom: 3px solid @red;
      .tf-status-tag {
        display: flex;
        align-content: center;
        width: auto;
        top: 20px;
        padding: 0 28px;
        font-size: 30px;
        border-radius: 30px 30px 0px 30px;
        background: linear-gradient(90deg, #f9866b, #eb5841);
      }
    }
    .apply-user {
      padding: 38px 0 50px;
      display: flex;
      align-content: center;
      &__avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        // background: @gray-7;
        margin-right: 10px;
      }
    }
  }
  .apply-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 150px;
    background-image: linear-gradient(to bottom right, @red, @red-dark);
    border: 6px solid #ffdbd9;
    border-radius: 50%;
    margin-top: 45px;
    font-size: 30px;
    color: #fff;
  }
}
.group-tag {
  height: 34px;
  line-height: 34px;
  padding: 0 13px;
  text-align: center;
  border: 2px solid @orange-dark;
  border-radius: 10px 0px 10px 10px;
  color: @orange-dark;
  font-size: 22px;
}
.activity-image {
  width: 100%;
  height: 365px;
  margin-bottom: 20px;
}
.like-active::before {
  color: @orange-dark;
}
.tf-card-content {
  padding: 30px 0;
  color: #666;
  font-size: 28px;
  line-height: 52px;
  word-break: break-all;
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
