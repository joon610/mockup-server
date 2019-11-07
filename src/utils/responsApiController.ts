
import { ApiInfo } from '@/const/mockType';
const { remote } = window.require('electron');
const fs = remote.require('fs');
export default class ResponsApiController {
    private static instance: ResponsApiController;

    private apiInfoList!: any;

    public getInstance() {
      if (ResponsApiController.instance === undefined) {
        ResponsApiController.instance = new ResponsApiController();
      }
      return ResponsApiController.instance;
    }

    public setResponsApi(api?: ApiInfo[]) {
      this.apiInfoList = api!.reduce((pre: any, value: ApiInfo) => {
        const json = value.status === 'success' ? value.index : value.error
        pre[value.api] = json;
        return pre;
      }, {});
      console.log('this.apiInfoList :', this.apiInfoList);
    }

    public getResponsApi() {
      return this.apiInfoList;
    }


}
