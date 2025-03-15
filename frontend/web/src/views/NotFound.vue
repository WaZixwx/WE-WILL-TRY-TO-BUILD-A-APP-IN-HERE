<!-- 
 * LightLink 404页面
 * 展示用户访问的页面不存在或已被移除
 * @author 开发者：WaZixwx, HanBai
 -->

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <router-link to="/" class="back-home-btn">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFoundPage',
  setup() {
    return {}
  }
})
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-light, #f8fafc);
}

.not-found-content {
  text-align: center;
  padding: 2rem;
  max-width: 500px;
  background: var(--white, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 6px var(--shadow, rgba(0, 0, 0, 0.1));
  animation: fadeIn 0.6s ease-in-out;
}

.not-found-content h1 {
  font-size: 6rem;
  color: var(--primary, #2563eb);
  margin: 0;
  font-weight: 700;
  line-height: 1;
}

.not-found-content h2 {
  font-size: 2rem;
  color: var(--text, #1e293b);
  margin: 1rem 0;
}

.not-found-content p {
  color: var(--text-light, #64748b);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.back-home-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  background: var(--primary-light, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .not-found-content h1 {
    font-size: 4rem;
  }
  
  .not-found-content h2 {
    font-size: 1.5rem;
  }
}
</style> 