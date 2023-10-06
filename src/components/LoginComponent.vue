<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '@/firebase/Auth/AuthFunctions';

export default defineComponent({
  name: 'LoginComponent',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref<string|null>(null);
    const router = useRouter();
    const isFading = ref(false);
    const isLoading = ref(false);  // new ref for loading state

    const handleLogin = async () => {
      isLoading.value = true;  // set loading true at the beginning
      const res = await loginUser(email.value, password.value);
      isLoading.value = false;  // set loading false at the end
      if (res.error) {
        console.log(res.error);
        error.value = res.error;
      } else if (res.userFirebase?.emailVerified === false) {
        error.value = "Please verify your email before logging in";
      } else {
        localStorage.setItem('user', JSON.stringify(res.user));
        isFading.value = true;
        setTimeout(() => {
          router.push('/home');
        }, 1000); 
      }
    };

    return {
      email,
      password,
      error,
      handleLogin,
      isFading,
      isLoading  // return isLoading ref
    };
  }
})
</script>

<template>
  <transition name="fade">
    <div v-if="!isFading" class="login-container">
      <div class="logo-text">
        <div class="logo">
          <img src="../assets/logo.png" alt="Logo" class="imageLogo"/>
          
        </div>
        <h1>NoteTaker</h1>
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
  </transition>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loader"></div>  <!-- Loading icon -->
  </div>
</template>



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

.imageLogo {
  width: 75px;
  height: 75px;
}
.logo {
  font-size: 2em;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--primary-bg); /* Semi-transparent primary color */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensure overlay is on top of other content */
}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
