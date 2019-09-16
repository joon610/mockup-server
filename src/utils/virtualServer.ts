const express = require( 'express' );
const app = express();

export default class VirtualServer {
  private static server: any;

  private port!: string;
  private apiList!: string[];

  public constructor(serverPort: string, apiList: string[]) {
    this.port = serverPort;
    this.apiList = apiList;
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
      app.get( api, ( req: any, res: any ) => {
        res.send( api );
    } );
    });
  }
}



