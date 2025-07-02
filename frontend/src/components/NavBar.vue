<template>
  <nav class="navbar">

    <!-- 导航菜单 -->
    <div class="navbar-menu">
      <router-link 
        v-for="item in menuItems" 
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.path === item.path }"
      >
        {{ item.name }}
      </router-link>
    </div>

    <!-- 右侧用户区域 -->
    <div class="navbar-user">

      <!-- 用户头像和下拉菜单 -->
      <div class="user-dropdown" @click="toggleDropdown">
        <img 
          :src="userAvatar" 
          :alt="userName"
          class="user-avatar"
        >
        <div v-if="showDropdown" class="dropdown-menu">
          <div class="dropdown-item" @click="goToProfile">
            Your Profile
          </div>
          <div class="dropdown-item" @click="goToSettings">
            Settings  
          </div>
          <div class="dropdown-item register" @click="register">
            Register
          </div>
          <div class="dropdown-item login" @click="signIn">
            Sign in
          </div>
          <div class="dropdown-item logout" @click="signOut">
            Sign out
          </div>
        </div>
      </div>
    </div>

    <!-- 点击外部关闭下拉菜单 -->
    <div v-if="showDropdown" class="dropdown-overlay" @click="closeDropdown"></div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      showDropdown: false,
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format',
      menuItems: [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Register', path: '/register' },
        { name: 'Login', path: '/login' },
        { name: 'Profile', path: '/profile' },
      ]
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    closeDropdown() {
      this.showDropdown = false
    },
    goToProfile() {
      this.$router.push('/profile')
      this.closeDropdown()
    },
    goToSettings() {
      this.$router.push('/settings')
      this.closeDropdown()
    },
    signIn() {
      this.$router.push('/login')
      this.closeDropdown()
    },
    register() {
      this.$router.push('/register')
      this.closeDropdown()
    },
    signOut() {
      // 处理登出逻辑
      console.log('Sign out')
      this.$router.push('/dashboard')
      this.closeDropdown()
      // 可以调用登出API并跳转到登录页面
      // this.$router.push('/login')
    }
  },
  mounted() {
    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showDropdown = false
      }
    })
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #374151;
  padding: 0 24px;
  height: 64px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo-icon {
  margin-right: 12px;
}

.navbar-menu {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 40px;
}

.nav-item {
  color: #D1D5DB;
  text-decoration: none;
  padding: 8px 16px;
  margin: 0 4px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #FFFFFF;
  background: rgba(120, 119, 129, 0.8);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #5f5e63;
  object-fit: cover;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  border-color: #5f5e63;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  padding: 12px 16px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #F3F4F6;
}

.dropdown-item.logout {
  color: #EF4444;
  border-top: 1px solid #E5E7EB;
}

.dropdown-item.logout:hover {
  background: #FEF2F2;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* NavBar.vue – Updated Styling */
.navbar {
  background: linear-gradient(90deg, #141414 0%, #4747482c 100%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
 
}

.nav-item {
  color: #D1D5DB; 
  transition: background-color 0.2s ease, color 0.2s ease;
}
.nav-item:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.15); 
}
.nav-item.active {
  color: #FFFFFF;
  background: linear-gradient(90deg, #49484d 0%, #b6b6bb 100%);
}


/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 16px;
  }
  
  .navbar-menu {
    margin-left: 20px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .navbar-user {
    gap: 12px;
  }
}


</style>