<template lang="pug">
  v-container
    v-layout(text-center='', wrap='')
      v-flex(xs12='')
      
        v-btn(color="primary") open Root Path
      v-flex(mb-4='')
        h1.display-2.font-weight-bold.mb-3
          | Welcome to Vuetify
        p.subheading.font-weight-regular
          | For help and collaboration with other Vuetify developers,
          br
          | please join our online
          a(href='https://community.vuetifyjs.com', target='_blank') Discord Community
      v-flex(mb-5='', xs12='')
        h2.headline.font-weight-bold.mb-3 What&apos;s next?
        v-layout(justify-center='')
          a.subheading.mx-3(v-for='(next, i) in whatsNext', :key='i', :href='next.href', target='_blank')
            | {{ next.text }}
      v-flex(xs12='', mb-5='')
        h2.headline.font-weight-bold.mb-3 Important Links
        v-layout(justify-center='')
          a.subheading.mx-3(v-for='(link, i) in importantLinks', :key='i', :href='link.href', target='_blank')
            | {{ link.text }}
      v-flex(xs12='', mb-5='')
        h2.headline.font-weight-bold.mb-3 Ecosystem
        v-layout(justify-center='')
          a.subheading.mx-3(v-for='(eco, i) in ecosystem', :key='i', :href='eco.href', target='_blank')
            | {{ eco.text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { dialog } from 'electron';
@Component
export default class HelloWorld extends Vue {

// private getPath() {
//   const pathArray = dialog.showOpenDialog({properties: ['openDirectory']});
// }
}
</script>

<style scoped>

</style>

