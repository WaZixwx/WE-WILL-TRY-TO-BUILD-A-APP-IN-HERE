<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click="closeOnOverlayClick && closeModal()">
        <div 
          class="modal-container" 
          :class="[size && `modal-${size}`]" 
          @click.stop
        >
          <!-- 模态框头部 -->
          <div class="modal-header" v-if="$slots.header || title">
            <slot name="header">
              <h3 class="modal-title">{{ title }}</h3>
            </slot>
            <button v-if="closable" class="modal-close" @click="closeModal">
              <slot name="close-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="modal-close-icon">
                  <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" fill="currentColor"/>
                </svg>
              </slot>
            </button>
          </div>
          
          <!-- 模态框内容 -->
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <!-- 模态框底部 -->
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, watch, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'LightModal',
  props: {
    // 通过v-model控制显示/隐藏
    modelValue: {
      type: Boolean,
      default: false
    },
    // 模态框标题
    title: {
      type: String,
      default: ''
    },
    // 模态框大小
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['sm', 'lg', 'xl', 'fullscreen', ''].includes(value)
    },
    // 是否可关闭
    closable: {
      type: Boolean,
      default: true
    },
    // 点击遮罩层是否关闭
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    },
    // 是否在按下Esc键时关闭
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    // 处理Esc键关闭
    const handleEscKey = (event: KeyboardEvent) => {
      if (props.closeOnEscape && props.modelValue && event.key === 'Escape') {
        closeModal()
      }
    }
    
    // 关闭模态框
    const closeModal = () => {
      emit('update:modelValue', false)
      emit('close')
    }
    
    // 当模态框显示时，禁止背景滚动
    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    })
    
    // 监听键盘事件
    onMounted(() => {
      document.addEventListener('keydown', handleEscKey)
    })
    
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = ''
    })
    
    return {
      closeModal
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: var(--white);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  line-height: 0;
}

.modal-close:hover {
  background-color: #f1f5f9;
  color: var(--text);
}

.modal-close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* 尺寸变体 */
.modal-sm {
  max-width: 300px;
}

.modal-lg {
  max-width: 800px;
}

.modal-xl {
  max-width: 1140px;
}

.modal-fullscreen {
  max-width: none;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  margin: 0;
  border-radius: 0;
}

/* 动画效果 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 640px) {
  .modal-container:not(.modal-sm):not(.modal-lg):not(.modal-xl):not(.modal-fullscreen) {
    max-width: 100%;
    margin: 0;
    border-radius: 0.5rem;
  }
}
</style> 