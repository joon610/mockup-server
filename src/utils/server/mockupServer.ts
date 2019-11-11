import express from 'express';
import { ApiInfo } from '@/const/mockType';
import  bodyParser from 'body-parser';
import JsonLogic from './jsonLogic'
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

export default class MockupServer {
  private server: any;

  private port!: string;

  private restfullList!: ApiInfo[];

  private readonly DYNAMIC_PARAM: string = 'id';

  private jsonLogic!: JsonLogic;

  private self:any;

  public constructor(vueComponent:any, serverPort: string) {
    this.port = serverPort;
    this.jsonLogic = new JsonLogic();
    this.self = vueComponent;
    this.restfullList = this.self.$store.state.apiInfoList;
  }
  
  public start(): boolean {
    if (!this.isValidateStart) { return false; }
    this.server = app.listen(this.port, () => {
      console.log(`server started at http://localhost:${this.port}`);
    });
    this.generateAPI();
    return true;
  }
  
  public close(): boolean {
    if (this.server === undefined) { return false; }
    this.server.close(() => {
      console.log('Closed out remaining connections');
    });
    delete this.server;
    this.restfullList = [];
    return false;
  }

  private isValidateStart(): boolean {
    if (this.restfullList === undefined || this.server !== undefined) {
      return false;
    }
    return true;
  }

  private  generateAPI() {
      this.restfullList.forEach((restful: ApiInfo,cnt:number) => {
      try {
        this.getApi(restful,cnt);
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
      const result = restful.status === 'success' ? this.jsonLogic.postData(req,restful): restful.error;
      this.restfullList[cnt].index = result;
      res.send(result);
    });  
  }
  
  private deleteApi(restful:ApiInfo,cnt:number){
    app.delete(restful.api+'/:'+this.DYNAMIC_PARAM, (req: any, res: any) => {
      const result = this.jsonLogic.getJson(restful);
      const data = req.params.hasOwnProperty(this.DYNAMIC_PARAM)?this.jsonLogic.deleteData(result,req.params): result;
      this.restfullList[cnt].index =data;
      res.send(data);
    });
  }

  private putApi(restful:ApiInfo,cnt:number){
    app.put(restful.api+'/:'+this.DYNAMIC_PARAM, (req: any, res: any) => {
      const result = this.jsonLogic.getJson(restful);
      const data = req.params.hasOwnProperty(this.DYNAMIC_PARAM)?this.jsonLogic.putData(result,req): result;
      this.restfullList[cnt].index =data;
      res.send(data);
    });  
  }

  private getApi(restful:ApiInfo,cnt:number){
    app.get(restful.api, (req: any, res: any) => {
      const result = this.jsonLogic.getJson(restful);
      res.send(result);
    });
    
    app.get(restful.api+'/:'+this.DYNAMIC_PARAM, (req: any, res: any) => {
      const result = this.jsonLogic.getJson(restful);
      const data = req.params.hasOwnProperty(this.DYNAMIC_PARAM)?this.jsonLogic.selectData(result,req.params): result;
      res.send(data);
    });
  } 

 
}
