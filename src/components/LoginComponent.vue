<template>
  <div class="login-container">
    <div class="logo-text">
      <!-- Placeholder for logo. Replace with your logo's <img> tag -->
      <div class="logo">
        [LOGO]
      </div>
      <p>Welcome to NoteTaker, the app that helps you organize your thoughts</p>
    </div>
    <h2>Login</h2>
    <div v-if="error" class="message error">
      {{ error }}
    </div>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
    <p>
      Don't have an account? <router-link to="/register">Register instead!</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { loginUser } from '@/firebase/Auth/AuthFunctions';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
 name: 'LoginComponent',
 setup()
 {
    const email = ref('')
    const password = ref('')
    const error = ref<string|null> (null)
    const router = useRouter()
    const handleLogin = async () => {
      const res = await loginUser(email.value, password.value)
      if (res.error) {
        console.log(res.error)
        error.value = res.error
      } else {
        localStorage.setItem('user', JSON.stringify(res.user))
        router.push('/home')
      } 
    }

    return {
        email,
        password,
        error,
        handleLogin
    }
 }
})
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.logo-text {
  margin-bottom: 20px;
}

.logo {
  font-size: 2em;
  font-weight: bold;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 20px auto;
  min-width: 300px;
}

input {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 15px;
  background-color: #007BFF;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.message.error {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
  max-width: 300px;
  text-align: center;
}
</style>
