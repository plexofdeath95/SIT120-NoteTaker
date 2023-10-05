<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import LoginComponent from '@/components/LoginComponent.vue';
import LandingComponent from '@/components/LandingComponent.vue';

export default defineComponent({
  name: 'LoginView',
  components: {
    LoginComponent,
    LandingComponent
  },
  setup() {
    const showLanding = ref(true);

    onMounted(() => {
      setTimeout(() => {
        showLanding.value = false;
      }, 3000); 
    });

    return {
      showLanding
    };
  }
})
</script>

<template>
  <div>
    <transition
      name="fade"
      mode="out-in"
    >
      <LandingComponent v-if="showLanding" key="landing" />
      <LoginComponent v-else key="login" />
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
