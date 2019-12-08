import { ApiInfo } from '@/const/mockType';
import { INDEX_DIR, ERROR_DIR, HEADER_DIR } from '@/const/mockConst';

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
        const apiList = this.dirPathList.map((value: string) => {
            const api = value.replace(this.rootPath, '');
            const apiInfo = new ApiInfo();
            const indexPath = this.rootPath + api + INDEX_DIR;
            const errorPath = this.rootPath + api + ERROR_DIR;
            const headerPath = this.rootPath + api + HEADER_DIR;
            const headerInfo = this.readJson(headerPath);
            const indexInfo = this.readJson(indexPath)
            const errorInfo = this.readJson(errorPath);
            console.log('headerPath :', headerPath);
            console.log('headerInfo :', headerInfo?.header);
            console.log('headerInfo :', headerInfo?.cookies);
            apiInfo.api = api;
            apiInfo.index = indexInfo;
            apiInfo.error = errorInfo
            apiInfo.isFail = apiInfo.index === undefined;
            apiInfo.header = headerInfo?.header;
            apiInfo.cookies = headerInfo?.cookies;

            return apiInfo;
        });
        console.log('apiList :', apiList);
        return apiList;
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
        if (fs.existsSync(path + INDEX_DIR)) {
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
