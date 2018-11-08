<template>
  <div class="hello">
    <a href="#" @click.prevent="signout">登出</a>
    <h1>HelloWorld</h1>
    <h2>{{msg}}</h2>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    signout() {
      const api = `${process.env.APIPATH}/logout`;
      this.$http.post(api)
        .then(response => {
          response.data.success ? this.$router.push('/login') : false
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
