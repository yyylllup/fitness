<template>
  <div class="exercise-records">
    <div class="header">
      <h2>运动记录</h2>
      <button class="add-btn" @click="showAddModal = true">
        <i class="plus-icon">+</i>
        添加记录
      </button>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <select v-model="selectedType" @change="filterRecords">
        <option value="">全部类型</option>
        <option value="跑步">跑步</option>
        <option value="骑行">骑行</option>
        <option value="游泳">游泳</option>
        <option value="健身">健身</option>
        <option value="其他">其他</option>
      </select>
      
      <input 
        type="date" 
        v-model="selectedDate" 
        @change="filterRecords"
        class="date-filter"
      >
    </div>

    <!-- 记录列表 -->
    <div class="records-list">
      <div 
        v-for="record in filteredRecords" 
        :key="record.id"
        class="record-card"
      >
        <div class="record-header">
          <div class="type-badge" :class="record.type">
            {{ record.type }}
          </div>
          <div class="date">{{ formatDate(record.date) }}</div>
          <div class="actions">
            <button @click="editRecord(record)" class="edit-btn">编辑</button>
            <button @click="deleteRecord(record.id)" class="delete-btn">删除</button>
          </div>
        </div>
        
        <div class="record-content">
          <div class="stats">
            <div class="stat-item" v-if="record.duration">
              <span class="label">时长</span>
              <span class="value">{{ record.duration }}分钟</span>
            </div>
            <div class="stat-item" v-if="record.distance">
              <span class="label">距离</span>
              <span class="value">{{ record.distance }}公里</span>
            </div>
            <div class="stat-item" v-if="record.calories">
              <span class="label">卡路里</span>
              <span class="value">{{ record.calories }}kcal</span>
            </div>
            <div class="stat-item" v-if="record.heartRate">
              <span class="label">心率</span>
              <span class="value">{{ record.heartRate }}bpm</span>
            </div>
          </div>
          
          <div class="notes" v-if="record.notes">
            <p>{{ record.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑模态框 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingRecord ? '编辑记录' : '添加记录' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveRecord" class="modal-form">
          <div class="form-group">
            <label>运动类型</label>
            <select v-model="currentRecord.type" required>
              <option value="">请选择</option>
              <option value="跑步">跑步</option>
              <option value="骑行">骑行</option>
              <option value="游泳">游泳</option>
              <option value="健身">健身</option>
              <option value="其他">其他</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>日期</label>
            <input type="date" v-model="currentRecord.date" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>时长(分钟)</label>
              <input type="number" v-model="currentRecord.duration" min="1">
            </div>
            <div class="form-group">
              <label>距离(公里)</label>
              <input type="number" v-model="currentRecord.distance" step="0.1" min="0">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>卡路里</label>
              <input type="number" v-model="currentRecord.calories" min="0">
            </div>
            <div class="form-group">
              <label>平均心率</label>
              <input type="number" v-model="currentRecord.heartRate" min="0" max="220">
            </div>
          </div>
          
          <div class="form-group">
            <label>备注</label>
            <textarea v-model="currentRecord.notes" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">取消</button>
            <button type="submit" class="save-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExerciseRecords',
  data() {
    return {
      showAddModal: false,
      editingRecord: null,
      selectedType: '',
      selectedDate: '',
      currentRecord: this.getEmptyRecord(),
      records: [
        {
          id: 1,
          type: '跑步',
          date: '2024-12-01',
          duration: 45,
          distance: 8.5,
          calories: 450,
          heartRate: 145,
          notes: '晨跑，天气不错'
        },
        {
          id: 2,
          type: '骑行',
          date: '2024-12-02',
          duration: 90,
          distance: 25.3,
          calories: 680,
          heartRate: 135,
          notes: '周末骑行到公园'
        },
        {
          id: 3,
          type: '健身',
          date: '2024-12-03',
          duration: 60,
          calories: 320,
          heartRate: 125,
          notes: '力量训练'
        }
      ],
      filteredRecords: []
    }
  },
  mounted() {
    this.loadRecords()
    this.filterRecords()
  },
  methods: {
    getEmptyRecord() {
      return {
        type: '',
        date: new Date().toISOString().split('T')[0],
        duration: null,
        distance: null,
        calories: null,
        heartRate: null,
        notes: ''
      }
    },
    
    loadRecords() {
      // 从localStorage加载记录
      const saved = localStorage.getItem('exerciseRecords')
      if (saved) {
        this.records = JSON.parse(saved)
      }
    },
    
    saveRecords() {
      // 保存记录到localStorage
      localStorage.setItem('exerciseRecords', JSON.stringify(this.records))
      // 触发统计分析页面更新
      this.$emit('records-updated', this.records)
    },
    
    filterRecords() {
      this.filteredRecords = this.records.filter(record => {
        const typeMatch = !this.selectedType || record.type === this.selectedType
        const dateMatch = !this.selectedDate || record.date === this.selectedDate
        return typeMatch && dateMatch
      }).sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      })
    },
    
    editRecord(record) {
      this.editingRecord = record
      this.currentRecord = { ...record }
      this.showAddModal = true
    },
    
    deleteRecord(id) {
      if (confirm('确定要删除这条记录吗？')) {
        this.records = this.records.filter(r => r.id !== id)
        this.saveRecords()
        this.filterRecords()
      }
    },
    
    saveRecord() {
      if (this.editingRecord) {
        // 编辑现有记录
        const index = this.records.findIndex(r => r.id === this.editingRecord.id)
        this.records[index] = { ...this.currentRecord, id: this.editingRecord.id }
      } else {
        // 添加新记录
        const newRecord = {
          ...this.currentRecord,
          id: Date.now()
        }
        this.records.push(newRecord)
      }
      
      this.saveRecords()
      this.closeModal()
      this.filterRecords()
    },
    
    closeModal() {
      this.showAddModal = false
      this.editingRecord = null
      this.currentRecord = this.getEmptyRecord()
    }
  }
}
</script>

<style scoped>
.exercise-records {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  color: #333;
  margin: 0;
}

.add-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.add-btn:hover {
  background: #45a049;
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filters select,
.date-filter {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.type-badge.跑步 { background: #4CAF50; }
.type-badge.骑行 { background: #2196F3; }
.type-badge.游泳 { background: #00BCD4; }
.type-badge.健身 { background: #FF9800; }
.type-badge.其他 { background: #9E9E9E; }

.date {
  color: #666;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.record-content .stats {
  display: flex;
  gap: 30px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-item .value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.notes {
  color: #666;
  font-style: italic;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background: #45a049;
}
</style>