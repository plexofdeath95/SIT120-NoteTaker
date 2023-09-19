<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import readUsers, { type iUser } from '@/firebase/firestore/users';
import NavBar from '@/components/NavBar.vue';
const showSideNav = ref(window.innerWidth > 768);
const user = ref<iUser>();

onBeforeMount(async () => {
  const users = await readUsers.readUsers();
  localStorage.setItem('user', JSON.stringify(users[0]));
  if (users.length > 0) {
    user.value = users[0];
  } else {
    const tempUser: iUser = {
      username: '',
      email: '',
      userID: ''
    };
    user.value = tempUser;
  }
});
</script>

<template>
   <NavBar :user="user || undefined" @toggleSideNav="showSideNav = !showSideNav" :hideHam="true" />
    <div class="container">
     
      <h1>About Us</h1>
      <p>This is the About page.</p>
    </div>
</template>
  
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>