const express = require( 'express' );
const app = express();
const fs = require('fs');
import { ApiInfo } from '@/const/mockingBirdConst';

export default class VirtualServer {
  private static server: any;

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
    if ( VirtualServer.server !== undefined) {
      console.error('server is running');
      return false;
    }
    console.log(this.port);
    VirtualServer.server = app.listen( this.port, () => {
      console.log( `server started at http://localhost:${ this.port }` );
    } );
    this.api();
    return true;
  }

  public  close(): boolean {
    if (VirtualServer.server === undefined) { return false; }
    console.log();
    VirtualServer.server.close(() => {
        console.log('Closed out remaining connections');
    });
    VirtualServer.server = undefined;
    return false;
  }

  private api() {
    this.restfullList.forEach((restfull: ApiInfo) => {
      try {
        let rawdata = '';
        if (restfull.status === 'success' ) {
           rawdata = fs.readFileSync(this.rootPath + restfull.api + '/index.json');
          } else {
            rawdata = fs.readFileSync(this.rootPath + restfull.api + '/error.json');
        }
        const json = JSON.parse(rawdata);
        app.get( restfull.api, ( req: any, res: any ) => {
          res.send( json );
       } );
      } catch (errr) {
        console.log('no file');
      }
    });
  }
}



