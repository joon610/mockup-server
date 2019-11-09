import express from 'express';
import { ApiInfo } from '@/const/mockType';
import  bodyParser from 'body-parser';
import JsonLogic from './jsonLogic'
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

export default class MockupServer extends JsonLogic{
  private server: any;

  private port!: string;

  private restfullList!: ApiInfo[];

  private readonly DYNAMIC_PARAM: string = 'id';

  public constructor(serverPort: string, restfullList: ApiInfo[]) {
    super();
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
      const result = restful.status === 'success' ? this.postData(req,restful): restful.error;
      this.restfullList[cnt].index = result;
      res.send(result);
    });  
  }
  
  private deleteApi(restful:ApiInfo,cnt:number){
    app.delete(restful.api+'/:'+this.DYNAMIC_PARAM, (req: any, res: any) => {
      const result = this.getJson(restful);
      const data = req.params.hasOwnProperty(this.DYNAMIC_PARAM)?this.deleteData(result,req.params): result;
      this.restfullList[cnt].index =data;
      res.send(data);
    });
  }

  private putApi(restful:ApiInfo,cnt:number){
    app.put(restful.api+'/:'+this.DYNAMIC_PARAM, (req: any, res: any) => {
      const result = this.getJson(restful);
      const data = req.params.hasOwnProperty(this.DYNAMIC_PARAM)?this.putData(result,req): result;
      this.restfullList[cnt].index =data;
      res.send(data);
    });  
  }

  private getApi(restful:ApiInfo){
    app.get(restful.api, (req: any, res: any) => {
      const result = this.getJson(restful);
      res.send(result);
    });

    app.get(restful.api+'/:'+this.DYNAMIC_PARAM, (req: any, res: any) => {
      const result = this.getJson(restful);
      const data = req.params.hasOwnProperty(this.DYNAMIC_PARAM)?this.selectData(result,req.params): result;
      res.send(data);
    });
  } 

 
}
