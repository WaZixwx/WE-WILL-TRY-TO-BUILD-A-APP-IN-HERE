/**
 * LightLink UI组件库 - 统一导出
 * 此文件用于集中导出所有公共组件，方便批量引入
 * @author 开发者：WaZixwx, HanBai
 */

import { App } from 'vue'
import Alert from './Alert.vue'
import Avatar from './Avatar.vue'
import Badge from './Badge.vue'
import Button from './Button.vue'
import Card from './Card.vue'
import Dropdown from './Dropdown.vue'
import Form from './Form.vue'
import FormItem from './FormItem.vue'
import Input from './Input.vue'
import Modal from './Modal.vue'
import Progress from './Progress.vue'
import Tabs from './Tabs.vue'

// 所有组件列表
const components = {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  FormItem,
  Input,
  Modal,
  Progress,
  Tabs
}

// Vue插件安装函数
const install = (app: App): void => {
  // 注册所有组件
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
}

// 默认导出插件对象
export default {
  install
}

// 导出单个组件
export {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  FormItem,
  Input,
  Modal,
  Progress,
  Tabs
} 