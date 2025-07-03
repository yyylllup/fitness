<template>
  <div class="home">
    <div class="background-container"></div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="hero-content">
        <div class="hero-title-placeholder"></div>
      </div>
    </main>

    <!-- 内容模块 -->
    <section class="content-wrapper">
      <div class="modules-container">
        <!-- 天气与建议并排展示 -->
        <div class="weather-activity-row">
          <div class="module-box">
          <Weather @weather-updated="updateWeatherDesc" />
          </div>
          <div class="module-box">
          <SuggestionComponent :weatherDesc="currentWeatherDesc" />

          </div>
        </div>
        <!-- 视频模块 -->
        <div class="module">
          <div class="module-title"><span class="module-icon">🎥</span> 推荐健身视频</div>
          <div class="video-grid">
            <div class="video-card" v-for="(video, key) in videoList" :key="key">
              <video :src="video.src" controls></video>
              <div class="video-title">{{ video.title }}</div>
            </div>
          </div>
        </div>

        <!-- 食谱模块 -->
        <div class="module">
          <div class="module-title"><span class="module-icon">🍽️</span> 健康营养食谱推荐</div>
          <div class="recipe-grid">
            <div
              class="recipe-card"
              v-for="(recipe, key) in recipeList"
              :key="key"
              @click="goToRecipe(key)"
            >
              <img :src="recipe.cover" class="recipe-image" />
              <div class="recipe-title">{{ recipe.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Weather from '@/pages/weather.vue'
import SuggestionComponent from '@/pages/SuggestionComponent.vue'

export default {
  name: 'Dashboard',
  components: {
    Weather,
    SuggestionComponent
  },
  data() {
    return {
      location: 'Las Vegas',
      currentWeatherDesc: '', // 当前天气描述
          videoList: [
      {
        title: 'HIIT高强度间歇训练',
        src: '/videos/hiit.mp4'
      },
      {
        title: '晨间瑜伽舒展',
        src: '/videos/yoga.mp4'
      },
      {
        title: '全身力量训练',
        src: '/videos/strength.mp4'
      },
      {
        title: '有氧燃脂跳操',
        src: '/videos/cardio.mp4'
      },
      {
        title: '瑜伽拉伸基础',
        src: '/videos/stretch.mp4'
      },
      {
        title: '平板支撑',
        src: '/videos/pingban.mp4'
      }
    ],
      recipeList: {
      protein: {
        title: '高蛋白鸡胸肉沙拉',
        cover: '/recipes/protein.jpg',
        link: 'https://m.xiachufang.com/recipe/101776085/'
      },
      smoothie: {
        title: '蛋白质奶昔配方',
        cover: '/recipes/smoothie.jpg',
        link:'https://naturtotalshop.com/zh-CN/%E8%87%AA%E5%B7%B1%E5%88%B6%E4%BD%9C%E8%9B%8B%E7%99%BD%E8%B4%A8%E5%A5%B6%E6%98%94/'
      },
      oats: {
        title: '燕麦香蕉早餐碗',
        cover: '/recipes/oats.jpg',
        link: 'https://www.douguo.com/cookbook/3215461.html'
      },
      salmon: {
        title: '烤三文鱼配蔬菜',
        cover: '/recipes/salmon.jpg',
        link:'https://www.xiachufang.com/recipe/100385804/'
      },
    }
    }
  },
  methods: {
    updateWeatherDesc(desc) {
    this.currentWeatherDesc = desc
  },
    goToLogin() {
      this.$router.push('/login');
    },
    playVideo(key) {
      alert(`正在播放: ${this.videos[key]}`);
    },
    showRecipe(key) {
      alert(`查看食谱: ${this.recipes[key]}`);
    },
    goToRecipe(id) {
      const recipe = this.recipeList[id]
      if (recipe?.link) {
        window.open(recipe.link, '_blank')
      } else {
        this.$router.push(`/recipe/${id}`)
      }
    },
  }
}
</script>

<style>
/* 全局重置 */
.weather-activity-row {
  display: flex;
  gap: 30px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.module-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 隐藏滚动条 */
body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
body::-webkit-scrollbar {
  display: none;
}

/* 主容器 */
.home {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* 顶部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(135deg, #717172, #787879);
  padding: 15px 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(30, 60, 114, 0.3);
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LOGO 区域 */
.sports-logo {
  width: 45px;
  height: 45px;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.sports-logo:hover {
  transform: scale(1.1);
}

/* 登录按钮 */
.login-btn {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
}

/* 主体内容区域 */
.main-content {
    position: relative;
  z-index: 1;
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 80px;
  overflow: hidden;
}

/* 背景容器 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),  /* 半透明黑色叠层 */
    url('@/assets/images/back.jpg');                            /* 背景图路径 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -1;
  filter: contrast(0.7); /* 保持颜色清晰 */
}

/* 前景标题图 */
.hero-content {
  width: 100%;
  padding-left: 2vw;
  margin: 0;
  max-width: none;
}
.hero-title-placeholder {
  width: 380px;
  height: 120px;
  margin: 10px 0;
}

.title-img {
  max-width: 380px;
  padding: 10px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);

  /* 更明显的羽化边缘效果 */
  -webkit-mask-image: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 1) 40%,      /* 清晰区域缩小到 40% */
    rgba(0, 0, 0, 0.2) 70%,    /* 中间过渡区域更宽更淡 */
    rgba(0, 0, 0, 0) 100%      /* 完全透明的边缘 */
  );
  mask-image: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 1) 40%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}



/* 内容模块区 */
.content-wrapper {
  background-color: transparent;
  padding: 60px 0;
  width: 100%;
}

.modules-container {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 模块通用样式 */
.module,
.module-box {
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  border: none !important;
  padding: 20px;
  transition: none;
}

.module:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.module-title {
  font-size: 18px;
  font-weight: 600;
  color: #4ecdc4;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-icon {
  font-size: 20px;
}

/* 列表样式 */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-list li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
}

.item-list li:hover {
  color: #4ecdc4;
}

.item-list li:last-child {
  border-bottom: none;
}

/* 天气信息样式 */
.weather-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.weather-temp {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.weather-desc {
  color: #666;
  font-size: 14px;
}

/* 运动标签 */
.sport-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.sport-tag {
  background: linear-gradient(45deg, #624651, #44a08d);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    padding-left: 20px;
  }
  
  .title-img {
    max-width: 300px;
  }
  
  .modules-container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding-left: 15px;
  }
  
  .title-img {
    max-width: 250px;
  }
  
  .sports-logo {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
  
  .login-btn {
    padding: 8px 15px;
    font-size: 12px;
  }
}
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.video-card {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0;
}

.video-card:hover {
  transform: translateY(-4px);
}

.video-card video {
  width: 100%;
  border-radius: 6px;
}

.video-title {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #4ecdc4;
}
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.recipe-card {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0;
}

.recipe-card:hover {
  transform: translateY(-3px);
}

.recipe-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.recipe-title {
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #4ecdc4;
}

</style>