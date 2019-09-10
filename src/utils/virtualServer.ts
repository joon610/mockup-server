const express = require( 'express' );
const app = express();

export default class VirtualServer {

  private port!: number;
  private server!: any;

  public constructor(serverPort: number) {
    this.port = serverPort;
  }

  public start() {
    this.server = app.listen( this.port, () => {
      console.log( `server started at http://localhost:${ this.port }` );
    } );
    this.api();
  }

  public close() {
    this.server.close(() => {
        console.log('Closed out remaining connections');
    });
  }

  public api() {
    app.get( '/', ( req: any, res: any ) => {
      res.send( 'Hello world!' );
  } );

  }
}



