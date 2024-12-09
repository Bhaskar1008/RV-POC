<script setup>
</script>

<template>
 
    <v-app-bar color="#07458E" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <img src="../../assets/logo/iorta-logo.png" style="width: 38px" />
      </template>
      <v-divider
        inset
        vertical
        color="#ffffff"
        :thickness="2"
        class="border-opacity-100 ms-2"
      ></v-divider>

      <v-app-bar-title>
        <img src="../../assets/logo/iorta-logo.svg" style="width: 155px; margin-top: 3px" />
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

 
</template>

<style scoped>
</style>



