<template>
  <div class="ui grid">
    <div class="one column row stackable centered">
      <div class="column">
        <div class="ui breadcrumb">
          <div class="active section">Home</div>
        </div>
        <h1 class="ui header">Home</h1>
		<a href="/series">liste séries</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
