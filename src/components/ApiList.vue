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
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MockupServer from "@/utils/server/mockupServer";
import { ApiInfo } from "@/const/mockType";

import {
  LOCAL_HOST,
  COLOR_PALLET,
  DEFAULT,
  CURSOR_POINTER
} from "@/const/mockConst";
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
      console.log(LOCAL_HOST + this.port + api);
      shell.openExternalSync(LOCAL_HOST + this.port + api);
    }
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
  background-color: #424242;
  border-radius: 5px;
  margin-bottom: 5px;
  justify-content: center;
  vertical-align: middle;
  height: 50px;
  width: 510px;
  display: flex;
}
.api-container:hover {
  background-color: rgb(90, 90, 90);
  cursor: default;
}

.api-list-container {
  width: 340px;
}
.api-path {
  width: 250px;
  float: left;
  line-height: 50px;
  text-align: left;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.http-method {
  line-height: 50px;
  width: 50px;
  float: left;
}

.radio-style {
  height: 50px;
}

.radio-group {
  margin: 0px;
  padding: 0px;
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
</style>
