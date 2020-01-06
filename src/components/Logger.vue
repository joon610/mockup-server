<template lang="pug">
  .log-container
    v-btn.log-title(color="#616161" :disabled="isEmptyRootPath()" @click="openLogFile()")
     v-icon.log-icon fa-list-alt
     | Request Log
    .log-console(ref="logConsole")
      .log-start(ref="logStart")
        template(v-if="isEmptyLog()")
          .empty-container
            v-icon.empty-icon fa-list-alt
            br
            div Empty (GET, POST) Parameta
        template(v-else)
          div.log-info(v-for="log,index in $store.getters.logHistory" )
            .log-api
              v-chip.chip-style(label :color="getChipColor(log.restful)") {{log.restful}}
              | {{log.api}}
            .log-request(v-if="hasObject(log.params)")
              v-chip.chip-style(label :color="getChipColor(log.restful)") REQUEST
              | {{log.params}}
</template>>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {REQUEST_PARAM_JSON,GET,PUT,DELETE,POST} from '@/const/mockConst';
import fs from 'fs';
// Open a local file in the default app
@Component
export default class ComponentName extends Vue {
  private updated() {
    this.$nextTick(() => this.scrollToEnd());;
  }

  private scrollToEnd() {
    (this.$refs.logConsole as HTMLElement).scrollTop = 
    (this.$refs.logStart as HTMLElement).offsetHeight;
  }   

  private getChipColor(restful:string):string {
    switch(restful){
      case GET:
        return 'cyan';
      case PUT:
        return '#FB8C00';
      case POST:
        return 'teal';
      case DELETE:
        return '#BF360C';
      default:
        return '';
    }
  }

  private hasObject( params:string ){
    const keysCnt =  Object.keys(JSON.parse(params)).length;
    return keysCnt === 0 ? false:true;
  }

  private isEmptyLog() {
    if(this.$store.getters.logHistory.length === 0){
      return true;
    }
    return false;
  }

  private openLogFile() {
    const shell = require("electron").shell;
    const result = fs.existsSync(this.$store.getters.rootPath+REQUEST_PARAM_JSON);
    if(result){
      shell.showItemInFolder(this.$store.getters.rootPath+REQUEST_PARAM_JSON);
    }else {
      shell.showItemInFolder(this.$store.getters.rootPath);
    }
   
  }

  private isEmptyRootPath() {
    return this.$store.getters.rootPath === '' ? true : false;
  }

}
</script>

<style scoped>
.log-request {
    background: none;   
    word-break: break-word; 
 }
.log-icon {
  margin-right: 5px;
}
 .log-console {
  width: 300px;
  height: 560px;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(56, 56, 56);
}

.log-container {
  padding: 0px 5px 5px 5px;
  margin: 0px 0px 5px 10px;
}

.log-title {
  margin-bottom: 5px;
  text-transform: none;
  font-size: 20px;
  height: 40px !important;
  margin-bottom: 5px;
}

.log-info {
  background: black;
  margin: 5px 5px 5px 0;
  padding: 5px
}

.chip-style {
  width: 80px;
  margin: 3px;
  justify-content: center;
}

.empty-container {
  text-align: center;
  color:dimgray;
  top: calc(50% - 120px);
  position: relative;
}

.empty-icon {
  color: dimgray;
  font-size: 100px;
  top: calc(50% - 120px);
  position: relative;
}

.log-start {
    /* position: absolute; */
    width: inherit;
    height: inherit;
    -webkit-box-pack: center;
    /* display: table; */
    justify-content: center;
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

::-webkit-scrollbar {
  width: 10px;
}
 
::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;

}


</style>
