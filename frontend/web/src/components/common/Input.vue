<template>
  <div class="input-wrapper" :class="{ 'input-error': error }">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <div class="input-container">
      <div v-if="$slots['prefix']" class="input-prefix">
        <slot name="prefix"></slot>
      </div>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :class="[
          'input',
          size && `input-${size}`,
          rounded && 'input-rounded'
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="$slots['suffix']" class="input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <p v-if="error" class="input-error-text">{{ error }}</p>
    <p v-else-if="helper" class="input-helper-text">{{ helper }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LightInput',
  props: {
    // 输入框ID
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 10)}`
    },
    // v-model绑定值
    modelValue: {
      type: [String, Number],
      default: ''
    },
    // 输入框类型
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => [
        'text', 'password', 'email', 
        'number', 'tel', 'url', 'search',
        'date', 'time', 'datetime-local'
      ].includes(value)
    },
    // 输入框标签
    label: {
      type: String,
      default: ''
    },
    // 占位文本
    placeholder: {
      type: String,
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false
    },
    // 输入框尺寸
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['sm', 'lg', ''].includes(value)
    },
    // 是否为圆角输入框
    rounded: {
      type: Boolean,
      default: false
    },
    // 辅助文本
    helper: {
      type: String,
      default: ''
    },
    // 错误信息
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup(props, { emit }) {
    // 处理输入事件
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }

    // 处理失焦事件
    const handleBlur = (event: Event) => {
      emit('blur', event)
    }

    // 处理聚焦事件
    const handleFocus = (event: Event) => {
      emit('focus', event)
    }

    return {
      handleInput,
      handleBlur,
      handleFocus
    }
  }
})
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1rem;
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}

.input-required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input {
  flex: 1;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text);
  background-color: var(--white);
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input:disabled,
.input:read-only {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.input::placeholder {
  color: #94a3b8;
}

/* 输入框尺寸 */
.input-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.input-lg {
  padding: 1rem 1.25rem;
  font-size: 1.125rem;
}

/* 圆角输入框 */
.input-rounded {
  border-radius: 9999px;
}

/* 前缀和后缀 */
.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: var(--text-light);
}

.input-prefix {
  padding-right: 0;
}

.input-suffix {
  padding-left: 0;
}

/* 错误状态 */
.input-error .input {
  border-color: #ef4444;
}

.input-error .input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-error-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.input-helper-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
}
</style> 