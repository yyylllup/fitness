<template>
  <div class="fitness-plans">
    <div class="plans-content">
      <h3>健身计划制定</h3>
      
      <!-- 预设计划模板 -->
      <div class="plan-templates">
        <h4>预设计划模板</h4>
        <div class="templates-grid">
          <div 
            class="template-card"
            v-for="template in templates"
            :key="template.id"
            :class="{ 'selected': selectedTemplate?.id === template.id }"
            @click="selectTemplate(template)"
          >
            <div class="template-header">
              <h5>{{ template.name }}</h5>
              <span class="template-badge" :class="template.type">{{ template.typeLabel }}</span>
            </div>
            <p class="template-description">{{ template.description }}</p>
            <div class="template-details">
              <div class="detail-item">
                <span class="detail-label">时长:</span>
                <span class="detail-value">{{ template.duration }}周</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">频率:</span>
                <span class="detail-value">每周{{ template.frequency }}次</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 计划详情和自定义 -->
      <div v-if="selectedTemplate" class="plan-details">
        <h4>计划详情</h4>
        <div class="plan-editor">
          <div class="plan-info">
            <div class="info-row">
              <label>计划名称:</label>
              <input 
                v-model="customPlan.name" 
                type="text" 
                class="plan-input"
                placeholder="输入自定义计划名称"
              />
            </div>
            <div class="info-row">
              <label>计划时长:</label>
              <select v-model="customPlan.duration" class="plan-select">
                <option value="4">4周</option>
                <option value="8">8周</option>
                <option value="12">12周</option>
                <option value="16">16周</option>
              </select>
            </div>
            <div class="info-row">
              <label>训练频率:</label>
              <select v-model="customPlan.frequency" class="plan-select">
                <option value="3">每周3次</option>
                <option value="4">每周4次</option>
                <option value="5">每周5次</option>
                <option value="6">每周6次</option>
              </select>
            </div>
          </div>

          <!-- 周计划 -->
          <div class="weekly-plan">
            <h5>周训练计划</h5>
            <div class="week-days">
              <div 
                v-for="(day, index) in customPlan.weeklyPlan" 
                :key="index"
                class="day-plan"
              >
                <div class="day-header">
                  <h6>{{ getDayName(index) }}</h6>
                  <label class="rest-toggle">
                    <input 
                      type="checkbox" 
                      v-model="day.isRest"
                      @change="toggleRestDay(index)"
                    />
                    休息日
                  </label>
                </div>
                <div v-if="!day.isRest" class="day-exercises">
                  <div 
                    v-for="(exercise, exerciseIndex) in day.exercises"
                    :key="exerciseIndex"
                    class="exercise-item"
                  >
                    <select v-model="exercise.type" class="exercise-select">
                      <option value="">选择运动类型</option>
                      <option value="有氧运动">有氧运动</option>
                      <option value="力量训练">力量训练</option>
                      <option value="柔韧性训练">柔韧性训练</option>
                      <option value="核心训练">核心训练</option>
                    </select>
                    <input 
                      v-model="exercise.name" 
                      type="text" 
                      placeholder="运动名称"
                      class="exercise-input"
                    />
                    <input 
                      v-model.number="exercise.duration" 
                      type="number" 
                      placeholder="时长(分钟)"
                      class="exercise-input short"
                    />
                    <button 
                      @click="removeExercise(index, exerciseIndex)"
                      class="remove-exercise-btn"
                    >
                      ×
                    </button>
                  </div>
                  <button 
                    @click="addExercise(index)"
                    class="add-exercise-btn"
                  >
                    + 添加运动
                  </button>
                </div>
                <div v-else class="rest-day-note">
                  <span>🛌 休息日 - 建议进行轻度拉伸或散步</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="plan-actions">
            <button @click="savePlan" class="save-btn">保存计划</button>
            <button @click="resetPlan" class="reset-btn">重置</button>
          </div>
        </div>
      </div>

      <!-- 我的计划列表 -->
      <div class="my-plans">
        <h4>我的计划</h4>
        <div v-if="myPlans.length === 0" class="empty-state">
          <p>还没有创建任何计划，选择一个模板开始吧！</p>
        </div>
        <div v-else class="plans-list">
          <div 
            v-for="plan in myPlans"
            :key="plan.id"
            class="plan-item"
          >
            <div class="plan-item-header">
              <h5>{{ plan.name }}</h5>
              <div class="plan-item-actions">
                <button @click="editPlan(plan)" class="edit-plan-btn">编辑</button>
                <button @click="deletePlan(plan.id)" class="delete-plan-btn">删除</button>
              </div>
            </div>
            <div class="plan-item-details">
              <span>{{ plan.duration }}周计划</span>
              <span>每周{{ plan.frequency }}次</span>
              <span>创建于 {{ formatDate(plan.createdAt) }}</span>
            </div>
            <div class="plan-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: plan.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">进度: {{ plan.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FitnessPlans',
  data() {
    return {
      selectedTemplate: null,
      customPlan: null,
      templates: [
        {
          id: 1,
          name: '减脂计划',
          type: 'weight-loss',
          typeLabel: '减重',
          description: '适合想要减重的用户',
          duration: 8,
          frequency: 4,
          weeklyPlan: this.getDefaultWeeklyPlan('weight-loss')
        },
        {
          id: 2,
          name: '增肌计划',
          type: 'muscle-gain',
          typeLabel: '增肌',
          description: '适合想要增加肌肉的用户',
          duration: 12,
          frequency: 5,
          weeklyPlan: this.getDefaultWeeklyPlan('muscle-gain')
        },
        {
          id: 3,
          name: '入门计划',
          type: 'beginner',
          typeLabel: '新手',
          description: '适合健身初学者',
          duration: 4,
          frequency: 3,
          weeklyPlan: this.getDefaultWeeklyPlan('beginner')
        }
      ],
      myPlans: []
    }
  },
  methods: {
    getDefaultWeeklyPlan(type) {
      const basePlan = Array.from({ length: 7 }, (_, index) => ({
        isRest: index === 6, // 周日默认休息
        exercises: []
      }))

      if (type === 'weight-loss') {
        basePlan[0].exercises = [
          { type: '有氧运动', name: '跑步', duration: 30 },
          { type: '核心训练', name: '腹肌训练', duration: 15 }
        ]
        basePlan[1].exercises = [
          { type: '力量训练', name: '上肢训练', duration: 45 }
        ]
        basePlan[2].exercises = [
          { type: '有氧运动', name: '游泳', duration: 40 }
        ]
        basePlan[3].exercises = [
          { type: '力量训练', name: '下肢训练', duration: 45 }
        ]
        basePlan[4].isRest = true
        basePlan[5].exercises = [
          { type: '有氧运动', name: '骑行', duration: 45 }
        ]
      } else if (type === 'muscle-gain') {
        basePlan[0].exercises = [
          { type: '力量训练', name: '胸肌训练', duration: 60 }
        ]
        basePlan[1].exercises = [
          { type: '力量训练', name: '背部训练', duration: 60 }
        ]
        basePlan[2].exercises = [
          { type: '力量训练', name: '腿部训练', duration: 60 }
        ]
        basePlan[3].exercises = [
          { type: '力量训练', name: '肩部训练', duration: 45 }
        ]
        basePlan[4].exercises = [
          { type: '力量训练', name: '手臂训练', duration: 45 }
        ]
        basePlan[5].exercises = [
          { type: '有氧运动', name: '轻度有氧', duration: 30 }
        ]
      } else if (type === 'beginner') {
        basePlan[0].exercises = [
          { type: '有氧运动', name: '快走', duration: 20 },
          { type: '柔韧性训练', name: '拉伸', duration: 10 }
        ]
        basePlan[1].isRest = true
        basePlan[2].exercises = [
          { type: '力量训练', name: '基础力量', duration: 30 }
        ]
        basePlan[3].isRest = true
        basePlan[4].exercises = [
          { type: '有氧运动', name: '骑行', duration: 25 }
        ]
        basePlan[5].isRest = true
      }

      return basePlan
    },
    selectTemplate(template) {
      this.selectedTemplate = template
      this.customPlan = {
        name: template.name,
        duration: template.duration,
        frequency: template.frequency,
        weeklyPlan: JSON.parse(JSON.stringify(template.weeklyPlan))
      }
    },
    getDayName(index) {
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      return days[index]
    },
    toggleRestDay(dayIndex) {
      if (this.customPlan.weeklyPlan[dayIndex].isRest) {
        this.customPlan.weeklyPlan[dayIndex].exercises = []
      } else {
        this.customPlan.weeklyPlan[dayIndex].exercises.push({
          type: '',
          name: '',
          duration: 30
        })
      }
    },
    addExercise(dayIndex) {
      this.customPlan.weeklyPlan[dayIndex].exercises.push({
        type: '',
        name: '',
        duration: 30
      })
    },
    removeExercise(dayIndex, exerciseIndex) {
      this.customPlan.weeklyPlan[dayIndex].exercises.splice(exerciseIndex, 1)
    },
    savePlan() {
      if (!this.customPlan.name.trim()) {
        alert('请输入计划名称')
        return
      }

      const newPlan = {
        id: Date.now(),
        ...this.customPlan,
        createdAt: new Date().toISOString(),
        progress: 0
      }

      this.myPlans.push(newPlan)
      this.$emit('update-plans', this.myPlans)
      alert('计划保存成功！')
    },
    resetPlan() {
      if (this.selectedTemplate) {
        this.customPlan = {
          name: this.selectedTemplate.name,
          duration: this.selectedTemplate.duration,
          frequency: this.selectedTemplate.frequency,
          weeklyPlan: JSON.parse(JSON.stringify(this.selectedTemplate.weeklyPlan))
        }
      }
    },
    editPlan(plan) {
      this.customPlan = JSON.parse(JSON.stringify(plan))
      this.selectedTemplate = { id: 'custom' }
    },
    deletePlan(planId) {
      if (confirm('确定要删除这个计划吗？')) {
        this.myPlans = this.myPlans.filter(plan => plan.id !== planId)
        this.$emit('update-plans', this.myPlans)
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('zh-CN')
    }
  }
}
</script>

<style scoped>
.fitness-plans {
  padding: 24px;
}

.plans-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.plan-templates {
  margin-bottom: 32px;
}

.plan-templates h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.template-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.template-card.selected {
  border-color: #007bff;
  background: #f8f9ff;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.template-header h5 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.template-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.template-badge.weight-loss {
  background: #fff3cd;
  color: #856404;
}

.template-badge.muscle-gain {
  background: #d1ecf1;
  color: #0c5460;
}

.template-badge.beginner {
  background: #d4edda;
  color: #155724;
}

.template-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.template-details {
  display: flex;
  gap: 16px;
}

.detail-item {
  display: flex;
  gap: 4px;
  font-size: 14px;
}

.detail-label {
  color: #666;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.plan-details {
  margin-bottom: 32px;
}

.plan-details h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.plan-editor {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 24px;
}

.plan-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.plan-input, .plan-select {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
}

.plan-input:focus, .plan-select:focus {
  outline: none;
  border-color: #007bff;
}

.weekly-plan h5 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.week-days {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.day-plan {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  background: #f8f9fa;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.day-header h6 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.rest-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.exercise-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.exercise-select, .exercise-input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 12px;
  flex: 1;
}

.exercise-input.short {
  flex: 0 0 80px;
}

.remove-exercise-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.add-exercise-btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.rest-day-note {
  color: #666;
  font-style: italic;
  font-size: 14px;
  text-align: center;
  padding: 12px;
}

.plan-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
}

.save-btn, .reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.save-btn {
  background: #007bff;
  color: white;
}

.save-btn:hover {
  background: #0056b3;
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #545b62;
}

.my-plans h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.plans-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.plan-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-item-header h5 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.plan-item-actions {
  display: flex;
  gap: 8px;
}

.edit-plan-btn, .delete-plan-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-plan-btn {
  background: #17a2b8;
  color: white;
}

.delete-plan-btn {
  background: #dc3545;
  color: white;
}

.plan-item-details {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.plan-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #28a745;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .templates-grid, .week-days {
    grid-template-columns: 1fr;
  }
  
  .plan-info {
    grid-template-columns: 1fr;
  }
  
  .exercise-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .plan-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .plan-item-details {
    flex-direction: column;
    gap: 4px;
  }
}
</style>