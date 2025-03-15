<template>
  <div 
    class="form-item" 
    :class="[
      formContext?.layout === 'horizontal' && 'form-item-horizontal',
      error && 'form-item-error'
    ]"
  >
    <!-- 标签 -->
    <label 
      v-if="label" 
      class="form-item-label" 
      :class="{ 'form-item-label-required': required }"
      :style="labelStyle"
    >
      {{ label }}
    </label>
    
    <!-- 内容区域 -->
    <div class="form-item-content">
      <slot></slot>
      
      <!-- 错误信息 -->
      <div v-if="error" class="form-item-error-message">
        {{ error }}
      </div>
      
      <!-- 提示信息 -->
      <div v-else-if="hint" class="form-item-hint">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'

// 验证器函数类型
type Validator = (value: any) => boolean | string | Promise<boolean | string>

export default defineComponent({
  name: 'LightFormItem',
  props: {
    // 表单项标签
    label: {
      type: String,
      default: ''
    },
    // 表单项名称
    name: {
      type: String,
      default: ''
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false
    },
    // 提示信息
    hint: {
      type: String,
      default: ''
    },
    // 自定义验证规则
    rules: {
      type: Array as PropType<Validator[]>,
      default: () => []
    },
    // 表单项值
    modelValue: {
      type: [String, Number, Boolean, Array, Object],
      default: ''
    }
  },
  setup(props) {
    // 从父表单获取上下文
    const formContext = inject('form', null)
    
    // 错误信息
    const error = ref('')
    
    // 计算标签样式
    const labelStyle = computed(() => {
      if (formContext?.layout === 'horizontal' && formContext.labelWidth) {
        return { width: formContext.labelWidth }
      }
      return {}
    })
    
    // 验证表单项
    const validate = async () => {
      // 如果必填但值为空
      if (props.required) {
        const isEmpty = 
          props.modelValue === undefined || 
          props.modelValue === null || 
          props.modelValue === '' ||
          (Array.isArray(props.modelValue) && props.modelValue.length === 0)
        
        if (isEmpty) {
          error.value = `${props.label || props.name || '此项'} 是必填的`
          return false
        }
      }
      
      // 应用自定义验证规则
      if (props.rules.length > 0) {
        for (const rule of props.rules) {
          const result = await rule(props.modelValue)
          
          if (result !== true) {
            error.value = typeof result === 'string' ? result : `${props.label || props.name || '此项'} 验证失败`
            return false
          }
        }
      }
      
      // 验证通过，清除错误
      error.value = ''
      return true
    }
    
    // 重置表单项
    const resetField = () => {
      error.value = ''
    }
    
    // 注册到父表单
    onMounted(() => {
      if (formContext && formContext.addFormItem) {
        formContext.addFormItem({
          validate,
          resetField
        })
      }
    })
    
    // 从父表单移除
    onBeforeUnmount(() => {
      if (formContext && formContext.removeFormItem) {
        formContext.removeFormItem({
          validate,
          resetField
        })
      }
    })
    
    return {
      formContext,
      error,
      labelStyle,
      validate,
      resetField
    }
  }
})
</script>

<style scoped>
.form-item {
  margin-bottom: 1rem;
  width: 100%;
}

.form-item-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}

.form-item-label-required::before {
  content: '*';
  color: #ef4444;
  margin-right: 0.25rem;
}

.form-item-content {
  width: 100%;
}

/* 水平布局 */
.form-item-horizontal {
  display: flex;
  flex-wrap: wrap;
}

.form-item-horizontal .form-item-label {
  margin-bottom: 0;
  padding: 0.75rem 0;
  padding-right: 1rem;
  text-align: right;
}

.form-item-horizontal .form-item-content {
  flex: 1;
  min-width: 0;
}

/* 错误状态 */
.form-item-error :deep(input),
.form-item-error :deep(select),
.form-item-error :deep(textarea),
.form-item-error :deep(.input) {
  border-color: #ef4444 !important;
}

.form-item-error :deep(input:focus),
.form-item-error :deep(select:focus),
.form-item-error :deep(textarea:focus),
.form-item-error :deep(.input:focus) {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.form-item-error-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.form-item-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .form-item-horizontal {
    flex-direction: column;
  }
  
  .form-item-horizontal .form-item-label {
    width: 100% !important;
    text-align: left;
    margin-bottom: 0.5rem;
    padding: 0;
  }
}
</style> 