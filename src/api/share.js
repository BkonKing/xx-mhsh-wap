import request from '@/utils/request.js'

// 商品详情
export function getGoodsDetail (params) {
  return request.post('/share/goods/goods_info', params)
}

// 访客二维码链接
export function visitorCode (data) {
  return request.post('/share/visitor/visitorCode ', data)
}

// 活动详情接口
export function getActivityInfo (params) {
  return request.get('/share/activity/getActivityInfo', { params })
}

// 资讯详情
export function getArticleInfo (params) {
  return request.get('/share/article/getArticleInfo', { params })
}

// 新增话题贴吧
export function getPostBarInfo (params) {
  return request.get('/share/postbar/getPostBarInfo', { params })
}

export function getSignature (data) {
  return request.post('/ulogin/wx/signature', data)
}
