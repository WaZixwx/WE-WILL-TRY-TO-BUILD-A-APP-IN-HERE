<template>
  <div 
    class="progress-container" 
    :class="[
      size && `progress-${size}`,
      striped && 'progress-striped',
      animated && 'progress-animated'
    ]"
  >
    <!-- 标签显示 -->
    <div v-if="showLabel" class="progress-info">
      <span v-if="label" class="progress-label">{{ label }}</span>
      <span v-if="showPercentage" class="progress-percentage">{{ percentage }}%</span>
    </div>
    
    <!-- 进度条 -->
    <div class="progress">
      <div 
        class="progress-bar"
        :class="`progress-bar-${type}`"
        :style="{ width: `${percentage}%` }"
        role="progressbar"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span v-if="showPercentageInside" class="progress-text">{{ percentage }}%</span>
      </div>
    </div>
    
    <!-- 描述文本 -->
    <div v-if="description" class="progress-description">
      {{ description }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'LightProgress',
  props: {
    // 进度值（0-100）
    value: {
      type: Number,
      default: 0,
      validator: (value: number) => value >= 0 && value <= 100
    },
    // 进度条类型
    type: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
    },
    // 进度条大小
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['sm', 'lg', ''].includes(value)
    },
    // 是否显示条纹效果
    striped: {
      type: Boolean,
      default: false
    },
    // 是否显示动画效果
    animated: {
      type: Boolean,
      default: false
    },
    // 标签文本
    label: {
      type: String,
      default: ''
    },
    // 描述文本
    description: {
      type: String,
      default: ''
    },
    // 是否显示标签区域
    showLabel: {
      type: Boolean,
      default: true
    },
    // 是否在标签区域显示百分比
    showPercentage: {
      type: Boolean,
      default: true
    },
    // 是否在进度条内部显示百分比
    showPercentageInside: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // 计算百分比值（确保为整数）
    const percentage = computed(() => Math.round(props.value))
    
    return {
      percentage
    }
  }
})
</script>

<style scoped>
.progress-container {
  margin-bottom: 1rem;
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}

.progress-percentage {
  font-size: 0.875rem;
  color: var(--text-light);
}

.progress {
  height: 0.75rem;
  background-color: #e2e8f0;
  border-radius: 0.25rem;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--white);
  white-space: nowrap;
  font-weight: 600;
}

.progress-description {
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 0.5rem;
}

/* 尺寸变体 */
.progress-sm .progress {
  height: 0.5rem;
}

.progress-lg .progress {
  height: 1rem;
}

.progress-lg .progress-text {
  font-size: 0.875rem;
}

/* 类型变体 */
.progress-bar-primary {
  background-color: var(--primary);
}

.progress-bar-success {
  background-color: #10b981;
}

.progress-bar-warning {
  background-color: #f59e0b;
}

.progress-bar-danger {
  background-color: #ef4444;
}

.progress-bar-info {
  background-color: #3b82f6;
}

/* 条纹效果 */
.progress-striped .progress-bar {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

/* 动画效果 */
.progress-animated .progress-bar {
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}
</style> 