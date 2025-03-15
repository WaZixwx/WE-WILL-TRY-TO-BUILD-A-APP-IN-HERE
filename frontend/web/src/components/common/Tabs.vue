<template>
  <div class="tabs-container" :class="[`tabs-${type}`]">
    <!-- 标签页导航 -->
    <div
      class="tabs-nav"
      role="tablist"
      :class="{ 'tabs-nav-centered': centered, 'tabs-nav-fullwidth': fullWidth }"
    >
      <div v-if="$slots.prepend" class="tabs-prepend">
        <slot name="prepend"></slot>
      </div>
      
      <div class="tabs-nav-items" :class="{ 'tabs-nav-scrollable': scrollable }">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.name || index"
          class="tabs-nav-item"
          :class="{ 'tabs-nav-item-active': tab.name === modelValue }"
          role="tab"
          :aria-selected="tab.name === modelValue"
          :aria-controls="`tab-panel-${tab.name}`"
          :id="`tab-${tab.name}`"
          @click="changeTab(tab.name)"
          :disabled="tab.disabled"
        >
          <slot name="tab" :tab="tab">
            <span v-if="tab.icon" class="tabs-icon">
              <component :is="tab.icon" />
            </span>
            {{ tab.label }}
            <span v-if="tab.badge" class="tabs-badge">{{ tab.badge }}</span>
          </slot>
        </button>
        
        <div v-if="type === 'slider'" class="tabs-slider" :style="sliderStyle"></div>
      </div>
      
      <div v-if="$slots.append" class="tabs-append">
        <slot name="append"></slot>
      </div>
    </div>

    <!-- 标签页内容 -->
    <div class="tabs-content">
      <transition
        :name="transition"
        mode="out-in"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="tab.name || index"
          v-show="tab.name === modelValue"
          class="tabs-panel"
          role="tabpanel"
          :aria-labelledby="`tab-${tab.name}`"
          :id="`tab-panel-${tab.name}`"
        >
          <slot :name="tab.name"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, nextTick } from 'vue'

export interface TabItem {
  name: string
  label: string
  icon?: any
  badge?: string | number
  disabled?: boolean
}

export default defineComponent({
  name: 'LightTabs',
  props: {
    // 选中的标签页，支持 v-model
    modelValue: {
      type: String,
      required: true
    },
    // 标签页配置
    tabs: {
      type: Array as () => TabItem[],
      required: true
    },
    // 标签页类型
    type: {
      type: String,
      default: 'default',
      validator: (value: string) => ['default', 'slider', 'card', 'pills'].includes(value)
    },
    // 是否居中显示
    centered: {
      type: Boolean,
      default: false
    },
    // 是否充满宽度
    fullWidth: {
      type: Boolean,
      default: false
    },
    // 是否支持滚动
    scrollable: {
      type: Boolean,
      default: false
    },
    // 切换动画
    transition: {
      type: String,
      default: 'fade'
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const tabsNavRef = ref<HTMLElement | null>(null)
    const activeTabRef = ref<HTMLElement | null>(null)
    const activeTabIndex = ref(0)
    
    // 滑块样式计算
    const sliderStyle = computed(() => {
      if (!activeTabRef.value) return {}
      
      const tab = activeTabRef.value
      const left = tab.offsetLeft
      const width = tab.offsetWidth
      
      return {
        left: `${left}px`,
        width: `${width}px`
      }
    })
    
    // 切换标签页
    const changeTab = (name: string) => {
      const tab = props.tabs.find(t => t.name === name)
      if (tab && !tab.disabled) {
        emit('update:modelValue', name)
        emit('change', name)
      }
    }
    
    // 更新活动标签索引
    const updateActiveTabIndex = () => {
      activeTabIndex.value = props.tabs.findIndex(t => t.name === props.modelValue)
    }
    
    // 监听选中的标签页变更
    watch(() => props.modelValue, () => {
      updateActiveTabIndex()
      nextTick(() => {
        updateActiveTabElement()
      })
    })
    
    // 更新活动标签元素引用
    const updateActiveTabElement = () => {
      if (!tabsNavRef.value) return
      
      const navItems = tabsNavRef.value.querySelectorAll('.tabs-nav-item')
      if (navItems.length > activeTabIndex.value) {
        activeTabRef.value = navItems[activeTabIndex.value] as HTMLElement
      }
    }
    
    // 组件挂载完成后初始化
    onMounted(() => {
      updateActiveTabIndex()
      nextTick(() => {
        tabsNavRef.value = document.querySelector('.tabs-nav')
        updateActiveTabElement()
      })
    })
    
    return {
      sliderStyle,
      changeTab
    }
  }
})
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

/* 导航样式 */
.tabs-nav {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  position: relative;
}

.tabs-nav-centered {
  justify-content: center;
}

.tabs-nav-fullwidth .tabs-nav-items {
  flex-grow: 1;
}

.tabs-nav-fullwidth .tabs-nav-item {
  flex: 1;
  text-align: center;
}

.tabs-nav-scrollable {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.tabs-nav-scrollable::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.tabs-nav-items {
  display: flex;
  align-items: center;
  position: relative;
}

.tabs-prepend,
.tabs-append {
  padding: 0 1rem;
}

.tabs-nav-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-light);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tabs-nav-item:hover {
  color: var(--primary);
}

.tabs-nav-item-active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tabs-nav-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tabs-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tabs-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  color: var(--white);
  background-color: var(--primary);
  border-radius: 9999px;
}

/* 滑块样式 */
.tabs-slider {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background-color: var(--primary);
  transition: all 0.3s ease;
}

/* 卡片样式 */
.tabs-card .tabs-nav {
  border-bottom: none;
  gap: 0.25rem;
}

.tabs-card .tabs-nav-item {
  border: 1px solid #e2e8f0;
  border-bottom: none;
  border-radius: 0.375rem 0.375rem 0 0;
  background-color: #f8fafc;
}

.tabs-card .tabs-nav-item-active {
  background-color: var(--white);
  color: var(--primary);
  border-color: #e2e8f0;
  margin-bottom: -1px;
  padding-bottom: calc(0.75rem + 1px);
}

/* 胶囊样式 */
.tabs-pills .tabs-nav {
  border-bottom: none;
  gap: 0.5rem;
}

.tabs-pills .tabs-nav-item {
  border-radius: 9999px;
  border: none;
  padding: 0.5rem 1rem;
}

.tabs-pills .tabs-nav-item-active {
  background-color: var(--primary);
  color: var(--white);
}

/* 内容样式 */
.tabs-content {
  width: 100%;
}

.tabs-panel {
  width: 100%;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style> 