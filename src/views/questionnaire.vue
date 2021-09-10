<template>
  <div class="tf-bg-white">
    <van-nav-bar
      :title="title"
      :fixed="true"
      :border="false"
      placeholder
    />
    <div class="tf-main-container">
      <!-- 头部问卷投票信息 -->
      <div class="qustion-header">
        <userInfo
          :avatar="wjtp_info.avatar"
          :name="wjtp_info.nickname"
          :time="wjtp_info.ptime"
        ></userInfo>
        <!-- 已结束 -->
        <img
          v-if="wjtp_info.status == 3"
          class="finish-tag-box"
          src="@/assets/imgs/butler_questionnaire_ending.png"
        />
        <!-- 标题 -->
        <div class="tf-article-title">
          {{ wjtp_info.title }}
          <!-- 说明，没有不显示 -->
          <div v-if="wjtp_info.remarks" class="info-remarks">
            {{ wjtp_info.remarks }}
          </div>
        </div>
        <div
          class="tf-row-space-between"
          :class="{ 'tf-row-center': !(parseInt(wjtp_info.virtual_coin) > 0) }"
        >
          <!-- 参与能获得的幸福币，有才显示 -->
          <div class="tf-gradient-tag--warning" v-if="parseInt(wjtp_info.virtual_coin) > 0">
            参与得{{ wjtp_info.virtual_coin }}幸福币
          </div>
          <!-- 现有参与人数，红色--正在进行中的；灰色--已结束 -->
          <div class="people-number" :class="{ 'people-number-end': wjtp_info.status === 3 }">
            {{ wjtp_info.joins }}人参加
          </div>
        </div>
      </div>
      <div class="vote-padding">
        <!-- 问卷 -->
        <template v-if="wjtp_info.wjtp_type == 1">
          <!-- 题数 -->
          <div class="tf-text-grey tf-center tf-mb-lg">(共{{ wjtp_info.item_num }}题)</div>
          <div class="question-container">
            <div class="question-box" v-for="(item, i) in voteList" :key="i">
              <!-- 问卷题目名称 -->
              <div class="question__text">
                <span v-if="item.is_required == 1" class="tf-text-primary">*</span>{{ i + 1 }}、{{
                  item.question
                }}
              </div>
              <!-- 问卷-单选 -->
              <template v-if="item.item_type == 1">
                <van-radio-group v-model="item.answer" disabled>
                  <van-radio v-for="(radio, i) in item.option" :key="i" :name="radio.id">
                    {{ radio.content }}
                    <template #icon="props">
                      <div class="van-icon" :class="{ 'radio-checked-box': props.checked }" />
                    </template>
                  </van-radio>
                </van-radio-group>
              </template>
              <!-- 问卷-多选 -->
              <template v-else-if="item.item_type == 2">
                <van-checkbox-group v-model="item.answer" disabled>
                  <van-checkbox
                    v-for="(checkbox, i) in item.option"
                    :key="i"
                    :name="checkbox.id"
                    shape="square"
                    >{{ checkbox.content }}</van-checkbox
                  >
                </van-checkbox-group>
              </template>
              <!-- 问卷-填写 -->
              <template v-else-if="item.item_type == 3">
                <van-field
                  class="question__textarea"
                  v-model="item.answer"
                  rows="1"
                  autosize
                  type="textarea"
                  disabled
                />
              </template>
            </div>
          </div>
        </template>
        <!-- 投票 -->
        <template v-else-if="wjtp_info.wjtp_type == 2">
          <div class="tf-text-grey tf-center tf-mb-lg">
            投票选项({{ wjtp_info.tp_type == 1 ? '单选' : '多选' }})
          </div>
          <!-- 单选 -->
          <van-radio-group v-if="wjtp_info.tp_type === '1'" v-model="radioAnswer" disabled>
            <van-radio
              v-for="(item, i) in voteList.option"
              :key="i"
              :name="item.id"
              :class="{
                'vote-active': radioAnswer === item.id,
              }"
              class="vote-box tf-row-space-between"
              label-position="left"
            >
              <div class="vote-title">
                {{ item.content }}
              </div>
            </van-radio>
          </van-radio-group>
          <!-- 多选 -->
          <van-checkbox-group v-else v-model="voteAnswer" :max="5" disabled>
            <van-checkbox
              v-for="(item, i) in voteList.option"
              :key="i"
              :name="item.id"
              class="vote-box tf-row-space-between"
              label-position="left"
              :class="{
                'vote-active': voteAnswer.indexOf(item.id) > -1,
              }"
            >
              <div class="vote-title">
                {{ item.content }}
              </div>
            </van-checkbox>
          </van-checkbox-group>
        </template>
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
import { NavBar, RadioGroup, Radio, CheckboxGroup, Checkbox, Field } from 'vant'
import userInfo from '@/components/user-info'
import { getWjtpInfo } from '@/api/share.js'
import { openApp, isWx, txJssdk } from '@/utils/util.js'
export default {
  components: {
    userInfo,
    [NavBar.name]: NavBar,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [Field.name]: Field
  },
  data () {
    return {
      title: '',
      wjtpId: '',
      projectId: '',
      wjtp_info: {}, // 问卷投票基础信息
      voteList: {}, // 转化过的问题对象
      radioAnswer: '', // 投票单选值
      voteAnswer: [] // 投票选中值
    }
  },
  created () {
    this.isWx = isWx()
    this.wjtpId = this.$route.query.id
    this.projectId = this.$route.query.projectId
    this.getWjtpInfo()
    this.extinfo = `page_type=7&id=${this.wjtpId}`
  },
  methods: {
    // 获取投票详情
    getWjtpInfo () {
      getWjtpInfo({
        wjtpId: this.wjtpId,
        projectId: this.projectId
      }).then((res) => {
        const { wjtp_info, item } = res.data
        this.wjtp_info = wjtp_info
        this.title = this.wjtp_info.wjtp_type == '1' ? '问卷' : '投票'
        txJssdk({
          title: this.wjtp_info.title,
          desc: this.wjtp_info.remarks,
          imgUrl: `https://live.tosolomo.com/library/img/app_img/${this.wjtp_info.wjtp_type == '1' ? 'wenjuan' : 'toupiao'}.png`
        })
        // 遍历将可能答案为''的转为[]
        this.voteList = item.map((obj) => {
          // 多选，空则返回空数组
          if (obj.item_type === '2') {
            obj.answer = obj.answer ? obj.answer : []
          } else if (Array.isArray(obj.answer)) {
            // 单选和文本答案是数组，则只取第一个值
            obj.answer = obj.answer[0]
          }
          return obj
        })
        // 如果是投票只需取第一个问题
        if (this.wjtp_info.wjtp_type === '2') {
          this.voteList = this.voteList[0]
        }
      })
    },
    // 跳转到app
    goApp () {
      if (this.isWx) {
        return
      }
      openApp(this.extinfo)
    },
    handleLaunchFn (e) {
      console.log('success', e)
    },
    handleErrorFn (e) {
      this.$router.push({
        path: '/upload'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tf-bg-white {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
/deep/ .van-radio__icon,
/deep/ .van-checkbox__icon {
  height: 32px;
}
.tf-main-container {
  padding: 0 30px;
}
.tf-text-grey {
  font-size: 24px;
}
.qustion-header {
  padding: 30px 0;
  position: relative;
  border-bottom: 2px dashed #aaa;
  .tf-article-title {
    margin-top: 60px;
    margin-bottom: 30px;
  }
  .info-remarks {
    margin-top: 20px;
    font-size: 24px;
    color: @gray-7;
  }
  .people-number {
    font-size: 24px;
    color: @red-dark;
  }
  .people-number-end {
    color: @gray-7;
  }
  .finish-tag-box {
    position: absolute;
    top: 0;
    right: -30px;
    width: 160px;
    height: 150px;
  }
}

.vote-padding {
  padding-top: 30px;
}

.vote-box {
  margin-bottom: 30px;
  .vote-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 30px;
    color: @gray-7;
  }
  .vote-title {
    flex: 1;
    font-size: @font-size-lg;
    color: #222;
  }
  &.tf-row-space-between {
    padding: 30px;
    border: 2px solid #f0f0f0;
    border-radius: 10px;
  }
  &.vote-active {
    border: 2px solid #55b862;
  }
  /deep/ .van-radio__icon .van-icon,
  /deep/ .van-checkbox__icon .van-icon {
    width: 36px;
    height: 36px;
    background: #d4d4d4;
    border-color: #d4d4d4;
  }
  /deep/ .van-radio__icon--checked .van-icon,
  /deep/ .van-checkbox__icon--checked .van-icon {
    background-color: #55b862;
    border-color: #55b862;
  }
}

// 投票完成
.finish-vote-box {
  margin-bottom: 50px;
  .vote-result {
    margin-bottom: 18px;
  }
  .vote-title {
    position: relative;
    padding-left: 30px;
  }
  .tf-icon-gou {
    position: absolute;
    left: 0;
    top: 8px;
    font-size: 24px;
    color: #55b862;
  }
  /deep/ .van-progress {
    border-radius: 11px;
    .van-progress__portion {
      background: linear-gradient(90deg, #55b862, #63ce71);
    }
  }
}

// 问卷
.question-container {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  .question-box {
    margin-bottom: 40px;
    .question__text {
      margin-bottom: 20px;
      font-size: 30px;
      color: #222;
    }
    // 单选
    /deep/ .van-radio-group {
      border: 2px solid #f0f0f0;
      border-radius: 10px;
      .van-radio {
        min-height: 80px;
        padding-left: 30px;
        .van-radio__icon {
          height: 26px;
          .van-icon {
            width: 26px;
            height: 26px;
          }
        }
        .van-radio__icon--checked .van-icon {
          background: none;
          border: 6px solid #448fe4;
        }
        .van-radio__label {
          margin-left: 20px;
          font-size: 28px;
          color: #666;
        }
      }
      .van-radio + .van-radio {
        border-top: 2px solid #f0f0f0;
      }
    }
    // 多选
    /deep/ .van-checkbox-group {
      border: 2px solid #f0f0f0;
      border-radius: 10px;
      .van-checkbox {
        min-height: 80px;
        padding-left: 30px;
        .van-checkbox__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 26px;
          .van-icon {
            width: 26px;
            height: 26px;
            border-radius: 4px;
          }
        }
        .van-checkbox__icon--checked .van-icon {
          background: #448fe4;
          border-color: #448fe4;
          color: #fff;
          font-size: 24px;
          line-height: 1;
        }
        .van-checkbox__label {
          margin-left: 20px;
          font-size: 28px;
          color: #666;
        }
      }
      .van-checkbox + .van-checkbox {
        border-top: 2px solid #f0f0f0;
      }
    }
  }
  .question__textarea {
    padding: 19px 30px;

    border: 2px solid #f0f0f0;
    border-radius: 10px;
    /deep/ .van-field__control {
      font-size: 28px;
      color: #666;
    }
  }
}

// 投票、提交按钮
.confirm-btn-placeholder {
  height: 110px;
  display: flex;
  .confirm-btn {
    position: fixed;
    left: 20px;
    right: 20px;
    bottom: 30px;
    width: calc(100% - 40px);
    color: #fff;
    background-color: #448fe4;
    border: none;
  }
  .vote-btn {
    background-color: #55b862;
  }
  /deep/ .van-button--disabled {
    background: #aaaaaa;
  }
}
</style>
