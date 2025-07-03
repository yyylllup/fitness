<template>
  <div class="recipe-detail">
    <img :src="recipe.cover" class="detail-image" />
    <h2 class="detail-title">{{ recipe.title }}</h2>

    <section class="section">
      <h3>🥬 所需食材</h3>
      <ul>
        <li v-for="(item, i) in recipe.ingredients" :key="i">{{ item }}</li>
      </ul>
    </section>

    <section class="section">
      <h3>👨‍🍳 做法步骤</h3>
      <ol>
        <li v-for="(step, i) in recipe.steps" :key="i">{{ step }}</li>
      </ol>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const recipeId = route.params.id

// 所有食谱信息（含封面图、食材、步骤）
const recipes = {
  protein: {
    title: '🍗 高蛋白鸡胸肉沙拉',
    cover: '/recipes/protein.jpg',
    ingredients: ['鸡胸肉 200g', '生菜 100g', '橄榄油 1勺', '黑胡椒适量'],
    steps: [
      '鸡胸肉煮熟切片',
      '生菜洗净沥干水',
      '将食材混合后加橄榄油和黑胡椒',
      '搅拌均匀即可食用'
    ]
  },
  smoothie: {
    title: '🥤 蛋白质奶昔配方',
    cover: '/recipes/smoothie.jpg',
    ingredients: ['香蕉 1 根', '蛋白粉 30g', '脱脂牛奶 200ml'],
    steps: [
      '将香蕉切段',
      '与蛋白粉和牛奶一起放入搅拌机',
      '搅拌30秒至顺滑',
      '即可饮用'
    ]
  },
  // 其他略...
}

const recipe = recipes[recipeId] || {
  title: '未找到该食谱',
  cover: '',
  ingredients: [],
  steps: ['请返回上一页重试。']
}
</script>

<style scoped>
.recipe-detail {
  max-width: 900px;
  margin: 60px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
}

.detail-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}

.detail-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.section {
  margin-top: 30px;
}

.section h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #4ecdc4;
}

ul, ol {
  padding-left: 20px;
  color: #555;
  line-height: 1.8;
}
</style>
