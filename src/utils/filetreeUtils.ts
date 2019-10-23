const remote = window.require('electron').remote;
const fs = remote.require('fs');
import { ApiInfo } from '@/const/mockType';
export default class FiletreeUtils {
    private static instance: FiletreeUtils;
    private dirTask: string[] = [];
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
        this.setChildDirectroy(this.path);
        this.setRootDirectory(this.path);
    }

    public getRelativePath() {
        const apiList = this.dirEnd.map((value: string) => {
            return value.replace(this.path, '');
        }).map((api: string) => {
            const apiInfo = new ApiInfo();
            const indexPath = this.path + api + '/index.json';
            const errorPath = this.path + api + '/error.json';
            apiInfo.api = api;
            apiInfo.index =  this.generatorJson(indexPath);
            apiInfo.error =  this.generatorJson(errorPath) === undefined ? errorPath : this.generatorJson(errorPath);
            apiInfo.isFail = apiInfo.index === undefined ? true : false;
            return apiInfo;
        });
        return apiList;
    }

    private generatorJson(indexPath: string) {
        try {
            const result = JSON.parse(fs.readFileSync(indexPath));
            return result;
          } catch {
            return undefined;
          }
    }

    private setRootDirectory(path: string) {
        if (fs.existsSync(path + '/index.json')) {
            this.dirEnd.unshift('/');
        }
    }

    private setChildDirectroy(path: string= ''): any {
        if (!fs.lstatSync(path).isDirectory()) {
            if (this.dirTask.length === 0) {
                return;
            }
            return this.setChildDirectroy(this.dirTask.pop());
        }
        const childDir = fs.readdirSync(path).filter((value: string) => {
            return value.indexOf('.') === -1;
        }).map((value: string) => {
            return path + '/' + value;
        });

        this.dirTask = this.dirTask.concat(childDir);

        if (childDir.length === 0) {
            if (fs.existsSync(path + '/index.json')) {
                this.dirEnd.unshift(path);
            } else {
                this.dirEnd.push(path);
            }
        }
        if (this.dirTask.length === 0) {
            return this.dirEnd;
        }

        return this.setChildDirectroy(this.dirTask.pop());
    }
}
