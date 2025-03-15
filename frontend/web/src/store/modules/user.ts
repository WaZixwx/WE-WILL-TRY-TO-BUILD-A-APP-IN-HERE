/**
 * LightLink 用户状态管理模块
 * 管理用户登录、注册、个人信息等状态
 * @author 开发者：WaZixwx, HanBai
 */

import { defineStore } from 'pinia'
import { UserInfo } from '../../types/user'
import { login, register, getUserInfo, updateUserInfo, logout } from '../../api/user'

// 定义用户状态类型
interface UserState {
  token: string | null
  userInfo: UserInfo | null
  isLoading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  // 状态
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    userInfo: null,
    isLoading: false,
    error: null
  }),

  // 计算属性
  getters: {
    // 判断用户是否已登录
    isLoggedIn: (state) => !!state.token,
    // 获取用户昵称或默认值
    nickname: (state) => state.userInfo?.nickname || '用户',
    // 获取用户头像或默认图片
    avatar: (state) => state.userInfo?.avatar || '/src/assets/images/default-avatar.png'
  },

  // 操作方法
  actions: {
    // 设置令牌
    setToken(token: string | null) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    // 设置用户信息
    setUserInfo(userInfo: UserInfo | null) {
      this.userInfo = userInfo
    },

    // 设置加载状态
    setLoading(status: boolean) {
      this.isLoading = status
    },

    // 设置错误信息
    setError(error: string | null) {
      this.error = error
    },

    // 登录操作
    async loginAction(username: string, password: string) {
      this.setLoading(true)
      this.setError(null)
      
      try {
        // 调用登录API
        const response = await login(username, password)
        // 保存令牌和用户信息
        this.setToken(response.token)
        this.setUserInfo(response.userInfo)
        return true
      } catch (error) {
        // 处理错误
        this.setError(error as string)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // 注册操作
    async registerAction(username: string, password: string, email: string) {
      this.setLoading(true)
      this.setError(null)
      
      try {
        // 调用注册API
        await register(username, password, email)
        return true
      } catch (error) {
        // 处理错误
        this.setError(error as string)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // 获取用户信息
    async fetchUserInfo() {
      if (!this.token) return false
      
      this.setLoading(true)
      this.setError(null)
      
      try {
        // 调用获取用户信息API
        const userInfo = await getUserInfo()
        this.setUserInfo(userInfo)
        return true
      } catch (error) {
        // 处理错误
        this.setError(error as string)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // 更新用户信息
    async updateUserInfoAction(updatedInfo: Partial<UserInfo>) {
      if (!this.token || !this.userInfo) return false
      
      this.setLoading(true)
      this.setError(null)
      
      try {
        // 调用更新用户信息API
        const userInfo = await updateUserInfo(updatedInfo)
        this.setUserInfo({
          ...this.userInfo,
          ...userInfo
        })
        return true
      } catch (error) {
        // 处理错误
        this.setError(error as string)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // 退出登录
    async logoutAction() {
      this.setLoading(true)
      
      try {
        // 调用退出登录API
        await logout()
        
        // 清除本地状态
        this.setToken(null)
        this.setUserInfo(null)
        return true
      } catch (error) {
        // 处理错误
        this.setError(error as string)
        return false
      } finally {
        this.setLoading(false)
      }
    }
  }
}) 