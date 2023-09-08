<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const searchQuery = ref('')

    function performSearch() {
      // Perform search logic here
      console.log(`Searching for ${searchQuery.value}`)
    }

    return {
      searchQuery,
      performSearch
    }
  }
})
</script>

<template>
  <header>
    <nav>
      <div class="logo">
        <router-link to="/">NoteSphere</router-link>
      </div>

      <div class="search">
        <input
          type="text"
          placeholder="Search notes..."
          v-model="searchQuery"
          @keydown.enter="performSearch"
        />
      </div>

      <div class="account">
        <router-link to="/profile">Profile</router-link>
        <router-link to="/settings">Settings</router-link>
      </div>
    </nav>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #003366;
  color: #fff;
  height: 60px;
  padding: 0 20px;
}

.logo {
  font-size: 1.5em;
}

.search input {
  padding: 5px;
}

.account {
  display: flex;
  gap: 15px;
}
</style>
