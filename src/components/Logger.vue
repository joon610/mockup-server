<template lang="pug">
    .log-container
        .log-info
            | GET  /index.js
        .log-request
            | Request : {{request}} 
</template>>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class ComponentName extends Vue {
    request = {
        test :'hello'
    };
}
</script>

<style scoped>
 .log-info {
    background: dimgray;
 }
.log-request {
    background: none;    
 }
</style>
