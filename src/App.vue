<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',

};
</script>

<style lang='sass'>
@import './assets/all';

#app
  img
    display: block
    margin: 0 auto
</style>
