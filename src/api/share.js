import request from '@/utils/request.js'

// 商品详情
export function getGoodsDetail (params) {
  return request.post('/share/index/goods_info', params)
}
