<!-- 
 * LightLink 社交圈子页面
 * 展示用户及其好友发布的随想内容
 * 支持发布随想、点赞、评论等功能
 * @author 开发者：WaZixwx, HanBai
 -->

<template>
  <div class="moments-container">
    <!-- 顶部导航栏 -->
    <header class="moments-header">
      <div class="header-left">
        <button class="back-button" @click="$router.go(-1)">
          <span class="icon-back">&#xe900;</span>
        </button>
      </div>
      <h1 class="header-title">朋友圈</h1>
      <div class="header-right">
        <button class="more-button" @click="showActionMenu = true">
          <span class="icon-more">&#xe908;</span>
        </button>
      </div>
    </header>

    <!-- 我的资料卡片 -->
    <div class="profile-card">
      <div class="cover-image" :style="{ backgroundImage: `url(${currentUser.coverImage || '/images/default-cover.jpg'})` }">
        <div class="avatar-container">
          <img :src="currentUser.avatar || '/images/default-avatar.jpg'" alt="用户头像" class="profile-avatar" />
          <p class="profile-name">{{ currentUser.nickname || currentUser.username }}</p>
        </div>
      </div>
    </div>

    <!-- 发布随想按钮 -->
    <div class="publish-button-container">
      <button class="publish-button" @click="showPublishModal = true">
        <span class="icon-publish">&#xe909;</span>
        <span>发布随想</span>
      </button>
    </div>

    <!-- 随想列表 -->
    <div class="moments-list" ref="momentsList" v-if="moments.length > 0">
      <div class="loading-more" v-if="isLoadingMore">
        <div class="loading-spinner"></div>
        <span>加载更多...</span>
      </div>

      <div class="moment-item" v-for="moment in moments" :key="moment.id">
        <!-- 用户信息 -->
        <div class="moment-user-info">
          <img :src="moment.user.avatar || '/images/default-avatar.jpg'" alt="用户头像" class="moment-avatar" />
          <div class="moment-user-meta">
            <div class="moment-username">{{ moment.user.nickname || moment.user.username }}</div>
            <div class="moment-time">{{ formatTime(moment.createdAt) }}</div>
          </div>
        </div>

        <!-- 随想内容 -->
        <div class="moment-content">
          <p class="moment-text">{{ moment.content }}</p>
          
          <!-- 图片内容 -->
          <div class="moment-images" v-if="moment.images && moment.images.length > 0">
            <div 
              class="image-grid" 
              :class="[
                `image-grid-${moment.images.length > 9 ? 9 : moment.images.length}`,
                {'single-image': moment.images.length === 1}
              ]"
            >
              <div 
                v-for="(image, index) in moment.images.slice(0, 9)" 
                :key="index" 
                class="image-item"
                @click="viewImages(moment.images, index)"
              >
                <img :src="image" :alt="`图片${index + 1}`" class="moment-image" />
              </div>
              <div class="more-images" v-if="moment.images.length > 9">
                +{{ moment.images.length - 9 }}
              </div>
            </div>
          </div>

          <!-- 视频内容 -->
          <div class="moment-video" v-if="moment.video">
            <video 
              controls 
              class="video-player" 
              :poster="moment.videoCover"
            >
              <source :src="moment.video" type="video/mp4">
              您的浏览器不支持视频播放
            </video>
          </div>

          <!-- 位置信息 -->
          <div class="moment-location" v-if="moment.location">
            <span class="icon-location">&#xe90a;</span>
            <span>{{ moment.location }}</span>
          </div>
        </div>

        <!-- 互动区域 -->
        <div class="moment-interaction">
          <div class="interaction-buttons">
            <button 
              class="like-button" 
              :class="{ 'liked': moment.isLiked }"
              @click="toggleLike(moment)"
            >
              <span class="icon-like">{{ moment.isLiked ? '&#xe90b;' : '&#xe90c;' }}</span>
              <span>{{ moment.likes || 0 }}</span>
            </button>
            <button class="comment-button" @click="focusCommentInput(moment.id)">
              <span class="icon-comment">&#xe90d;</span>
              <span>{{ moment.comments ? moment.comments.length : 0 }}</span>
            </button>
            <button class="share-button" @click="shareMoment(moment)">
              <span class="icon-share">&#xe90e;</span>
            </button>
          </div>

          <!-- 点赞列表 -->
          <div class="like-list" v-if="moment.likedUsers && moment.likedUsers.length > 0">
            <span class="icon-liked">&#xe90b;</span>
            <div class="liked-users">
              <span v-for="(user, index) in moment.likedUsers" :key="user.id">
                {{ user.nickname || user.username }}{{ index < moment.likedUsers.length - 1 ? '、' : '' }}
              </span>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comment-list" v-if="moment.comments && moment.comments.length > 0">
            <div 
              class="comment-item" 
              v-for="comment in moment.comments" 
              :key="comment.id"
              @click="replyToComment(moment.id, comment)"
            >
              <span class="comment-username">{{ comment.user.nickname || comment.user.username }}</span>
              <span v-if="comment.replyTo" class="reply-text">回复</span>
              <span v-if="comment.replyTo" class="reply-username">{{ comment.replyTo.nickname || comment.replyTo.username }}</span>
              <span class="comment-content">{{ comment.content }}</span>
            </div>
          </div>
        </div>

        <!-- 评论输入框 -->
        <div class="comment-input-container" v-if="activeCommentId === moment.id">
          <input 
            type="text" 
            class="comment-input"
            v-model="commentText"
            :placeholder="replyToUser ? `回复 ${replyToUser.nickname || replyToUser.username}` : '发表评论...'"
            @keyup.enter="submitComment(moment)"
            ref="commentInputRef"
          />
          <button class="send-comment-button" @click="submitComment(moment)">发送</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else-if="!isLoading">
      <div class="empty-icon">&#xe90f;</div>
      <p class="empty-text">暂无随想内容</p>
      <p class="empty-subtext">快去发布你的第一条随想吧！</p>
    </div>

    <!-- 加载状态 -->
    <div class="loading-state" v-if="isLoading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 发布随想弹窗 -->
    <div class="modal-overlay" v-if="showPublishModal" @click.self="showPublishModal = false">
      <div class="publish-modal">
        <div class="modal-header">
          <h2>发布随想</h2>
          <button class="close-button" @click="showPublishModal = false">&#xe901;</button>
        </div>
        <div class="modal-body">
          <textarea 
            class="publish-textarea" 
            v-model="newMomentContent"
            placeholder="分享你的生活点滴..."
            maxlength="500"
          ></textarea>
          <div class="textarea-counter">{{ newMomentContent.length }}/500</div>
          
          <!-- 已选图片预览 -->
          <div class="selected-images" v-if="selectedImages.length > 0">
            <div 
              class="selected-image-item" 
              v-for="(image, index) in selectedImages" 
              :key="index"
            >
              <img :src="image.preview" :alt="`已选图片${index + 1}`" class="preview-image" />
              <button class="remove-image" @click="removeSelectedImage(index)">&#xe901;</button>
            </div>
            <div class="add-more-image" v-if="selectedImages.length < 9" @click="openImageSelector">
              <span>+</span>
            </div>
          </div>
          
          <!-- 功能按钮 -->
          <div class="publish-actions">
            <button class="action-button image-button" @click="openImageSelector" v-if="selectedImages.length === 0">
              <span class="icon-image">&#xe902;</span>
              <span>图片</span>
            </button>
            <button class="action-button video-button" @click="openVideoSelector" v-if="!selectedVideo && selectedImages.length === 0">
              <span class="icon-video">&#xe903;</span>
              <span>视频</span>
            </button>
            <button class="action-button location-button" @click="selectLocation">
              <span class="icon-location">&#xe90a;</span>
              <span>位置</span>
            </button>
          </div>
          
          <!-- 已选视频预览 -->
          <div class="selected-video" v-if="selectedVideo">
            <video controls class="preview-video">
              <source :src="selectedVideo.preview" type="video/mp4">
              您的浏览器不支持视频播放
            </video>
            <button class="remove-video" @click="removeSelectedVideo">移除视频</button>
          </div>
          
          <!-- 已选位置 -->
          <div class="selected-location" v-if="selectedLocation">
            <span class="icon-location">&#xe90a;</span>
            <span>{{ selectedLocation }}</span>
            <button class="remove-location" @click="removeSelectedLocation">&#xe901;</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showPublishModal = false">取消</button>
          <button 
            class="publish-submit-button" 
            :disabled="isPublishing || (!newMomentContent.trim() && selectedImages.length === 0 && !selectedVideo)"
            @click="publishMoment"
          >
            {{ isPublishing ? '发布中...' : '发布' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 查看图片弹窗 -->
    <div class="image-viewer" v-if="showImageViewer" @click.self="showImageViewer = false">
      <div class="viewer-header">
        <button class="close-viewer" @click="showImageViewer = false">&#xe901;</button>
        <div class="image-counter">{{ currentImageIndex + 1 }}/{{ viewerImages.length }}</div>
      </div>
      <div class="viewer-content">
        <button class="prev-image" @click="viewPrevImage" v-if="viewerImages.length > 1">&#xe904;</button>
        <img :src="viewerImages[currentImageIndex]" alt="查看大图" class="viewer-image" />
        <button class="next-image" @click="viewNextImage" v-if="viewerImages.length > 1">&#xe905;</button>
      </div>
    </div>

    <!-- 操作菜单 -->
    <div class="action-menu-overlay" v-if="showActionMenu" @click.self="showActionMenu = false">
      <div class="action-menu">
        <button class="menu-item" @click="refreshMoments">
          <span class="icon-refresh">&#xe906;</span>
          <span>刷新</span>
        </button>
        <button class="menu-item" @click="goToSettings">
          <span class="icon-settings">&#xe907;</span>
          <span>设置</span>
        </button>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input 
      type="file" 
      accept="image/*" 
      multiple 
      class="hidden-input" 
      ref="imageInputRef" 
      @change="handleImageSelect" 
    />
    <input 
      type="file" 
      accept="video/*" 
      class="hidden-input" 
      ref="videoInputRef" 
      @change="handleVideoSelect" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/modules/user'

export default defineComponent({
  name: 'MomentsPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 获取当前用户信息
    const currentUser = computed(() => userStore.currentUser || {})
    
    // 随想列表数据
    const moments = ref([])
    const isLoading = ref(true)
    const isLoadingMore = ref(false)
    
    // 评论相关状态
    const activeCommentId = ref(null)
    const commentText = ref('')
    const commentInputRef = ref(null)
    const replyToUser = ref(null)
    
    // 发布随想弹窗
    const showPublishModal = ref(false)
    const newMomentContent = ref('')
    const selectedImages = ref([])
    const selectedVideo = ref(null)
    const selectedLocation = ref('')
    const isPublishing = ref(false)
    
    // 图片选择器和视频选择器引用
    const imageInputRef = ref(null)
    const videoInputRef = ref(null)
    
    // 图片查看器
    const showImageViewer = ref(false)
    const viewerImages = ref([])
    const currentImageIndex = ref(0)
    
    // 操作菜单
    const showActionMenu = ref(false)
    
    // 随想列表引用
    const momentsList = ref(null)
    
    // 获取随想列表
    const fetchMoments = async (refresh = false) => {
      try {
        if (refresh) {
          isLoading.value = true
          moments.value = []
        }
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 模拟随想数据
        const mockMoments = [
          {
            id: 1,
            content: '今天天气真好，出去走走～',
            images: ['/images/moment1.jpg', '/images/moment2.jpg'],
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            user: {
              id: 1,
              username: 'user1',
              nickname: '张三',
              avatar: '/images/avatar1.jpg'
            },
            likes: 12,
            isLiked: false,
            likedUsers: [
              { id: 2, username: 'user2', nickname: '李四' },
              { id: 3, username: 'user3', nickname: '王五' }
            ],
            comments: [
              {
                id: 1,
                content: '好美的风景！',
                user: { id: 2, username: 'user2', nickname: '李四' }
              },
              {
                id: 2,
                content: '在哪里拍的？',
                user: { id: 3, username: 'user3', nickname: '王五' }
              }
            ]
          },
          {
            id: 2,
            content: '分享一首最近很喜欢的歌曲，希望大家也能喜欢～',
            video: '/videos/sample.mp4',
            videoCover: '/images/video-cover.jpg',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
            user: {
              id: 3,
              username: 'user3',
              nickname: '王五',
              avatar: '/images/avatar3.jpg'
            },
            likes: 8,
            isLiked: true,
            likedUsers: [
              { id: 1, username: 'user1', nickname: '张三' },
              { id: 4, username: 'user4', nickname: '赵六' }
            ],
            comments: []
          },
          {
            id: 3,
            content: '公司团建照片分享！',
            images: [
              '/images/team1.jpg',
              '/images/team2.jpg',
              '/images/team3.jpg',
              '/images/team4.jpg',
              '/images/team5.jpg',
              '/images/team6.jpg'
            ],
            location: '广州市天河区',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            user: {
              id: 2,
              username: 'user2',
              nickname: '李四',
              avatar: '/images/avatar2.jpg'
            },
            likes: 24,
            isLiked: false,
            likedUsers: [],
            comments: [
              {
                id: 3,
                content: '玩得真开心！',
                user: { id: 1, username: 'user1', nickname: '张三' }
              },
              {
                id: 4,
                content: '下次带上我！',
                user: { id: 4, username: 'user4', nickname: '赵六' },
                replyTo: { id: 1, username: 'user1', nickname: '张三' }
              }
            ]
          }
        ]
        
        // 更新随想列表
        if (refresh) {
          moments.value = mockMoments
        } else {
          moments.value = [...moments.value, ...mockMoments]
        }
      } catch (error) {
        console.error('获取随想列表失败:', error)
      } finally {
        isLoading.value = false
        isLoadingMore.value = false
      }
    }
    
    // 加载更多随想
    const loadMoreMoments = async () => {
      if (isLoadingMore.value) return
      
      isLoadingMore.value = true
      await fetchMoments(false)
    }
    
    // 刷新随想列表
    const refreshMoments = async () => {
      showActionMenu.value = false
      await fetchMoments(true)
    }
    
    // 点赞/取消点赞
    const toggleLike = (moment) => {
      moment.isLiked = !moment.isLiked
      if (moment.isLiked) {
        moment.likes++
        moment.likedUsers.push(currentUser.value)
      } else {
        moment.likes--
        const index = moment.likedUsers.findIndex(user => user.id === currentUser.value.id)
        if (index !== -1) {
          moment.likedUsers.splice(index, 1)
        }
      }
    }
    
    // 分享随想
    const shareMoment = (moment) => {
      // 实现分享功能
      console.log('分享随想:', moment.id)
    }
    
    // 聚焦评论输入框
    const focusCommentInput = (momentId) => {
      activeCommentId.value = momentId
      replyToUser.value = null
      commentText.value = ''
      
      nextTick(() => {
        if (commentInputRef.value) {
          commentInputRef.value.focus()
        }
      })
    }
    
    // 回复评论
    const replyToComment = (momentId, comment) => {
      activeCommentId.value = momentId
      replyToUser.value = comment.user
      commentText.value = ''
      
      nextTick(() => {
        if (commentInputRef.value) {
          commentInputRef.value.focus()
        }
      })
    }
    
    // 提交评论
    const submitComment = (moment) => {
      if (!commentText.value.trim()) return
      
      const newComment = {
        id: moment.comments ? moment.comments.length + 1 : 1,
        content: commentText.value,
        user: currentUser.value
      }
      
      if (replyToUser.value) {
        newComment.replyTo = replyToUser.value
      }
      
      if (!moment.comments) {
        moment.comments = []
      }
      
      moment.comments.push(newComment)
      commentText.value = ''
      activeCommentId.value = null
      replyToUser.value = null
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      
      const date = new Date(timestamp)
      const now = new Date()
      
      // 如果是今天
      if (date.toDateString() === now.toDateString()) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `今天 ${hours}:${minutes}`
      } 
      // 如果是昨天
      else if (date.getDate() === now.getDate() - 1) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `昨天 ${hours}:${minutes}`
      } 
      // 如果是本周
      else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        const days = ['日', '一', '二', '三', '四', '五', '六']
        return `周${days[date.getDay()]}`
      } 
      // 其他日期
      else {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    }
    
    // 打开图片选择器
    const openImageSelector = () => {
      if (imageInputRef.value) {
        imageInputRef.value.click()
      }
    }
    
    // 处理图片选择
    const handleImageSelect = (event) => {
      const files = event.target.files
      if (!files || files.length === 0) return
      
      const remainingSlots = 9 - selectedImages.value.length
      const filesToProcess = Array.from(files).slice(0, remainingSlots)
      
      filesToProcess.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          selectedImages.value.push({
            file: file,
            preview: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
      
      // 重置文件输入
      event.target.value = null
    }
    
    // 移除已选图片
    const removeSelectedImage = (index) => {
      selectedImages.value.splice(index, 1)
    }
    
    // 打开视频选择器
    const openVideoSelector = () => {
      if (videoInputRef.value) {
        videoInputRef.value.click()
      }
    }
    
    // 处理视频选择
    const handleVideoSelect = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedVideo.value = {
          file: file,
          preview: e.target.result
        }
      }
      reader.readAsDataURL(file)
      
      // 重置文件输入
      event.target.value = null
    }
    
    // 移除已选视频
    const removeSelectedVideo = () => {
      selectedVideo.value = null
    }
    
    // 选择位置
    const selectLocation = () => {
      // 模拟位置选择
      selectedLocation.value = '广州市天河区'
    }
    
    // 移除已选位置
    const removeSelectedLocation = () => {
      selectedLocation.value = ''
    }
    
    // 发布随想
    const publishMoment = async () => {
      if (isPublishing.value) return
      
      if (!newMomentContent.value.trim() && selectedImages.value.length === 0 && !selectedVideo.value) {
        return
      }
      
      isPublishing.value = true
      
      try {
        // 模拟发布请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 模拟发布成功
        const newMoment = {
          id: Date.now(),
          content: newMomentContent.value,
          createdAt: new Date(),
          user: currentUser.value,
          likes: 0,
          isLiked: false,
          likedUsers: [],
          comments: []
        }
        
        if (selectedImages.value.length > 0) {
          newMoment.images = selectedImages.value.map(img => img.preview)
        }
        
        if (selectedVideo.value) {
          newMoment.video = selectedVideo.value.preview
        }
        
        if (selectedLocation.value) {
          newMoment.location = selectedLocation.value
        }
        
        // 将新随想添加到列表开头
        moments.value.unshift(newMoment)
        
        // 重置表单
        newMomentContent.value = ''
        selectedImages.value = []
        selectedVideo.value = null
        selectedLocation.value = ''
        showPublishModal.value = false
        
      } catch (error) {
        console.error('发布随想失败:', error)
      } finally {
        isPublishing.value = false
      }
    }
    
    // 查看图片
    const viewImages = (images, startIndex = 0) => {
      viewerImages.value = images
      currentImageIndex.value = startIndex
      showImageViewer.value = true
    }
    
    // 查看上一张图片
    const viewPrevImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--
      } else {
        currentImageIndex.value = viewerImages.value.length - 1
      }
    }
    
    // 查看下一张图片
    const viewNextImage = () => {
      if (currentImageIndex.value < viewerImages.value.length - 1) {
        currentImageIndex.value++
      } else {
        currentImageIndex.value = 0
      }
    }
    
    // 前往设置页面
    const goToSettings = () => {
      showActionMenu.value = false
      router.push('/profile')
    }
    
    // 监听滚动事件，实现下拉加载更多
    const handleScroll = () => {
      if (!momentsList.value || isLoadingMore.value) return
      
      const scrollTop = momentsList.value.scrollTop
      const scrollHeight = momentsList.value.scrollHeight
      const clientHeight = momentsList.value.clientHeight
      
      // 当滚动到距离底部100px时加载更多
      if (scrollHeight - scrollTop - clientHeight < 100) {
        loadMoreMoments()
      }
    }
    
    onMounted(() => {
      // 初始加载随想列表
      fetchMoments(true)
      
      // 添加滚动事件监听
      if (momentsList.value) {
        momentsList.value.addEventListener('scroll', handleScroll)
      }
    })
    
    return {
      currentUser,
      moments,
      isLoading,
      isLoadingMore,
      activeCommentId,
      commentText,
      commentInputRef,
      replyToUser,
      showPublishModal,
      newMomentContent,
      selectedImages,
      selectedVideo,
      selectedLocation,
      isPublishing,
      imageInputRef,
      videoInputRef,
      showImageViewer,
      viewerImages,
      currentImageIndex,
      showActionMenu,
      momentsList,
      fetchMoments,
      loadMoreMoments,
      refreshMoments,
      toggleLike,
      shareMoment,
      focusCommentInput,
      replyToComment,
      submitComment,
      formatTime,
      openImageSelector,
      handleImageSelect,
      removeSelectedImage,
      openVideoSelector,
      handleVideoSelect,
      removeSelectedVideo,
      selectLocation,
      removeSelectedLocation,
      publishMoment,
      viewImages,
      viewPrevImage,
      viewNextImage,
      goToSettings
    }
  }
})
</script>

<style scoped>
.moments-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background, #f8f9fa);
  position: relative;
  overflow: hidden;
}

/* 顶部导航栏 */
.moments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: var(--primary, #2563eb);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  min-width: 44px;
}

.back-button, .more-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* 个人资料卡片 */
.profile-card {
  width: 100%;
  height: 180px;
  position: relative;
  margin-bottom: 15px;
}

.cover-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.avatar-container {
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  align-items: center;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
  margin-left: 10px;
}

.profile-name {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0 10px;
}

/* 发布随想按钮 */
.publish-button-container {
  padding: 0 15px 15px 15px;
  display: flex;
  justify-content: flex-end;
}

.publish-button {
  display: flex;
  align-items: center;
  background-color: var(--primary, #2563eb);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.publish-button span {
  margin-right: 5px;
}

/* 随想列表 */
.moments-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 15px 15px 15px;
}

.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  font-size: 14px;
  color: var(--text-light, #64748b);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary, #2563eb);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 随想项 */
.moment-item {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  overflow: hidden;
  padding: 15px;
}

.moment-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.moment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.moment-user-meta {
  display: flex;
  flex-direction: column;
}

.moment-username {
  font-weight: 600;
  font-size: 15px;
  color: var(--text, #1e293b);
}

.moment-time {
  font-size: 12px;
  color: var(--text-light, #64748b);
  margin-top: 2px;
}

.moment-content {
  margin-bottom: 15px;
}

.moment-text {
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 10px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 图片网格 */
.moment-images {
  margin-top: 10px;
}

.image-grid {
  display: grid;
  grid-gap: 4px;
}

.image-grid-1 {
  grid-template-columns: 1fr;
}

.image-grid-2, .image-grid-4 {
  grid-template-columns: 1fr 1fr;
}

.image-grid-3, .image-grid-5, .image-grid-6, .image-grid-7, .image-grid-8, .image-grid-9 {
  grid-template-columns: repeat(3, 1fr);
}

.single-image .image-item {
  max-width: 70%;
}

.image-item {
  position: relative;
  padding-bottom: 100%;
}

.moment-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.more-images {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 18px;
  font-weight: 600;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

/* 视频播放器 */
.moment-video {
  margin-top: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.video-player {
  width: 100%;
  max-height: 400px;
  background-color: black;
}

/* 位置信息 */
.moment-location {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-light, #64748b);
}

.moment-location span {
  margin-right: 5px;
}

/* 互动区域 */
.moment-interaction {
  border-top: 1px solid var(--border, #e2e8f0);
  padding-top: 12px;
}

.interaction-buttons {
  display: flex;
  justify-content: space-around;
}

.like-button, .comment-button, .share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 14px;
  color: var(--text-light, #64748b);
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.like-button:hover, .comment-button:hover, .share-button:hover {
  background-color: var(--hover, #f1f5f9);
}

.like-button.liked {
  color: var(--primary, #2563eb);
}

.like-button span, .comment-button span, .share-button span {
  margin-right: 5px;
}

/* 点赞列表 */
.like-list {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 8px 12px;
  background-color: var(--background, #f8f9fa);
  border-radius: 6px;
  font-size: 14px;
}

.icon-liked {
  color: var(--primary, #2563eb);
  margin-right: 8px;
}

.liked-users {
  color: var(--text, #1e293b);
  font-weight: 500;
  flex: 1;
}

/* 评论列表 */
.comment-list {
  margin: 10px 0;
  padding: 8px 12px;
  background-color: var(--background, #f8f9fa);
  border-radius: 6px;
}

.comment-item {
  padding: 6px 0;
  font-size: 14px;
  cursor: pointer;
}

.comment-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.comment-username {
  font-weight: 600;
  color: var(--text, #1e293b);
}

.reply-text {
  color: var(--text-light, #64748b);
  margin: 0 4px;
}

.reply-username {
  font-weight: 600;
  color: var(--text, #1e293b);
}

.comment-content {
  color: var(--text, #1e293b);
  margin-left: 5px;
  word-break: break-word;
}

/* 评论输入框 */
.comment-input-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 8px 0;
  border-top: 1px solid var(--border, #e2e8f0);
}

.comment-input {
  flex: 1;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
}

.comment-input:focus {
  border-color: var(--primary, #2563eb);
}

.send-comment-button {
  background-color: var(--primary, #2563eb);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  margin-left: 8px;
  font-size: 14px;
  cursor: pointer;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 30px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--text-light, #64748b);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text, #1e293b);
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-size: 14px;
  color: var(--text-light, #64748b);
  margin: 0;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.loading-state p {
  margin-top: 16px;
  color: var(--text-light, #64748b);
}

/* 发布随想弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.publish-modal {
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  animation: modal-fade-in 0.3s ease;
}

@keyframes modal-fade-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border, #e2e8f0);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.publish-textarea {
  width: 100%;
  min-height: 120px;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  resize: none;
  outline: none;
  margin-bottom: 5px;
}

.textarea-counter {
  text-align: right;
  font-size: 12px;
  color: var(--text-light, #64748b);
  margin-bottom: 15px;
}

/* 已选图片预览 */
.selected-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  margin-bottom: 15px;
}

.selected-image-item {
  position: relative;
  padding-bottom: 100%;
}

.preview-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

.add-more-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background, #f8f9fa);
  border: 1px dashed var(--border, #e2e8f0);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  padding-bottom: 100%;
}

.add-more-image span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: var(--text-light, #64748b);
}

/* 功能按钮 */
.publish-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.action-button {
  display: flex;
  align-items: center;
  background-color: var(--background, #f8f9fa);
  border: none;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}

.action-button span {
  margin-right: 5px;
}

/* 已选视频预览 */
.selected-video {
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.preview-video {
  width: 100%;
  max-height: 250px;
  background-color: black;
}

.remove-video {
  display: block;
  width: 100%;
  background-color: var(--background, #f8f9fa);
  border: none;
  padding: 8px 0;
  font-size: 14px;
  cursor: pointer;
  margin-top: 5px;
}

/* 已选位置 */
.selected-location {
  display: flex;
  align-items: center;
  background-color: var(--background, #f8f9fa);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  margin-bottom: 15px;
  display: inline-flex;
}

.selected-location span {
  margin-right: 5px;
}

.remove-location {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid var(--border, #e2e8f0);
}

.cancel-button {
  background: none;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
}

.publish-submit-button {
  background-color: var(--primary, #2563eb);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.publish-submit-button:disabled {
  background-color: var(--disabled, #cbd5e1);
  cursor: not-allowed;
}

/* 图片查看器 */
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.close-viewer {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.image-counter {
  color: white;
  font-size: 14px;
}

.viewer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.prev-image, .next-image {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
}

.prev-image {
  left: 20px;
}

.next-image {
  right: 20px;
}

.viewer-image {
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
}

/* 操作菜单 */
.action-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 100;
  padding-top: 60px;
}

.action-menu {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  background: none;
  border: none;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--hover, #f1f5f9);
}

.menu-item span {
  margin-right: 10px;
}

/* 隐藏的文件输入 */
.hidden-input {
  display: none;
}
</style>
