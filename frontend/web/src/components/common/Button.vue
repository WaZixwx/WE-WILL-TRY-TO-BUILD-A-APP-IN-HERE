<template>
  <button
    :class="[
      'btn',
      `btn-${type}`,
      size && `btn-${size}`,
      block && 'btn-block',
      outlined && 'btn-outlined',
      rounded && 'btn-rounded',
      disabled && 'btn-disabled'
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot name="icon-left"></slot>
    <slot></slot>
    <slot name="icon-right"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LightButton',
  props: {
    // 按钮类型
    type: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
    },
    // 按钮尺寸
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['sm', 'lg', 'xl', ''].includes(value)
    },
    // 是否为块级按钮
    block: {
      type: Boolean,
      default: false
    },
    // 是否为描边按钮
    outlined: {
      type: Boolean,
      default: false
    },
    // 是否为圆角按钮
    rounded: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    // 处理点击事件
    const handleClick = (event: MouseEvent) => {
      if (!props.disabled) {
        emit('click', event)
      }
    }

    return {
      handleClick
    }
  }
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

/* 按钮类型 */
.btn-primary {
  background-color: var(--primary);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background-color: var(--secondary);
  color: var(--text);
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow);
}

.btn-success {
  background-color: #10b981;
  color: var(--white);
}

.btn-success:hover {
  background-color: #34d399;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.btn-danger {
  background-color: #ef4444;
  color: var(--white);
}

.btn-danger:hover {
  background-color: #f87171;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.btn-warning {
  background-color: #f59e0b;
  color: var(--white);
}

.btn-warning:hover {
  background-color: #fbbf24;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

.btn-info {
  background-color: #3b82f6;
  color: var(--white);
}

.btn-info:hover {
  background-color: #60a5fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

/* 按钮尺寸 */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-xl {
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
}

/* 块级按钮 */
.btn-block {
  display: flex;
  width: 100%;
}

/* 描边按钮 */
.btn-outlined {
  background-color: transparent;
  border: 2px solid;
}

.btn-outlined.btn-primary {
  color: var(--primary);
  border-color: var(--primary);
}

.btn-outlined.btn-primary:hover {
  background-color: rgba(37, 99, 235, 0.1);
}

.btn-outlined.btn-secondary {
  color: var(--text);
  border-color: var(--text-light);
}

.btn-outlined.btn-secondary:hover {
  background-color: rgba(100, 116, 139, 0.1);
}

.btn-outlined.btn-success {
  color: #10b981;
  border-color: #10b981;
}

.btn-outlined.btn-success:hover {
  background-color: rgba(16, 185, 129, 0.1);
}

.btn-outlined.btn-danger {
  color: #ef4444;
  border-color: #ef4444;
}

.btn-outlined.btn-danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.btn-outlined.btn-warning {
  color: #f59e0b;
  border-color: #f59e0b;
}

.btn-outlined.btn-warning:hover {
  background-color: rgba(245, 158, 11, 0.1);
}

.btn-outlined.btn-info {
  color: #3b82f6;
  border-color: #3b82f6;
}

.btn-outlined.btn-info:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

/* 圆角按钮 */
.btn-rounded {
  border-radius: 9999px;
}

/* 禁用状态 */
.btn-disabled,
.btn:disabled {
  opacity: 0.65;
  pointer-events: none;
  cursor: not-allowed;
}
</style> 