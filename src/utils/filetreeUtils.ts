import { ApiInfo } from '@/const/mockType';
import { INDEX_DIR, ERROR_DIR } from '@/const/mockConst';

const { remote } = window.require('electron');
const fs = remote.require('fs');

export default class FiletreeUtils {
    private static instance: FiletreeUtils;

    private checkEndDirectory: string[] = [];

    private dirEndPoint: string[] = [];

    private rootPath!: string;

    private apiList: ApiInfo[] = [];

    public getInstance() {
      if (FiletreeUtils.instance === undefined) {
        FiletreeUtils.instance = new FiletreeUtils();
      }
      return FiletreeUtils.instance;
    }

    public build(path: string) {
      this.dirEndPoint = [];
      this.rootPath = path;
      this.generateDirList(this.rootPath);
      this.apiList = this.makeApiList();
    }

    public getApiInfoList(): ApiInfo[] | undefined {
      const fileUitls = new FiletreeUtils();
      if (fileUitls.getInstance() === undefined) {
        return undefined;
      }
      return this.apiList;
    }

    private makeApiList() {
      const apiList = this.dirEndPoint.map((value: string) => {
        const api = value.replace(this.rootPath, '');
        const apiInfo = new ApiInfo();
        const indexPath = this.rootPath + api + INDEX_DIR;
        const errorPath = this.rootPath + api + ERROR_DIR;
        apiInfo.api = api;
        apiInfo.index = this.readJson(indexPath);
        apiInfo.error = this.readJson(errorPath) === undefined ? errorPath : this.readJson(errorPath);
        apiInfo.isFail = apiInfo.index === undefined;
        return apiInfo;
      });
      return apiList;
    }

    private readJson(indexPath: string) {
      try {
        const readJson = JSON.parse(fs.readFileSync(indexPath));
        const result = readJson['data'] ? readJson['data'] : readJson; 
        return result;
      } catch {
        return undefined;
      }
    }

    private generateDone(path: string) {
      if (fs.existsSync(path + INDEX_DIR)) {
        this.dirEndPoint.unshift('/');
      }
      return this.dirEndPoint;
    }

    private generateDirList(paths = ''): any {
      if (!fs.lstatSync(paths).isDirectory()) {
        if (this.isEmptyDirectory(this.checkEndDirectory)) {
          return;
        }
        return this.generateDirList(this.checkEndDirectory.pop());
      }
      this.checkEndDirectory = this.checkEndDirectory.concat(this.getAllDirectorys(paths));
      if (this.isEmptyDirectory(this.checkEndDirectory)) {
        return this.generateDone(this.rootPath);
      }
      return this.generateDirList(this.checkEndDirectory.pop());
    }

    private isEmptyDirectory(target: any[]) {
      const isEmpty = target.length === 0;
      return isEmpty;
    }

    private addEndPointDir(path: string) {
      if (fs.existsSync(path + INDEX_DIR)) {
        this.dirEndPoint.unshift(path);
      } else {
        this.dirEndPoint.push(path);
      }
    }

    private getAllDirectorys(path: string) {
      const childDirectory = fs.readdirSync(path).filter((value: string) => {
        const getDirName = value.indexOf('.') === -1;
        return getDirName;
      }).map((lastDirName: string) => {
        const getDirPath = `${path}/${lastDirName}`;
        return getDirPath;
      });
      if (this.isEmptyDirectory(childDirectory)) {
        this.addEndPointDir(path);
      }
      return childDirectory;
    }
}
