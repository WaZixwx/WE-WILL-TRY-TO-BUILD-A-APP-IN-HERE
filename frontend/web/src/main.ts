/**
 * LightLink Vue应用入口文件
 * 负责创建Vue应用实例、挂载全局组件和插件
 * @author 开发者：WaZixwx, HanBai
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/base.css'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用Vue Router
app.use(router)

// 挂载应用到DOM
app.mount('#app') 