
import fs from 'fs';
import  store  from '../store';

export const openDirectory = (path:string) => {
    const shell = require("electron").shell;
    path = store.state.rootPath+path
    const result = fs.existsSync(path);
    shell.showItemInFolder(path);
  }