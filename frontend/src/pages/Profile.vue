<template>
  <div class="profile-container">
    <!-- 顶部导航栏 -->
    <div class="profile-header">
      <h1 class="profile-title">个人资料</h1>
      <p class="profile-subtitle">管理您的健身信息和偏好设置</p>
    </div>

    <!-- 四个功能模块下拉框 -->
    <div class="profile-sections">
      <!-- 个人信息管理 -->
      <div class="section-card">
        <div class="section-header" @click="toggleSection('personal')">
          <div class="section-icon personal-icon">
            <i class="icon-user"></i>
          </div>
          <div class="section-info">
            <h3>个人信息管理</h3>
            <p>管理基本信息、身体数据和健身目标</p>
          </div>
          <div class="section-arrow" :class="{ 'expanded': expandedSections.personal }">
            <i class="icon-chevron-down"></i>
          </div>
        </div>
        <div class="section-content" v-show="expandedSections.personal">
          <PersonalInfo @update-info="handlePersonalInfoUpdate" />
        </div>
      </div>

      <!-- 健身计划 -->
      <div class="section-card">
        <div class="section-header" @click="toggleSection('plans')">
          <div class="section-icon plans-icon">
            <i class="icon-target"></i>
          </div>
          <div class="section-info">
            <h3>健身计划</h3>
            <p>制定和管理您的健身计划模板</p>
          </div>
          <div class="section-arrow" :class="{ 'expanded': expandedSections.plans }">
            <i class="icon-chevron-down"></i>
          </div>
        </div>
        <div class="section-content" v-show="expandedSections.plans">
          <FitnessPlans @update-plans="handlePlansUpdate" />
        </div>
      </div>

      <!-- 运动记录 -->
      <div class="section-card">
        <div class="section-header" @click="toggleSection('records')">
          <div class="section-icon records-icon">
            <i class="icon-activity"></i>
          </div>
          <div class="section-info">
            <h3>运动记录</h3>
            <p>记录和查看您的运动历史数据</p>
          </div>
          <div class="section-arrow" :class="{ 'expanded': expandedSections.records }">
            <i class="icon-chevron-down"></i>
          </div>
        </div>
        <div class="section-content" v-show="expandedSections.records">
          <ExerciseRecords 
            :records="exerciseRecords" 
            @add-record="handleAddRecord"
            @delete-record="handleDeleteRecord" 
          />
        </div>
      </div>

      <!-- 统计分析 -->
      <div class="section-card">
        <div class="section-header" @click="toggleSection('analytics')">
          <div class="section-icon analytics-icon">
            <i class="icon-bar-chart"></i>
          </div>
          <div class="section-info">
            <h3>统计分析</h3>
            <p>可视化展示您的运动数据和进展</p>
          </div>
          <div class="section-arrow" :class="{ 'expanded': expandedSections.analytics }">
            <i class="icon-chevron-down"></i>
          </div>
        </div>
        <div class="section-content" v-show="expandedSections.analytics">
          <StatisticsAnalysis :records="exerciseRecords" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalInfo from '@/components/PersonalInfo.vue'
import FitnessPlans from '@/components/FitnessPlans.vue'
import ExerciseRecords from '@/components/ExerciseRecords.vue'
import StatisticsAnalysis from '@/components/StatisticsAnalysis.vue'

export default {
  name: 'Profile',
  components: {
    PersonalInfo,
    FitnessPlans,
    ExerciseRecords,
    StatisticsAnalysis
  },
  data() {
    return {
      expandedSections: {
        personal: false,
        plans: false,
        records: false,
        analytics: false
      },
      personalInfo: {
        name: '张三',
        age: 25,
        gender: '男',
        height: 175,
        weight: 70,
        bmi: 22.9,
        targetWeight: 65,
        exerciseFrequency: '3-4'
      },
      exerciseRecords: [
        {
          id: 1,
          type: '跑步',
          date: '2024-01-15',
          duration: 30,
          caloriesBurned: 300,
          distance: null
        },
        {
          id: 2,
          type: '健身房',
          date: '2024-01-14',
          duration: 60,
          caloriesBurned: 400,
          distance: null
        },
        {
          id: 3,
          type: '骑行',
          date: '2024-01-13',
          duration: 45,
          caloriesBurned: 350,
          distance: null
        }
      ]
    }
  },
  methods: {
    toggleSection(section) {
      this.expandedSections[section] = !this.expandedSections[section]
    },
    handlePersonalInfoUpdate(info) {
      this.personalInfo = { ...this.personalInfo, ...info }
      // 这里可以添加保存到后端的逻辑
      console.log('个人信息更新:', info)
    },
    handlePlansUpdate(plans) {
      // 处理健身计划更新
      console.log('健身计划更新:', plans)
    },
    handleAddRecord(record) {
      const newRecord = {
        ...record,
        id: Date.now()
      }
      this.exerciseRecords.unshift(newRecord)
      console.log('添加运动记录:', newRecord)
    },
    handleDeleteRecord(recordId) {
      this.exerciseRecords = this.exerciseRecords.filter(record => record.id !== recordId)
      console.log('删除运动记录:', recordId)
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.profile-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.section-header:hover {
  background-color: #f8f9fa;
}

.section-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}

.personal-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.plans-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.records-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.analytics-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.section-info {
  flex: 1;
}

.section-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.section-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.section-arrow {
  font-size: 18px;
  color: #999;
  transition: transform 0.3s ease;
}

.section-arrow.expanded {
  transform: rotate(180deg);
}

.section-content {
  border-top: 1px solid #eee;
  padding: 0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 图标字体 */
.icon-user::before { content: '👤'; }
.icon-target::before { content: '🎯'; }
.icon-activity::before { content: '📊'; }
.icon-bar-chart::before { content: '📈'; }
.icon-chevron-down::before { content: '▼'; }

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .section-header {
    padding: 16px;
  }
  
  .section-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .section-info h3 {
    font-size: 16px;
  }
  
  .section-info p {
    font-size: 13px;
  }
}
</style>