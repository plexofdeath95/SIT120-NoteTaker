<script lang=ts>
import RegisterComponent from '@/components/RegisterComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LoginView',
    components: {
        RegisterComponent
    }
})

</script>

<template>

    <div>
        <RegisterComponent />
    </div>
</template>


<style scoped>

</style>