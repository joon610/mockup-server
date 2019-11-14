<template lang="pug">
  v-container
    v-layout(text-center='', wrap='')
      v-row.row-height(no-gutters)
        .input-row
          v-text-field(v-model="rootPath" :solo="true" :flat="true" readonly)
        .select-root-container
          v-btn(color="#A5D6A7" :disabled="serverStatus" @click="initPath()") Select Root
      v-row(no-gutters)
        v-mock-restful(v-model="serverStatus"  :rootPath="rootPath" :port="portNum" :isServerOn="isServerOn" style="width:100%" ) 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FileTreeUtils from '@/utils/filetreeUtils';
import { STANDARD_PORT } from '@/const/mockConst';
import MakeRestful from '@/components/MakeRestful.vue';

@Component({
    components: {
        vMockRestful: MakeRestful,
    },
})
export default class MockServer extends Vue {
    private rootPath = '';
    private portNum = STANDARD_PORT;
    private serverStatus = false;
    private isServerOn = false;
    private hasRestfullList = true;

    private async initPath(): Promise<void> {
        const electron = require('electron').remote;
        const dialog = electron.dialog;
        const path = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });
        if (path.filePaths!.length === 0) {
            return;
        }
        this.rootPath = path.filePaths![0];
        this.makeFileTree();
    }

    private makeFileTree(): void {
        const filetree = new FileTreeUtils();
        filetree.getInstance().build(this.rootPath);
        this.$store.state.apiInfoList = filetree
            .getInstance()
            .getApiInfoList()!;
    }
}
</script>

<style lang="css" scoped>
.select-root-container {
    display: flex;
}

.rootPath {
    margin: 10px;
    border-radius: 3px;
    padding: 20px;
    background-color: #424242;
}
button {
    margin-left: 5px;
    width: 165px;
    height: 48px !important;
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
}

.row-height {
    height: 48px;
    margin-bottom: 5px;
}
</style>
