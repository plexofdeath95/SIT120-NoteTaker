<template>
    <GoogleMap api-key="" style="width: 100%; height: 500px" :center="center" :zoom="15">
      <Marker :options="{ position: center }" />
    </GoogleMap>
  </template>
  
  <script lang='ts'>
  import { defineComponent } from "vue";
  import { GoogleMap, Marker } from "vue3-google-map";
  
  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
    setup() {
      const center = { lat: -37.813629, lng: 144.963058 };
  
      return { center };
    },
  });
  </script>