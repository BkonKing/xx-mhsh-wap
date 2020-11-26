<template>
  <div class="tf-row-space-between tf-flex-item">
    <div
      :class="[
        size ? `user-info__left-box-${size}` : 'user-info__left-box',
        { 'user-info__ellipsis': ellipsis }
      ]"
    >
      <img
        v-if="avatar"
        v-imageCach="avatar"
        class="tf-mr-base tf-avatar"
        :src="avatar"
        mode="aspectFit"
      />
      <img
        v-else
        class="tf-mr-base tf-avatar"
        src="@/assets/imgs/touxiang.png"
        mode="aspectFit"
      />
      <slot name="left">
        <div class="tf-space-around">
          <div class="user-info--name">{{ name || '暂无昵称' }}</div>
          <div v-if="time" class="user-info-time">{{ time }}</div>
        </div>
      </slot>
    </div>
    <div class="user-info__right-box">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
const stringProp = {
  type: String,
  default: ''
}
export default {
  props: {
    avatar: stringProp,
    name: stringProp,
    time: stringProp,
    size: {
      type: String,
      default: ''
    },
    ellipsis: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
.user-info__ellipsis.user-info__left-box {
  .tf-space-around {
    flex: 1;
    width: 1px;
    .user-info--name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.user-info--name {
  font-size: 30px;
  font-weight: 500;
  color: @text-color;
}
.user-info-time {
  font-size: 24px;
  color: @gray-7;
}
.user-info__left-box {
  @flex();
  flex: 1;
  height: 88px;
}
.user-info__left-box-m {
  @flex();
  flex: 1;
  height: 66px;
  .tf-avatar {
    width: 66px;
    height: 66px;
    border-radius: 50%;
  }
}
.user-info__right-box {
  flex-direction: row;
  align-items: center;
}
</style>
