<template>
  <form 
    class="form" 
    :class="[layout && `form-${layout}`]"
    @submit.prevent="handleSubmit"
  >
    <slot></slot>
  </form>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'

export default defineComponent({
  name: 'LightForm',
  props: {
    // 表单布局
    layout: {
      type: String,
      default: 'vertical',
      validator: (value: string) => ['vertical', 'horizontal', 'inline'].includes(value)
    },
    // 标签宽度 (用于水平布局)
    labelWidth: {
      type: [String, Number],
      default: '120px'
    },
    // 是否禁用表单
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    // 表单项注册
    const formItems = ref(new Set<any>())
    
    // 处理表单提交
    const handleSubmit = (event: Event) => {
      emit('submit', event)
    }
    
    // 获取表单项错误状态
    const validate = async () => {
      // 包含所有表单项验证结果的数组
      const results = []
      
      // 对每个表单项进行验证
      for (const formItem of formItems.value) {
        if (typeof formItem.validate === 'function') {
          const result = await formItem.validate()
          results.push(result)
        }
      }
      
      // 所有表单项都验证通过才返回true
      return results.every(result => result)
    }
    
    // 重置表单
    const resetFields = () => {
      for (const formItem of formItems.value) {
        if (typeof formItem.resetField === 'function') {
          formItem.resetField()
        }
      }
    }
    
    // 添加表单项
    const addFormItem = (item: any) => {
      formItems.value.add(item)
    }
    
    // 移除表单项
    const removeFormItem = (item: any) => {
      formItems.value.delete(item)
    }
    
    // 提供表单配置给子组件
    provide('form', {
      layout: props.layout,
      labelWidth: props.labelWidth,
      disabled: props.disabled,
      addFormItem,
      removeFormItem
    })
    
    return {
      handleSubmit,
      validate,
      resetFields
    }
  }
})
</script>

<style scoped>
.form {
  margin-bottom: 1rem;
}

/* 垂直布局 */
.form-vertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 水平布局 */
.form-horizontal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 行内布局 */
.form-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}

.form-inline :deep(.form-item) {
  margin-bottom: 0;
  display: inline-flex;
  align-items: center;
}

@media (max-width: 640px) {
  .form-inline {
    flex-direction: column;
  }
  
  .form-inline :deep(.form-item) {
    width: 100%;
  }
}
</style> 