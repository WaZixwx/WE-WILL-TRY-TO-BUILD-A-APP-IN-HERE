<!-- 
 * LightLink 聊天页面
 * 展示用户之间的聊天记录
 * 支持发送文字、图片、文件、语音消息
 * 支持创建群聊
 * @author 开发者：WaZixwx, HanBai
 -->

<template>
  <div class="chat-container">
    <!-- 左侧会话列表 -->
    <div class="sidebar">
      <div class="user-profile">
        <div class="avatar-container">
          <img :src="currentUser.avatar || defaultAvatar" alt="用户头像" class="user-avatar" />
          <div class="status-indicator online"></div>
        </div>
        <div class="user-info">
          <h3>{{ currentUser.nickname }}</h3>
          <p class="status">在线</p>
        </div>
      </div>
      
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="搜索会话" 
          v-model="searchQuery"
          @input="filterConversations"
        />
        <button class="search-icon">
          <i class="icon-search"></i>
        </button>
      </div>

      <div class="conversation-tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'recent' }"
          @click="activeTab = 'recent'"
        >
          最近会话
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'contacts' }"
          @click="activeTab = 'contacts'"
        >
          联系人
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'groups' }"
          @click="activeTab = 'groups'"
        >
          群组
        </div>
      </div>

      <div class="conversation-list">
        <div 
          v-for="conversation in filteredConversations" 
          :key="conversation.id"
          class="conversation-item"
          :class="{ active: selectedConversation && selectedConversation.id === conversation.id }"
          @click="selectConversation(conversation)"
        >
          <div class="avatar-container">
            <img :src="conversation.avatar || defaultAvatar" alt="会话头像" class="conversation-avatar" />
            <div class="status-indicator" :class="conversation.isOnline ? 'online' : 'offline'"></div>
          </div>
          <div class="conversation-info">
            <div class="conversation-header">
              <h4>{{ conversation.name }}</h4>
              <span class="time">{{ formatTime(conversation.lastMessageTime) }}</span>
            </div>
            <div class="conversation-preview">
              <p>{{ truncateMessage(conversation.lastMessage) }}</p>
              <div v-if="conversation.unreadCount > 0" class="unread-badge">
                {{ conversation.unreadCount > 99 ? '99+' : conversation.unreadCount }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredConversations.length === 0" class="empty-state">
          <p>{{ getEmptyStateMessage() }}</p>
        </div>
      </div>
      
      <div class="create-new">
        <button class="new-chat-btn" @click="createNewChat">
          <i class="icon-plus"></i>
          新建会话
        </button>
      </div>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-area">
      <template v-if="selectedConversation">
        <div class="chat-header">
          <div class="conversation-info">
            <h2>{{ selectedConversation.name }}</h2>
            <p class="participant-info">
              {{ getParticipantInfo() }}
            </p>
          </div>
          <div class="chat-actions">
            <button class="action-btn" title="语音通话">
              <i class="icon-phone"></i>
            </button>
            <button class="action-btn" title="视频通话">
              <i class="icon-video"></i>
            </button>
            <button class="action-btn" title="会话信息">
              <i class="icon-info"></i>
            </button>
          </div>
        </div>

        <div class="messages-container" ref="messagesContainer">
          <div class="date-separator">
            <span>{{ formatDate(today) }}</span>
          </div>
          
          <div 
            v-for="message in currentMessages" 
            :key="message.id"
            class="message"
            :class="{
              'message-sent': message.senderId === currentUser.id,
              'message-received': message.senderId !== currentUser.id
            }"
          >
            <div class="message-avatar" v-if="message.senderId !== currentUser.id">
              <img :src="getMessageSenderAvatar(message)" alt="发送者头像" />
            </div>
            <div class="message-content">
              <div class="message-sender" v-if="isGroupChat && message.senderId !== currentUser.id">
                {{ getMessageSenderName(message) }}
              </div>
              <div class="message-bubble" :class="{ 
                'burn-after-read': message.burnAfterRead,
                'destroying': message.countdown === 1
              }">
                <div class="burn-indicator" v-if="message.burnAfterRead">
                  <i class="icon-fire"></i>
                  <span v-if="!message.isRead || message.senderId === currentUser.id">{{ message.burnAfterReadTime || 10 }}秒</span>
                  <span v-else-if="message.countdown">{{ message.countdown }}秒</span>
                  <span v-else>即将销毁</span>
                </div>
                <p v-if="message.type === 'text'" :class="{ 'destroyed': message.isDestroyed }">{{ message.content }}</p>
                <img 
                  v-else-if="message.type === 'image'" 
                  :src="message.content" 
                  alt="图片消息"
                  @click="previewImage(message.content)"
                  class="message-image"
                />
                <div v-else-if="message.type === 'file'" class="file-message">
                  <i class="icon-file"></i>
                  <div class="file-info">
                    <p class="file-name">{{ getFileName(message.content) }}</p>
                    <p class="file-size">{{ getFileSize(message.size) }}</p>
                  </div>
                  <button class="download-btn">
                    <i class="icon-download"></i>
                  </button>
                </div>
                <div v-else-if="message.type === 'voice'" class="voice-message">
                  <button class="play-btn" @click="playVoiceMessage(message)">
                    <i :class="isPlayingVoice(message) ? 'icon-pause' : 'icon-play'"></i>
                  </button>
                  <div class="voice-wave">
                    <!-- 语音波形图 -->
                    <div class="voice-duration">{{ formatVoiceDuration(message.duration) }}</div>
                  </div>
                </div>
              </div>
              <div class="message-time">
                {{ formatMessageTime(message.timestamp) }}
              </div>
            </div>
          </div>
          
          <div class="loading-messages" v-if="isLoadingMessages">
            <div class="loading-spinner"></div>
            <span>加载更多消息...</span>
          </div>
        </div>

        <div class="message-input-area">
          <div class="message-toolbar">
            <button class="toolbar-btn" title="表情" @click="toggleEmojiPicker">
              <i class="icon-emoji"></i>
            </button>
            <button class="toolbar-btn" title="图片" @click="uploadImage">
              <i class="icon-image"></i>
              <input type="file" ref="imageInput" accept="image/*" style="display:none" @change="handleImageUpload" />
            </button>
            <button class="toolbar-btn" title="文件" @click="uploadFile">
              <i class="icon-attachment"></i>
              <input type="file" ref="fileInput" style="display:none" @change="handleFileUpload" />
            </button>
            <button class="toolbar-btn" title="语音消息" @mousedown="startRecording" @mouseup="stopRecording" @mouseleave="cancelRecording">
              <i class="icon-microphone"></i>
            </button>
            <button 
              class="toolbar-btn" 
              :class="{ 'active': isBurnAfterReadActive }" 
              title="阅后即焚" 
              @click="toggleBurnAfterRead"
            >
              <i class="icon-fire"></i>
            </button>
          </div>
          
          <div class="burn-time-selector" v-if="isBurnAfterReadActive">
            <span>销毁时间:</span>
            <select v-model="burnAfterReadTime">
              <option value="5">5秒</option>
              <option value="10">10秒</option>
              <option value="30">30秒</option>
              <option value="60">1分钟</option>
              <option value="300">5分钟</option>
            </select>
            <i class="icon-help" @click="showBurnAfterReadHelp"></i>
          </div>
          
          <div class="emoji-picker" v-if="showEmojiPicker">
            <div class="emoji-categories">
              <button v-for="category in emojiCategories" :key="category.id" class="emoji-category">
                <i :class="`icon-${category.icon}`"></i>
              </button>
            </div>
            <div class="emoji-grid">
              <button v-for="emoji in currentEmojiCategory" :key="emoji" class="emoji-item" @click="insertEmoji(emoji)">
                {{ emoji }}
              </button>
            </div>
          </div>
          
          <div class="input-container">
            <textarea 
              ref="messageInput"
              v-model="newMessage" 
              placeholder="输入消息..." 
              @keydown.enter.prevent="sendMessage"
              @input="adjustTextareaHeight"
            ></textarea>
          </div>
          
          <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
            <i class="icon-send"></i>
          </button>
        </div>
      </template>

      <div class="empty-chat" v-else>
        <div class="empty-chat-content">
          <i class="icon-chat-large"></i>
          <h2>选择一个会话开始聊天</h2>
          <p>或者创建一个新的会话</p>
          <button class="new-chat-btn" @click="createNewChat">
            <i class="icon-plus"></i>
            新建会话
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加阅后即焚帮助弹窗 -->
  <div class="help-modal" v-if="showBurnAfterReadHelpModal">
    <div class="help-modal-content">
      <h3>阅后即焚功能说明</h3>
      <p>阅后即焚是一种保护您隐私的消息发送方式。启用后：</p>
      <ul>
        <li>您发送的消息、图片或文件在对方阅读后会自动销毁</li>
        <li>销毁时间可在5秒至5分钟之间设置</li>
        <li>所有阅后即焚内容在发送前会经过内容审核</li>
        <li>对方可以看到倒计时，但无法保存内容</li>
        <li>该功能适用于发送敏感信息，但请勿发送违法违规内容</li>
      </ul>
      <div class="help-modal-footer">
        <label>
          <input type="checkbox" v-model="dontShowBurnAfterReadHelpAgain" />
          不再显示
        </label>
        <button @click="closeBurnAfterReadHelp">了解了</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, nextTick, watch } from 'vue'

// 接口定义
interface User {
  id: number;
  nickname?: string; // 添加nickname字段，因为currentUser有这个属性
  name?: string;
  avatar: string | null; // 允许null值，因为很多地方使用 || defaultAvatar
  status?: string;
}

interface Participant extends User {
  status?: string;
}

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice';
  size?: number;
  duration?: number;
  burnAfterRead?: boolean;
  burnAfterReadTime?: number;
  isRead?: boolean;
  isDestroyed?: boolean;
  countdown?: number; // 添加倒计时属性
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  type: 'private' | 'group';
  participants?: Participant[];
}

export default defineComponent({
  name: 'ChatView',
  setup() {
    // 默认头像
    const defaultAvatar = '/src/assets/default-avatar.png'
    
    // 用户数据
    const currentUser = ref({
      id: 1,
      nickname: '当前用户',
      avatar: null
    })
    
    // 对话列表
    const conversations = ref([
      {
        id: 1,
        name: '张三',
        avatar: null,
        lastMessage: '你好，最近怎么样？',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 2,
        isOnline: true,
        type: 'private'
      },
      {
        id: 2,
        name: '工作群',
        avatar: null,
        lastMessage: '李四: 明天的会议是几点？',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 5,
        isOnline: true,
        type: 'group',
        participants: [
          { id: 3, name: '李四', avatar: null },
          { id: 4, name: '王五', avatar: null },
          { id: 5, name: '赵六', avatar: null }
        ]
      },
      {
        id: 3,
        name: '李四',
        avatar: null,
        lastMessage: '项目进度如何了？',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 0,
        isOnline: false,
        type: 'private'
      }
    ])
    
    // 消息数据
    const messagesData = ref({
      1: [
        {
          id: 1,
          senderId: 1,
          content: '你好，张三！',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          type: 'text'
        },
        {
          id: 2,
          senderId: 2,
          content: '你好，最近怎么样？',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          type: 'text'
        },
        {
          id: 3,
          senderId: 3,
          content: '这是一条阅后即焚消息',
          timestamp: new Date(Date.now() - 1000 * 60 * 50),
          type: 'text',
          burnAfterRead: true,
          burnAfterReadTime: 10,
          isRead: false
        },
        {
          id: 4,
          senderId: 1,
          content: '好的，我知道了',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          type: 'text'
        },
        {
          id: 5,
          senderId: 3,
          content: '/path/to/image.jpg',
          timestamp: new Date(Date.now() - 1000 * 60 * 40),
          type: 'image',
          burnAfterRead: true,
          burnAfterReadTime: 30,
          isRead: false
        }
      ],
      2: [
        {
          id: 3,
          senderId: 3,
          content: '大家好！',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          type: 'text'
        },
        {
          id: 4,
          senderId: 4,
          content: '你们好！',
          timestamp: new Date(Date.now() - 1000 * 60 * 59),
          type: 'text'
        },
        {
          id: 5,
          senderId: 3,
          content: '明天的会议是几点？',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          type: 'text'
        }
      ]
    })
    
    // 搜索和筛选
    const searchQuery = ref('')
    const activeTab = ref('recent')
    
    // 当前选中的会话
    const selectedConversation = ref(null)
    
    // 新消息输入
    const newMessage = ref('')
    const messageInput = ref(null)
    
    // 显示表情选择器
    const showEmojiPicker = ref(false)
    
    // 文件上传引用
    const imageInput = ref(null)
    const fileInput = ref(null)
    
    // 消息容器引用
    const messagesContainer = ref(null)
    
    // 正在加载更多消息
    const isLoadingMessages = ref(false)
    
    // 正在播放的语音消息ID
    const playingVoiceId = ref(null)
    
    // 今天的日期
    const today = new Date()
    
    // 表情分类
    const emojiCategories = [
      { id: 'recent', icon: 'clock', emojis: ['😊', '👍', '❤️', '😂'] },
      { id: 'smileys', icon: 'smile', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'] },
      { id: 'people', icon: 'user', emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤘', '🤙', '👋', '🙌', '👏'] },
    ]
    
    // 当前表情分类
    const currentEmojiCategory = computed(() => {
      return emojiCategories[0].emojis
    })
    
    // 过滤后的会话列表
    const filteredConversations = computed(() => {
      let result = conversations.value
      
      // 根据搜索词过滤
      if (searchQuery.value) {
        result = result.filter((conv: Conversation) => 
          conv.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }
      
      // 根据活动标签过滤
      if (activeTab.value === 'contacts') {
        result = result.filter((conv: Conversation) => conv.type === 'private')
      } else if (activeTab.value === 'groups') {
        result = result.filter((conv: Conversation) => conv.type === 'group')
      }
      
      return result
    })
    
    // 当前会话的消息
    const currentMessages = computed(() => {
      if (!selectedConversation.value) return []
      return messagesData.value[selectedConversation.value.id] || []
    })
    
    // 是否为群聊
    const isGroupChat = computed(() => {
      return selectedConversation.value?.type === 'group'
    })
    
    // 选择会话
    const selectConversation = (conversation: Conversation) => {
      selectedConversation.value = conversation
      
      // 清空未读消息数
      const conv = conversations.value.find((c: Conversation) => c.id === conversation.id)
      if (conv) {
        conv.unreadCount = 0
      }
      
      // 滚动到最新消息
      nextTick(() => {
        scrollToBottom()
      })
    }
    
    // 筛选会话
    const filterConversations = () => {
      // 已在computed中实现
    }
    
    // 获取空状态消息
    const getEmptyStateMessage = () => {
      if (searchQuery.value) {
        return '没有找到匹配的会话'
      } else if (activeTab.value === 'contacts') {
        return '没有联系人'
      } else if (activeTab.value === 'groups') {
        return '没有群组'
      } else {
        return '没有最近会话'
      }
    }
    
    // 创建新会话
    const createNewChat = () => {
      // 实现创建新会话的逻辑
      console.log('创建新会话')
    }
    
    // 获取参与者信息
    const getParticipantInfo = () => {
      if (!selectedConversation.value) return ''
      
      if (selectedConversation.value.type === 'private') {
        return selectedConversation.value.isOnline ? '在线' : '离线'
      } else {
        const participants = selectedConversation.value.participants || []
        return `${participants.length} 位成员`
      }
    }
    
    // 获取消息发送者头像
    const getMessageSenderAvatar = (message: Message) => {
      if (!selectedConversation.value) return defaultAvatar
      
      if (selectedConversation.value.type === 'private') {
        return selectedConversation.value.avatar || defaultAvatar
      } else {
        const sender = selectedConversation.value.participants?.find((p: Participant) => p.id === message.senderId)
        return sender?.avatar || defaultAvatar
      }
    }
    
    // 获取消息发送者名称
    const getMessageSenderName = (message: Message) => {
      if (!selectedConversation.value) return ''
      
      if (selectedConversation.value.type === 'group') {
        const sender = selectedConversation.value.participants?.find((p: Participant) => p.id === message.senderId)
        return sender?.name || '未知用户'
      }
      return ''
    }
    
    // 阅后即焚状态
    const isBurnAfterReadActive = ref(false)
    const burnAfterReadTime = ref(10) // 默认10秒
    const burnMessageTimers = ref({}) // 存储消息的计时器
    const burnAfterReadFirstUse = ref(true) // 是否首次使用阅后即焚
    
    // 切换阅后即焚模式
    const toggleBurnAfterRead = () => {
      isBurnAfterReadActive.value = !isBurnAfterReadActive.value
      
      // 如果是首次开启阅后即焚，显示提示弹窗
      if (isBurnAfterReadActive.value && burnAfterReadFirstUse.value) {
        showBurnAfterReadModal()
        burnAfterReadFirstUse.value = false
      }
    }
    
    // 显示阅后即焚提示弹窗
    const showBurnAfterReadModal = () => {
      // 检查用户是否选择了不再显示
      const dontShow = localStorage.getItem('dontShowBurnAfterReadHelp') === 'true';
      
      if (!dontShow) {
        showBurnAfterReadHelpModal.value = true;
      } else {
        // 使用浏览器原生弹窗，实际项目中应使用更美观的自定义弹窗
        alert(`阅后即焚消息（包括文字、图片、文件等）将会被传输至服务器进行内容审查（人工与AI混合审查）。审查通过后方可发送，未通过审查的消息将被驳回。请确保发送内容符合法律法规及平台规范。`);
      }
    }
    
    // 发送消息时添加阅后即焚属性
    const sendMessage = () => {
      if (!newMessage.value.trim() || !selectedConversation.value) return
      
      // 模拟内容审核（实际应发送到服务器审核）
      if (isBurnAfterReadActive.value) {
        // 模拟内容审核过程
        const hasProhibitedContent = /敏感词|违规内容|色情|赌博|政治/.test(newMessage.value)
        
        if (hasProhibitedContent) {
          alert('消息包含敏感内容，审核未通过，请修改后重试。')
          return
        }
      }
      
      const message = {
        id: Date.now(),
        senderId: currentUser.value.id,
        content: newMessage.value,
        timestamp: new Date(),
        type: 'text',
        // 如果阅后即焚模式开启，添加相关属性
        ...(isBurnAfterReadActive.value && {
          burnAfterRead: true,
          burnAfterReadTime: burnAfterReadTime.value,
          isRead: false
        })
      }
      
      // 添加消息到当前会话
      if (!messagesData.value[selectedConversation.value.id]) {
        messagesData.value[selectedConversation.value.id] = []
      }
      messagesData.value[selectedConversation.value.id].push(message)
      
      // 更新会话的最后一条消息
      const conv = conversations.value.find((c: Conversation) => c.id === selectedConversation.value.id)
      if (conv) {
        conv.lastMessage = isBurnAfterReadActive.value ? '[阅后即焚消息]' : newMessage.value
        conv.lastMessageTime = new Date()
      }
      
      // 清空输入框
      newMessage.value = ''
      
      // 滚动到最新消息
      nextTick(() => {
        scrollToBottom()
        adjustTextareaHeight()
      })
    }
    
    // 调整文本框高度
    const adjustTextareaHeight = () => {
      if (!messageInput.value) return
      
      messageInput.value.style.height = 'auto'
      messageInput.value.style.height = `${messageInput.value.scrollHeight}px`
    }
    
    // 切换表情选择器
    const toggleEmojiPicker = () => {
      showEmojiPicker.value = !showEmojiPicker.value
    }
    
    // 插入表情
    const insertEmoji = (emoji: string) => {
      newMessage.value += emoji
      
      // 可以选择是否关闭表情选择器
      // showEmojiPicker.value = false
    }
    
    // 上传图片
    const uploadImage = () => {
      if (imageInput.value) {
        imageInput.value.click()
      }
    }
    
    // 处理图片上传
    const handleImageUpload = (event: Event) => {
      // 处理图片上传逻辑，实际项目中应上传到服务器
      const fileInput = event.target as HTMLInputElement;
      console.log('上传图片', fileInput.files?.[0]);
      
      // 示例：模拟添加图片消息
      if (fileInput.files && fileInput.files.length > 0 && selectedConversation.value) {
        const file = fileInput.files[0];
        
        // 模拟内容审核（实际应发送到服务器审核）
        if (isBurnAfterReadActive.value) {
          // 模拟图片内容审核过程
          // 实际项目中应将图片上传到服务器进行审核
          // 这里简单模拟一个随机的审核结果
          const passAudit = Math.random() > 0.1; // 90%的概率通过审核
          
          if (!passAudit) {
            alert('图片内容未通过审核，请更换其他图片。');
            // 重置文件输入框
            fileInput.value = '';
            return;
          }
        }
        
        // 创建临时URL用于显示
        const imageUrl = URL.createObjectURL(file);
        
        const message = {
          id: Date.now(),
          senderId: currentUser.value.id,
          content: imageUrl, // 实际项目中应为服务器返回的URL
          timestamp: new Date(),
          type: 'image',
          // 如果阅后即焚模式开启，添加相关属性
          ...(isBurnAfterReadActive.value && {
            burnAfterRead: true,
            burnAfterReadTime: burnAfterReadTime.value,
            isRead: false
          })
        }
        
        // 添加消息到当前会话
        if (!messagesData.value[selectedConversation.value.id]) {
          messagesData.value[selectedConversation.value.id] = []
        }
        messagesData.value[selectedConversation.value.id].push(message)
        
        // 更新会话的最后一条消息
        const conv = conversations.value.find((c: Conversation) => c.id === selectedConversation.value.id)
        if (conv) {
          conv.lastMessage = isBurnAfterReadActive.value ? '[阅后即焚图片]' : '[图片]'
          conv.lastMessageTime = new Date()
        }
        
        // 滚动到最新消息
        nextTick(() => {
          scrollToBottom()
        })
      }
      
      // 重置文件输入框
      if (fileInput) fileInput.value = '';
    }
    
    // 上传文件
    const uploadFile = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    
    // 处理文件上传
    const handleFileUpload = (event: Event) => {
      // 处理文件上传逻辑，实际项目中应上传到服务器
      const fileInput = event.target as HTMLInputElement;
      console.log('上传文件', fileInput.files?.[0]);
      
      // 示例：模拟添加文件消息
      if (fileInput.files && fileInput.files.length > 0 && selectedConversation.value) {
        const file = fileInput.files[0];
        
        // 模拟内容审核（实际应发送到服务器审核）
        if (isBurnAfterReadActive.value) {
          // 模拟文件内容审核过程
          // 这里简单检查文件名是否包含敏感词
          const hasProhibitedName = /敏感|违规|色情|赌博|政治/.test(file.name);
          
          if (hasProhibitedName) {
            alert('文件名包含敏感内容，审核未通过，请修改文件名后重试。');
            // 重置文件输入框
            fileInput.value = '';
            return;
          }
        }
        
        const message = {
          id: Date.now(),
          senderId: currentUser.value.id,
          content: file.name,
          size: file.size,
          timestamp: new Date(),
          type: 'file',
          // 如果阅后即焚模式开启，添加相关属性
          ...(isBurnAfterReadActive.value && {
            burnAfterRead: true,
            burnAfterReadTime: burnAfterReadTime.value,
            isRead: false
          })
        }
        
        // 添加消息到当前会话
        if (!messagesData.value[selectedConversation.value.id]) {
          messagesData.value[selectedConversation.value.id] = []
        }
        messagesData.value[selectedConversation.value.id].push(message)
        
        // 更新会话的最后一条消息
        const conv = conversations.value.find((c: Conversation) => c.id === selectedConversation.value.id)
        if (conv) {
          conv.lastMessage = isBurnAfterReadActive.value ? '[阅后即焚文件]' : `[文件] ${file.name}`
          conv.lastMessageTime = new Date()
        }
        
        // 滚动到最新消息
        nextTick(() => {
          scrollToBottom()
        })
      }
      
      // 重置文件输入框
      if (fileInput) fileInput.value = '';
    }
    
    // 开始录音
    const startRecording = () => {
      // 实际项目中应进行录音操作
      console.log('开始录音')
    }
    
    // 停止录音
    const stopRecording = () => {
      // 实际项目中应停止录音，并发送语音消息
      console.log('停止录音并发送')
      
      // 示例：模拟添加语音消息
      if (selectedConversation.value) {
        const message = {
          id: Date.now(),
          senderId: currentUser.value.id,
          content: 'voice-message-url', // 实际项目中应为服务器返回的URL
          duration: 5, // 假设语音长度为5秒
          timestamp: new Date(),
          type: 'voice'
        }
        
        // 添加消息到当前会话
        if (!messagesData.value[selectedConversation.value.id]) {
          messagesData.value[selectedConversation.value.id] = []
        }
        messagesData.value[selectedConversation.value.id].push(message)
        
        // 更新会话的最后一条消息
        const conv = conversations.value.find((c: Conversation) => c.id === selectedConversation.value.id)
        if (conv) {
          conv.lastMessage = '[语音]'
          conv.lastMessageTime = new Date()
        }
        
        // 滚动到最新消息
        nextTick(() => {
          scrollToBottom()
        })
      }
    }
    
    // 取消录音
    const cancelRecording = () => {
      // 实际项目中应取消录音
      console.log('取消录音')
    }
    
    // 播放语音消息
    const playVoiceMessage = (message: Message) => {
      // 实际项目中应播放语音文件
      console.log('播放语音消息', message)
      
      playingVoiceId.value = playingVoiceId.value === message.id ? null : message.id
    }
    
    // 检查是否正在播放此语音
    const isPlayingVoice = (message: Message) => {
      return playingVoiceId.value === message.id
    }
    
    // 预览图片
    const previewImage = (src: string) => {
      // 实际项目中应实现图片预览功能
      console.log('预览图片', src)
    }
    
    // 获取文件名称
    const getFileName = (path: string) => {
      return path
    }
    
    // 获取格式化文件大小
    const getFileSize = (bytes: number) => {
      if (!bytes) return '0 B'
      
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    // 格式化消息时间
    const formatMessageTime = (timestamp: Date) => {
      if (!timestamp) return ''
      
      const date = new Date(timestamp)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      
      return `${hours}:${minutes}`
    }
    
    // 格式化日期
    const formatDate = (date: Date) => {
      if (!date) return ''
      
      const now = new Date()
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (date.toDateString() === now.toDateString()) {
        return '今天'
      } else if (date.toDateString() === yesterday.toDateString()) {
        return '昨天'
      } else {
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${month}月${day}日`
      }
    }
    
    // 格式化会话时间
    const formatTime = (timestamp: Date) => {
      if (!timestamp) return ''
      
      const date = new Date(timestamp)
      const now = new Date()
      
      // 如果是今天
      if (date.toDateString() === now.toDateString()) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
      } 
      // 如果是昨天
      else if (date.getDate() === now.getDate() - 1) {
        return '昨天'
      } 
      // 如果是本周
      else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        const days = ['日', '一', '二', '三', '四', '五', '六']
        return `周${days[date.getDay()]}`
      } 
      // 其他日期
      else {
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${month}/${day}`
      }
    }
    
    // 格式化语音消息时长
    const formatVoiceDuration = (seconds: number) => {
      if (!seconds) return '0:00'
      
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    
    // 截断消息
    const truncateMessage = (message: string) => {
      if (!message) return ''
      
      return message.length > 20 ? message.substring(0, 20) + '...' : message
    }
    
    // 滚动到聊天区域底部
    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }
    
    // 加载更多消息
    const loadMoreMessages = () => {
      if (isLoadingMessages.value || !selectedConversation.value) return
      
      isLoadingMessages.value = true
      
      // 实际项目中应从服务器加载更多消息
      console.log('加载更多消息')
      
      // 模拟加载延迟
      setTimeout(() => {
        isLoadingMessages.value = false
      }, 1000)
    }
    
    // 检测滚动加载更多消息
    const checkScrollForMessages = () => {
      if (!messagesContainer.value) return
      
      if (messagesContainer.value.scrollTop === 0) {
        loadMoreMessages()
      }
    }
    
    // 组件挂载后
    onMounted(() => {
      // 监听消息容器的滚动事件
      if (messagesContainer.value) {
        messagesContainer.value.addEventListener('scroll', checkScrollForMessages)
      }
    })
    
    // 监听选中的会话变化
    watch(selectedConversation, () => {
      if (selectedConversation.value) {
        nextTick(() => {
          scrollToBottom()
        })
      }
    })
    
    // 处理接收到的阅后即焚消息
    const handleBurnAfterReadMessage = (message: Message) => {
      // 如果是阅后即焚消息且未被阅读
      if (message.burnAfterRead && !message.isRead && message.senderId !== currentUser.value.id) {
        // 标记为已读
        message.isRead = true;
        
        // 设置初始倒计时值
        message.countdown = message.burnAfterReadTime || 10;
        
        // 创建倒计时更新定时器
        const countdownInterval = setInterval(() => {
          if (message.countdown && message.countdown > 0) {
            message.countdown -= 1;
          } else {
            clearInterval(countdownInterval);
          }
        }, 1000);
        
        // 开始销毁倒计时
        const timer = setTimeout(() => {
          // 找到消息所在的对话
          const conversationId = Object.keys(messagesData.value).find(id => 
            messagesData.value[id].some((m: Message) => m.id === message.id)
          );
          
          if (conversationId) {
            // 获取消息索引
            const messageIndex = messagesData.value[conversationId].findIndex((m: Message) => m.id === message.id);
            
            if (messageIndex !== -1) {
              // 播放销毁提示音（实际项目中可实现）
              // playDestroySound();
              
              // 标记消息为已销毁（在实际应用中可能会完全删除或用占位符替换）
              messagesData.value[conversationId][messageIndex].isDestroyed = true;
              messagesData.value[conversationId][messageIndex].content = '[该消息已销毁]';
            }
          }
          
          // 清除定时器
          clearTimeout(burnMessageTimers.value[message.id]);
          delete burnMessageTimers.value[message.id];
        }, (message.burnAfterReadTime || 10) * 1000); // 使用默认值10秒，防止undefined
        
        // 存储定时器
        burnMessageTimers.value[message.id] = timer;
      }
    };
    
    // 监听消息变化，处理阅后即焚消息
    watch(() => currentMessages.value, (messages: Message[] | undefined) => {
      if (!messages) return
      
      // 检查是否有新的阅后即焚消息
      messages.forEach((message: Message) => {
        if (message.burnAfterRead && !message.isRead && message.senderId !== currentUser.value.id) {
          handleBurnAfterReadMessage(message)
        }
      })
    }, { deep: true })

    // 在setup函数中添加帮助弹窗相关逻辑
    const showBurnAfterReadHelpModal = ref(false);
    const dontShowBurnAfterReadHelpAgain = ref(false);

    // 显示阅后即焚帮助
    const showBurnAfterReadHelp = () => {
      showBurnAfterReadHelpModal.value = true;
    };

    // 关闭阅后即焚帮助
    const closeBurnAfterReadHelp = () => {
      showBurnAfterReadHelpModal.value = false;
      
      // 如果选择了不再显示，记录到本地存储
      if (dontShowBurnAfterReadHelpAgain.value) {
        localStorage.setItem('dontShowBurnAfterReadHelp', 'true');
      }
    };

    return {
      defaultAvatar,
      currentUser,
      conversations,
      searchQuery,
      activeTab,
      selectedConversation,
      filteredConversations,
      currentMessages,
      isGroupChat,
      newMessage,
      showEmojiPicker,
      emojiCategories,
      currentEmojiCategory,
      messageInput,
      imageInput,
      fileInput,
      messagesContainer,
      isLoadingMessages,
      today,
      selectConversation,
      filterConversations,
      getEmptyStateMessage,
      createNewChat,
      getParticipantInfo,
      getMessageSenderAvatar,
      getMessageSenderName,
      sendMessage,
      adjustTextareaHeight,
      toggleEmojiPicker,
      insertEmoji,
      uploadImage,
      handleImageUpload,
      uploadFile,
      handleFileUpload,
      startRecording,
      stopRecording,
      cancelRecording,
      playVoiceMessage,
      isPlayingVoice,
      previewImage,
      getFileName,
      getFileSize,
      formatMessageTime,
      formatDate,
      formatTime,
      formatVoiceDuration,
      truncateMessage,
      isBurnAfterReadActive,
      burnAfterReadTime,
      toggleBurnAfterRead,
      showBurnAfterReadHelpModal,
      dontShowBurnAfterReadHelpAgain,
      showBurnAfterReadHelp,
      closeBurnAfterReadHelp
    }
  }
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: var(--font-family, 'PingFang SC', 'Helvetica Neue', Helvetica, 'Microsoft YaHei', Arial, sans-serif);
}

/* 侧边栏样式 */
.sidebar {
  width: 320px;
  height: 100%;
  border-right: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--sidebar-bg, #f9fafb);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-profile {
  padding: 16px;
  display: flex;
  align-items: center;
  background-color: var(--sidebar-header-bg, #f3f4f6);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.avatar-container {
  position: relative;
  margin-right: 12px;
}

.user-avatar, .conversation-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--avatar-bg, #dbeafe);
}

.conversation-avatar {
  width: 40px;
  height: 40px;
}

.status-indicator {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  bottom: 0;
  right: 0;
  border: 2px solid var(--sidebar-bg, #f9fafb);
}

.status-indicator.online {
  background-color: var(--online-color, #10b981);
}

.status-indicator.offline {
  background-color: var(--offline-color, #9ca3af);
}

.user-info h3 {
  font-size: 16px;
  margin: 0;
  color: var(--text-color, #1f2937);
  font-weight: 600;
}

.user-info .status {
  font-size: 12px;
  color: var(--text-light, #6b7280);
  margin: 0;
}

.search-bar {
  padding: 12px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px;
  padding-right: 40px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--input-bg, #ffffff);
  font-size: 14px;
  color: var(--text-color, #1f2937);
}

.search-bar input:focus {
  outline: none;
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: var(--text-light, #6b7280);
  cursor: pointer;
}

.conversation-tabs {
  display: flex;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: var(--text-color, #1f2937);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab.active {
  color: var(--primary, #2563eb);
  border-bottom-color: var(--primary, #2563eb);
  font-weight: 600;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.conversation-item {
  display: flex;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 0 8px 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.conversation-item:hover {
  background-color: var(--hover-bg, #f3f4f6);
}

.conversation-item.active {
  background-color: var(--active-bg, #e0f2fe);
}

.conversation-info {
  flex: 1;
  min-width: 0;
  margin-left: 12px;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.conversation-header h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color, #1f2937);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-header .time {
  font-size: 12px;
  color: var(--text-light, #6b7280);
}

.conversation-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversation-preview p {
  font-size: 12px;
  color: var(--text-light, #6b7280);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.unread-badge {
  background-color: var(--primary, #2563eb);
  color: white;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  font-weight: 600;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: var(--text-light, #6b7280);
  font-size: 14px;
}

.create-new {
  padding: 12px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.new-chat-btn {
  width: 100%;
  padding: 10px 16px;
  background-color: var(--primary, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-chat-btn:hover {
  background-color: var(--primary-dark, #1d4ed8);
}

.new-chat-btn i {
  margin-right: 8px;
}

/* 聊天区域样式 */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--chat-bg, #ffffff);
}

.chat-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--white, #ffffff);
}

.chat-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color, #1f2937);
}

.chat-header .participant-info {
  font-size: 12px;
  color: var(--text-light, #6b7280);
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: var(--action-bg, #f3f4f6);
  color: var(--text-color, #1f2937);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--action-hover, #e5e7eb);
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--messages-bg, #f9fafb);
}

.date-separator {
  text-align: center;
  margin: 8px 0;
  position: relative;
}

.date-separator span {
  background-color: var(--date-bg, #e5e7eb);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-light, #6b7280);
}

.message {
  display: flex;
  margin-bottom: 8px;
  max-width: 80%;
}

.message-sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-received {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  margin: 0 8px;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-sender {
  font-size: 12px;
  color: var(--text-light, #6b7280);
  margin-bottom: 4px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 100%;
  word-break: break-word;
}

.message-sent .message-bubble {
  background-color: var(--primary, #2563eb);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received .message-bubble {
  background-color: var(--white, #ffffff);
  color: var(--text-color, #1f2937);
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-bubble p {
  margin: 0;
}

.message-image {
  max-width: 240px;
  max-height: 240px;
  border-radius: 12px;
  cursor: pointer;
}

.file-message {
  display: flex;
  align-items: center;
  padding: 8px;
}

.file-info {
  margin-left: 8px;
  flex: 1;
}

.file-name {
  font-weight: 600;
  margin: 0 0 4px 0;
}

.file-size {
  font-size: 12px;
  margin: 0;
  opacity: 0.8;
}

.download-btn {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.8;
  cursor: pointer;
}

.voice-message {
  display: flex;
  align-items: center;
  min-width: 120px;
}

.play-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-right: 8px;
}

.voice-wave {
  flex: 1;
  height: 24px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.voice-duration {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
}

.message-time {
  font-size: 11px;
  color: var(--text-light, #6b7280);
  margin-top: 2px;
  align-self: flex-end;
}

.message-sent .message-time {
  color: var(--primary-light, #93c5fd);
}

.loading-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: var(--text-light, #6b7280);
  font-size: 12px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary, #2563eb);
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message-input-area {
  padding: 16px;
  border-top: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--white, #ffffff);
  position: relative;
}

.message-toolbar {
  display: flex;
  margin-bottom: 12px;
  gap: 12px;
}

.toolbar-btn {
  background: none;
  border: none;
  color: var(--text-light, #6b7280);
  cursor: pointer;
  font-size: 18px;
  transition: color 0.2s ease;
}

.toolbar-btn:hover {
  color: var(--primary, #2563eb);
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 16px;
  background-color: var(--white, #ffffff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 320px;
  padding: 12px;
  z-index: 100;
}

.emoji-categories {
  display: flex;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.emoji-category {
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

.emoji-category:hover {
  background-color: var(--hover-bg, #f3f4f6);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.emoji-item {
  font-size: 20px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
}

.emoji-item:hover {
  background-color: var(--hover-bg, #f3f4f6);
}

.input-container {
  position: relative;
  margin-bottom: 8px;
}

.input-container textarea {
  width: 100%;
  padding: 12px;
  padding-right: 44px;
  border-radius: 24px;
  border: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--input-bg, #f3f4f6);
  font-size: 14px;
  resize: none;
  min-height: 24px;
  max-height: 120px;
  color: var(--text-color, #1f2937);
}

.input-container textarea:focus {
  outline: none;
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.send-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary, #2563eb);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover {
  background-color: var(--primary-dark, #1d4ed8);
}

.send-btn:disabled {
  background-color: var(--disabled, #9ca3af);
  cursor: not-allowed;
}

.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--messages-bg, #f9fafb);
}

.empty-chat-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.empty-chat-content i {
  font-size: 64px;
  color: var(--text-light, #9ca3af);
  margin-bottom: 24px;
}

.empty-chat-content h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color, #1f2937);
}

.empty-chat-content p {
  color: var(--text-light, #6b7280);
  margin-bottom: 24px;
}

.empty-chat-content .new-chat-btn {
  margin: 0 auto;
  max-width: 200px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .sidebar {
    width: 280px;
  }

  .message {
    max-width: 90%;
  }
  
  .message-image {
    max-width: 200px;
    max-height: 200px;
  }
}

@media (max-width: 640px) {
  .chat-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 40vh;
  }
  
  .conversation-list {
    max-height: calc(40vh - 140px);
  }
  
  .message {
    max-width: 95%;
  }
  
  .message-image {
    max-width: 180px;
    max-height: 180px;
  }
  
  .emoji-picker {
    width: 90%;
    left: 5%;
  }
}

/* 阅后即焚按钮样式增强 */
.toolbar-btn.active {
  background-color: rgba(255, 59, 48, 0.2);
  color: #ff3b30;
  position: relative;
}

.toolbar-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #ff3b30;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.5; transform: translateX(-50%) scale(1.5); }
  100% { opacity: 1; transform: translateX(-50%) scale(1); }
}

/* 阅后即焚消息气泡样式增强 */
.message-bubble.burn-after-read {
  position: relative;
  background-color: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  transition: all 0.3s ease;
}

.message-sent .message-bubble.burn-after-read {
  background-color: rgba(255, 59, 48, 0.3);
  color: #fff;
}

.message-bubble.burn-after-read.destroying {
  animation: fadeOut 1s forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  90% { opacity: 0.1; transform: scale(0.95); }
  100% { opacity: 0; transform: scale(0.9); }
}

.burn-indicator {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 59, 48, 0.8);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  animation: floatAnimation 2s ease-in-out infinite;
}

@keyframes floatAnimation {
  0% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
  100% { transform: translateX(-50%) translateY(0); }
}

.icon-fire {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.5 4 8.7 4.5 7.5 5C6.3 5.5 5.5 6.5 5.5 8C5.5 9.5 6.5 11 8 11.5C9.5 12 11 12 12 12.5C13 13 13.5 14 13.5 15C13.5 16 13 16.5 12 16.5C11 16.5 10.5 16 10.5 15H8.5C8.5 17 10 18.5 12 18.5C14 18.5 15.5 17 15.5 15C15.5 13 14.5 11.5 13 11C11.5 10.5 10 10.5 9 10C8 9.5 7.5 8.5 7.5 8C7.5 7.5 7.8 7 8.5 6.5C9.2 6 10.5 5.5 12 3.5L12 2Z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  animation: flameAnimation 1s ease-in-out infinite alternate;
}

@keyframes flameAnimation {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 1; }
}

/* 已销毁的消息样式增强 */
.message-bubble .destroyed-message {
  color: #999;
  font-style: italic;
}

.message-bubble p.destroyed {
  color: #999;
  font-style: italic;
  text-decoration: line-through;
  opacity: 0.7;
}

/* 阅后即焚时间选择器样式增强 */
.burn-time-selector {
  display: flex;
  align-items: center;
  background-color: rgba(255, 59, 48, 0.1);
  border-radius: 4px;
  padding: 0 8px;
  margin-left: 8px;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.burn-time-selector span {
  font-size: 12px;
  margin-right: 4px;
  white-space: nowrap;
  color: #666;
}

.burn-time-selector select {
  border: none;
  background: transparent;
  font-size: 12px;
  padding: 2px;
  color: #ff3b30;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.burn-time-selector select:hover {
  background-color: rgba(255, 59, 48, 0.1);
}

/* 添加阅后即焚帮助弹窗 */
.help-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.help-modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.help-modal-content h3 {
  color: #ff3b30;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  display: flex;
  align-items: center;
}

.help-modal-content h3::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff3b30"><path d="M12 2C10.5 4 8.7 4.5 7.5 5C6.3 5.5 5.5 6.5 5.5 8C5.5 9.5 6.5 11 8 11.5C9.5 12 11 12 12 12.5C13 13 13.5 14 13.5 15C13.5 16 13 16.5 12 16.5C11 16.5 10.5 16 10.5 15H8.5C8.5 17 10 18.5 12 18.5C14 18.5 15.5 17 15.5 15C15.5 13 14.5 11.5 13 11C11.5 10.5 10 10.5 9 10C8 9.5 7.5 8.5 7.5 8C7.5 7.5 7.8 7 8.5 6.5C9.2 6 10.5 5.5 12 3.5L12 2Z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.help-modal-content p {
  margin-bottom: 12px;
  line-height: 1.5;
  color: #333;
}

.help-modal-content ul {
  margin: 0 0 20px 0;
  padding-left: 24px;
}

.help-modal-content li {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #333;
}

.help-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.help-modal-footer label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.help-modal-footer input[type="checkbox"] {
  margin-right: 8px;
}

.help-modal-footer button {
  background-color: #ff3b30;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.help-modal-footer button:hover {
  background-color: #e02e24;
}

/* 为图标添加样式 */
.icon-help {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm1-10c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 8px;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.icon-help:hover {
  opacity: 1;
}
</style>
