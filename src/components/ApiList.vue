<template lang="pug">
    .api-list-container
        .api-container(v-for="rest,index in $store.getters.apiInfoList" :key="index"  :style="apiContainerStyle(rest, isServerOn)" )
            a(@click="openBrowser(rest.api)")
                .http-method(:style="httpMethodStyle(rest,isServerOn)")
                    | API 
                .api-path(:style="apiPathStyle(rest,isServerOn)")
                    | {{ rest.api }}
            v-radio-group.radio-group(v-model="$store.getters.apiInfoList[index].status" row :disabled="rest.isFail || isServerOn")
              v-radio.radio-style(label="sucsses" color="green" value="success")
              v-radio.radio-style(label="error" color="red" value="error")   
            v-icon.setting-style(@click="openDirectory(rest.api)") far fa-folder-open
            span.tooltiptext(v-if="rest.description !== undefined ") {{ rest.description }}
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import MockupServer from "@/utils/server/mockupServer";
import {ApiInfo} from "@/const/mockType";
import {
  LOCAL_HOST,
  COLOR_PALLET,
  DEFAULT,
  CURSOR_POINTER
} from "@/const/mockConst";
import * as fsMock from '@/utils/fsMock';
const shell = require("electron").shell;
@Component
export default class ApiList extends Vue {
  private get hasApiList(): boolean {
    return this.$store.getters.apiInfoList.length === 0 ? true : false;
  }

  @Prop(String) private port!: string;
  @Prop(Boolean) private isServerOn!: boolean;

  private vPort = "";
  private isRunningServer!: boolean;
  private server!: MockupServer | undefined;

  private httpMethodStyle(restfull: ApiInfo, isServerOn: boolean): object {
    const style = {
      color: COLOR_PALLET.DISABLE_API_TEXT_COLOR
    };
    if (restfull.isFail === true) {
      return style;
    }
    if (isServerOn) {
      style.color = COLOR_PALLET.RESTFUL_TEXT_COLOR;
    }
    return style;
  }

  private apiPathStyle(restfull: ApiInfo, isServerOn: boolean): object {
    const style = {
      color: COLOR_PALLET.DISABLE_API_TEXT_COLOR
    };
    if (restfull.isFail === true) {
      return style;
    }
    if (isServerOn) {
      style.color = COLOR_PALLET.RUN_API_TEXT_COLOR;
    }
    return style;
  }

  private apiContainerStyle(restfull: ApiInfo, isServerOn: boolean): object {
    const style = {
      cursor: DEFAULT
    };
    if (restfull.isFail === true) {
      return style;
    }
    if (isServerOn) {
      style.cursor = CURSOR_POINTER;
    }
    return style;
  }

  private openBrowser(api: string): void {
    if (this.isServerOn) {
      shell.openExternalSync(LOCAL_HOST + this.port + api);
    }
  }

  private openDirectory(path:string){
    fsMock.openDirectory(path);
  }
}
</script>

<style scoped>
button {
  width: 165px;
  margin-left: 5px;
  height: 48px !important;
}

.api-container {
  position: relative;
  display: inline-block;

  background-color: #424242;
  padding-bottom: 5px;
  justify-content: center;
  vertical-align: middle;
  height: 50px;
  border-bottom: 3px solid #303030;
  display: flex;
}
.api-container:hover {
  background-color: rgb(90, 90, 90);
  cursor: default;
}

.api-container:hover .tooltiptext {
  visibility: visible;
}

.api-container span:after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 100%;
  margin-left: -8px;
  width: 0;
  height: 0;
  border-bottom: 8px solid #000000;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
}

.api-container .tooltiptext {
  visibility: hidden;
  height: fit-content;
  background-color: black;
  color: white;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  top: 45px;
  opacity: 0.9;
  text-align: left;
  padding: 10px;
}
.api-path {
  width: 200px;
  float: left;
  line-height: 50px;
  text-align: left;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-container .radio-group .v-input__control .v-input__slot{
  margin-bottom: 0 !important;
}


.http-method {
  line-height: 50px;
  width: 50px;
  float: left;
}

.radio-style {
  height: 50px;
  margin-right: 10px;
  padding: 0;
}

.radio-group {
  margin: 0px;
  padding: 0px;
  display: contents;
}
.v-input__slot {
  margin: 0px !important;
  padding: 0px !important;
}
.loacalhost-label {
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  width: 40px;
  text-align: right;
  margin-right: 0px;
  float: left;
}

.loacalhost-input {
  float: right;
  width: 200px;
}

.input-row {
  width: 340px;
  float: left;
}

.setting-style{
  width: 50px;
  height: 50px;
  color: white;
  cursor: pointer;
}
.setting-style:hover{
  color: orange;
}
</style>
