<template lang="pug">
    .api-list-container
        .server-btn
          v-btn(v-show="isRunningServer === false" color="primary" :disabled="hasApiList" @click="startServer()") start Server
          v-btn(v-show="isRunningServer === true " color="deep-orange" :disabled="hasApiList" @click="closeServer()") close Server
        .api-container(v-for="rest in restfullList" )
            a(@click="openBrowser(rest.api)" :style="apiContainerStyle")
                .http-method(:style="httpMethodStyle")
                    | GET 
                .api-path(:style="apiPathStyle")
                    | {{ rest.api }}
            v-radio-group(row)
              v-radio(label="red" color="red" value="red")
              v-radio(label="blue" color="blue" value="blue")
              
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import VirtualServer from '../utils/virtualServer';
import { ApiInfo } from '../const/mockingBirdConst';
const shell = require('electron').shell;
@Component
export default class MakeRestfull extends Vue {

    private get hasApiList() {
      return this.restfullList.length === 0 ? true : false ;
    }

    @Prop() private restfullList!: ApiInfo[];
    @Prop(String) private port!: string;
    @Prop(String) private rootPath!: string;
    @Prop(Boolean) private isServerOn!: boolean;

    private isRunningServer!: boolean;

    private server!: VirtualServer;

    private httpMethodStyle = {
        color: 'dimgray',
    };

    private apiPathStyle = {
        color: 'dimgray',
    };

    private apiContainerStyle = {
        cursor: 'default',
    };

    private created() {
      this.isRunningServer = this.isServerOn;
    }

  private async startServer() {
    this.server = new VirtualServer(this.port, this.rootPath, this.restfullList);
    this.isRunningServer = await this.server.start();
    this.setButtonStyle(this.isRunningServer );
  }

  private async closeServer() {
    this.isRunningServer = await this.server.close();
    this.setButtonStyle(this.isRunningServer );
  }

  private setButtonStyle(isRunningServer: boolean) {
   if (isRunningServer) {
        this.httpMethodStyle.color = 'darkorange';
        this.apiPathStyle.color = 'white';
        this.apiContainerStyle.cursor = 'pointer';
    } else {
        this.httpMethodStyle.color = 'dimgray';
        this.apiPathStyle.color = 'gray';
        this.apiContainerStyle.cursor = 'default';
    }
  }

  private openBrowser(api: string) {
      console.log('http://localhost:' + this.port + api);
      shell.openExternalSync('http://localhost:' + this.port + api);
  }

}
</script>

<style scoped>
.server-btn {
  margin-bottom: 10px;
  width: 500px;
}

button{
  width: 100%;
}



.api-container {
  background-color: #424242;
  border-radius: 5px;
  margin-bottom: 5px;
  justify-content: center;
  vertical-align: middle;
  height: 50px;
}
.api-container:hover {
  background-color: rgb(90, 90, 90);
  cursor: default;
}

.api-list-container {
  margin: 10px;
  width: 340px;
}
.api-path {
  width: 340px;
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
</style>
