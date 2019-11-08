import express from 'express';
import { ApiInfo } from '@/const/mockType';
import  bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

export default class VirtualServerUtils {
  private server: any;

  private port!: string;

  private restfullList!: ApiInfo[];

  public constructor(serverPort: string, restfullList: ApiInfo[]) {

    this.port = serverPort;
    this.restfullList = this.deepCopy(restfullList);
  }

  public start(): boolean {
    if (!this.isValidateStart) { return false; }
    this.generateAPI();
    this.server = app.listen(this.port, () => {
      console.log(`server started at http://localhost:${this.port}`);
    });
    return true;
  }

  public close(): boolean {
    if (this.server === undefined) { return false; }
    this.server.close(() => {
      console.log('Closed out remaining connections');
    });
    this.server = undefined;
    return false;
  }

  private isValidateStart(): boolean {
    if (this.restfullList === undefined || this.server !== undefined) {
      return false;
    }
    return true;
  }

  private async generateAPI() {
    await this.restfullList.forEach((restful: ApiInfo,cnt:number) => {
      try {
        this.getApi(restful);
        this.postApi(restful,cnt);
        this.deleteApi(restful,cnt);
        this.putApi(restful,cnt);
      } catch (err) {
        app.get(restful.api, (req: any, res: any) => {
          res.send(err);
        }); 
      }
    });
  }

  private postApi(restful:ApiInfo,cnt:number){
    app.post(restful.api, (req: any, res: any) => {
      const result = restful.status === 'success' ? this.postData(req,restful,cnt): restful.error;
      res.send(result);
    });  
  }
  
  private deleteApi(restful:ApiInfo,cnt:number){
    app.delete(restful.api+'/:id', (req: any, res: any) => {
      const result = this.getJson(restful);
      const data = req.params.hasOwnProperty('id')?this.deleteData(result,req.params,cnt): result;
      res.send(data);
    });
  }

  private putApi(restful:ApiInfo,cnt:number){
    app.put(restful.api+'/:id', (req: any, res: any) => {
      const result = this.getJson(restful);
      const data = req.params.hasOwnProperty('id')?this.putData(result,req,cnt): result;
      res.send(data);
    });  
  }

  private getApi(restful:ApiInfo){
    app.get(restful.api, (req: any, res: any) => {
      const result = this.getJson(restful);
      res.send(result);
    });

    app.get(restful.api+'/:id', (req: any, res: any) => {
      const result = this.getJson(restful);
      const data = req.params.hasOwnProperty('id')?this.selectData(result,req.params): result;
      res.send(data);
    });
  } 

  private postData(req:any, restful:ApiInfo, cnt:number){
    restful.index.push(req.body);
    this.restfullList[cnt] = restful.index;
    return restful.index;
  }

  private selectData(data:any,params:any){
    return data.filter((value:any)=>{
      return value['id'] === params.id ? true : false; 
    });
  }

  private deleteData(data:any,params:any,cnt:number){
     const result = data.filter((value:any)=>{
      return value['id'] === params.id ? false : true; 
    });
    this.restfullList[cnt].index = result; 
    return result;
  }

  private putData(data:any,req:any,cnt:number){
    const result = data.map((value:any)=>{
      const hasData = value['id'] === req.params.id ? true : false; 
      return hasData ? this.objectMixin(value,req.body) : value;
    });
    this.restfullList[cnt].index = result;
    return result;
  }

  private getJson(restful:ApiInfo) {
    return restful.status === 'success' ? restful.index : restful.error;
  }

  private deepCopy(value:any){
    return JSON.parse(JSON.stringify(value));
  }

  private objectMixin(main:any,target:any){
    const keys = Object.keys(target);
    const object = this.deepCopy(main);
      keys.forEach((key)=>{
        object[key] = target[key];
      });
    return object;
  }
}
