<template>
  <div>
    <van-popup v-model="isShow">
      <div class="model-block">
        <div class="model-body">
          <div v-if="modelName" class="model-name">{{ modelName }}</div>
          <div v-if="modelTit" class="model-tit">{{ modelTit }}</div>
          <div v-if="modelSubTit" class="model-subtit">{{ modelSubTit }}</div>
        </div>
        <div class="model-btn tf-row-space-between">
          <div v-if="cancel" class="cancel-btn" @click="closeModel">{{ cancelTxt }}</div>
          <div v-if="yes" class="sure-btn" @click="confirmSure">{{ yesTxt }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  Popup
} from 'vant'
export default {
  components: {
    [Popup.name]: Popup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelName: {
      type: String,
      default: ''
    },
    modelTit: {
      type: String,
      default: ''
    },
    modelSubTit: {
      type: String,
      default: ''
    },
    cancelTxt: {
      type: String,
      default: '取消'
    },
    cancel: {
      type: Boolean,
      default: true
    },
    yesTxt: {
      type: String,
      default: '确认'
    },
    yes: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShow: this.value
    }
  },
  created () {
  },
  methods: {
    closeModel () {
      this.isShow = false
      this.$emit('cancel')
    },
    confirmSure () {
      this.isShow = false
      this.$emit('sure')
    }
  },
  watch: {
    value (val) {
      this.isShow = val
    },
    isShow (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-popup {
  border-radius: 10px;
}
.model-block {
  width: 560px;
  @flex-column();
  font-size: 30px;
  color: #333333;
  overflow: hidden;
  .model-body {
    @flex-column();
    justify-content: center;
    min-height: 232px;
  }
  .model-name {
    font-weight: 500;
    line-height: 36px;
    padding: 26px 0;
    text-align: center;
  }
  .model-tit {
    width: 380px;
    line-height: 1.5;
    margin: 20px auto;
    text-align: center;
    font-size: 30px;
  }
  .model-subtit {
    width: 440px;
    margin: 0 auto 50px;
    text-align: center;
    font-size: 24px;
    line-height: 1.5;
    color: @gray-7;
  }
  .model-btn {
    height: 88px;
    width: 480px;
    margin: 0 auto 40px;
    div {
      flex: 1;
      height: 100%;
      line-height: 88px;
      text-align: center;
      width: 220px;
      border-radius: 10px;
      font-size: 28px;
    }
    .cancel-btn {
      color: #AAAAAA;
      background: #F7F7F7;
    }
    .sure-btn {
      color: #FFFFFF;
      background: #FF6555;
    }
    div:nth-child(2) {
      margin-left: 40px;
    }
  }
}
</style>
