import request from '@/utils/request.js'

// 商品详情
export function getGoodsDetail (params) {
  return request.post('/share/index/goods_info', params)
}

// 访客二维码链接
export function visitorCode (data) {
  return request.post('/butler/visitor/visitorCode', data)
}

// 活动详情接口
export function getActivityInfo (params) {
  return request.get('/neighbours/activity/getActivityInfo', { params })
}

// 资讯详情
export function getArticleInfo (params) {
  return request.get('/neighbours/article/getArticleInfo', { params })
}

// 新增话题贴吧
export function getPostBarInfo (params) {
  return request.get('/neighbours/postbar/getPostBarInfo', { params })
}
