<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const searchQuery = ref('')
    const showSideNav = ref(false)

    function performSearch() {
      console.log(`Searching for ${searchQuery.value}`)
    }

    function toggleSideNav() {
      showSideNav.value = !showSideNav.value
    }

    return {
      searchQuery,
      performSearch,
      showSideNav,
      toggleSideNav
    }
  }
})
</script>

<template>
  <header>
    <nav>
      <div class="left-actions">
        <button class="hamburger-button" @click="$emit('toggleSideNav')">
          <span class="material-icons">menu</span>
        </button>
      </div>
      <div class="search">
        <input
          type="text"
          placeholder="Search notes..."
          v-model="searchQuery"
          @keydown.enter="performSearch"
        />
      </div>
      <div class="right-actions"></div>
    </nav>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--primary-bg);
  color: #fff;
  height: 60px;
  padding: 0 20px;
}

.left-actions,
.right-actions {
  width: 50px;
}

.search {
  margin: 0 auto;
}

.search input {
  padding: 5px;
  border-radius: 5px;
  min-width: 300px;
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  border: none;
}

.hamburger-button {
  background: none;
  border: none;
  font-size: 2em;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 768px) {
  .search {
    margin: 0;
  }
  .hamburger-button {
    display: inline;
  }
  .left-actions,
  .right-actions {
    width: auto;
  }
}
</style>
