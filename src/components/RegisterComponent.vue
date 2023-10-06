<template>
    <div class="register-container">
      <div class="logo-text">
        <div class="logo">
          <img src="../assets/logo.png" alt="Logo" class="imageLogo"/>
          <h1>NoteTaker</h1>
        </div>
        <p>Welcome to NoteTaker, the app that helps you organize your thoughts</p>
      </div>
      <h2 v-if="!success">Register</h2>
  
      <!-- Display error or success messages -->
      <div v-if="error" class="message error">
        {{ error }}
      </div>
      <div v-if="success" class="message success">
        Registration successful! Check your inbox to verify your email and then sign in.
        <RouterLink to="/">Login</RouterLink>
      </div>
  
      <!-- Only display form if registration was not successful -->
      <form v-if="!success" @submit.prevent="handleRegister">
        <input type="text" v-model="username" placeholder="Username">
        <input type="email" v-model="email" placeholder="Email">
        <input type="password" v-model="password" placeholder="Password">
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password">
        
        <!-- Password match validation -->
        <div v-if="!confirmPasswordMatch" class="message error">
          Passwords do not match.
        </div>
        
        <button type="submit" :disabled="!confirmPasswordMatch">Register</button>
      </form>
      <p v-if="!success">
        Already have an account? <router-link to="/">Login instead!</router-link>
      </p>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loader"></div>  <!-- Loading icon -->
    </div>
  </template>
  
  <script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import {registerUser} from '../firebase/Auth/AuthFunctions'
  import { type iUser } from '@/firebase/firestore/users';
  export default defineComponent({
    name: 'RegisterComponent',
    setup()
    {
        const username = ref('')
        const email = ref('')
        const password = ref('')
        const confirmPassword = ref('')
        const error = ref<string|null> (null)
        const success = ref(false)
        const isLoading = ref(false); 
        const confirmPasswordMatch = computed(() => {
            return password.value === confirmPassword.value
        })

        const handleRegister = async () => {
          isLoading.value = true;  // set loading true at the beginning
        const user:iUser = {
            username: username.value,
            email: email.value,
            userID: ''
        }

          const res = await registerUser(email.value, password.value, user)
          isLoading.value = false;  // set loading false at the end
          if(res.error)
          {
            error.value = res.error
          }
          else
          {
            success.value = true
          }
        }

        return {
            username,
            email,
            password,
            confirmPassword,
            confirmPasswordMatch,
            error,
            success,
            isLoading,
            handleRegister
      }
    }
})
  </script>
  
  <style scoped>
  .register-container {
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
    background-color: #28a745;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #1f7a33;
  }

  .message {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
  }

  .message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    display: flex;
    flex-direction: column;
    justify-content: center;

  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 123, 255, 0.5); /* Semi-transparent primary color */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Ensure overlay is on top of other content */
}

.loader {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #28a745; /* Primary color */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
}

.imageLogo {
  width: 100px;
  height: 100px;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
  </style>
  