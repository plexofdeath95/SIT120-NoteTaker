<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import type {iUser}from '../firebase/firestore/users'
import { RouterLink } from 'vue-router'
export default defineComponent({
  name: 'NavBar',
  props: {
    user: {
      type: Object as PropType<iUser> || undefined,
      required: false
    },
    hideHam: {
      type: Boolean,
      required: false,
      default: false
    }
  },
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
        <button class="hamburger-button" @click="$emit('toggleSideNav')" v-if="!hideHam">
          <span class="material-icons">menu</span>
        </button>
        <RouterLink to="/"><a href="">Home</a></RouterLink> 
        <RouterLink to="/about"><a href="">About</a></RouterLink> 
      </div>
      <div class="search">
        <input
          type="text"
          placeholder="Search notes..."
          v-model="searchQuery"
          @keydown.enter="performSearch"
        />
      </div>
      <div class="right-actions">
        Hello {{ user?.username }}
      </div>
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

.left-actions
{
  display: flex;
  align-items: center;
}

.search {
  margin: 0 auto;
}

a
{
  color: #fff;
  text-decoration: none;
  margin: 20px;
}

a:hover
{
  color: #fff;
  text-decoration: underline;
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
