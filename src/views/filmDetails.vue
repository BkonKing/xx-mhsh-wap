<template>
  <div class="tf-bg tf-body">
    <div class="tf-body-container">
      <!-- 影片信息 -->
      <div class="film-container">
        <div class="film-header">
          <img class="film-cover" :src="filmInfo.cover" alt="影片封面" />
          <div class="film-filmInfo">
            <!-- 名称 -->
            <div class="film-title">{{ filmInfo.film_name }}</div>
            <!-- 类型 -->
            <div v-if="filmInfo.type" class="film-type">
              {{ filmInfo.type }}
            </div>
            <!-- 时长/地区 -->
            <div class="film-duration">
              {{ filmInfo.duration }}分钟 / {{ filmInfo.area }}
            </div>
            <!-- 上映时间 -->
            <div class="film-publish">
              {{ filmInfo.publish_date }}中国大陆上映
            </div>
            <!-- 制式 -->
            <div class="film-tags" v-if="filmInfo.version">
              <div
                class="film-tag"
                v-for="(tag, i) in filmInfo.version.split(',')"
                :key="i"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
        <div class="film-footer">
          <!-- 评分 -->
          <div v-if="parseFloat(filmInfo.score) != 0" class="film-score">
            <div class="film-text">{{ parseFloat(filmInfo.score) / 10 }}</div>
            <div class="film-minor">电影评分</div>
          </div>
          <!-- 想看人数 -->
          <div class="film-want">
            <div class="film-text">{{ filmInfo.want_view | wantFormat }}</div>
            <div class="film-minor">
              {{ parseInt(filmInfo.want_view) > 9999 ? '万' : '' }}人想看
            </div>
          </div>
          <!-- 想看操作 -->
          <!-- <div class="film-view">
            <div class="film-text">
              <img
                class="film-uncollect"
                src="@/assets/imgs/movie_uncollect.png"
                alt="想看"
                @click="goApp"
              />
            </div>
            <div class="film-minor">
              想看
            </div>
          </div> -->
        </div>
      </div>
      <!-- 影片介绍 -->
      <div
        v-if="filmInfo.introduction"
        class="film-introduction"
        :class="[
          { 'film-introduction-collapsed': collapsed },
          { 'film-introduction-able': collapseable },
        ]"
      >
        <div ref="introductionBox" class="introduction-text">
          <div ref="introductionText">{{ filmInfo.introduction }}</div>
        </div>
        <!-- 判断是否需要折叠，需要则显示折叠图标 -->
        <div class="tf-flex" v-if="collapseable">
          <van-icon
            :name="collapsed ? 'arrow-up' : 'arrow-down'"
            @click="collapsed = !collapsed"
          />
        </div>
      </div>
      <!-- 演职人员信息 -->
      <div class="film-cast-info" v-if="filmInfo.director || filmInfo.cast">
        <div class="film-cast-header" @click="goApp">
          <div class="film-cast-title">演职人员</div>
          <!-- <div class="tf-text-grey">全部 <van-icon name="arrow" /></div> -->
        </div>
        <div class="van-ellipsis">
          <span class="tf-text-grey">导演：</span>{{ filmInfo.director }}
        </div>
        <div v-if="filmInfo.cast" class="van-ellipsis">
          <span class="tf-text-grey"
            >{{ filmInfo.cast_type == '0' ? '主演' : '配音' }}：</span
          >{{ filmInfo.cast }}
        </div>
      </div>
    </div>
    <div class="tf-padding">
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
            <div class="btn" style="display: flex;align-items: center;justify-content: center;height: 100%;font-size: 15px;color: #fff;">在APP内打开</div>
          </script>
        </wx-open-launch-app>
      </button>
      <button v-else @click="goApp" class="app-btn">
        <div class="launch-btn">
          <div class="btn">
            在APP内打开
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { NavBar, Button, Icon } from 'vant'
import { getfilminfo } from '@/api/share'
import { openApp, isWx, txJssdk } from '@/utils/util.js'
export default {
  name: 'movieFilmDetails',
  data () {
    return {
      filmId: '',
      title: '',
      filmInfo: {
        score: 0,
        want_view: 0,
        introduction: ' '
      },
      introductionBoxHeight: 0, // introductionBox默认高度
      collapseable: false, // 是否需要折叠
      collapsed: false, // 控制折叠
      isWx: false,
      extinfo: ''
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Button.name]: Button
  },
  created () {
    this.filmId = this.$route.query.id
    this.extinfo = `page_type=3&id=${this.filmId}`
    this.isWx = isWx()
    txJssdk()
    this.getfilminfo()
  },
  mounted () {
    this.introductionBoxHeight = this.$refs.introductionBox.clientHeight
  },
  methods: {
    // 获取影片详情
    getfilminfo () {
      getfilminfo({
        film_id: this.filmId
      }).then(({ data }) => {
        this.filmInfo = data
        this.$nextTick(() => {
          // 描述元素如果高度大于introductionBoxHeight则需要显示折叠按钮
          if (
            this.$refs.introductionText.clientHeight >
            this.introductionBoxHeight
          ) {
            this.collapseable = true
          }
        })
      })
    },
    // 跳转到app
    goApp () {
      openApp(this.extinfo)
    },
    handleLaunchFn (e) {
      // alert('成功')
      console.log('success', e)
    },
    handleErrorFn (e) {
      this.$router.push({
        path: '/upload'
      })
    }
  },
  filters: {
    // 超过一万则以万为单位
    wantFormat (value) {
      const val = parseInt(value)
      return val > 9999 ? `${Math.ceil(val / 10000)}` : val
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar {
  background: #000c;
  .van-icon,
  .tf-icon {
    color: #fff;
  }
}
.film-introduction {
  padding: 50px 30px;
  background: #fff;
  font-size: 30px;
  line-height: 50px;
  color: #222;
  .introduction-text {
    height: 210px;
    overflow: hidden;
  }
}
// 介绍可以折叠
.film-introduction-able {
  padding-bottom: 30px;
  .tf-flex {
    justify-content: center;
    align-items: center;
    padding-top: 24px;
    .tf-icon {
      font-size: 24px;
      line-height: 1;
    }
  }
}
// 介绍展开
.film-introduction-collapsed {
  .introduction-text {
    height: auto;
  }
}
.film-cast-info {
  margin-top: 30px;
  padding: 40px 30px;
  background: #fff;
  font-size: 30px;
  color: #222;
  .film-cast-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .film-cast-title {
      font-size: 34px;
      font-weight: 500;
      color: #222222;
    }
    .tf-text-grey {
      display: flex;
      align-items: center;
      font-size: 26px;
    }
  }
  .van-ellipsis {
    margin-top: 10px;
  }
}
.film-container {
  padding: 30px;
  background: #000c;
  .film-header {
    display: flex;
    .film-cover {
      width: 186px;
      height: 259px;
      margin-right: 30px;
      font-size: 28px;
      color: #fff;
      border-radius: 4px;
    }
    .film-info {
      flex: 1;
    }
  }
  .film-title {
    margin-bottom: 16px;
    font-size: 42px;
    font-weight: 600;
    color: #fff;
  }
  .film-type,
  .film-duration,
  .film-publish {
    margin-top: 6px;
    font-size: 26px;
    color: #ffffff99;
  }
  .film-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 18px;
    .film-tag {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 4px 12px;
      font-size: 24px;
      line-height: 1;
      color: #ffffff99;
      border: 2px solid #ffffff99;
      border-radius: 4px;
    }
  }
  .film-footer {
    display: flex;
    height: 130px;
    margin-top: 30px;
    padding: 22px 0;
    background: #ffffff1a;
    border-radius: 10px;
    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .film-want,
    .film-view {
      position: relative;
    }
    > div + div::before {
      // border-left: 2px solid #ffffff66;
      display: block;
      width: 2px;
      height: 70px;
      position: absolute;
      left: 0;
      background: #ffffff;
      opacity: 0.4;
      border-radius: 1px;
      content: '';
    }
    .film-text {
      font-size: 48px;
      font-weight: 500;
      color: #ffa110;
    }
    .film-minor {
      font-size: 24px;
      color: #fff;
    }
  }
  .film-collect {
    width: 40px;
    height: 40px;
    font-size: 24px;
    color: #fff;
  }
  .film-uncollect {
    width: 40px;
    height: 40px;
    font-size: 24px;
    color: #fff;
  }
}
.app-btn {
  display: block;
  width: 100%;
  height: 1.2rem;
  border: none;
  border-radius: 8px;
  background-image: linear-gradient(to right, #f9866b, #eb5841);
  color: #fff;
  font-size: 0.4rem;
  text-align: center;
  z-index: 2;
  box-shadow: 0.15rem 0.15rem 0.3rem #999;
}
.launch-btn {
  width: 100%;
  height: 100%;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 30px;
  color: #fff;
}
</style>
