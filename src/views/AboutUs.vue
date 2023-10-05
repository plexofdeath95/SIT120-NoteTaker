<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { type iUser, readUsers, getUser } from '@/firebase/firestore/users';
import NavBar from '@/components/NavBar.vue';
import GoogleMapsInt from '@/components/GoogleMapsInt.vue';
import { getCurrentUser } from '@/firebase/Auth/AuthFunctions';
const showSideNav = ref(window.innerWidth > 768);
const user = ref<iUser>(      {
        username: '',
        email: '',
        userID: ''
      });


onBeforeMount(async () => {
  const users = await getCurrentUser();

  localStorage.setItem('user', JSON.stringify(users));
  if(users) {
    const userData = await getUser(users.userID);
    if(userData) {
      user.value = userData;
    }

  }
});
</script>

<template>
   <NavBar :user="user || undefined" @toggleSideNav="showSideNav = !showSideNav" :hideHam="true" />
    <div class="container">
     
      <h1>About Us</h1>
      <p>This is the About page.</p>
      <GoogleMapsInt/>
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