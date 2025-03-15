/**
 * LightLink HTTP请求客户端
 * 负责处理API请求，包含请求拦截器、响应拦截器和错误处理
 * @author 开发者：WaZixwx, HanBai
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建HTTP客户端实例
const http: AxiosInstance = axios.create({
  baseURL: '/api', // API基础路径
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    
    // 如果有token则添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    // 请求错误处理
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 提取响应数据
    const { data } = response
    
    // 处理自定义错误
    if (data.code && data.code !== 200) {
      return Promise.reject(data.message || '服务器错误')
    }
    
    // 返回响应数据
    return data.data || data
  },
  (error) => {
    // 响应错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除token并重定向到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          return Promise.reject('登录已过期，请重新登录')
          
        case 403:
          return Promise.reject('没有权限进行此操作')
          
        case 404:
          return Promise.reject('请求的资源不存在')
          
        case 500:
          return Promise.reject('服务器内部错误')
          
        default:
          return Promise.reject(data.message || `请求失败(${status})`)
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      return Promise.reject('服务器无响应，请检查网络连接')
    } else {
      // 请求配置错误
      return Promise.reject(`请求错误: ${error.message}`)
    }
  }
)

// 导出HTTP客户端
export default http 