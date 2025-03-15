<template>
  <transition name="fade">
    <div 
      v-if="visible" 
      :class="[
        'alert',
        `alert-${type}`,
        dismissible && 'alert-dismissible',
        withIcon && 'alert-with-icon'
      ]"
    >
      <!-- 警告图标 -->
      <div v-if="withIcon" class="alert-icon">
        <slot name="icon">
          <!-- 根据类型显示默认图标 -->
          <svg v-if="type === 'success'" class="alert-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <svg v-else-if="type === 'warning'" class="alert-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <svg v-else-if="type === 'danger'" class="alert-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <svg v-else-if="type === 'info'" class="alert-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </slot>
      </div>
      
      <!-- 警告内容 -->
      <div class="alert-content">
        <h4 v-if="title" class="alert-heading">{{ title }}</h4>
        <div class="alert-text">
          <slot>{{ message }}</slot>
        </div>
        <div v-if="$slots.actions" class="alert-actions">
          <slot name="actions"></slot>
        </div>
      </div>
      
      <!-- 关闭按钮 -->
      <button v-if="dismissible" class="alert-close" @click="closeAlert">
        <slot name="close-icon">
          <svg class="alert-close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </slot>
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'LightAlert',
  props: {
    // 警告类型
    type: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
    },
    // 警告标题
    title: {
      type: String,
      default: ''
    },
    // 警告内容
    message: {
      type: String,
      default: ''
    },
    // 是否可关闭
    dismissible: {
      type: Boolean,
      default: false
    },
    // 是否显示图标
    withIcon: {
      type: Boolean,
      default: false
    },
    // 自动关闭延时（毫秒），为0时不自动关闭
    autoClose: {
      type: Number,
      default: 0
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    // 显示状态
    const visible = ref(true)
    
    // 自动关闭计时器
    let autoCloseTimer: ReturnType<typeof setTimeout> | null = null
    
    // 关闭警告
    const closeAlert = () => {
      visible.value = false
      emit('close')
    }
    
    // 设置自动关闭
    if (props.autoClose > 0) {
      autoCloseTimer = setTimeout(() => {
        closeAlert()
      }, props.autoClose)
    }
    
    // 组件销毁时清除计时器
    onBeforeUnmount(() => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    })
    
    return {
      visible,
      closeAlert
    }
  }
})
</script>

<style scoped>
.alert {
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: flex-start;
  background-color: var(--white);
  border-left: 4px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 类型样式 */
.alert-primary {
  border-left-color: var(--primary);
  background-color: rgba(37, 99, 235, 0.1);
}

.alert-success {
  border-left-color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.alert-warning {
  border-left-color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.alert-danger {
  border-left-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.alert-info {
  border-left-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

/* 内容区域 */
.alert-content {
  flex: 1;
}

.alert-heading {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.alert-text {
  color: var(--text);
}

/* 带图标样式 */
.alert-with-icon {
  padding-left: 3.5rem;
}

.alert-icon {
  position: absolute;
  left: 1rem;
  top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
}

.alert-primary .alert-icon-svg {
  color: var(--primary);
}

.alert-success .alert-icon-svg {
  color: #10b981;
}

.alert-warning .alert-icon-svg {
  color: #f59e0b;
}

.alert-danger .alert-icon-svg {
  color: #ef4444;
}

.alert-info .alert-icon-svg {
  color: #3b82f6;
}

/* 可关闭样式 */
.alert-dismissible {
  padding-right: 3rem;
}

.alert-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.alert-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.alert-close-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-light);
}

/* 操作按钮区域 */
.alert-actions {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style> 