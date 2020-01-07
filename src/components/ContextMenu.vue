<template lang="pug">
    <ul id="right-click-menu" tabindex="-1" >
        <li>Reveal in Floder</li>
        <li>setting</li>
    </ul>
</template>
<script lang="ts">

import {Component, Vue} from 'vue-property-decorator';

@Component
export default class ContextMenu extends Vue {

}
</script>

<style scoped>
#right-click-menu{
    background: rgb(46, 46, 46);
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    /* width: 250px; */
    z-index: 999999;
    border-radius: 5px;
}

#right-click-menu li {
    /* border-bottom: 1px solid #E0E0E0; */
    margin: 0;
    padding: 5px 35px;
}

#right-click-menu li:last-child {
    border-bottom: none;
}

#right-click-menu li:hover {
    background: #1E88E5;
    color: #FAFAFA;
}
</style>
