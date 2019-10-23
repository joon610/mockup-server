const remote = window.require('electron').remote;
const fs = remote.require('fs');
import { ApiInfo } from '@/const/mockType';
export default class FiletreeUtils {
    private static instance: FiletreeUtils;
    private dirQueue: string[] = [];
    private dirEnd: string[] = [];
    private path!: string;

    public getInstance() {
        if (FiletreeUtils.instance === undefined) {
            FiletreeUtils.instance = new FiletreeUtils();
        }
        return FiletreeUtils.instance;
    }

    public setRootPath(path: string) {
        this.dirEnd = [];
        this.path = path;
        this.generateDirList(this.path);
    }

    public getRelativePath() {
        const apiList = this.dirEnd.map((value: string) => {
            return value.replace(this.path, '');
        }).map((api: string) => {
            const apiInfo = new ApiInfo();
            const indexPath = this.path + api + '/index.json';
            const errorPath = this.path + api + '/error.json';
            apiInfo.api = api;
            apiInfo.index =  this.readJson(indexPath);
            apiInfo.error =  this.readJson(errorPath) === undefined ? errorPath : this.readJson(errorPath);
            apiInfo.isFail = apiInfo.index === undefined ? true : false;
            return apiInfo;
        });
        return apiList;
    }

    private readJson(indexPath: string) {
        try {
            const result = JSON.parse(fs.readFileSync(indexPath));
            return result;
          } catch {
            return undefined;
          }
    }

    private generateDone(path: string) {
        if (fs.existsSync(path + '/index.json')) {
            this.dirEnd.unshift('/');
        }
        return this.dirEnd;
    }

    private generateDirList(path: string = ''): any {
        if (!fs.lstatSync(path).isDirectory()) {
            if (this.isEmptyDirQueue()) {
                return;
            }
            return this.generateDirList(this.dirQueue.pop());
        }

        const childDir = this.checkDirectory(path);
        this.dirQueue = this.dirQueue.concat(childDir);

        if (this.isEndPoint(childDir)) {
            this.addEndPointDir(path);
        }

        if (this.isEmptyDirQueue()) {
            return this.generateDone(this.path);
        }
        return this.generateDirList(this.dirQueue.pop());
    }

    private isEndPoint(childDir: string) {
        return childDir.length === 0 ? true : false;
    }

    private isEmptyDirQueue() {
        return this.dirQueue.length === 0 ? true : false;
    }

    private addEndPointDir(path: string) {
        if (fs.existsSync(path + '/index.json')) {
            this.dirEnd.unshift(path);
        } else {
            this.dirEnd.push(path);
        }
    }

    private checkDirectory(path: string): string {
        const directory = fs.readdirSync(path).filter((value: string) => {
            const selectDir = value.indexOf('.') === -1;
            return selectDir;
        }).map((lastDirName: string) => {
            const dirPath = path + '/' + lastDirName;
            return dirPath;
        });
        return directory;
    }

}
