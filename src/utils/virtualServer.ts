const express = require( 'express' );
const app = express();
const fs = require('fs');
import { ApiInfo } from '@/const/mockingBirdConst';

export default class VirtualServer {
  private static server: any;

  private port!: string;
  private apiList!: string[];
  private rootPath!: string;


  private test!: ApiInfo[];

  public constructor(serverPort: string, rootPath: string , apiList: string[]) {
    this.port = serverPort;
    this.apiList = apiList;
    this.rootPath = rootPath;
  }



  public start(): boolean {
    if (this.apiList === undefined ) {
      console.error('apiList is Empty');
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
    console.log(this.test);
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
    this.apiList.forEach((api) => {
      try {
        const rawdata = fs.readFileSync(this.rootPath + api + '/index.json');
        const json = JSON.parse(rawdata);
        // this.test = this.test.concat({api: json, hasJson: true });
        console.log(json);
        app.get( api, ( req: any, res: any ) => {
          res.send( json );
       } );
      } catch (errr) {
        console.log('no file');
      }
    });
  }
}



