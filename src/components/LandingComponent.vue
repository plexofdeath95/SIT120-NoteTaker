<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'LandingComponent',
  setup() {
    const productNameText = ref('')
    const taglineText = ref('')
    const productNameIndex = ref(0)
    const taglineIndex = ref(0)

    const typeText = (text: string, textRef: any, indexRef: any, speed: number) => {
      if (indexRef.value < text.length) {
        textRef.value += text.charAt(indexRef.value)
        indexRef.value += 1
        setTimeout(() => typeText(text, textRef, indexRef, speed + Math.random() * 5), speed)
      }
    }

    onMounted(() => {
      typeText('Welcome to NoteTaker', productNameText, productNameIndex, 35)
      setTimeout(() => {
        typeText(
          'Your notes, Your way.',
          taglineText,
          taglineIndex,
          35
        )
      }, 1000)
    })

    return {
      productNameText,
      taglineText
    }
  }
})
</script>

<template>
  <div class="landing-container">
    <div class="landing-content">
      <div class="logo">
        <img src="../assets/logo.png" alt="Logo" class="imageLogo"/>
        
      </div>
      <h1 v-html="productNameText"></h1>
      <p v-html="taglineText"></p>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.landing-content {
  padding: 20px;
  border-radius: 5px;
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

p {
  margin-top: 10px;
  color: #555;
}

.logo {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
    justify-content: center;
}

#productName:after,
#tagline:after {
  content: '|';
  animation: blink 1s infinite;
}


.imageLogo {
  width: 75px;
  height: 75px;
  margin-bottom: 20px;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
