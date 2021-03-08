<template>
  <div class="app-body">
    <div class="body-block">
      <div class="order-bar bar-white">
        <van-nav-bar
          title="商品详情"
          fixed
          :border="false"
          placeholder
        ></van-nav-bar>
      </div>
      <div class="scroll-body">
      <div class="banner">
        <van-swipe :autoplay="4000" @change="onChange">
          <van-swipe-item v-for="(item, index) in swiperArr" :key="index">
            <img class="img-100" :src="item" />
          </van-swipe-item>
          <div class="custom-indicator flex-center" slot="indicator">
            {{ current + 1 }}/{{swiperArr.length}}
          </div>
        </van-swipe>
      </div>
      <template v-if="infoData.goods_type == 3">
        <div :class="[infoData.ollage_info.is_start == 1 ? 'flash-session-bg' : '','flash-session']">
          <div class="flash-limit">
            <div class="flash-limit-l"></div>
            <div class="flash-limit-m">限量{{infoData.z_stock}}件</div>
            <div class="flash-limit-r"></div>
          </div>
          <div v-if="infoData.ollage_info.is_start" class="flash-time">距离结束还剩<van-count-down ref="countDown" :auto-start="true" :time="infoData.ollage_info.end_time*1000-newTime" @finish="finish">
              <template v-slot="timeData">{{ 10 > timeData.hours ? '0' + timeData.hours : timeData.hours }}:{{ 10 > timeData.minutes ? '0' + timeData.minutes : timeData.minutes }}:{{ 10 > timeData.seconds ? '0' + timeData.seconds : timeData.seconds }}
              </template>
            </van-count-down></div>
          <div v-else class="flash-time">{{infoData.ollage_info.start_time_txt}}</div>
        </div>
      </template>

      <div class="goods-info goods-session">
        <div class="goods-name">{{infoData.goods_name}}</div>

        <template v-if="infoData.pay_type == 1">
          <div class="goods-price"><span class="font-24">￥</span>{{infoData.sell_price/100}} <span v-if="infoData.original_price && infoData.original_price!='0'" class="font-24 color-8f8f94 font-normal through-line">￥{{infoData.original_price/100}}</span></div>
          <div class="happy-block"><div class="happy-coin">使用 {{infoData.credits/10}} 幸福币可兑换</div></div>
        </template>
        <template v-else>
          <div v-if="infoData.goods_type<3" class="goods-price"><span class="font-24">￥</span>{{infoData.sell_price/100}} <span v-if="infoData.original_price && infoData.original_price!='0'" class="font-24 color-8f8f94 font-normal through-line">￥{{infoData.original_price/100}}</span></div>

          <!-- 闪购 -->
          <div v-else-if="infoData.dq_collage_type == 1" class="goods-price activity-flash-price"><span class="font-30 color-209cff">限时闪购 </span><span class="font-24 color-209cff">￥</span>{{infoData.sell_price/100}} <span class="font-24 color-8f8f94 font-normal through-line">￥{{infoData.original_price/100}}</span></div>
          <!-- 拼单 -->
          <div v-else class="price-block">
            <div class="price-left">
              <div class="activity-limit-price activity-flash-price">限时闪购</div>
              <div class="activity-now-price activity-pay-price">拼单价</div>
            </div>
            <div class="price-right">
              <div class="activity-flash-price"><span class="font-24">￥</span>{{infoData.flash_price/100}}<div class="activity-old-price">￥{{infoData.original_price/100}}</div></div>
              <div class="activity-pay-price"><span class="font-24">￥</span>{{infoData.sell_price/100}}</div>
            </div>
          </div>
          <div v-if="infoData.credits && infoData.credits!='0'" class="happy-block"><div class="happy-coin">幸福币可抵￥{{infoData.credits/100}}</div></div>
        </template>
      </div>

      <div v-if="infoData.goods_type == 3 && infoData.dq_collage_type == 2" class="goods-session collage-session">
        <div class="flex-between collage-header"><span>拼单</span>(新老用户均可参加)</div>
        <div class=" p-30">
          <div class="flex-between collage-step">
            <div>①选择商品</div>
            <div class="collage-step-icon"></div>
            <div>②支付开团</div>
            <div class="collage-step-icon"></div>
            <div>③分享好友</div>
            <div class="collage-step-icon"></div>
            <div>④成功(失败退款)</div>
          </div>
          <div v-if="collageList.length > 0" class="collage-total flex-between">
            <div class="color-8f8f94">以下小伙伴正在发起拼单，可直接参与</div>
            <div class="color-222">{{collageList[0].collage_num}}人拼单</div>
          </div>
          <div v-if="collageList.length > 0" class="collage-list">
            <template v-for="(item, index) in collageList">
              <div class="collage-item flex-between" :key="index">
                <div class="collage-user flex-align-center">
                  <div v-for="(val, k) in item.user_arr" :key="k" class="collage-user-info">
                    <img v-if="val.avatar" class="collage-user-photo" :src="val.avatar" />
                    <img v-else class="collage-user-photo" src="@/assets/imgs/touxiang.png" />
                    <div class="collage-user-name p-nowrap">{{val.nickname}}</div>
                  </div>
                  <div v-if="item.user_arr.length > 5" class="collage-user-info">
                    <div class="collage-mask flex-center"><span></span><span></span><span></span></div>
                    <img v-if="val.avatar" class="collage-user-photo" :src="val.avatar" />
                    <img v-else class="collage-user-photo" src="@/assets/imgs/touxiang.png" />
                  </div>
                </div>
                <div v-if="item.is_pay" class="collage-item-right">
                  <div class="collage-btn yq-btn">邀请好友</div>
                  <div class="collage-need-num">还差 <span class="color-eb5841">{{item.need_num}}</span> 人</div>
                </div>
                <div v-else class="collage-item-right">
                  <div @click="showFunc('collage',item.f_collage_order_project_id)" class="collage-btn pd-btn">一起拼单</div>
                  <div class="collage-need-num">还差 <span class="color-eb5841">{{item.need_num}}</span> 人</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div v-if="infoData.goods_type == 3" class="common-list goods-session" @click="ensureFunc">
        <div class="common-item">
          <div class="font-26 color-222">基础保障</div>
          <div class="link-icon">
            <img class="img-100" src="@/assets/img/right.png" />
          </div>
        </div>
      </div>

      <div class="goods-tip goods-session flex-align-center">
        <div v-if="infoData.goods_type == 3" @click="ensureFunc" class="tip-item">
          <div class="tip-left logistics-left">
            保障
          </div>
          <div class="tip-right color-222">
            假一赔二 · 破损补寄 · 15天保价
          </div>
          <div class="link-icon">
            <img class="img-100" src="@/assets/img/right.png" />
          </div>
        </div>
        <div class="tip-item">
          <div class="tip-left logistics-left">
            配送
          </div>
          <div v-if="infoData.distribution_type == 0 || infoData.distribution_type == 2" class="tip-right color-222">
            {{infoData.distribution_type_name}} · {{infoData.freight ? '运费'+(infoData.freight)+'元' : '免邮'}}
          </div>
          <div v-else-if="infoData.distribution_type == 1" class="tip-right color-222 p-nowrap">
            {{infoData.distribution_type_name}}({{infoData.take_address}})
          </div>
        </div>
        <div v-if="infoData.tips_arr && infoData.tips_arr.length" @click="rightShow && tipToggle()" class="tip-item">
          <div class="tip-left logistics-left">
            说明
          </div>
          <div class="tip-right color-222 p-nowrap">
            <template v-for="(item, index) in infoData.tips_arr">{{item}} {{index!=infoData.tips_arr.length-1 ? '·' : ''}} </template>
          </div>
          <div v-if="rightShow" class="link-icon">
            <img class="img-100" src="@/assets/img/right.png" />
          </div>
        </div>
        <div ref="tipItem" class="tip-item hide">
          <div class="flex-center">
            <div class="tip-left logistics-left">
              说明
            </div>
            <div ref="tipTxt" class="tip-hide color-222">
              <template v-for="(item, index) in infoData.tips_arr">{{item}} {{index!=infoData.tips_arr.length-1 ? '·' : ''}} </template>
            </div>
          </div>
        </div>
      </div>

      <div class="goods-cont goods-session">
        <div class="goods-cont-tit">商品详情</div>
        <div class="goods-detail-cont" v-html="infoData.content"></div>
      </div>
      </div>

      <!-- <div class="fixed-empty"></div> -->
      <div :class="[isWx ? '' : 'flex-align-center','bottom-fixed operate-session']">
        <template v-if="isWx">
          <template v-if="f_orderid > 0">
            <wx-open-launch-app
              id="id"
              class="launch-btn"
              appid="wx7245d2cb43a093db"
              :extinfo="extinfo"
              @error="handleErrorFn"
              @launch="handleLaunchFn"
              >
              <script type="text/wxtag-template">
                <style>
                .app-btn {width: 100%;height: 100%;font-size: 0;}
                div.app-btn img {width: 100%;height: auto;}
                </style>
                <div class="app-btn"><img src="https://live.tosolomo.com/library/img/app_img/btn_02.png" /></div>
              </script>
            </wx-open-launch-app>
          </template>
          <template v-else>
            <wx-open-launch-app
              id="id"
              class="launch-btn"
              appid="wx7245d2cb43a093db"
              :extinfo="extinfo"
              @error="handleErrorFn"
              @launch="handleLaunchFn"
              >
              <script type="text/wxtag-template">
                <style>
                .app-btn {width: 100%;height: 100%;font-size: 0;}
                div.app-btn img {width: 100%;height: auto;}
                </style>
                <div class="app-btn"><img src="https://live.tosolomo.com/library/img/app_img/btn_01.png" /></div>
              </script>
            </wx-open-launch-app>
          </template>
        </template>
        <template v-else>
          <a :href="'tel: '+infoData.customerServiceHotline" class="kf-btn flex-center">
            <img src="@/assets/img/icon_07.png" />
          </a>
          <div @click="goApp" v-if="infoData.pay_type == 0" class="cart-btn flex-center">
            <img src="@/assets/img/icon_06.png" />
            <div v-if="cart_num > 0" class="cart-num">{{cart_num}}</div>
          </div>
          <template v-if="infoData.is_sell_out > 0">
            <div class="add-btn btn-disabled">{{infoData.sell_out_text}}</div>
          </template>
          <template v-else>
            <template v-if="infoData.pay_type == 0">
              <template v-if="infoData.goods_type < 3">
                <div class="add-btn" @click="showFunc('cart')">加入购物车</div>
                <div class="buy-btn" @click="showFunc('buy')">立即购买</div>
              </template>
              <template v-else>
                <template v-if="infoData.ollage_info.is_start">
                  <template v-if="infoData.dq_collage_type == 1">
                    <div class="buy-btn btn-linear" @click="showFunc('buy')">立即购买</div>
                  </template>
                  <template v-else>
                    <template v-if="f_orderid && infoData.f_order_ollage_info && (!infoData.order_ollage_info || infoData.order_ollage_info.status!=0)">
                      <div class="count-time">剩余<van-count-down ref="countDown" :auto-start="true" :time="infoData.ollage_info.end_time*1000-newTime" @finish="finish">
                          <template v-slot="timeData">{{ 10 > timeData.hours ? '0' + timeData.hours : timeData.hours }}:{{ 10 > timeData.minutes ? '0' + timeData.minutes : timeData.minutes }}:{{ 10 > timeData.seconds ? '0' + timeData.seconds : timeData.seconds }}
                          </template>
                        </van-count-down>结束</div>
                      <div @click="showFunc('collage')" class="buy-btn btn-linear">一起拼单</div>
                    </template>
                    <template v-else>
                      <template v-if="my_ing_info">
                        <div class="count-time">剩余<van-count-down ref="countDown" :auto-start="true" :time="infoData.ollage_info.end_time*1000-newTime" @finish="finish">
                          <template v-slot="timeData">{{ 10 > timeData.hours ? '0' + timeData.hours : timeData.hours }}:{{ 10 > timeData.minutes ? '0' + timeData.minutes : timeData.minutes }}:{{ 10 > timeData.seconds ? '0' + timeData.seconds : timeData.seconds }}
                          </template>
                        </van-count-down>结束</div>
                        <div class="buy-btn btn-linear">邀请好友</div>
                      </template>
                      <template v-else>
                        <div class="add-btn" @click="showFunc('flash')">单独购买￥{{infoData.flash_price/100}}</div>
                        <div class="buy-btn" @click="showFunc('collage')">发起拼单￥{{infoData.sell_price/100}}</div>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <div class="add-btn" @click="showFunc('cart')">加入购物车</div>
                  <div v-if="!infoData.is_set" class="buy-btn">开抢提醒</div>
                  <div v-else class="buy-btn btn-disabled">已设提醒</div>
                </template>
              </template>
            </template>
            <template v-else>
              <div class="add-btn credits-info"><img src="@/assets/img/icon_24.png" />{{ableCredits}}</div>
              <div class="buy-btn btn-linear" @click="showFunc('buy')" data-type="buy">立即兑换</div>
            </template>
          </template>
        </template>
      </div>

      <div v-show="isShow" class="public-mask  bottom-fixed">
        <div class="public-dclose" @click="showFunc()"><img class="img-100" src="@/assets/img/close.png" /></div>
        <div class="shops-params" v-if="skuList.length > 0">
          <div class="params-goods-info">
            <div class="params-goods-left">
              <img class="img-100" :src="skuList[typeVal].specs_img" data-src="" />
            </div>
            <div class="params-goods-right">
              <div>
                <div class="goods-name p-nowrapm">{{infoData.goods_name}}</div>
                <template v-if="infoData.goods_type<3">
                  <div class="goods-price">
                    <span class="font-24">￥</span>{{skuList[typeVal].s_price/100}}
                    <span v-if="skuList[typeVal].y_price && skuList[typeVal].y_price!='0'" class="font-24 color-8f8f94 font-normal through-line">￥{{skuList[typeVal].y_price/100}}</span>
                  </div>
                </template>
                <template v-else>
                  <div v-if="is_collage" class="goods-price">
                    <span class="font-24">￥</span>{{skuList[typeVal].s_price/100}}
                    <span v-if="skuList[typeVal].y_price && skuList[typeVal].y_price!='0'" class="font-24 color-8f8f94 font-normal through-line">￥{{skuList[typeVal].y_price/100}}</span>
                  </div>
                  <div v-else class="goods-price">
                    <span class="font-24">￥</span>{{infoData.ollage_info.is_start == 1 ? skuList[typeVal].o_price/100 : skuList[typeVal].s_price/100}}
                    <span v-if="skuList[typeVal].y_price && skuList[typeVal].y_price!='0'" class="font-24 color-8f8f94 font-normal through-line">￥{{skuList[typeVal].y_price/100}}</span>
                  </div>
                </template>
              </div>
              <template v-if="infoData.pay_type == 1">
                <div class="happy-block"><div class="happy-coin"><img src="@/assets/img/icon_20.png" />{{skuList[typeVal].credits/10}}</div></div>
              </template>
              <template v-else>
                <template v-if="infoData.goods_type<3">
                  <div v-if="skuList[typeVal].credits!=0" class="happy-block"><div class="happy-coin">幸福币可抵￥{{skuList[typeVal].credits/100}}</div></div>
                </template>
                <template v-else>
                  <div class="happy-block" v-if="(is_collage&&skuList[typeVal].p_credits!=0) || (!is_collage && infoData.ollage_info.is_start==1&&skuList[typeVal].o_credits!=0) || (infoData.ollage_info.is_start!=1&&skuList[typeVal].credits!=0)"><div class="happy-coin">幸福币可抵￥{{is_collage ? skuList[typeVal].p_credits/100 : (infoData.ollage_info.is_start == 1 ? skuList[typeVal].o_credits/100 : skuList[typeVal].credits/100)}}</div></div>
                </template>
              </template>
            </div>
          </div>

          <div class="shops-dlist">
            <div class="shops-ditem">
              <div class="shops-dtit">规格</div>
              <div class="doption-list">
                <div v-for="(item, index) in skuList" :key="index" :class="[typeVal == index ? 'active' : '','shops-doption']" @click="typeFunc(index)">{{item.specs_name}}</div>
              </div>
            </div>
            <div class="shops-ditem">
              <div class="shops-dtit">数量</div>
              <div class="goods-num-count">
                <div class="goods-btn-block">
                  <div class="goods-btn goods-sub" @click.stop="countTab(-1)" data-types="-1">-</div>
                  <div class="goods-num">{{skuList[typeVal].count}}</div>
                  <div :class="[skuList[typeVal].notAdd ? 'not-add' : '','goods-btn goods-add']" @click.stop="countTab(1)">+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="submit-btn" @click="addCar()">{{infoData.pay_type == 1 ? '确认兑换' : '确认'}}</div>
      </div>
      <div v-show="isShow" class="mask-bg" catchtouchmove="true" @click="showFunc()"></div>

      <div v-show="ensureShow" class="public-mask ensure-mask bottom-fixed">
        <div class="public-dclose" @click="ensureFunc"><img class="img-100" src="@/assets/img/close.png" /></div>
        <div class="public-header">基础保障</div>
        <div class="ensure-list">
          <div class="ensure-item">
            <div class="ensure-tit flex-align-center"><img src="@/assets/img/icon_03.png" />假一赔二</div>
            <div class="ensure-cont">正品保障，假一赔二</div>
          </div>
          <div class="ensure-item">
            <div class="ensure-tit flex-align-center"><img src="@/assets/img/icon_04.png" />破损 补寄</div>
            <div class="ensure-cont">签收48小时(食品24小时)内，商品破损/漏液并提供有效凭证的，24小时内响应补寄事宜。</div>
          </div>
          <div class="ensure-item">
            <div class="ensure-tit flex-align-center"><img src="@/assets/img/icon_05.png" />15天保价</div>
            <div class="ensure-cont">活动结束后15天内若发生降价，可举证申请差价双倍赔付。</div>
          </div>
        </div>
        <div class="submit-btn" @click="ensureFunc">确认</div>
      </div>
      <div v-show="ensureShow" class="mask-bg" catchtouchmove="true" @click="ensureFunc"></div>
      <div v-show="tipShow" class="public-mask ensure-mask bottom-fixed">
        <div class="public-dclose" @click="tipToggle"><img class="img-100" src="@/assets/img/close.png" /></div>
        <div class="public-header">优惠限制</div>

        <div class="common-list tip-list">
          <div v-for="(item,index) in infoData.tips_arr" :key="index" :class="[index == 0 ? 'common-item-first' : '' , 'common-item']">
            <div class="common-item-left">{{item}}</div>
          </div>
        </div>
        <div class="submit-btn" @click="tipToggle">确认</div>
      </div>
      <div v-show="tipShow" class="mask-bg" catchtouchmove="true" @click="tipToggle"></div>
      <remind-swal
      :show-swal="showSwal"
      :remind-tit="remindTit"
      @closeSwal="closeSwal"
      @sureSwal="sureSwal()"></remind-swal>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Icon, ImagePreview, NavBar, CountDown, Toast } from 'vant'
import remindSwal from '@/components/remind-swal'
import { getGoodsDetail } from '@/api/share.js'
import { openApp, isWx, txJssdk } from '@/utils/util.js'
export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon,
    [ImagePreview.name]: ImagePreview,
    [NavBar.name]: NavBar,
    [CountDown.name]: CountDown,
    [Toast.name]: Toast,
    remindSwal
  },
  data () {
    return {
      windowHeight: document.documentElement.clientHeight,
      time: 11 * 60 * 60 * 1000,
      newTime: '',
      showSwal: false, // 提醒弹窗
      remindTit: '提醒消息将在活动开始时通知您', // 提醒标题

      shop_id: '', // 商品id
      skuList: [], // 商品规格
      isShow: false, // 商品规格弹窗是否显示
      btnIsShow: true, // 商品加入礼包按钮是否显示
      is_sell_out: false, // 商品是否售罄
      typeVal: 0, // 当前选中的商品规格index
      ensureShow: false, // 基础保障弹窗
      tipShow: false, // 商品提示说明弹窗
      is_collage: true, // 是否拼单(拼单专用 true拼单 false 单独购买)
      f_orderid: '', // 拼单分享 分享人订单id(f_collage_order_project_id)
      f_id: '', // 参与的拼单 id
      specs_id: '', // 拼单分享 分享商品规格id
      ollage_ing_info: '', // 当前的拼单信息
      my_ing_info: '', // 我发起的拼单信息
      cart_num: '', // 购物车商品数
      goods: { // 购物车
        goods_id: '',
        goods_name: '',
        sign_url: '',
        count: 1, // 数量
        goods_type: 1, // 类型 1正常  2特价  3闪购
        special_bargain_type: '', // 1专区 2特价
        y_specs_img: '', // 规格图
        specs_img: '', // 规格图
        specs_name: '', // 规格名称
        specs_id: '', // 规格id
        s_price: '', // 售价
        pay_price: '', // 售价
        y_price: '', // 规格原价
        credits: '', // 规格幸福币
        stock: 0, // 库存
        max_buy: 0, // 限制最大购买数
        is_checked: true, // 是否选中（购物车中）
        tip_text: ''
      },
      cart_counts: 0, // 购物车中这个商品的总数量
      collageList: [], // 闪购拼单列表

      goodsId: '', // 商品id
      infoData: '', // 商品数据
      btn_type: 'cart', // cart点击了加入购物 buy点击了立即购买
      current: 0,
      ableCredits: '',
      rightShow: false,

      // show: false,
      swiperArr: [], // 轮播图
      skuPicArr: [], // 规格图
      extinfo: '',
      isWx: false
    }
  },
  created () {
    this.goodsId = this.$route.query.id
    this.f_orderid = this.$route.query.f_id ? this.$route.query.f_id : ''
    this.extinfo = 'page_type=1&id=' + this.goodsId + '&f_id=' + this.f_orderid
    this.isWx = isWx()
    txJssdk()
    this.getData()
  },
  watch: {
    infoData (value) {
      this.$nextTick(() => {
        if (value.tips_arr.length > 0) {
          var itemWidth = this.$refs.tipItem.offsetWidth
          var tipWidth = this.$refs.tipTxt.offsetWidth
          if (tipWidth / itemWidth > 620 / 750) {
            this.rightShow = true
          }
        }
      })
    }
  },
  methods: {
    getData () {
      getGoodsDetail({
        goods_id: this.goodsId,
        f_id: this.f_orderid
      }).then(res => {
        if (res.success) {
          this.infoData = res.data
          this.ableCredits = res.ok_credits
          this.swiperArr = res.data.pic_url_arr
          this.skuList = res.data.formats
          this.skuList.forEach((res2) => {
            this.$set(res2, 'count', 1)
            this.skuPicArr.push(res2.specs_img)
          })
          this.newTime = parseInt(new Date().getTime())

          this.goods.goods_id = res.data.id
          this.goods.goods_name = res.data.goods_name
          this.goods.goods_type = res.data.goods_type
          this.goods.tip_text = res.data.tip_text
          if (res.data.goods_type === 3) {
            this.goods.sign_url = res.data.sign_url
            if (this.is_collage) {
              this.collageList = res.data.f_collage_order_arr ? res.data.f_collage_order_arr : []
            }
            if (res.data.user_order_project_info) {
              this.my_ing_info = res.data.user_order_project_info
            }
          }
          if (res.data.goods_type === 2) {
            this.goods.special_bargain_type = res.data.special_bargain_type
          }
          // if(this.infoData.goods_type == 3 && !this.is_collage){
          //   this.goods.s_price = this.skuList[index].o_price
          //   this.goods.pay_price = this.skuList[index].o_price
          // }
          this.typeFunc(0)
        }
      })
    },
    onChange (index) {
      this.current = index
    },

    /*
    *显示/隐藏弹窗(规格)
    */
    showFunc (type = '', f_orderid = '') {
      this.goApp()
      // if (type && type === 'collage') {
      //   this.is_collage = true
      // } else {
      //   this.is_collage = false
      // }
      // // this.is_collage = (type && type === 'collage' ? true : false)
      // this.btn_type = type && (type === 'buy' || type === 'collage' || type === 'flash') ? 'buy' : 'cart'
      // this.f_id = f_orderid

      // if (this.infoData.goods_type == 3 && this.infoData.ollage_info.is_start == 1) {
      //   if (this.is_collage) {
      //     this.goods.s_price = this.skuList[this.typeVal].p_price
      //     this.goods.pay_price = this.skuList[this.typeVal].p_price
      //     this.goods.credits = this.skuList[this.typeVal].p_credits
      //   } else {
      //     this.goods.s_price = this.skuList[this.typeVal].o_price
      //     this.goods.pay_price = this.skuList[this.typeVal].o_price
      //   }
      // } else {
      //   this.goods.goods_type = 1
      // }

      // this.isShow = !this.isShow
    },
    /*
    *显示/隐藏弹窗（基础保障）
    */
    ensureFunc: function (e) {
      this.ensureShow = !this.ensureShow
    },
    /*
    *显示/隐藏弹窗（商品提示）
    */
    tipToggle: function (e) {
      this.tipShow = !this.tipShow
    },
    /*
    *选中规格
    */
    typeFunc (index) {
      const nowSku = this.skuList[index]
      this.typeVal = index
      if (nowSku) {
        this.goods.y_specs_img = nowSku.y_specs_img
        this.goods.specs_img = nowSku.specs_img
        this.goods.specs_name = nowSku.specs_name
        this.goods.specs_id = nowSku.specs_id
        this.goods.s_price = nowSku.s_price
        this.goods.pay_price = nowSku.s_price
        this.goods.y_price = nowSku.y_price ? nowSku.y_price : 0
        this.goods.credits = nowSku.credits
        this.goods.stock = nowSku.stock
        nowSku.count = nowSku.count ? nowSku.count : 1
        nowSku.notAdd = nowSku.notAdd ? nowSku.notAdd : false
      }
    },
    /*
    *商品数量加减
    */
    countTab (types) {
      const nowSku = this.skuList[this.typeVal]
      nowSku.stock = parseInt(nowSku.stock)
      if (nowSku.notAdd && types == 1) return
      if (nowSku.stock > this.goods.max_buy) {
        nowSku.stock = this.goods.max_buy
      }
      if (nowSku.count + types >= nowSku.stock) {
        if (nowSku.count + types == nowSku.stock) {
          nowSku.count = parseInt(nowSku.count) + types
        }
        console.log(nowSku.count, nowSku.stock)
        nowSku.notAdd = true
        return
      }
      if (nowSku.count + types > 0) {
        nowSku.count = parseInt(nowSku.count) + types
        nowSku.notAdd = false
      }
    },
    /**
     * 加入购物车
     */
    addCar: function (e) {
      this.isShow = false
    },
    /**
     * 拼单倒计时结束
    */
    overFunc: function () {

    },
    // 倒计时开始
    start () {
      this.$refs.countDown.start()
    },
    // 倒计时暂停
    pause () {
      this.$refs.countDown.pause()
    },
    // 倒计时结束
    finish () {
      this.getData()
    },
    closeSwal (data) {
      if (data == 1) {
        this.showSwal = true
      } else {
        this.showSwal = false
      }
    },
    handleLaunchFn (e) {
      // alert(JSON.stringify(e.detail))
      console.log('success', e)
    },
    handleErrorFn (e) {
      console.log('fail', e.detail)
      this.$router.push({
        path: '/upload'
      })
    },
    // 跳转到app
    goApp () {
      // const params = {
      //   id: this.goodsId,
      //   f_id: this.f_orderid
      // }
      const params = 'page_type=1&id=' + this.infoData.id + '&f_id=' + this.f_orderid
      openApp(params)
    }
  },
  beforeRouteLeave (to, from, next) {
    next()
  }
}
</script>

<style scoped  src="../styles/life.css"></style>
<style scoped>
.app-body {
  background-color: #f2f2f4;
  font-size: 28px;
}
.scroll-body {
  max-height: calc(100% - 186px);
  overflow-y: auto;
  overflow-x: hide;
}
/*轮播*/
.banner {
  width: 100%;
  height: 750px;
  position: relative;
}
.banner .van-swipe {
  height: 100%;
}
.banner .van-swipe-item img {
  width: 100%;
  height: 100%;
}
.custom-indicator {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 90px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 24px;
}

.goods-session {
  background-color: #fff;
  margin-bottom: 30px;
}
.scroll-body .goods-session:last-child {
  margin-bottom: 0;
}
.goods-info {
  padding: 30px 30px 40px;
}
.goods-name {
  color: #222;
  font-size: 34px;
  line-height: 52px;
  font-weight: bold;
  text-align: center;
}
.goods-price {
  line-height: 92px;
  margin-top: 10px;
  color: #eb5841;
  font-size: 42px;
  text-align: center;
  font-weight: bold;
}
.font-normal {
  font-weight: normal;
}
.happy-block {
  height: 60px;
  display: flex;
}
.happy-coin {
  display: flex;
  align-items: center;
  height: 60px;
  color: #ffa110;
  font-size: 24px;
  padding: 0 28px;
  background-color: #fff5e7;
  margin: 0 auto;
  border-radius: 30px;
}
.happy-coin img {
  width: 28px;
  height: 28px;
  margin-right: 8px;
}

.link-icon {
  width: 15px;
  height: 26px;
}
.goods-tip {
  padding: 20px 0;
  color: #8f8f94;
  font-size: 26px;
  min-height: 100px;
  flex-wrap: wrap;
}
.tip-item {
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
}
.tip-hide {
  white-space: nowrap;
  line-height: 44px;
}
.hide {
  height: 1px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
.tip-left {
  width: 100px;
  line-height: 44px;
  flex-shrink: 0;
}
.tip-left img {
  width: 28px;
  height: 28px;
}
.tip-right {
  line-height: 44px;
  min-width: 605px;
  max-width: 620px;
}
.logistics-left {
  padding-left: 30px;
}

.goods-detail-cont {
  display: flex;
  flex-direction: column;
}
.goods-cont-tit {
  line-height: 110px;
  text-align: center;
  font-size: 34px;
  color: #383838;
}

/*基础保障*/
.ensure-tit {
  font-size: 30px;
  height: 44px;
}
.ensure-tit img {
  width: 44px;
  height: 44px;
  margin-right: 20px;
}
.ensure-cont {
  padding: 12px 0 30px 64px;
  line-height: 40px;
  color: #8f8f94;
  font-size: 26px;
}
.submit-btn {
  color: #fff;
  font-size: 30px;
}
.tip-list {
  margin-bottom: 60px;
  border-bottom: 1px solid #f0f0f0;
}

/* 操作 start */
.fixed-empty {
  height: 68px;
}
.operate-session {
  display: flex;
  height: 98px;
  z-index: 20;
  background-color: #fff;
  position: absolute;
  align-items: flex-start !important;
}
.kf-btn,.cart-btn {
  width: 100px;
  height: 100%;
  position: relative;
}
.cart-num {
  position: absolute;
  top: 6px;
  left: 39px;
  min-width: 34px;
  height: 34px;
  line-height: 34px;
  border-radius: 17px;
  background-color: #eb5841;
  text-align: center;
  color: #fff;
  font-size: 24px;
  padding: 0 5px;
}
.operate-session img {
  width: 44px;
  height: 44px;
}
.cart-btn img {
  margin-left: -16px;
}
.add-btn,.buy-btn {
  width: 275px;
  height: 100%;
  flex-grow: 1;
  text-align: center;
  line-height: 98px;
  color: #fff;
  font-size: 30px;
}
.add-btn {
  background-color: #ffc017;
}
.buy-btn {
  background-color: #eb5841;
}
.buy-btn.btn-linear {
   background-image: linear-gradient(to right, #f9856b, #eb5841);
}
div.btn-disabled {
  background-color: #aaa;
}
.credits-info {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: bold;
  color: #eb5841;
  background-color: #fff;
}
.credits-info img {
  width: 36px;
  height: 36px;
  margin-right: 8px;
}

/*规格*/
.shops-params {
  position: relative;
  padding: 40px 0 0 0;
  min-height: 180px;
  background-color: #fff;
}
.params-goods-info {
  height: 230px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.params-goods-left {
  width: 230px;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  background-color: #f4f4f4;
}
.params-goods-right {
  width: 431px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.params-goods-right .goods-name {
  font-size: 26px;
  line-height: 40px;
  text-align: left;
  margin-top: 6px;
}
.params-goods-right .goods-price {
  line-height: 76px;
  margin: 0 0 8px 0;
  font-size: 42px;
  text-align: left;
}
.params-goods-right .happy-coin {
  margin: 0;
}
.shops-dlist {
  max-height: 600px;
  overflow-y: auto;
}
.shops-ditem {
  overflow: hidden;
}
.shops-dtit {
  color: #222;
  padding-top: 10px;
  line-height: 86px;
}
.doption-list {
  display: flex;
  flex-wrap: wrap;
}
.shops-doption {
  color: #666;
  height: 66px;
  border: 2px solid #f2f2f4;
  line-height: 62px;
  margin: 0 20px 20px 0;
  background-color: #f2f2f4;
  border-radius: 4px;
  padding: 0 30px;
}
.shops-doption.active {
  background-color: #fdeeec;
  color: #eb5841;
  border-color: #eb5841;
}
.goods-num-count {
  display: flex;
  margin-bottom: 60px;
}
.goods-btn-block {
  height: 44px;
  border-radius: 2px;
  color: #aaa;
  font-size: 24px;
  display: flex;
}
.goods-btn {
  width: 47px;
  height: 100%;
  border: 1.3px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}
.not-add.goods-btn {
  background-color: #eee;
}
.goods-num {
  float: left;
  width: 58px;
  height: 100%;
  border-top: 1.3px solid #aaa;
  border-bottom: 1.3px solid #aaa;
  box-sizing: border-box;
  min-height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #222;
}

/* 闪购、拼单 */
.flash-session {
  height: 98px;
  position: relative;
  background: #fff url('../assets/img/flash_01.png') center center/100% 100%;
}
.flash-session-bg.flash-session {
  background: #fff url('../assets/img/flash_03.png') center center/100% 100%;
}
.flash-session.flash-over {
  background: #fff url('../assets/img/flash_02.png') center center/100% 100%;
}
.flash-over div {
  color: #333;
  font-weight: bold;
  padding-left: 192px;
  text-align: center;
  line-height: 98px;
}
.flash-limit {
  /* height: 58px; */
  position: absolute;
  left: 200px;
  top: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.flash-limit-m {
  line-height: 58px;
  background-color: #209cff;
  padding: 0 6px;
  min-width: 126px;
  color: #fff;
  font-size: 24px;
  text-align: center;
}
.flash-limit-l,.flash-limit-r {
  width: 0;
  height: 0;
  border-style: solid;
}
.flash-limit-l {
  border-width: 29px 12px 29px 0;
  border-color: transparent #209cff transparent transparent;
}
.flash-limit-r {
  border-width: 29px 0 29px 12px;
  border-color: transparent transparent transparent #209cff;
}
.flash-time {
  float: right;
  color: #209cff;
  line-height: 98px;
  margin-right: 32px;
}
.flash-time div {
  display: inline;
  color: #209cff;
  font-size: 32px;
}
.activity-flash-price {
  color: #209cff;
}
.activity-old-price {
  margin-left: 8px;
  text-decoration: line-through;
  font-size: 24px;
  color: #8f8f94;
  font-weight: normal;
}
.through-line {
  text-decoration: line-through;
}
.activity-presale-price {
  color: #ffae00;
}
.activity-pay-price {
  color: #ff656f;
}
.price-block {
  display: flex;
  line-height: 61px;
  margin: 18px 0 24px;
}
.price-left {
  width: 260px;
  flex-shrink: 1;
  text-align: right;
  font-size: 30px;
}
.price-left div {
  line-height: 61px;
}
.price-right {
  flex-grow: 1;
  text-align: left;
  font-size: 42px;
}
.price-right div {
  height: 61px;
  line-height: 61px;
  font-weight: bold;
}
.price-right span {
  font-weight: bold;
}
.price-right .activity-old-price {
  display: inline;
}

  /* 拼单 */
.collage-header {
  height: 120px;
  background-color: #d2ebff;
  padding: 0 30px;
}
.collage-header-l {
  color: #209cff;
  font-size: 30px;
}
.collage-header-l span {
  font-size: 34px;
  font-weight: bold;
  padding-right: 6px;
}
.p-30 {
  padding: 0 30px;
}
.collage-step {
  height: 83px;
  font-size: 24px;
  color: #222;
  border-bottom: 1.5px dashed #aaa;
}
.collage-step-icon {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 9px 0 9px 10px;
  border-color: transparent transparent transparent #383838;
}
.collage-total {
  height: 84px;
  font-size: 24px;
}
.collage-item {
  height: 161px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 30px;
}
.collage-item:last-child {
  border-bottom: 0;
}

.collage-user {
  height: 130px;
  width: 540px;
}
.collage-user-info {
  width: 88px;
  height: 100%;
  margin-right: 20px;
  position: relative;
}
.collage-user-photo {
  width: 100%;
  height: 88px;
  border-radius: 50%;
}
.collage-mask {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -44px;
  width: 88px;
  height: 88px;
  background-color: rgba(0,0,0,0.5);
  border-radius: 50%;
}
.collage-mask span {
  width: 8px;
  height: 8px;
  margin: 0 5px;
  background-color: #fff;
  border-radius: 50%;
}
.collage-user-name {
  width: 100%;
  line-height: 42px;
  text-align: center;
  color: #8f8f94;
  font-size: 22px;
}
.collage-item-right {
  width: 140px;
  height: 130px;
  overflow: hidden;
  text-align: center;
}
.collage-btn {
  width: 100%;
  height: 66px;
  line-height: 66px;
  border-radius: 10px;
  font-size: 26px;
  color: #fff;
  margin: 11px 0;
}
.collage-btn.yq-btn {
  background-color: #eb5841;
}
.collage-btn.pd-btn {
  background-color: #ffae00;
}
.collage-need-num {
  height: 42px;
  line-height: 42px;
  font-size: 24px;
  color: #222;
}
.count-time {
  width: 275px;
  color: #eb5841;
  font-size: 24px;
  padding-left: 26px;
  text-align: center;
}
.count-time div {
  display: inline;
  color: #eb5841;
  font-size: 24px;
}

.launch-btn {
  float: left;
  width: 100%;
  height: 100%;
}
</style>
