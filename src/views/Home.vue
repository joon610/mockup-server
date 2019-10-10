<template>
  <MockServer/>
</template>

<script lang="ts">
import Vue from 'vue';
import MockServer from '../components/MockServer.vue';

export default Vue.extend({
  components: {
    MockServer,
  },
});
</script>
