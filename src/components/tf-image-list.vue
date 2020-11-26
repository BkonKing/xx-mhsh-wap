<template>
  <van-grid
    class="tf-image-grid"
    :square="square"
    :border="false"
    :column-num="column"
    :gutter="10"
    style="margin-right: -10px !important;"
  >
    <van-grid-item v-for="(img, i) in list" :key="i">
      <van-image
        v-if="mode === 'show'"
        class="tf-image-item"
        fit="cover"
        :src="img"
        v-lazy="img"
        v-imageCach="img"
      />
      <template v-else>
        <van-image
          class="tf-image-item"
          fit="cover"
          :src="img | imgsrc(srcKey)"
          v-lazy="img"
          v-imageCach="img[srcKey] || img"
          @click="onclick(img, i)"
        />
        <div
          class="tf-image--shade"
          v-if="data.length > 3 && i === 2"
          @click="onclick(img, 2)"
        >
          <span>+{{ data.length - 3 }}</span>
        </div>
      </template>
      <slot name="tag" :img="img"></slot>
    </van-grid-item>
  </van-grid>
</template>

<script>
import { Grid, GridItem, Image, Lazyload } from 'vant'
export default {
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Image.name]: Image
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'list'
    },
    column: {
      type: Number,
      default: 3
    },
    square: {
      type: Boolean,
      default: true
    },
    srcKey: {
      type: String,
      default: ''
    }
  },
  methods: {
    onclick (data, index) {
      this.$emit('click', data)
    }
  },
  computed: {
    list () {
      if (this.mode !== 'show') {
        const len = this.data.length
        return len > 3 ? this.data.slice(0, 3) : this.data
      }
      return this.data
    }
  },
  directives: {
    lazy: Lazyload
  },
  filters: {
    imgsrc (value, srcKey) {
      if (typeof value === 'string') {
        return value
      } else {
        return value[srcKey]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tf-image-grid {
  @relative();
  padding-left: 0 !important;
  /deep/ .van-grid-item__content--square {
    padding: 0;
  }
}
.tf-image-item {
  width: 100%;
  height: 100%;
}
.tf-image--shade {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #000000;
  opacity: 0.6;
  top: 0;
  left: 0;
  text-align: center;
  color: #fff;
  font-size: 54px;
}
</style>
