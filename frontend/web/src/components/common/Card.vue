<template>
  <div 
    class="card" 
    :class="[
      shadow && `card-shadow-${shadow}`,
      hover && 'card-hover'
    ]"
  >
    <!-- 卡片标题 -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- 卡片内容 -->
    <div :class="['card-body', bodyClass]">
      <slot></slot>
    </div>
    
    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LightCard',
  props: {
    // 卡片标题
    title: {
      type: String,
      default: ''
    },
    // 内容区域的自定义类名
    bodyClass: {
      type: String,
      default: ''
    },
    // 阴影级别: 'sm', 'md', 'lg', 'none'
    shadow: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg', 'none'].includes(value)
    },
    // 是否启用悬停效果
    hover: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
.card {
  background-color: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* 阴影效果 */
.card-shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 悬停效果 */
.card-hover {
  cursor: pointer;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
</style> 