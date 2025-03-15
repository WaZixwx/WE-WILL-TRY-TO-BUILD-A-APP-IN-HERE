/**
 * LightLink 路由配置
 * 定义应用的路由映射关系
 * @author 开发者：WaZixwx, HanBai
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'LightLink - 首页',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'LightLink - 登录',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: 'LightLink - 注册',
      requiresAuth: false
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: {
      title: 'LightLink - 聊天',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: 'LightLink - 个人资料',
      requiresAuth: true
    }
  },
  {
    path: '/moments',
    name: 'Moments',
    component: () => import('../views/Moments.vue'),
    meta: {
      title: 'LightLink - 社交圈子',
      requiresAuth: true
    }
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('../views/Wallet.vue'),
    meta: {
      title: 'LightLink - 钱包',
      requiresAuth: true
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: 'LightLink - 页面未找到',
      requiresAuth: false
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || 'LightLink'
  
  // 检查是否需要登录权限
  if (to.meta.requiresAuth) {
    // 这里会检查用户是否已登录
    const isLoggedIn = localStorage.getItem('token') !== null
    
    if (!isLoggedIn) {
      // 未登录，重定向到登录页
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      // 已登录，允许访问
      next()
    }
  } else {
    // 不需要登录权限的页面，直接访问
    next()
  }
})

export default router 