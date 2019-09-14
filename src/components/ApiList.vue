<template lang="pug">
    .api-list-container
        .api-container(v-for="api in apiList")
            | {{ api }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ApiList extends Vue {
@Prop() public apiList!: string[];

}
</script>

<style scoped>
.api-container {
    background-color:cadetblue;
    border-radius: 2px;
    margin: 2px;
    height: 50px;
    justify-content: center;
    vertical-align: middle;
}
.api-list-container{
    margin: 10px;
}
</style>
