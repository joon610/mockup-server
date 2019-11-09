<template lang="pug">
    .api-list-container
        .server-on-container
          .input-row
            .loacalhost-label http://localhost:
            .loacalhost-input
              v-text-field(v-model="vPort" :solo="true" :readonly="isServerOn" :flat="true" style="hegiht:48px")
          .server-btn
            v-btn(v-show="isRunningServer === false" color="primary"  @click="startServer()") start Server
            v-btn(v-show="isRunningServer === true " color="deep-orange" :disabled="hasApiList" @click="closeServer()") close Server
        .api-container(v-for="rest,index in restfullList" :key="index"  :style="apiContainerStyle(rest)" )
            a(@click="openBrowser(rest.api)")
                .http-method(:style="httpMethodStyle(rest)")
                    | API 
                .api-path(:style="apiPathStyle(rest)")
                    | {{ rest.api }}
            v-radio-group.radio-group(v-model="restfullList[index].status" row :disabled="rest.isFail || isRunningServer")
              v-radio.radio-style(label="sucsses" color="green" value="success")
              v-radio.radio-style(label="error" color="red" value="error")
              
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MockupServer from '@/utils/server/mockupServer';
import { ApiInfo } from '@/const/mockType';
import { LOCAL_HOST, COLOR_PALLET, DEFAULT, CURSOR_POINTER } from '@/const/mockConst';
const shell = require('electron').shell;
@Component
export default class MakeRestful extends Vue {

    private get hasApiList() {
      return this.restfullList.length === 0 ? true : false ;
    }

    @Prop() private restfullList!: ApiInfo[];
    @Prop(String) private port!: string;
    @Prop(String) private rootPath!: string;
    @Prop(Boolean) private isServerOn!: boolean;

    private vPort = '';
    private isRunningServer!: boolean;
    private server!: MockupServer;


    private httpMethodStyle(restfull: ApiInfo) {
      const style = {
        color: COLOR_PALLET.DISABLE_API_TEXT_COLOR,
      };
      if (restfull.isFail === true) { return style; }
      if (this.isRunningServer ) {
        style.color = COLOR_PALLET.RESTFUL_TEXT_COLOR;
      }
      return style;
    }

    private apiPathStyle(restfull: ApiInfo) {
      const style = {
        color: COLOR_PALLET.DISABLE_API_TEXT_COLOR,
      };
      if (restfull.isFail === true) { return style; }
      if (this.isRunningServer) {
        style.color = COLOR_PALLET.RUN_API_TEXT_COLOR;
      }
      return style;
    }

    private apiContainerStyle(restfull: ApiInfo) {
      const style = {
        cursor: DEFAULT,
      };
      if (restfull.isFail === true) { return style; }
      if (this.isRunningServer) {
        style.cursor = CURSOR_POINTER;
      }
      return style;
    }

    private created() {
      this.$nextTick(() => {
        this.vPort = this.port;
      });
      this.isRunningServer = this.isServerOn;
    }

  private async startServer() {
    this.server = new MockupServer(this.vPort, this.restfullList);
    this.isRunningServer = await this.server.start();
    this.$emit('input', this.isRunningServer);
    this.$forceUpdate();
  }

  private async closeServer() {
    this.isRunningServer = await this.server.close();
    this.$emit('input', this.isRunningServer);
    this.$forceUpdate();
  }

  private openBrowser(api: string) {
    if (this.isRunningServer) {
      console.log(LOCAL_HOST + this.vPort + api);
      shell.openExternalSync(LOCAL_HOST + this.vPort + api);
    }
  }

}
</script>

<style scoped>
.server-on-container {
  height: 48px;
  margin-bottom: 5px;
  width: 510px;
  display: flex;
}

.server-btn  {
  margin-bottom: 10px;
  float: left;
  width: max-content;
  display: flex;
}

button{
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
  width:510px;
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
  margin-left: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.http-method {
  line-height: 50px;
  width: 50px;
  float: left;
}

.radio-style{
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
