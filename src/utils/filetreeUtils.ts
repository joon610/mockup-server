const remote = window.require('electron').remote;
const fs = remote.require('fs');
import { ApiInfo } from '@/const/mockType';
import { INDEX_DIR, ERROR_DIR} from '@/const/mockConst';

export default class FiletreeUtils {
    private static instance: FiletreeUtils;
    private checkEndDirectory: string[] = [];
    private dirEndPoint: string[] = [];
    private rootPath!: string;

    public getInstance() {
        if (FiletreeUtils.instance === undefined) {
            FiletreeUtils.instance = new FiletreeUtils();
        }
        return FiletreeUtils.instance;
    }

    public setRootPath(path: string) {
        this.dirEndPoint = [];
        this.rootPath = path;
        this.generateDirList(this.rootPath);
    }

    public getRelativePath() {
        const apiList = this.dirEndPoint.map((value: string) => {
            const api = value.replace(this.rootPath, '');
            const apiInfo = new ApiInfo();
            const indexPath = this.rootPath + api + INDEX_DIR;
            const errorPath = this.rootPath + api + ERROR_DIR;
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
        if (fs.existsSync(path + INDEX_DIR)) {
            this.dirEndPoint.unshift('/');
        }
        return this.dirEndPoint;
    }

    private generateDirList(paths: string = ''): any {
        if (!fs.lstatSync(paths).isDirectory()) {
            if (this.isEmptyLength(this.checkEndDirectory)) {
                return;
            }
            return this.generateDirList(this.checkEndDirectory.pop());
        }
        this.checkEndDirectory = this.checkEndDirectory.concat(this.getAllDirectorys(paths));
        if (this.isEmptyLength(this.checkEndDirectory)) {
            return this.generateDone(this.rootPath);
        }
        return this.generateDirList(this.checkEndDirectory.pop());
    }

    private isEmptyLength(target: any[]) {
        return target.length === 0 ?  true : false;
    }

    private addEndPointDir(path: string) {
        if (fs.existsSync(path + INDEX_DIR)) {
            this.dirEndPoint.unshift(path);
        } else {
            this.dirEndPoint.push(path);
        }
    }

    private getAllDirectorys(path: string): string {
        const childDirectory = fs.readdirSync(path).filter((value: string) => {
            const selectDir = value.indexOf('.') === -1;
            return selectDir;
        }).map((lastDirName: string) => {
            const dirPath = path + '/' + lastDirName;
            return dirPath;
        });
        if (this.isEmptyLength(childDirectory)) {
            this.addEndPointDir(path);
        }
        return childDirectory;
    }
}
