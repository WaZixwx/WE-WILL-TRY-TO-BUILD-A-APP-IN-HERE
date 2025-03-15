<template>
  <div 
    class="avatar" 
    :class="[
      `avatar-${size}`,
      `avatar-${shape}`,
      status && `avatar-status-${status}`,
      bordered && 'avatar-bordered',
      clickable && 'avatar-clickable'
    ]"
    @click="handleClick"
  >
    <!-- 显示图片 -->
    <img 
      v-if="src && !error" 
      :src="src" 
      :alt="alt"
      @error="handleError"
      class="avatar-img"
    />
    
    <!-- 图片加载失败或无图片时显示文字头像 -->
    <div v-else class="avatar-text" :style="textStyle">
      <slot>{{ initials }}</slot>
    </div>
    
    <!-- 状态指示器 -->
    <span v-if="status" class="avatar-status"></span>
    
    <!-- 徽章 -->
    <span v-if="badge" class="avatar-badge">{{ badge }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

// 头像尺寸
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 头像形状
export type AvatarShape = 'circle' | 'rounded' | 'square'

// 头像状态
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export default defineComponent({
  name: 'LightAvatar',
  props: {
    // 头像图片地址
    src: {
      type: String,
      default: ''
    },
    // 头像替代文本
    alt: {
      type: String,
      default: 'avatar'
    },
    // 用于生成文字头像的名称
    name: {
      type: String,
      default: ''
    },
    // 头像大小
    size: {
      type: String as () => AvatarSize,
      default: 'md',
      validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    // 头像形状
    shape: {
      type: String as () => AvatarShape,
      default: 'circle',
      validator: (value: string) => ['circle', 'rounded', 'square'].includes(value)
    },
    // 是否显示边框
    bordered: {
      type: Boolean,
      default: false
    },
    // 背景色 (文字头像)
    bgColor: {
      type: String,
      default: ''
    },
    // 文本颜色 (文字头像)
    textColor: {
      type: String,
      default: ''
    },
    // 头像状态
    status: {
      type: String as () => AvatarStatus,
      default: '',
      validator: (value: string) => ['', 'online', 'offline', 'busy', 'away'].includes(value)
    },
    // 徽章内容
    badge: {
      type: [String, Number],
      default: ''
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'error'],
  setup(props, { emit }) {
    // 图片加载错误状态
    const error = ref(false)
    
    // 计算文字头像样式
    const textStyle = computed(() => {
      const style: Record<string, string> = {}
      
      if (props.bgColor) {
        style.backgroundColor = props.bgColor
      } else {
        // 根据名称生成一致的背景色
        const hash = props.name.split('').reduce((acc, char) => {
          return char.charCodeAt(0) + ((acc << 5) - acc)
        }, 0)
        const hue = Math.abs(hash % 360)
        style.backgroundColor = `hsl(${hue}, 65%, 65%)`
      }
      
      if (props.textColor) {
        style.color = props.textColor
      }
      
      return style
    })
    
    // 计算名称缩写
    const initials = computed(() => {
      if (!props.name) return '?'
      
      return props.name
        .split(' ')
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    })
    
    // 处理图片加载错误
    const handleError = (e: Event) => {
      error.value = true
      emit('error', e)
    }
    
    // 处理点击事件
    const handleClick = (e: MouseEvent) => {
      if (props.clickable) {
        emit('click', e)
      }
    }
    
    return {
      error,
      textStyle,
      initials,
      handleError,
      handleClick
    }
  }
})
</script>

<style scoped>
.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #e2e8f0;
  color: var(--text);
  font-weight: 600;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 尺寸变体 */
.avatar-xs {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.625rem;
}

.avatar-sm {
  width: 2rem;
  height: 2rem;
  font-size: 0.75rem;
}

.avatar-md {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
}

.avatar-lg {
  width: 3rem;
  height: 3rem;
  font-size: 1.25rem;
}

.avatar-xl {
  width: 4rem;
  height: 4rem;
  font-size: 1.5rem;
}

/* 形状变体 */
.avatar-circle {
  border-radius: 50%;
}

.avatar-rounded {
  border-radius: 0.375rem;
}

.avatar-square {
  border-radius: 0;
}

/* 边框 */
.avatar-bordered {
  border: 2px solid var(--white);
  box-shadow: 0 0 0 1px #e2e8f0;
}

/* 状态指示器 */
.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  border: 2px solid var(--white);
}

.avatar-status-online {
  background-color: #10b981;
}

.avatar-status-offline {
  background-color: #94a3b8;
}

.avatar-status-busy {
  background-color: #ef4444;
}

.avatar-status-away {
  background-color: #f59e0b;
}

/* 徽章 */
.avatar-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 0.75rem;
  height: 0.75rem;
  line-height: 0.75rem;
  padding: 0 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--white);
  background-color: var(--primary);
  border-radius: 9999px;
  border: 1px solid var(--white);
  transform: translate(25%, -25%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-lg .avatar-badge,
.avatar-xl .avatar-badge {
  min-width: 1rem;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.75rem;
}

/* 可点击样式 */
.avatar-clickable {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.avatar-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.avatar-clickable:active {
  transform: translateY(0);
}
</style> 