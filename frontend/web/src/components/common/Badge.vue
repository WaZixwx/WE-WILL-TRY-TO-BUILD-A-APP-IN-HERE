<template>
  <component 
    :is="tag" 
    class="badge" 
    :class="[
      `badge-${type}`,
      size && `badge-${size}`,
      rounded && 'badge-rounded',
      outlined && 'badge-outlined',
      dot && 'badge-dot'
    ]"
  >
    <span v-if="dot" class="badge-dot-indicator"></span>
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LightBadge',
  props: {
    // 标签类型
    type: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
    },
    // 标签大小
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['sm', 'lg', ''].includes(value)
    },
    // 是否为圆形标签
    rounded: {
      type: Boolean,
      default: false
    },
    // 是否为描边标签
    outlined: {
      type: Boolean,
      default: false
    },
    // 是否为点状标签
    dot: {
      type: Boolean,
      default: false
    },
    // HTML标签
    tag: {
      type: String,
      default: 'span'
    }
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35em 0.65em;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

/* 类型样式 */
.badge-primary {
  background-color: var(--primary);
  color: var(--white);
}

.badge-secondary {
  background-color: var(--secondary);
  color: var(--text);
}

.badge-success {
  background-color: #10b981;
  color: var(--white);
}

.badge-danger {
  background-color: #ef4444;
  color: var(--white);
}

.badge-warning {
  background-color: #f59e0b;
  color: var(--white);
}

.badge-info {
  background-color: #3b82f6;
  color: var(--white);
}

/* 尺寸样式 */
.badge-sm {
  font-size: 0.625rem;
  padding: 0.2em 0.4em;
}

.badge-lg {
  font-size: 0.875rem;
  padding: 0.5em 0.75em;
}

/* 圆形样式 */
.badge-rounded {
  border-radius: 9999px;
}

/* 描边样式 */
.badge-outlined {
  background-color: transparent;
  border: 1px solid;
}

.badge-outlined.badge-primary {
  color: var(--primary);
  border-color: var(--primary);
}

.badge-outlined.badge-secondary {
  color: var(--text);
  border-color: var(--text-light);
}

.badge-outlined.badge-success {
  color: #10b981;
  border-color: #10b981;
}

.badge-outlined.badge-danger {
  color: #ef4444;
  border-color: #ef4444;
}

.badge-outlined.badge-warning {
  color: #f59e0b;
  border-color: #f59e0b;
}

.badge-outlined.badge-info {
  color: #3b82f6;
  border-color: #3b82f6;
}

/* 点状标签样式 */
.badge-dot {
  padding: 0;
  border-radius: 0;
  background: transparent;
  position: relative;
  padding-left: 1.25em;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-dot-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.6em;
  height: 0.6em;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5em;
}

.badge-dot.badge-primary .badge-dot-indicator {
  background-color: var(--primary);
}

.badge-dot.badge-secondary .badge-dot-indicator {
  background-color: var(--text-light);
}

.badge-dot.badge-success .badge-dot-indicator {
  background-color: #10b981;
}

.badge-dot.badge-danger .badge-dot-indicator {
  background-color: #ef4444;
}

.badge-dot.badge-warning .badge-dot-indicator {
  background-color: #f59e0b;
}

.badge-dot.badge-info .badge-dot-indicator {
  background-color: #3b82f6;
}

.badge-dot.badge-primary {
  color: var(--text);
}

.badge-dot.badge-secondary {
  color: var(--text);
}

.badge-dot.badge-success {
  color: var(--text);
}

.badge-dot.badge-danger {
  color: var(--text);
}

.badge-dot.badge-warning {
  color: var(--text);
}

.badge-dot.badge-info {
  color: var(--text);
}
</style> 