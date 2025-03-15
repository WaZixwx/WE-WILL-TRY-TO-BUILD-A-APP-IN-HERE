<!-- 
 * LightLink 个人资料设置页面
 * 展示用户资料信息
 * 支持编辑资料、修改密码、绑定手机号、绑定邮箱、实名认证、注销账号等功能
 * @author 开发者：WaZixwx, HanBai
 -->

<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="header-background" :style="{ backgroundImage: `url(${currentUser.backgroundImage || defaultBackground})` }">
        <button class="edit-background-btn" @click="uploadBackground">
          <i class="icon-camera"></i>
          更换背景
        </button>
      </div>
      <div class="user-profile-info">
        <div class="avatar-wrapper">
          <img :src="currentUser.avatar || defaultAvatar" alt="用户头像" class="profile-avatar" />
          <button class="change-avatar-btn" @click="uploadAvatar">
            <i class="icon-camera"></i>
          </button>
        </div>
        <div class="user-details">
          <h1>{{ currentUser.nickname }}</h1>
          <p class="user-id">LightLink ID: {{ currentUser.username }}</p>
          <p class="signature">{{ currentUser.signature || '这个人很懒，还没有设置个性签名' }}</p>
        </div>
        <button class="edit-profile-btn" @click="toggleEditMode">
          {{ isEditMode ? '保存' : '编辑资料' }}
        </button>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-sidebar">
        <div class="setting-navigation">
          <div 
            v-for="section in settingSections" 
            :key="section.id"
            class="setting-nav-item"
            :class="{ active: activeSection === section.id }"
            @click="activeSection = section.id"
          >
            <i :class="section.icon"></i>
            <span>{{ section.name }}</span>
          </div>
        </div>
      </div>

      <div class="profile-main">
        <!-- 基本资料设置 -->
        <div v-if="activeSection === 'basic'" class="setting-section">
          <h2>基本资料</h2>
          
          <div class="form-group">
            <label>昵称</label>
            <input 
              type="text" 
              v-model="editUserData.nickname" 
              :disabled="!isEditMode"
              placeholder="请输入昵称"
            />
          </div>
          
          <div class="form-group">
            <label>个性签名</label>
            <textarea 
              v-model="editUserData.signature" 
              :disabled="!isEditMode"
              placeholder="请输入个性签名"
              maxlength="100"
            ></textarea>
            <div class="character-count">{{ editUserData.signature?.length || 0 }}/100</div>
          </div>
          
          <div class="form-group">
            <label>性别</label>
            <select v-model="editUserData.gender" :disabled="!isEditMode">
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">不愿透露</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>生日</label>
            <input 
              type="date" 
              v-model="editUserData.birthday" 
              :disabled="!isEditMode"
            />
          </div>
          
          <button 
            v-if="isEditMode" 
            class="primary-btn save-btn"
            @click="saveProfile"
          >
            保存修改
          </button>
        </div>
        
        <!-- 账号安全设置 -->
        <div v-if="activeSection === 'security'" class="setting-section">
          <h2>账号与安全</h2>
          
          <div class="security-item">
            <div class="security-info">
              <h3>登录密码</h3>
              <p>用于保护账号安全，建议定期修改</p>
            </div>
            <button class="action-btn" @click="showChangePasswordModal = true">修改</button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <h3>手机号码</h3>
              <p>{{ formatPhone(currentUser.phone) || '未绑定' }}</p>
            </div>
            <button class="action-btn" @click="showBindPhoneModal = true">
              {{ currentUser.phone ? '修改' : '绑定' }}
            </button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <h3>邮箱地址</h3>
              <p>{{ formatEmail(currentUser.email) || '未绑定' }}</p>
            </div>
            <button class="action-btn" @click="showBindEmailModal = true">
              {{ currentUser.email ? '修改' : '绑定' }}
            </button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <h3>实名认证</h3>
              <p>{{ currentUser.isVerified ? '已认证' : '未认证' }}</p>
            </div>
            <button class="action-btn" @click="goToVerification">
              {{ currentUser.isVerified ? '查看' : '认证' }}
            </button>
          </div>
          
          <div class="security-item danger-zone">
            <div class="security-info">
              <h3>账号注销</h3>
              <p>注销后，账号数据将被永久删除且无法恢复</p>
            </div>
            <button class="danger-btn" @click="showDeleteAccountModal = true">注销账号</button>
          </div>
        </div>
        
        <!-- 隐私设置 -->
        <div v-if="activeSection === 'privacy'" class="setting-section">
          <h2>隐私设置</h2>
          
          <div class="privacy-item">
            <div class="privacy-info">
              <h3>加好友方式</h3>
              <p>设置其他用户添加您为好友的方式</p>
            </div>
            <select v-model="privacySettings.addFriendMethod">
              <option value="anyone">允许任何人添加</option>
              <option value="verification">需要验证</option>
              <option value="friends">仅允许好友添加</option>
              <option value="none">禁止任何人添加</option>
            </select>
          </div>
          
          <div class="privacy-item">
            <div class="privacy-info">
              <h3>随想可见性</h3>
              <p>设置社交圈子随想的默认可见范围</p>
            </div>
            <select v-model="privacySettings.momentVisibility">
              <option value="public">公开</option>
              <option value="friends">仅好友</option>
              <option value="private">私密</option>
            </select>
          </div>
          
          <div class="privacy-item">
            <div class="privacy-info">
              <h3>消息免打扰</h3>
              <p>开启后将不再接收消息通知</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="privacySettings.messageDoNotDisturb">
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="privacy-item">
            <div class="privacy-info">
              <h3>阅后即焚提示</h3>
              <p>开启后将接收阅后即焚消息提示</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="privacySettings.burnAfterReadNotification">
              <span class="slider"></span>
            </label>
          </div>
          
          <button class="primary-btn save-btn" @click="savePrivacySettings">
            保存设置
          </button>
        </div>
        
        <!-- 通用设置 -->
        <div v-if="activeSection === 'general'" class="setting-section">
          <h2>通用设置</h2>
          
          <div class="general-item">
            <div class="general-info">
              <h3>语言设置</h3>
              <p>选择应用界面语言</p>
            </div>
            <select v-model="generalSettings.language">
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁体中文</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
          
          <div class="general-item">
            <div class="general-info">
              <h3>主题设置</h3>
              <p>选择应用主题模式</p>
            </div>
            <select v-model="generalSettings.theme">
              <option value="light">白天模式</option>
              <option value="dark">夜间模式</option>
              <option value="system">跟随系统</option>
            </select>
          </div>
          
          <div class="general-item">
            <div class="general-info">
              <h3>字体大小</h3>
              <p>调整应用字体大小</p>
            </div>
            <select v-model="generalSettings.fontSize">
              <option value="small">小号字体</option>
              <option value="normal">标准字体</option>
              <option value="large">大号字体</option>
              <option value="xlarge">超大号字体</option>
            </select>
          </div>
          
          <div class="general-item">
            <div class="general-info">
              <h3>缓存清理</h3>
              <p>清理本地缓存，释放存储空间</p>
            </div>
            <button class="action-btn" @click="showCacheModal = true">管理缓存</button>
          </div>
          
          <button class="primary-btn save-btn" @click="saveGeneralSettings">
            保存设置
          </button>
        </div>
        
        <!-- 关于 -->
        <div v-if="activeSection === 'about'" class="setting-section">
          <h2>关于 LightLink</h2>
          
          <div class="about-logo">
            <img src="/logo.png" alt="LightLink Logo" />
            <h3>LightLink 安全聊天</h3>
            <p class="version">版本 1.0.0</p>
          </div>
          
          <div class="about-description">
            <p>LightLink 是一款面向未来的开源安全聊天软件，致力于打造一款部分开源、极致安全、高性能、用户至上的即时通讯工具。</p>
          </div>
          
          <div class="about-links">
            <a href="https://github.com/WaZixwx/WE-WILL-TRY-TO-BUILD-A-APP-IN-HERE" target="_blank" class="about-link">
              <i class="icon-github"></i>
              GitHub 仓库
            </a>
            <a href="mailto:rostos@163.com" class="about-link">
              <i class="icon-mail"></i>
              联系我们
            </a>
            <a href="#" class="about-link" @click.prevent="showPrivacyPolicy">
              <i class="icon-shield"></i>
              隐私政策
            </a>
            <a href="#" class="about-link" @click.prevent="showTermsOfService">
              <i class="icon-file-text"></i>
              服务条款
            </a>
          </div>
          
          <div class="about-footer">
            <p>© 2023 LightLink Team. All rights reserved.</p>
            <p>开发者：WaZixwx, HanBai</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 模态框组件，省略具体实现 -->
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'

export default defineComponent({
  name: 'ProfilePage',
  setup() {
    // 当前用户数据（模拟数据）
    const currentUser = reactive({
      id: '1001',
      username: 'user1001',
      nickname: '光之连接者',
      avatar: '',
      backgroundImage: '',
      signature: '连接世界，守护隐私',
      gender: 'male',
      birthday: '1990-01-01',
      phone: '13800138000',
      email: 'user@example.com',
      isVerified: false
    })
    
    // 默认图片
    const defaultAvatar = '/default-avatar.png'
    const defaultBackground = '/default-background.jpg'
    
    // 编辑模式
    const isEditMode = ref(false)
    const editUserData = reactive({ ...currentUser })
    
    // 当前激活的设置部分
    const activeSection = ref('basic')
    
    // 设置导航项
    const settingSections = [
      { id: 'basic', name: '基本资料', icon: 'icon-user' },
      { id: 'security', name: '账号与安全', icon: 'icon-shield' },
      { id: 'privacy', name: '隐私设置', icon: 'icon-lock' },
      { id: 'general', name: '通用设置', icon: 'icon-settings' },
      { id: 'about', name: '关于', icon: 'icon-info' }
    ]
    
    // 隐私设置
    const privacySettings = reactive({
      addFriendMethod: 'verification',
      momentVisibility: 'friends',
      messageDoNotDisturb: false,
      burnAfterReadNotification: true
    })
    
    // 通用设置
    const generalSettings = reactive({
      language: 'zh-CN',
      theme: 'light',
      fontSize: 'normal'
    })
    
    // 模态框显示状态
    const showChangePasswordModal = ref(false)
    const showBindPhoneModal = ref(false)
    const showBindEmailModal = ref(false)
    const showDeleteAccountModal = ref(false)
    const showCacheModal = ref(false)
    
    // 切换编辑模式
    const toggleEditMode = () => {
      if (isEditMode.value) {
        // 保存修改
        saveProfile()
      } else {
        // 进入编辑模式
        Object.assign(editUserData, currentUser)
      }
      isEditMode.value = !isEditMode.value
    }
    
    // 保存个人资料
    const saveProfile = () => {
      // 实际应用中这里会调用API保存数据
      Object.assign(currentUser, editUserData)
      isEditMode.value = false
      alert('个人资料保存成功')
    }
    
    // 上传头像
    const uploadAvatar = () => {
      // 实际应用中这里会打开文件选择对话框
      alert('上传头像功能待实现')
    }
    
    // 上传背景图片
    const uploadBackground = () => {
      // 实际应用中这里会打开文件选择对话框
      alert('上传背景图片功能待实现')
    }
    
    // 保存隐私设置
    const savePrivacySettings = () => {
      // 实际应用中这里会调用API保存数据
      alert('隐私设置保存成功')
    }
    
    // 保存通用设置
    const saveGeneralSettings = () => {
      // 实际应用中这里会调用API保存数据
      alert('通用设置保存成功')
    }
    
    // 格式化手机号码（部分隐藏）
    const formatPhone = (phone: string) => {
      if (!phone) return ''
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
    
    // 格式化邮箱地址（部分隐藏）
    const formatEmail = (email: string) => {
      if (!email) return ''
      const [name, domain] = email.split('@')
      if (name.length <= 2) return email
      return `${name.substring(0, 2)}***@${domain}`
    }
    
    // 跳转到实名认证页面
    const goToVerification = () => {
      // 实际应用中这里会跳转到实名认证页面
      alert('实名认证功能待实现')
    }
    
    // 显示隐私政策
    const showPrivacyPolicy = () => {
      // 实际应用中这里会显示隐私政策内容
      alert('隐私政策内容待实现')
    }
    
    // 显示服务条款
    const showTermsOfService = () => {
      // 实际应用中这里会显示服务条款内容
      alert('服务条款内容待实现')
    }
    
    return {
      currentUser,
      defaultAvatar,
      defaultBackground,
      isEditMode,
      editUserData,
      activeSection,
      settingSections,
      privacySettings,
      generalSettings,
      showChangePasswordModal,
      showBindPhoneModal,
      showBindEmailModal,
      showDeleteAccountModal,
      showCacheModal,
      toggleEditMode,
      saveProfile,
      uploadAvatar,
      uploadBackground,
      savePrivacySettings,
      saveGeneralSettings,
      formatPhone,
      formatEmail,
      goToVerification,
      showPrivacyPolicy,
      showTermsOfService
    }
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  position: relative;
  margin-bottom: 2rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px var(--shadow, rgba(0, 0, 0, 0.1));
}

.header-background {
  position: relative;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: var(--primary-light, #60a5fa);
}

.edit-background-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: var(--dark, rgba(0, 0, 0, 0.5));
  color: var(--white, #ffffff);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-background-btn:hover {
  background: var(--dark, rgba(0, 0, 0, 0.7));
}

.user-profile-info {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: var(--white, #ffffff);
  position: relative;
}

.avatar-wrapper {
  position: relative;
  margin-right: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--white, #ffffff);
  object-fit: cover;
  box-shadow: 0 4px 6px var(--shadow, rgba(0, 0, 0, 0.1));
  margin-top: -60px;
}

.change-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: var(--primary-light, #60a5fa);
}

.user-details {
  flex: 1;
}

.user-details h1 {
  color: var(--text, #1e293b);
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.user-id {
  color: var(--text-light, #64748b);
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.signature {
  color: var(--text, #1e293b);
  margin: 0;
  font-size: 1rem;
}

.edit-profile-btn {
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-profile-btn:hover {
  background: var(--primary-light, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.profile-content {
  display: flex;
  gap: 2rem;
}

.profile-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.setting-navigation {
  background: var(--white, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px var(--shadow, rgba(0, 0, 0, 0.1));
}

.setting-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text, #1e293b);
}

.setting-nav-item.active {
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
}

.setting-nav-item:hover:not(.active) {
  background: var(--bg-light, #f8fafc);
}

.profile-main {
  flex: 1;
  background: var(--white, #ffffff);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 4px var(--shadow, rgba(0, 0, 0, 0.1));
}

.setting-section h2 {
  color: var(--text, #1e293b);
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border, #e2e8f0);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--text, #1e293b);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  background: var(--white, #ffffff);
  color: var(--text, #1e293b);
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.character-count {
  text-align: right;
  color: var(--text-light, #64748b);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.primary-btn {
  background: var(--primary, #2563eb);
  color: var(--white, #ffffff);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: var(--primary-light, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.save-btn {
  margin-top: 1rem;
}

.security-item,
.privacy-item,
.general-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border, #e2e8f0);
}

.security-item:last-child,
.privacy-item:last-child,
.general-item:last-child {
  border-bottom: none;
}

.security-info h3,
.privacy-info h3,
.general-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text, #1e293b);
  font-size: 1.1rem;
}

.security-info p,
.privacy-info p,
.general-info p {
  margin: 0;
  color: var(--text-light, #64748b);
  font-size: 0.9rem;
}

.action-btn {
  background: var(--secondary, #f1f5f9);
  color: var(--text, #1e293b);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.danger-zone {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px dashed var(--error, #ef4444);
}

.danger-btn {
  background: var(--error, #ef4444);
  color: var(--white, #ffffff);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary, #2563eb);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.about-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.about-logo img {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.about-logo h3 {
  margin: 0;
  color: var(--text, #1e293b);
  font-size: 1.3rem;
}

.version {
  color: var(--text-light, #64748b);
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
}

.about-description {
  text-align: center;
  margin-bottom: 2rem;
}

.about-description p {
  color: var(--text, #1e293b);
  line-height: 1.6;
}

.about-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.about-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--secondary, #f1f5f9);
  color: var(--text, #1e293b);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.about-link:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.about-footer {
  text-align: center;
  color: var(--text-light, #64748b);
  font-size: 0.9rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border, #e2e8f0);
}

.about-footer p {
  margin: 0.25rem 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
  
  .setting-navigation {
    display: flex;
    overflow-x: auto;
  }
  
  .setting-nav-item {
    white-space: nowrap;
  }
  
  .security-item,
  .privacy-item,
  .general-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-btn,
  select {
    width: 100%;
  }
}
</style> 