import express from 'express';
import { ApiInfo, Json} from '@/const/mockType';
const app = express();
const fs = require('fs');

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
    if (this.restfullList === undefined ) {
      console.error('restfullList is Empty');
      return false;
    }
    if ( this.server !== undefined) {
      return false;
    }
    this.generateAPI(this.rootPath);
    console.log(this.port);
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
    console.log(this.server);
    this.server = undefined;
    return false;
  }

  private async generateAPI(rootPath: string) {
    await this.restfullList.forEach((restful: ApiInfo) => {
      try {
        const rawJson: Json = this.getJsonStatus(rootPath, restful.api);
        app.get( restful.api, ( req: any, res: any ) => {
              // @ts-ignore
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

  private getJsonStatus(rootPath: string, api: string): Json {
    const INDEX_JSON = rootPath + api + '/index.json';
    const ERROR_JSON = rootPath + api + '/error.json';
    const success = fs.readFileSync(INDEX_JSON);
    const json = new Json();
    json.index = JSON.parse(success);
    if (fs.existsSync(ERROR_JSON)) {
      const error = fs.readFileSync(ERROR_JSON);
      json.error = JSON.parse(error);
    }
    return json;
  }
}



