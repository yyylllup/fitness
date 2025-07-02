<template>
  <div class="login-wrapper">
    <div class="login-box" role="dialog" aria-labelledby="loginTitle">
      <h2 id="loginTitle">ACCOUNT REGISTER</h2>

      <form @submit.prevent="handleRegister" novalidate autocomplete="on">
        <!-- 用户名 -->
        <label class="input-group" :class="{ focused: username }">
          <i class="fas fa-user" aria-hidden="true"></i>
          <input
            type="text"
            placeholder="Username"
            v-model="username"
            required
            aria-label="Username"
            autocomplete="username"
          />
        </label>

        <!-- 邮箱 -->
        <label class="input-group" :class="{ focused: email }">
          <i class="fas fa-envelope" aria-hidden="true"></i>
          <input
            type="email"
            placeholder="Email"
            v-model="email"
            required
            aria-label="Email"
            autocomplete="email"
          />
        </label>

        <!-- 密码 -->
        <label class="input-group" :class="{ focused: password }">
          <i class="fas fa-lock" aria-hidden="true"></i>
          <input
            type="password"
            placeholder="Password"
            v-model="password"
            required
            minlength="6"
            aria-label="Password"
            autocomplete="new-password"
          />
        </label>

        <div class="options">
          <label class="remember">
            <input type="checkbox" v-model="remember" /> Remember me
          </label>
          <a class="forgot" href="#">Forgot password?</a>
        </div>

        <button type="submit" class="btn-login" :disabled="processing">
          {{ processing ? 'Registering…' : 'REGISTER' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/*********************
  CSS Custom Properties
*********************/


@keyframes slideIn {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 在 .login-box 现有规则里加这一行 */



:root {
  /* palette */
  --clr-primary: #222;
  --clr-accent: #5c5a63;
  --clr-accent-2: #cfc6cd;
  --clr-muted: #888;
  --clr-link: #6e6a73;
  --clr-bg-blur: rgba(255, 255, 255, 0.88);
  /* motion & radius */
  --radius: 20px;
  --motion-fast: 0.25s;
  --motion-normal: 0.4s;
}

/* Wrapper keeps previous background image */
.login-wrapper {
  background: url('/images/bg-01.jpg') no-repeat center / cover;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  position: relative; 
}

.login-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);  /* 半透明黑遮罩 */
  backdrop-filter: blur(2px);
  z-index: 0;
}
/* 让卡片盖在遮罩之上 */
.login-box {
  position: relative;
  z-index: 1;
}

/*********************
  Login Card
*********************/
.login-box {
  background: var(--clr-bg-blur);
  backdrop-filter: blur(12px) saturate(120%);
  padding: 3.2rem 3rem;
  border-radius: var(--radius);
  width: min(380px, 100%);
  text-align: center;
  border: 1px solid rgb(255 255 255 / 0.6);
  box-shadow: 0 12px 35px rgb(0 0 0 / 0.35);
  transition: transform var(--motion-normal), box-shadow var(--motion-normal);
  animation: slideIn .6s cubic-bezier(.25,.8,.25,1) forwards;
}

.login-box:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 45px rgb(0 0 0 / 0.4);
}

.login-box h2 {
  margin-bottom: 1.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--clr-primary);
  letter-spacing: 1.5px;
}

/*********************
  Inputs
*********************/

@media (prefers-color-scheme: dark) {
  :root {
    --clr-primary: #eee;
    --clr-bg-blur: rgba(30, 30, 30, 0.85);
  }
  .login-box {
    box-shadow: 0 12px 35px rgb(0 0 0 / 0.8);
  }
  .forgot { color: #9da; }
}




/* —— 更新后的 .input-group —— */
.input-group{
  --border-color:#bbb;
  display:flex;
  align-items:center;
  gap:.75rem;
  padding-block:.85rem;
  margin-bottom:1.6rem;

  /* 默认：1 px 灰线 */
  border-bottom:1px solid var(--border-color);

  /* 过渡包括宽度和颜色/渐变 */
  transition:
    border-bottom-width .35s ease,
    border-color        var(--motion-fast),
    border-image-source .35s ease;
}

.input-group:focus-within,
.input-group.focused {
  /* 线条加粗 + 渐变边框 */
  border-bottom-width: 2px;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    90deg,
    var(--clr-accent),
    var(--clr-accent-2)
  );
  transition: border-image-source .5s ease, border-bottom-width .35s ease;

  /* 外发光效果 */
  box-shadow: 0 2px 8px rgba(92, 90, 99, 0.6), inset 0 -2px 4px rgba(255, 255, 255, 0.2);

  /* 动态闪烁 */
  animation: glowBorder 1.5s ease-in-out infinite;
}

@keyframes glowBorder {
  0%, 100% {
    border-image-source: linear-gradient(
      90deg,
      var(--clr-accent),
      var(--clr-accent-2)
    );
    box-shadow: 0 2px 8px rgba(92, 90, 99, 0.6),
                inset 0 -2px 4px rgba(255, 255, 255, 0.2);
  }
  50% {
    border-image-source: linear-gradient(
      270deg,
      var(--clr-accent),
      var(--clr-accent-2)
    );
    box-shadow: 0 2px 12px rgba(92, 90, 99, 0.8),
                inset 0 -2px 6px rgba(255, 255, 255, 0.3);
  }
}




/* 图标 + 输入保持原样 */
.input-group i{
  color:var(--clr-muted);
  font-size:1.1rem;
  transition:color var(--motion-fast);
}
.input-group:focus-within i,
.input-group.focused i{
  color:var(--clr-accent);
}

.input-group input{
  flex:1;
  border:0;
  outline:none;
  font-size:1rem;
  background:transparent;
  color:var(--clr-primary);
}
.input-group input::placeholder{color:#aaa;}





/*********************
  Options Row
*********************/
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 1.6rem;
  color: #555;
}

.options input[type="checkbox"] {
  accent-color: var(--clr-accent);
  cursor: pointer;
  transition: transform var(--motion-fast);
}

.options input[type="checkbox"]:hover {
  transform: scale(1.25);
}

.forgot {
  color: var(--clr-link);
  text-decoration: none;
  transition: color var(--motion-fast);
}

.forgot:hover,
.forgot:focus-visible {
  color: var(--clr-accent);
  text-decoration: underline;
}

/*********************
  Button
*********************/
.btn-login {
  width: 100%;
  padding: 0.9rem 0;
  border: none;
  border-radius: calc(var(--radius) + 5px);
  font-weight: 700;
  color: #000000;
  background-image: linear-gradient(90deg, var(--clr-accent) 0%, var(--clr-accent-2) 100%);
  background-size: 200% auto;
  cursor: pointer;
  box-shadow: 0 6px 18px rgb(92 90 99 / 0.5);
  transition: background-position var(--motion-normal), transform var(--motion-fast), box-shadow var(--motion-fast);
}

.btn-login:hover,
.btn-login:focus-visible {
  background-position: right center;
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgb(92 90 99 / 0.6);
}

.btn-login:active {
  transform: translateY(1px);
  box-shadow: 0 4px 10px rgb(92 90 99 / 0.45);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/*********************
  Motion Preference
*********************/
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/*********************
  Small‑screen Tweaks
*********************/
@media (max-width: 380px) {
  .login-box {
    padding: 2.5rem 1.8rem;
  }
}


</style>

<script setup>
import api from '@/utils/api'
import { useAuth } from '@/store/auth'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 输入字段（v-model 绑定用）
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const remember = ref(false)
const processing = ref(false)

const router = useRouter()
const auth = useAuth()

const handleRegister = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const { data } = await api.post('/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    ElMessage.success('注册成功，正在跳转...')
    router.push('/login')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

