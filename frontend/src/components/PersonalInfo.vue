<template>
  <div class="personal-info">

    <!-- 个人信息管理 -->
    <div class="info-management">
      <h3>个人信息管理</h3>
      <div class="info-sections">
        <!-- 基本信息 -->
        <div class="info-section">
          <div class="section-title">
            <h4>基本信息</h4>
            <button class="edit-btn" @click="toggleEdit('basic')">
              {{ editMode.basic ? '保存' : '编辑' }}
            </button>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>姓名:</label>
              <input 
                v-if="editMode.basic" 
                v-model="localInfo.name" 
                type="text"
                class="info-input"
              />
              <span v-else class="info-value">{{ localInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>年龄:</label>
              <input 
                v-if="editMode.basic" 
                v-model.number="localInfo.age" 
                type="number"
                class="info-input"
              />
              <span v-else class="info-value">{{ localInfo.age }}岁</span>
            </div>
            <div class="info-item">
              <label>性别:</label>
              <select v-if="editMode.basic" v-model="localInfo.gender" class="info-select">
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
              <span v-else class="info-value">{{ localInfo.gender }}</span>
            </div>
          </div>
        </div>

        <!-- 身体数据 -->
        <div class="info-section">
          <div class="section-title">
            <h4>身体数据</h4>
            <button class="edit-btn" @click="toggleEdit('body')">
              {{ editMode.body ? '保存' : '编辑' }}
            </button>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>身高:</label>
              <input 
                v-if="editMode.body" 
                v-model.number="localInfo.height" 
                type="number"
                class="info-input"
                @input="calculateBMI"
              />
              <span v-else class="info-value">{{ localInfo.height }} cm</span>
            </div>
            <div class="info-item">
              <label>体重:</label>
              <input 
                v-if="editMode.body" 
                v-model.number="localInfo.weight" 
                type="number"
                class="info-input"
                @input="calculateBMI"
              />
              <span v-else class="info-value">{{ localInfo.weight }} kg</span>
            </div>
            <div class="info-item">
              <label>BMI:</label>
              <span class="info-value bmi-value" :class="getBMIClass()">
                {{ localInfo.bmi }}
              </span>
            </div>
          </div>
        </div>

        <!-- 健身目标 -->
        <div class="info-section">
          <div class="section-title">
            <h4>健身目标</h4>
            <button class="edit-btn" @click="toggleEdit('goals')">
              {{ editMode.goals ? '保存' : '编辑' }}
            </button>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>主要目标:</label>
              <select v-if="editMode.goals" v-model="localInfo.mainGoal" class="info-select">
                <option value="减重">减重</option>
                <option value="增肌">增肌</option>
                <option value="塑形">塑形</option>
                <option value="保持">保持</option>
              </select>
              <span v-else class="info-value">{{ localInfo.mainGoal }}</span>
            </div>
            <div class="info-item">
              <label>目标体重:</label>
              <input 
                v-if="editMode.goals" 
                v-model.number="localInfo.targetWeight" 
                type="number"
                class="info-input"
              />
              <span v-else class="info-value">{{ localInfo.targetWeight }} kg</span>
            </div>
            <div class="info-item">
              <label>运动频率:</label>
              <select v-if="editMode.goals" v-model="localInfo.exerciseFrequency" class="info-select">
                <option value="1-2">每周1-2次</option>
                <option value="3-4">每周3-4次</option>
                <option value="5-6">每周5-6次</option>
                <option value="7">每天</option>
              </select>
              <span v-else class="info-value">每周{{ localInfo.exerciseFrequency }}次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfo',
  props: {
    info: {
      type: Object,
      default: () => ({
        name: '张三',
        age: 25,
        gender: '男',
        height: 175,
        weight: 70,
        bmi: 22.9,
        targetWeight: 65,
        exerciseFrequency: '3-4',
        mainGoal: '减重'
      })
    }
  },
  data() {
    return {
      localInfo: { ...this.info },
      editMode: {
        basic: false,
        body: false,
        goals: false
      }
    }
  },
  watch: {
    info: {
      handler(newInfo) {
        this.localInfo = { ...newInfo }
      },
      deep: true
    }
  },
  methods: {
    toggleEdit(section) {
      if (this.editMode[section]) {
        // 保存模式
        this.saveInfo(section)
      }
      this.editMode[section] = !this.editMode[section]
    },
    saveInfo(section) {
      this.$emit('update-info', this.localInfo)
      console.log(`保存${section}信息:`, this.localInfo)
    },
    calculateBMI() {
      if (this.localInfo.height && this.localInfo.weight) {
        const heightInM = this.localInfo.height / 100
        this.localInfo.bmi = (this.localInfo.weight / (heightInM * heightInM)).toFixed(1)
      }
    },
    getBMIClass() {
      const bmi = parseFloat(this.localInfo.bmi)
      if (bmi < 18.5) return 'bmi-underweight'
      if (bmi < 24) return 'bmi-normal'
      if (bmi < 28) return 'bmi-overweight'
      return 'bmi-obese'
    }
  }
}
</script>

<style scoped>
.personal-info {
  padding: 24px;
}

.feature-intro {
  margin-bottom: 32px;
}

.feature-intro h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.personal-management { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.exercise-record { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.fitness-plan { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.data-visual { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.feature-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.feature-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.info-management h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.edit-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.edit-btn:hover {
  background: #0056b3;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.info-value {
  font-size: 16px;
  color: #333;
  padding: 8px 0;
}

.info-input, .info-select {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.info-input:focus, .info-select:focus {
  outline: none;
  border-color: #007bff;
}

.bmi-value {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.bmi-underweight { background: #e3f2fd; color: #1976d2; }
.bmi-normal { background: #e8f5e8; color: #388e3c; }
.bmi-overweight { background: #fff3e0; color: #f57c00; }
.bmi-obese { background: #ffebee; color: #d32f2f; }

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>