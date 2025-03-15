<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>LightLink</h1>
        <p>欢迎回来，请登录您的账号</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名/邮箱/手机号</label>
          <input 
            type="text" 
            id="username" 
            v-model="loginForm.username"
            placeholder="请输入用户名/邮箱/手机号"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginForm.password"
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="loginForm.remember" />
            <label for="remember">记住我</label>
          </div>
          <router-link to="/forgot-password" class="forgot-password">忘记密码?</router-link>
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        
        <div class="login-footer">
          <p>还没有账号? <router-link to="/register">立即注册</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isLoading = ref(false)
    
    const loginForm = reactive({
      username: '',
      password: '',
      remember: false
    })
    
    const handleLogin = async () => {
      try {
        isLoading.value = true
        
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 模拟登录成功
        localStorage.setItem('token', 'mock-jwt-token')
        
        // 如果有重定向，则跳转到重定向地址
        const redirectPath = route.query.redirect as string || '/chat'
        router.push(redirectPath)
        
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      loginForm,
      isLoading,
      handleLogin
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--secondary, #f1f5f9);
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background: var(--white, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--shadow, rgba(0, 0, 0, 0.1));
  padding: 2.5rem;
  animation: fadeInScale 0.5s ease forwards;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 2rem;
  color: var(--primary, #2563eb);
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--text-light, #64748b);
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: var(--text, #1e293b);
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  outline: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-me input[type="checkbox"] {
  accent-color: var(--primary, #2563eb);
}

.forgot-password {
  color: var(--primary, #2563eb);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.forgot-password:hover {
  color: var(--primary-light, #60a5fa);
  text-decoration: underline;
}

.login-button {
  padding: 0.9rem;
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover:not(:disabled) {
  background: var(--primary-light, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-light, #64748b);
}

.login-footer a {
  color: var(--primary, #2563eb);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-footer a:hover {
  color: var(--primary-light, #60a5fa);
  text-decoration: underline;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 576px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .login-container {
    padding: 1rem;
  }
}
</style> 