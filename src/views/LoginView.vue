<script lang=ts>
import LoginComponent from '@/components/LoginComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LoginView',
    components: {
        LoginComponent
    }
})

</script>

<template>

    <div>
        <LoginComponent />
    </div>
</template>


<style scoped>

</style>