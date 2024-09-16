<script>
import HomePage from './components/HomePage.vue';
export default {
  components: {
    HomePage
  }
}
</script>

<template>
  <div class="content">
    <HomePage />
  </div>
</template>
<style>
/* ATTENTION the style is not scoped !!*/
.content {
  /* For Full Screen */
  height: 100vh;
  width: 100vw;
  background-color: rgb(193, 150, 234);
}
#app {
  /* To Remove White Parts at Both Sides */
  margin: 0;
  padding: 0;
}
</style>