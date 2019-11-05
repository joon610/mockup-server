import express from 'express';
import { ApiInfo } from '@/const/mockType';
const app = express();

export default class VirtualServerUtils {
  private server: any;

  private port!: string;
  private restfullList!: ApiInfo[];
  private rootPath!: string;

  public constructor(serverPort: string, rootPath: string , restfullList: ApiInfo[]) {
    this.port = serverPort;
    this.restfullList = restfullList;
    this.rootPath = rootPath;
  }

  public start(): boolean {
    if (!this.isValidateStart) { return false; }
    this.generateAPI(this.rootPath);
    this.server = app.listen( this.port, () => {
      console.log( `server started at http://localhost:${ this.port }` );
    } );
    return true;
  }

  public  close(): boolean {
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

  private async generateAPI(rootPath: string) {
    await this.restfullList.forEach((restful: ApiInfo) => {
      try {
        app.get( restful.api, ( req: any, res: any ) => {
          const result = restful.status === 'success' ?  restful.index : restful.error;
          res.send(result);
          });
      } catch (err) {
        app.get(restful.api, (req: any, res: any) => {
          res.send(err);
        });
      }
    });
  }
}



