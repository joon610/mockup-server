const express = require( 'express' );
const app = express();
const fs = require('fs');
import { ApiInfo } from '@/const/mockingBirdConst';

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
    console.log(this.server);
    if ( this.server !== undefined) {
      // console.error('server is running');
      return false;
    }
    this.api();
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

  private async api() {
    await this.restfullList.forEach((restfull: ApiInfo) => {
      try {
        const rawdata = {success: '', error: ''};
        const INDEX_JSON = this.rootPath + restfull.api + '/index.json';
        const ERROR_JSON = this.rootPath + restfull.api + '/error.json';
        if (!restfull.isFail) {

          const success = fs.readFileSync(INDEX_JSON);
          rawdata.success = JSON.parse(success);
          if (fs.existsSync(ERROR_JSON)) {
            const error = fs.readFileSync(ERROR_JSON);
            rawdata.error = JSON.parse(error);
          }
        }
        app.get( restfull.api, ( req: any, res: any ) => {
            // @ts-ignore
           res.send( rawdata.success );
       } );
      } catch (err) {
        app.get(restfull.api, (req: any, res: any) => {
          res.send(err);
        });
      }
    });
  }
}



