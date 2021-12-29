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

/**
 * 获取影片详情
 * @param {string} film_id 电影ID
 */
export function getfilminfo (data) {
  return request.post('/film/filmnotoken/getfilminfo', data)
}

/**
 * 根据城市获取所有县影院数量
 * @param {string} cinema_id 影院ID
 */
export function getCinemadetail (data) {
  return request.post('/film/filmnotoken/cinemadetail', data)
}

/**
 * 影院详情（排期接口）
 * @param {string} cinema_id 影院ID
 * @param {string} film_no 影片编码
 */
export function getCinemaschedu (data) {
  return request.post('/film/filmnotoken/cinemaschedu', data)
}

export function getSignature (data) {
  return request.post('/ulogin/wx/signature', data)
}

// 任务详情
export function getTaskInfo (data) {
  return request.post('/share/linli/linli_task_info', data)
}

// 问卷投票
export function getWjtpInfo (params) {
  return request.get('/share/wjtp/getWjtpInfo', {
    params
  })
}

// 红包分享领取页获取分享所得幸福币
export function getInviteReward (data) {
  return request({
    url: '/share/invite/hb_invite_receive_json',
    method: 'post',
    data,
    headers: {
      noToast: true
    }
  })
}

// 红包分享领取操作
export function receiveInvite (data) {
  return request({
    url: '/share/invite/hb_invite_receive',
    method: 'post',
    data,
    headers: {
      noToast: true
    }
  })
}

// 免费服务列表
export function getFreeServerList (data) {
  return request({
    url: '/share/freeservernotoken/getFreeServerList',
    method: 'post',
    data
  })
}
