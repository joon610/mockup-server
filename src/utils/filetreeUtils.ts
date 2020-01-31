import { ApiInfo } from '@/const/mockType';
import { INDEX_JSON, ERROR_JSON, SETTING_JSON } from '@/const/mockConst';
import MockupServer from '@/utils/server/mockupServer';
import  store  from '../store';
const { remote } = window.require('electron');
const fs = remote.require('fs');

interface headObject {
    header:Object;
    cookies: Array<any>
}

export default class FiletreeUtils {
    private static instance: FiletreeUtils;

    private checkEndDirectory: string[] = [];

    private dirPathList: string[] = [];

    private rootPath!: string;

    private apiList: ApiInfo[] = [];

    private apiHashMap: any = {};

    public getInstance(): FiletreeUtils {
        if (FiletreeUtils.instance === undefined) {
            FiletreeUtils.instance = new FiletreeUtils();
        }
        return FiletreeUtils.instance;
    }

    public build(path: string): void {
        this.dirPathList = [];
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

    private makeApiList(): ApiInfo[] {
        const apiList = this.dirPathList.map((value: string,cnt:number) => {
            const api = value.replace(this.rootPath, '');
            
            const indexPath = this.rootPath + api + INDEX_JSON;
            this.apiHashMap[indexPath] = cnt;
            console.log(indexPath);
            const errorPath = this.rootPath + api + ERROR_JSON;
            const settingPath = this.rootPath + api + SETTING_JSON;
            const settingInfo = this.readJson(settingPath);
            const indexJson = this.readJson(indexPath)
            const errorJson = this.readJson(errorPath);
            const apiInfo = new ApiInfo();
            apiInfo.api = api;
            apiInfo.index = indexJson;
            apiInfo.error = errorJson
            apiInfo.isFail = apiInfo.index === undefined;
            apiInfo.header = settingInfo?.header;
            apiInfo.cookies = settingInfo?.cookies;
            apiInfo.description = settingInfo?.description;
            apiInfo.dynamicRoute = settingInfo?.dynamicRoute;
            
            this.fileWatch(indexPath);
            return apiInfo;
        });
        return apiList;
    }

    private fileWatch(tragetDir:string){
        let watcherId:any = undefined;
        try{   
            fs.watch(tragetDir, (eventType:any, filename:any) => {
                clearTimeout(watcherId)
                watcherId = setTimeout(() => {
                    store.state.apiInfoList = FiletreeUtils.instance.makeApiList();
                }, 300);
            });
        }catch {
            console.log('empty file');
        }
    }

    private readJson(indexPath: string) {
        try {
            const readJson = JSON.parse(fs.readFileSync(indexPath));
            return readJson;
        } catch {
            return undefined;
        }
    }

    private generateDone(): string[] {
        return this.dirPathList;
    }

    private generateDirList(paths = ''): string[] | void {
        if (!fs.lstatSync(paths).isDirectory()) {
            if (this.isEmptyDirectory(this.checkEndDirectory)) {
                return;
            }
            return this.generateDirList(this.checkEndDirectory.pop());
        }
        this.checkEndDirectory = this.checkEndDirectory.concat(
            this.getAllDirectorys(paths),
        );
        if (this.isEmptyDirectory(this.checkEndDirectory)) {
            return this.generateDone();
        }
        return this.generateDirList(this.checkEndDirectory.pop());
    }

    private isEmptyDirectory(target: unknown[]): boolean {
        const isEmpty = target.length === 0;
        return isEmpty;
    }

    private addEndPointDir(path: string): void {
        if (fs.existsSync(path + INDEX_JSON)) {
            this.dirPathList.unshift(path);
        } else {
            this.dirPathList.push(path);
        }
    }

    private getAllDirectorys(path: string): string[] {
        const childDirectory = fs
            .readdirSync(path)
            .filter((value: string) => {
                const getDirName = value.indexOf('.') === -1;
                return getDirName;
            })
            .map((lastDirName: string) => {
                const getDirPath = `${path}/${lastDirName}`;
                return getDirPath;
            });
        if (this.isEmptyDirectory(childDirectory)) {
            this.addEndPointDir(path);
        }
        return childDirectory;
    }
}
