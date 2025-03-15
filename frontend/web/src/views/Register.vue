<!-- 
  * LightLink 注册页面
  * 展示用户注册页面
  * 支持注册账号、切换至登录账号等功能
 * @author 开发者：WaZixwx, HanBai
 -->

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>LightLink</h1>
        <p>创建您的账号，开始安全沟通</p>
      </div>
      
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="phone">手机号</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="registerForm.phone"
            placeholder="请输入手机号码"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="registerForm.username"
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="registerForm.password"
            placeholder="请设置密码，至少8位"
            required
            minlength="8"
          />
          <div class="password-strength" :class="passwordStrengthClass">
            <div class="strength-bar"></div>
            <span class="strength-text">{{ passwordStrengthText }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
            required
          />
          <div class="password-match" v-if="registerForm.confirmPassword">
            <span v-if="passwordsMatch" class="match-success">密码匹配</span>
            <span v-else class="match-error">密码不匹配</span>
          </div>
        </div>
        
        <div class="terms-agreement">
          <input type="checkbox" id="terms" v-model="registerForm.agreeTerms" required />
          <label for="terms">
            我已阅读并同意
            <a href="#" @click.prevent="showTerms">《用户服务协议》</a>
            和
            <a href="#" @click.prevent="showPrivacy">《隐私政策》</a>
          </label>
        </div>
        
        <button type="submit" class="register-button" :disabled="isLoading || !formValid">
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>
        
        <div class="register-footer">
          <p>已有账号? <router-link to="/login">立即登录</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)
    
    const registerForm = reactive({
      email: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })
    
    // 密码强度检查
    const passwordStrength = computed(() => {
      const password = registerForm.password
      if (!password) return 0
      
      let strength = 0
      
      // 长度检查
      if (password.length >= 8) strength += 1
      if (password.length >= 12) strength += 1
      
      // 复杂度检查
      if (/[A-Z]/.test(password)) strength += 1
      if (/[a-z]/.test(password)) strength += 1
      if (/[0-9]/.test(password)) strength += 1
      if (/[^A-Za-z0-9]/.test(password)) strength += 1
      
      return Math.min(strength, 5)
    })
    
    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value
      if (strength === 0) return 'strength-none'
      if (strength <= 2) return 'strength-weak'
      if (strength <= 4) return 'strength-medium'
      return 'strength-strong'
    })
    
    const passwordStrengthText = computed(() => {
      const strength = passwordStrength.value
      if (strength === 0) return '请输入密码'
      if (strength <= 2) return '弱'
      if (strength <= 4) return '中'
      return '强'
    })
    
    // 密码匹配检查
    const passwordsMatch = computed(() => 
      registerForm.password === registerForm.confirmPassword && 
      registerForm.confirmPassword !== ''
    )
    
    // 表单验证
    const formValid = computed(() => 
      registerForm.email && 
      registerForm.phone && 
      registerForm.username && 
      registerForm.password && 
      registerForm.password.length >= 8 && 
      passwordsMatch.value && 
      registerForm.agreeTerms
    )
    
    // 处理注册
    const handleRegister = async () => {
      if (!formValid.value) return
      
      try {
        isLoading.value = true
        
        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 模拟注册成功
        localStorage.setItem('token', 'mock-jwt-token')
        
        // 跳转到聊天页面
        router.push('/chat')
        
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    // 显示条款
    const showTerms = () => {
      alert('用户服务协议内容')
    }
    
    // 显示隐私政策
    const showPrivacy = () => {
      alert('隐私政策内容')
    }
    
    return {
      registerForm,
      isLoading,
      passwordStrengthClass,
      passwordStrengthText,
      passwordsMatch,
      formValid,
      handleRegister,
      showTerms,
      showPrivacy
    }
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--secondary, #f1f5f9);
  padding: 2rem;
}

.register-card {
  width: 100%;
  max-width: 520px;
  background: var(--white, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--shadow, rgba(0, 0, 0, 0.1));
  padding: 2.5rem;
  animation: fadeInScale 0.5s ease forwards;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  font-size: 2rem;
  color: var(--primary, #2563eb);
  margin-bottom: 0.5rem;
}

.register-header p {
  color: var(--text-light, #64748b);
  font-size: 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.strength-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-none .strength-bar::before {
  width: 0%;
  background-color: #e2e8f0;
}

.strength-weak .strength-bar::before {
  width: 33%;
  background-color: #ef4444;
}

.strength-medium .strength-bar::before {
  width: 66%;
  background-color: #f59e0b;
}

.strength-strong .strength-bar::before {
  width: 100%;
  background-color: #10b981;
}

.strength-text {
  display: block;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  text-align: right;
}

.strength-none .strength-text {
  color: var(--text-light, #64748b);
}

.strength-weak .strength-text {
  color: #ef4444;
}

.strength-medium .strength-text {
  color: #f59e0b;
}

.strength-strong .strength-text {
  color: #10b981;
}

.password-match {
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.match-success {
  color: #10b981;
}

.match-error {
  color: #ef4444;
}

.terms-agreement {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.terms-agreement input[type="checkbox"] {
  margin-top: 0.25rem;
  accent-color: var(--primary, #2563eb);
}

.terms-agreement label {
  font-size: 0.9rem;
  color: var(--text, #1e293b);
  line-height: 1.4;
}

.terms-agreement a {
  color: var(--primary, #2563eb);
  text-decoration: none;
  transition: all 0.3s ease;
}

.terms-agreement a:hover {
  color: var(--primary-light, #60a5fa);
  text-decoration: underline;
}

.register-button {
  padding: 0.9rem;
  margin-top: 0.5rem;
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-button:hover:not(:disabled) {
  background: var(--primary-light, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-light, #64748b);
}

.register-footer a {
  color: var(--primary, #2563eb);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.register-footer a:hover {
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
  .register-card {
    padding: 1.5rem;
  }
  
  .register-container {
    padding: 1rem;
  }
}
</style> 