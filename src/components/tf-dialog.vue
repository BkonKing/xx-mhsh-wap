<template>
  <van-popup
    v-model="valueChild"
    :class="['tf-dialog-container', popupClass]"
    :close-on-popstate="true"
    :close-on-click-overlay="false"
    :style="{ top: top }"
    closeable
    safe-area-inset-bottom
    @click-overlay="close"
  >
    <div class="tf-dialog__wrapper-box">
      <!-- <span class="tf-icon tf-icon-guanbi1" @click="close"></span> -->
      <div class="tf-dialog">
        <div v-if="title" class="tf-dialog-title">
          {{ title }}
        </div>
        <div class="tf-dialog-content">
          <slot></slot>
        </div>
        <div v-if="showCancelButton || showConfirmButton" class="tf-dialog-footer">
          <div
            v-if="showCancelButton"
            class="tf-dialog-footer__btn tf-dialog-footer__btn--grey"
            @click="cancel"
          >
            {{ cancelButtonText }}
          </div>
          <div
            v-if="showConfirmButton"
            class="tf-dialog-footer__btn tf-dialog-footer__btn--orange"
            @click="confirm"
          >
            {{ confirmButtonText }}
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vant'
export default {
  components: {
    [Popup.name]: Popup
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '50%'
    },
    getContainer: {
      type: String,
      default: 'body'
    },
    popupClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      valueChild: this.value
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
      this.close()
    },
    close () {
      this.valueChild = false
      this.$emit('closed')
    },
    confirm () {
      this.$emit('confirm')
    }
  },
  watch: {
    value (val) {
      this.valueChild = val
    },
    valueChild (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
.tf-dialog-container {
  width: 560px;
  background: none;
  .tf-dialog {
    padding: 30px;
    border-radius: 10px;
    background-color: #fff;
    .tf-dialog-title {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 30px;
      font-size: 32px;
      font-weight: bold;
      color: #222222;
      line-height: 1;
    }
  }
}

// .tf-icon {
//   display: block;
//   text-align: right;
//   font-size: 50px;
//   color: #fff;
//   margin: 0 30px 30px 0;
// }

.tf-dialog-content {
  font-size: 28px;
  color: #222222;
  line-height: 46px;
}

.tf-dialog-footer {
  @flex();
}
.tf-dialog-footer__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 88px;
  line-height: 1;
  border-radius: 44px;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
}
.tf-dialog-footer__btn + .tf-dialog-footer__btn {
  margin-left: 30px;
}
.tf-dialog-footer__btn--grey {
  border: 2px solid #aaa;
  color: @gray-7;
}
.tf-dialog-footer__btn--orange {
  border: 2px solid #ff6555;
  background-color: #ff6555;
}
</style>

<style>
.tf-dialog-container .van-popup__close-icon {
  font-size: 34px;
  top: 28px;
  right: 28px;
}
</style>
