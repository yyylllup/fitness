<template>
  <div class="module-box">
    <div class="module">
      <div class="module-title"><span class="module-icon">🏃</span> 适合今日运动</div>
      <div class="weather-desc" style="margin-bottom: 15px;">
        根据当前天气为您推荐：
      </div>
      <ul class="item-list">
        <li v-for="(item, index) in suggestions" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  weatherDesc: {
    type: String,
    default: '晴'
  }
})

const suggestions = ref([])

function getSuggestions(weather) {
  if (weather.includes('晴') || weather.includes('多云')) {
    return [
      ' 户外慢跑 - 30分钟',
      ' 户外骑行 - 45分钟',
      ' 山地徒步 - 60分钟',
      ' 网球训练 - 40分钟'
    ]
  } else if (weather.includes('雨') || weather.includes('小雨')) {
    return [
      ' 居家力量训练 - 30分钟',
      ' 居家瑜伽舒展 - 20分钟',
      ' 健身操 - 25分钟'
    ]
  } else if (weather.includes('雪')) {
    return [
      ' 室内有氧训练 - 30分钟',
      ' 室内拉伸放松 - 20分钟'
    ]
  } else {
    return [' 适量活动，注意天气变化']
  }
}

// 监听天气描述变化，实时更新建议
watch(() => props.weatherDesc, (newVal) => {
  suggestions.value = getSuggestions(newVal)
}, { immediate: true })
</script>


<style scoped>
.module-box {
  flex: 1;
  max-width: 400px;
}

.module {
  background: rgba(0, 0, 0, 0.3);   /* ✅ 半透明黑底 */
  color: #eafdfc;                  /* ✅ 字体亮色统一 */
  backdrop-filter: blur(8px);     /* ✅ 毛玻璃 */
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  width: 400px;
  font-weight: 500;
  transition: all 0.3s ease;
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
.weather-desc {
  color: #68908e; /* 你可以换成 #fff、#00ffe0 等等 */
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-list li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: #4ecdc4;
  transition: color 0.3s ease;
}

.item-list li:hover {
  color: #4ecdc4;
}
</style>
