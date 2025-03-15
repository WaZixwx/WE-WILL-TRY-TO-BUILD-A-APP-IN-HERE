/**
 * LightLink 用户类型定义
 * 定义与用户相关的数据类型
 * @author 开发者：WaZixwx, HanBai
 */

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  avatar: string
  signature: string
  createdAt: string
  updatedAt: string
}

// 登录请求参数接口
export interface LoginParams {
  username: string
  password: string
}

// 登录响应接口
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// 注册请求参数接口
export interface RegisterParams {
  username: string
  password: string
  email: string
}

// 更新用户信息请求参数接口
export interface UpdateUserInfoParams {
  nickname?: string
  avatar?: string
  signature?: string
  email?: string
} 