<template lang="pug">
  .log-container
    v-container.log-title
      v-row
        v-col.log-cols-left(cols="8" sm="8")
          v-btn.log-button(color="#616161" :disabled="isEmptyRootPath()" @click="openLogFile()")
            v-icon.log-icon fa-list-alt
            | RequestLog
        v-col.log-cols-right(cols="4" sm="4")
          v-btn.log-button(color="#616161" :disabled="isEmptyRootPath()" @click="clearConsole()")
            v-icon.log-icon fa-eraser
            | Clear
    .log-console(ref="logConsole")
      .log-start(ref="logStart")
        template(v-if="isEmptyLog()")
          .empty-container
            v-icon.empty-icon fa-list-alt
            br
            div Empty logHistory
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
import {REQUEST_PARAM_JSON,GET,PUT,DELETE,POST, 
LOG_GET_COLOR,LOG_PUT_COLOR,LOG_POST_COLOR,LOG_DELETE_COLOR} from '@/const/mockConst';
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

  private clearConsole() {
    console.log('this.$store.state.logHistory :', this.$store.state.logHistory);
    this.$store.state.logHistory = [];
    this.$forceUpdate();
  }

  private getChipColor(restful:string):string {
    switch(restful){
      case GET:
        return LOG_GET_COLOR;
      case PUT:
        return LOG_PUT_COLOR;
      case POST:
        return LOG_POST_COLOR;
      case DELETE:
        return LOG_DELETE_COLOR;
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
  height: 550px;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(56, 56, 56);
}
.log-cols-left {
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 10px;
  /* display: contents; */
}
.log-cols-right {
  padding-top: 0;
  padding-bottom: 0;
  padding-left:0
  /* display: contents; */
}

.log-container {
  padding: 0px 5px 5px 5px;
  margin: 0px 0px 5px 10px;
}

.log-button {
  height: 50px !important;
  width: 100%;
  font-size: 1.0rem;
  text-transform:none;
}

.log-title {
  margin-bottom: 5px;
  text-transform: none;
  font-size: 20px;
  padding: 0;
  height: 50px;
  margin-bottom: 5px;
}

 .log-clear{
  width: 20px;
  height: 50px !important;
  margin: 0, 0, 0, 10px;
  padding: 0;
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
  top: 180px;
  position: relative;
}

.empty-icon {
  color: dimgray;
  font-size: 100px;
  top: calc(50% - 120px);
  position: relative;
}

.log-start {
    width: inherit;
    height: inherit;
    -webkit-box-pack: center;
    display: table;
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
