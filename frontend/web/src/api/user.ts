/**
 * LightLink 用户API接口
 * 封装用户相关的API请求
 * @author 开发者：WaZixwx, HanBai
 */

import http from './http'
import { LoginResponse, UserInfo, UpdateUserInfoParams } from '../types/user'

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns 登录响应信息
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  return await http.post('/auth/login', { username, password })
}

/**
 * 用户注册
 * @param username 用户名
 * @param password 密码
 * @param email 邮箱
 * @returns 注册结果
 */
export const register = async (username: string, password: string, email: string): Promise<void> => {
  await http.post('/auth/register', { username, password, email })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  return await http.get('/user/info')
}

/**
 * 更新用户信息
 * @param params 要更新的信息
 * @returns 更新后的用户信息
 */
export const updateUserInfo = async (params: UpdateUserInfoParams): Promise<UserInfo> => {
  return await http.put('/user/info', params)
}

/**
 * 退出登录
 */
export const logout = async (): Promise<void> => {
  await http.post('/auth/logout')
} 