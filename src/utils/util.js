import wxsdk from 'weixin-js-sdk'
import router from '../router'
// const wxsdk = window["wx"]
import { getSignature } from '@/api/share.js'
export function openApp (params) {
  window.location.href = 'mhshjyScheme://?' + params
  setTimeout(() => {
    router.push({
      path: '/upload',
      query: {
        appParams: params
      }
    })
  }, 2000)
}

export function isWx () {
  const wx = navigator.userAgent.toLowerCase()
  if (wx.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

export function txJssdk () {
  let sign_url = ''
  if (window.__wxjs_is_wkwebview === true) {
    // 如果当前设备是IOS
    sign_url = window.location.href.split('#')[0]
  } else {
    // 非IOS设备
    sign_url = window.location.href
  }
  getSignature({
    share_url: sign_url
  }).then(res => {
    wxsdk.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
      appId: res.data.appId, // 必填，公众号的唯一标识
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名
      jsApiList: ['onMenuShareTimeline'], // 必填，需要使用的JS接口列表
      openTagList: ['wx-open-launch-app'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
    })

    wxsdk.ready(function () {
      wxsdk.checkJsApi({
        jsApiList: ['wx-open-launch-app'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res) {
          // console.log(res)
        },
        fail: (err) => {
          console.log(err, '不可用')
        }
      })
    })
    wxsdk.error(function (res) {
      // Toast(res)
    })
  })
}
