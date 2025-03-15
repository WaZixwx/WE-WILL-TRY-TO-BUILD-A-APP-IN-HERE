<template>
  <div class="dropdown" :class="{ 'dropdown-active': isOpen }">
    <!-- 触发器 -->
    <div 
      class="dropdown-trigger" 
      @click="toggleDropdown"
      ref="triggerRef"
    >
      <slot name="trigger">
        <button class="dropdown-button" type="button">
          {{ label }}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="16" 
            height="16" 
            class="dropdown-arrow"
            :class="{ 'dropdown-arrow-rotate': isOpen }"
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor" />
          </svg>
        </button>
      </slot>
    </div>

    <!-- 下拉菜单内容 -->
    <transition name="dropdown">
      <div 
        v-if="isOpen" 
        class="dropdown-menu" 
        :class="[
          position && `dropdown-position-${position}`,
          align && `dropdown-align-${align}`,
          width && `dropdown-width-${width}`
        ]"
        ref="menuRef"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

export default defineComponent({
  name: 'LightDropdown',
  props: {
    // 下拉菜单标签
    label: {
      type: String,
      default: 'Dropdown'
    },
    // 下拉菜单位置
    position: {
      type: String,
      default: 'bottom',
      validator: (value: string) => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    // 下拉菜单对齐方式
    align: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'center', 'right'].includes(value)
    },
    // 下拉菜单宽度
    width: {
      type: String,
      default: 'auto',
      validator: (value: string) => ['auto', 'trigger', 'custom'].includes(value)
    },
    // 点击外部是否关闭
    closeOnClickOutside: {
      type: Boolean,
      default: true
    },
    // 选择后是否自动关闭
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    // 下拉菜单是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['open', 'close', 'select'],
  setup(props, { emit }) {
    const isOpen = ref(false)
    const triggerRef = ref<HTMLElement | null>(null)
    const menuRef = ref<HTMLElement | null>(null)
    
    // 切换下拉菜单显示状态
    const toggleDropdown = () => {
      if (props.disabled) return
      
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        emit('open')
        nextTick(() => {
          updateMenuPosition()
        })
      } else {
        emit('close')
      }
    }
    
    // 关闭下拉菜单
    const closeDropdown = () => {
      if (isOpen.value) {
        isOpen.value = false
        emit('close')
      }
    }
    
    // 处理菜单项选择
    const handleSelect = (value: any) => {
      emit('select', value)
      if (props.closeOnSelect) {
        closeDropdown()
      }
    }
    
    // 处理点击外部
    const handleClickOutside = (event: MouseEvent) => {
      if (!props.closeOnClickOutside) return
      
      const target = event.target as HTMLElement
      if (
        isOpen.value && 
        triggerRef.value && 
        menuRef.value && 
        !triggerRef.value.contains(target) && 
        !menuRef.value.contains(target)
      ) {
        closeDropdown()
      }
    }
    
    // 更新菜单位置
    const updateMenuPosition = () => {
      if (!triggerRef.value || !menuRef.value) return
      
      const trigger = triggerRef.value.getBoundingClientRect()
      const menu = menuRef.value
      
      if (props.width === 'trigger') {
        menu.style.width = `${trigger.width}px`
      }
    }
    
    // 监听滚动和窗口大小调整
    const handleResize = () => {
      if (isOpen.value) {
        updateMenuPosition()
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize)
    })
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    })
    
    return {
      isOpen,
      triggerRef,
      menuRef,
      toggleDropdown,
      closeDropdown,
      handleSelect
    }
  }
})
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
  position: relative;
}

.dropdown-button {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--white);
  color: var(--text);
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-button:hover {
  border-color: var(--primary);
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

.dropdown-arrow-rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  z-index: 100;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  background-color: var(--white);
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

/* 位置变体 */
.dropdown-position-bottom {
  top: 100%;
  margin-top: 0.25rem;
}

.dropdown-position-top {
  bottom: 100%;
  margin-bottom: 0.25rem;
}

.dropdown-position-left {
  right: 100%;
  margin-right: 0.25rem;
  top: 0;
}

.dropdown-position-right {
  left: 100%;
  margin-left: 0.25rem;
  top: 0;
}

/* 对齐变体 */
.dropdown-align-left {
  left: 0;
}

.dropdown-align-center {
  left: 50%;
  transform: translateX(-50%);
}

.dropdown-align-right {
  right: 0;
}

/* 宽度变体 */
.dropdown-width-custom {
  width: var(--dropdown-width, auto);
}

/* 动画效果 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(0.25rem);
}

/* 菜单项样式 */
:deep(.dropdown-item) {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  clear: both;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  color: var(--text);
  font-size: 0.875rem;
  line-height: 1.5;
  transition: all 0.15s ease;
}

:deep(.dropdown-item:hover) {
  background-color: #f1f5f9;
  color: var(--primary);
}

:deep(.dropdown-item-active) {
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--primary);
}

:deep(.dropdown-item-disabled) {
  color: var(--text-light);
  pointer-events: none;
  opacity: 0.6;
}

:deep(.dropdown-divider) {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid #e2e8f0;
}

:deep(.dropdown-header) {
  display: block;
  padding: 0.5rem 1rem;
  margin-bottom: 0;
  font-size: 0.75rem;
  color: var(--text-light);
  white-space: nowrap;
  text-transform: uppercase;
  font-weight: 600;
}
</style> 