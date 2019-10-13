const remote = window.require('electron').remote;
const fs = remote.require('fs');
import { ApiInfo } from '../const/mockServerConst';
export default class FiletreeUtils {

    private dirTask: string[] = [];
    private dirEnd: string[] = [];
    private path!: string;

    constructor(path: string) {
        this.path = path;
        this.setChildDirectroy(this.path);
        this.setRootDirectory(this.path);
    }

    public getRelativePath() {
        const apiList = this.dirEnd.map((value: string) => {
            return value.replace(this.path, '');
        }).map((api: string) => {
            try {
                const rawdata = fs.readFileSync(this.path + api + '/index.json');
              } catch {
                const error = new ApiInfo();
                error.api = 'add index.json';
                error.isFail = true;
                return error;
              }
            const apiInfo = new ApiInfo();
            apiInfo.api = api;
            return apiInfo;
        });
        return apiList;
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
