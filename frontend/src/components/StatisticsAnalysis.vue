<template>
  <div class="statistics-analysis">
    <!-- 顶部标签 -->
    <div class="top-tabs">
      <div class="tab-item active">整体运动</div>
      <div class="tab-item">跑步</div>
      <div class="tab-item">骑行</div>
      <div class="tab-item">训练</div>
    </div>

    <!-- 时间筛选 -->
    <div class="time-filters">
      <div class="overview-label">运动概览</div>
      <div class="time-tabs">
        <button 
          v-for="period in timePeriods" 
          :key="period.key"
          :class="['time-tab', { active: selectedPeriod === period.key }]"
          @click="selectedPeriod = period.key"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- 主要统计区域 -->
    <div class="main-stats">
      <!-- 运动总览 -->
      <div class="overview-section">
        <div class="overview-title">运动总览</div>
        <div class="overview-stats">
          <div class="stat-card">
            <div class="stat-label">总次数</div>
            <div class="stat-value">{{ totalSessions }}</div>
            <div class="stat-unit">次</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">总时长</div>
            <div class="stat-value">{{ formatTime(totalDuration) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">消耗</div>
            <div class="stat-value">{{ totalCalories }}</div>
            <div class="stat-unit">kcal</div>
          </div>
        </div>

        <!-- 运动类型分布饼图 -->
        <div class="pie-chart-container">
          <canvas ref="pieChart" width="200" height="200"></canvas>
          <div class="chart-legend">
            <div v-for="item in pieData" :key="item.type" class="legend-item">
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-label">{{ item.type }} {{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势分布图 -->
      <div class="trend-section">
        <div class="section-title">趋势分布</div>
        <div class="chart-filters">
          <button 
            v-for="type in ['次数', '时长', '消耗']" 
            :key="type"
            :class="['filter-btn', { active: selectedChart === type }]"
            @click="selectedChart = type"
          >
            {{ type }}
          </button>
        </div>
        <div class="bar-chart-container">
          <canvas ref="barChart" width="400" height="200"></canvas>
        </div>
      </div>

      <!-- 运动偏好 -->
      <div class="preference-section">
        <div class="section-title">运动偏好</div>
        <div class="preference-bars">
          <div v-for="pref in preferences" :key="pref.time" class="preference-item">
            <div class="pref-label">{{ pref.time }}</div>
            <div class="pref-bar">
              <div class="pref-fill" :style="{ width: pref.percentage + '%' }"></div>
            </div>
            <div class="pref-percentage">{{ pref.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="module">
export default {
  name: 'StatisticsAnalysis',
  data() {
    return {
      selectedPeriod: 'month',
      selectedChart: '消耗',
      timePeriods: [
        { key: 'week', label: '近7日' },
        { key: 'month', label: '近30日' },
        { key: 'year', label: '近1年' },
        { key: 'total', label: '全部' }
      ],
      records: [],
      readinessScore: 74,
      sleepScore: 76,
      atlValue: 61,
      ctlValue: 80,
      tsbValue: 19,
      trainingLoad: 434,
      baseLoad: 791,
      avgLoad: 557
    }
  },
  computed: {
    filteredRecords() {
      const now = new Date()
      const records = this.records || []
      switch (this.selectedPeriod) {
        case 'week':
          return records.filter(r => new Date(r.date) >= new Date(now.getTime() - 7 * 86400000))
        case 'month':
          return records.filter(r => new Date(r.date) >= new Date(now.getTime() - 30 * 86400000))
        case 'year':
          return records.filter(r => new Date(r.date) >= new Date(now.getTime() - 365 * 86400000))
        default:
          return records
      }
    },
    totalSessions() {
      return this.filteredRecords.length
    },
    totalDuration() {
      return this.filteredRecords.reduce((sum, r) => sum + (r.duration || 0), 0)
    },
    totalCalories() {
      return this.filteredRecords.reduce((sum, r) => sum + (r.calories || 0), 0)
    },
    pieData() {
      const stats = {}
      const colors = { '跑步': '#4CAF50', '骑行': '#2196F3', '健身': '#FF9800', '其他': '#9E9E9E' }
      this.filteredRecords.forEach(r => {
        stats[r.type] = (stats[r.type] || 0) + 1
      })
      const total = this.totalSessions || 1
      return Object.entries(stats).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round(count / total * 100),
        color: colors[type] || '#9E9E9E'
      }))
    },
    preferences() {
      const timeSlots = {
        '凌晨': 0, '上午': 0, '中午': 0, '下午': 0, '傍晚': 0, '晚上': 0
      }
      this.filteredRecords.forEach(r => {
        const hour = new Date(r.date).getHours()
        if (hour < 6) timeSlots['凌晨']++
        else if (hour < 11) timeSlots['上午']++
        else if (hour < 13) timeSlots['中午']++
        else if (hour < 17) timeSlots['下午']++
        else if (hour < 20) timeSlots['傍晚']++
        else timeSlots['晚上']++
      })
      const total = this.totalSessions || 1
      return Object.entries(timeSlots).map(([time, count]) => ({
        time,
        percentage: Math.round(count / total * 100)
      }))
    }
  },
  mounted() {
    this.loadRecords()
    this.$nextTick(() => {
      this.drawPieChart()
      this.drawBarChart()
      this.drawHRVChart()
      this.drawLoadChart()
    })
  },
  watch: {
    selectedPeriod() {
      this.$nextTick(() => {
        this.drawPieChart()
        this.drawBarChart()
      })
    },
    selectedChart() {
      this.$nextTick(() => {
        this.drawBarChart()
      })
    }
  },
  methods: {
    loadRecords() {
      try {
        const saved = localStorage.getItem('exerciseRecords')
        if (saved) {
          this.records = JSON.parse(saved)
        }
      } catch (e) {
        console.error('Failed to load exerciseRecords', e)
      }
    },
    formatTime(minutes) {
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      return `${h}:${m.toString().padStart(2, '0')}:00`
    },
    drawPieChart() {
      const canvas = this.$refs.pieChart
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const r = 80
      let start = 0
      this.pieData.forEach(item => {
        const angle = (item.percentage / 100) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, r, start, start + angle)
        ctx.fillStyle = item.color
        ctx.fill()
        start += angle
      })
      ctx.beginPath()
      ctx.arc(cx, cy, 30, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
    },
    drawBarChart() {
      const canvas = this.$refs.barChart
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const grouped = {}
      this.filteredRecords.forEach(r => {
        const d = new Date(r.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
        if (!grouped[d]) grouped[d] = { 次数: 0, 时长: 0, 消耗: 0 }
        grouped[d]['次数']++
        grouped[d]['时长'] += r.duration || 0
        grouped[d]['消耗'] += r.calories || 0
      })
      const labels = Object.keys(grouped)
      const values = labels.map(d => grouped[d][this.selectedChart])
      const max = Math.max(...values, 10)
      const barW = 30
      const spacing = 60
      values.forEach((v, i) => {
        const x = 50 + i * spacing
        const y = canvas.height - 30
        const h = (v / max) * 150
        ctx.fillStyle = '#4CAF50'
        ctx.fillRect(x, y - h, barW, h)
        ctx.fillStyle = '#666'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(labels[i], x + barW / 2, y + 15)
      })
    },
    drawHRVChart() {
      const canvas = this.$refs.hrvChart
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const data = [100, 105, 98, 102, 95, 108, 103, 99, 101, 97]
      const w = canvas.width, h = canvas.height, pad = 20
      ctx.strokeStyle = '#00BCD4'
      ctx.lineWidth = 2
      ctx.beginPath()
      data.forEach((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - 2 * pad)
        const y = h - pad - ((v - 90) / 20) * (h - 2 * pad)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    },
    drawLoadChart() {
      const canvas = this.$refs.loadChart
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const data = [300, 350, 400, 380, 420, 450, 430, 460, 440, 434]
      const w = canvas.width, h = canvas.height, pad = 20
      ctx.strokeStyle = '#9C27B0'
      ctx.lineWidth = 2
      ctx.beginPath()
      data.forEach((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - 2 * pad)
        const y = h - pad - ((v - 250) / 250) * (h - 2 * pad)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#9C27B0'
        ctx.fill()
        ctx.beginPath()
      })
      ctx.stroke()
    }
  }
}
</script>


<style scoped>
.statistics-analysis {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.top-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 5px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
}

.tab-item.active {
  background: #4CAF50;
  color: white;
}

.time-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.overview-label {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.time-tabs {
  display: flex;
  gap: 10px;
}

.time-tab {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.time-tab.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.main-stats {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.overview-section,
.trend-section,
.preference-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.overview-title,
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.overview-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-unit {
  font-size: 12px;
  color: #666;
}

.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: 12px;
  color: #666;
}

.chart-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.filter-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.preference-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pref-label {
  width: 40px;
  font-size: 12px;
  color: #666;
}

.pref-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.pref-fill {
  height: 100%;
  background: #4CAF50;
  border-radius: 4px;
}

.pref-percentage {
  width: 30px;
  font-size: 12px;
  color: #666;
  text-align: right;
}

.status-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.status-cards {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
}

.status-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.status-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.readiness-score {
  font-size: 48px;
  font-weight: bold;
  color: #4CAF50;
  text-align: center;
  margin-bottom: 10px;
}

.readiness-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
}

.status-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.metric-label {
  color: #666;
}

.metric-value {
  color: #333;
  font-weight: 500;
}

.status-subtitle {
  font-size: 12px;
  color: #666;
  margin-bottom: 20px;
}

.hrv-metrics {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.hrv-item {
  text-align: center;
}

.hrv-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.hrv-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.recovery-time {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.recovery-label {
  font-size: 12px;
  color: #666;
}

.load-score {
  font-size: 48px;
  font-weight: bold;
  color: #9C27B0;
  text-align: center;
  margin-bottom: 20px;
}

.load-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.load-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.load-label {
  color: #666;
}

.load-value {
  color: #333;
  font-weight: 500;
}

.bar-chart-container,
.hrv-chart,
.load-chart {
  display: flex;
  justify-content: center;
}

@media (max-width: 1200px) {
  .main-stats {
    grid-template-columns: 1fr;
  }
  
  .status-cards {
    grid-template-columns: 1fr;
  }
}
</style>