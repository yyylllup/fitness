<template>
  <div class="weather-activity-wrapper">
    <!-- 左侧天气查询 -->
    <div class="weather-container">
      <h2>🌤 城市天气查询</h2>
      <div class="input-section">
        <input v-model="city" placeholder="请输入城市名称" @keyup.enter="fetchWeather" />
        <button @click="fetchWeather">查询</button>
      </div>
      <div v-if="weather" class="weather-box">
        <p>城市：{{ weather.city }}</p>
        <p>天气：{{ weather.desc }}</p>
        <p>温度：{{ weather.temp }}</p>
        <p>湿度：{{ weather.humidity }}%</p>
        <p>风速：{{ weather.wind }} m/s</p>
      </div>
      <div v-else-if="loading">
        <p>正在加载天气数据...</p>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  name: 'Weather',
  data() {
    return {
      city: 'Beijing',     // 默认城市
      weather: null,
      loading: false
    }
  },
  mounted() {
    this.fetchWeather()
  },
  methods: {
    async fetchWeather() {
      if (!this.city.trim()) {
        alert("请输入城市名");
        return;
      }

      this.loading = true
      this.weather = null

        try {
      const res = await axios.get(`/api/weather?city=${this.city}`)
      this.weather = res.data

    // ⭐ 把天气描述（如“晴”、“多云”）传给父组件
      this.$emit('weather-updated', res.data.desc)
      } catch (err) {
      alert('获取天气失败，请检查城市名或网络连接')
      console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.weather-activity-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.weather-container
{
  background: rgba(0, 0, 0, 0.3);  /* 半透明黑底，更贴近背景图 */
  color: #eafdfc;                 /* 亮色字体，与其他模块统一 */
  backdrop-filter: blur(8px);     /* 模糊背景 */
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  width: 400px;
  font-weight: 500;
}

.activity-suggestions {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.activity-suggestions ul {
  margin-top: 1rem;
  padding-left: 1rem;
}

.activity-suggestions li {
  margin-bottom: 0.5rem;
  font-size: 16px;
}
.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}
input {
  flex: 1;
  padding: 8px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button {
  padding: 8px 16px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #66b1ff;
}
.weather-box {
  background:transparent;
  padding: 1rem;
  border-radius: 6px;
  font-size: 16px;
  line-height: 1.6;
}
</style>
