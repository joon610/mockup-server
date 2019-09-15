<template lang="pug">
    .api-list-container
        .api-container(v-for="api in apiList")
            .http-method
                | GET
            .api-path
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
    background-color:#424242;
    border-radius: 5px;
    margin-bottom: 5px;
    justify-content: center;
    vertical-align: middle;
    height: 50px;
}
.api-list-container{
    margin: 10px;
    width: 340px;

}
.api-path{
    width: 290px;
    float: left;
    line-height: 50px;
}
.http-method{
    line-height: 50px;
    width: 50px;
    float: left;
    color:darkorange;
}
</style>
