<template>
  <div class="container">
    <header class="header">
      <h1>LightLink</h1>
      <p>面向未来的开源安全聊天软件</p>
    </header>
    
    <div class="features-section animate-slide-in">
      <div class="feature-card">
        <div class="feature-icon">
          <i class="icon-security"></i>
        </div>
        <h3>极致安全</h3>
        <p>采用先进加密技术，全链路多层次保障用户通信隐私，数据安全存储</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="icon-performance"></i>
        </div>
        <h3>高性能体验</h3>
        <p>采用Rust语言打造高性能后端，确保快速响应和稳定运行</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="icon-user"></i>
        </div>
        <h3>用户友好</h3>
        <p>现代简洁的界面设计，操作逻辑直观自然，让沟通回归简单高效</p>
      </div>
    </div>
    
    <div class="action-section">
      <router-link to="/register" class="primary-btn">
        立即注册
      </router-link>
      <router-link to="/login" class="secondary-btn">
        登录账号
      </router-link>
    </div>
    
    <div class="schedule-list">
      <h2>LightLink 特色功能</h2>
      
      <div class="schedule-item">
        <div>
          <h3>私聊与群聊</h3>
          <p>支持文本、图片、语音、视频、文件等多种消息类型</p>
        </div>
      </div>
      
      <div class="schedule-item">
        <div>
          <h3>语音视频通话</h3>
          <p>高清流畅的语音/视频通话，让沟通无障碍</p>
        </div>
      </div>
      
      <div class="schedule-item">
        <div>
          <h3>LightLink钱包</h3>
          <p>安全快捷的支付体验，方便好友间转账</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
  setup() {
    return {}
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.header h1 {
  font-size: 2.5rem;
  color: var(--primary, #2563eb);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header p {
  color: var(--text-light, #64748b);
  font-size: 1.1rem;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: var(--white, #ffffff);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px var(--shadow, rgba(0, 0, 0, 0.1));
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 12px var(--shadow-lg, rgba(0, 0, 0, 0.15));
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light, #60a5fa);
  border-radius: 50%;
  color: var(--white, #ffffff);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text, #1e293b);
}

.feature-card p {
  color: var(--text-light, #64748b);
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 3rem 0;
}

.primary-btn, .secondary-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.primary-btn {
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
}

.primary-btn:hover {
  background: var(--primary-light, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.secondary-btn {
  background: var(--secondary, #f1f5f9);
  color: var(--text, #1e293b);
}

.secondary-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.schedule-list {
  margin-top: 3rem;
  opacity: 0;
  animation: slideIn 0.8s ease forwards;
}

.schedule-list h2 {
  font-size: 1.8rem;
  color: var(--text, #1e293b);
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  border-left: 4px solid var(--primary, #2563eb);
}

.schedule-item {
  background: var(--white, #ffffff);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px var(--shadow, rgba(0, 0, 0, 0.1));
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-item:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px var(--shadow-lg, rgba(0, 0, 0, 0.15));
}

.schedule-item h3 {
  color: var(--text, #1e293b);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.schedule-item p {
  color: var(--text-light, #64748b);
  font-size: 0.9rem;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
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
  .features-section {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
  }
  
  .container {
    padding: 1rem;
  }
}
</style> 