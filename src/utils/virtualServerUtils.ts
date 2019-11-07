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
    this.restfullList = restfullList;
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
    await this.restfullList.forEach((restful: ApiInfo,index:number) => {
      try {
        this.getApi(restful);
        this.postApi(restful);
        this.deleteApi(restful,index);
      } catch (err) {
        app.get(restful.api, (req: any, res: any) => {
          res.send(err);
        }); 
      }
    });
  }

  private getApi(restful:ApiInfo){
    console.log(restful.api)
    app.get(restful.api, (req: any, res: any) => {
      console.log('req params:', req.body);
      const result = restful.status === 'success' ? restful.index : restful.error;
      res.send(result);
    });
  } 
  
  private postApi(restful:ApiInfo){
    app.post(restful.api, (req: any, res: any) => {
      const result = restful.status === 'success' ? restful.index : restful.error;
      console.log('req params :', req.body);
      
      res.send(result);
    });  
  }
  
  private deleteApi(restful:ApiInfo,cnt:number){
    app.delete(restful.api, (req: any, res: any) => {
      console.log('req :', req);
      const result = restful.status === 'success' ? this.deleted(req,restful,cnt): restful.error;
      res.send(result);
    });  
  }

  private putApi(restful:ApiInfo){
    app.put(restful.api, (req: any, res: any) => {
      const result = restful.status === 'success' ? restful.index : restful.error;
      res.send(result);
    });  
  }

  private getObjectKey(query:object){
    return Object.keys(query).map(function(key){
       return key;   
    });
  }

  private deepCopy(value:any){
    return JSON.parse(JSON.stringify(value));
  }

  private post(req:any, restful:ApiInfo, cnt:number){
    const result = this.getObjectKey(req.query).reduce((pre:any,key)=>{
      const deleteObject = pre.filter((value:any) =>{
        return value[key] === req.query[key]? false:true
      })
    return deleteObject;
  },this.deepCopy(restful.index));   
  }

  private put(req:any, restful:ApiInfo, cnt:number){
    console.log('req :', req);
  } 

  private deleted(req:any, restful:ApiInfo, cnt:number){
    const result = this.getObjectKey(req.query).reduce((pre:any,key)=>{
                      const deleteObject = pre.filter((value:any) =>{
                        return value[key] === req.query[key]? false:true
                      })
                    return deleteObject;
                  },this.deepCopy(restful.index));
    this.restfullList[cnt].index = result;
    return result;
  }
}
