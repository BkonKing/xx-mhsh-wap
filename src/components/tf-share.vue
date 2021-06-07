<template>
  <div v-show="value" class="mask-bg" @click="calcel(false)">
    <div class="mask-block" @click.stop="calcel(true)">
      <div class="mask-close">
        <img class="img-100" src="@/assets/img/close.png" @click.stop="calcel(false)" />
      </div>
      <div class="share-cont flex-center">
        <div @click.stop="shareFunc(1)" class="share-btn">
          <img src="@/assets/img/share_1.png" />
          <div>微信</div>
        </div>
        <div v-if="!pyqHide" @click.stop="shareFunc(2)" class="share-btn">
          <img src="@/assets/img/share_2.png" />
          <div>朋友圈</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tf-share',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    pyqHide: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    calcel (val) {
      this.$emit('input', val)
    },
    shareFunc (type) {
      this.$emit('input', false)
      this.$emit('share', type)
    }
  }
}
</script>
<style lang="less" scoped>
/*弹窗*/
.mask-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2030;
  background-color: rgba(0, 0, 0, 0.6);
}
.mask-block {
  height: 327px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 50px;
  border-radius: 0;
  background-color: #fff;
}
.mask-close {
  position: absolute;
  right: 20px;
  top: -80px;
  width: 70px;
  height: 70px;
  padding: 10px;
  z-index: 5;
}
.share-cont {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-top: 20px;
}
.share-btn {
  height: 188px;
  width: 250px;
  padding: 0 65px;
  display: flex;
  flex-wrap: wrap;
}
.share-btn div {
  font-size: 28px;
  color: #666666;
  text-align: center;
  height: 68px;
  line-height: 68px;
  width: 100%;
}
.share-btn img {
  width: 120px;
  height: 120px;
}
.mask-close {
  display: flex;
}
// .mask-btn div.mask-sure-btn {
//   width: 215px;
// }
</style>
