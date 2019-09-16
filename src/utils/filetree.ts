const remote = window.require('electron').remote;
const fs = remote.require('fs');

export default class FileTree {

    private dirTask: string[] = [];
    private dirEnd: string[] = [];

    private path!: string;

    constructor(path: string) {
        this.path = path;
    }

    public build()  {
        return this.getChildDirectory(this.path);
    }

    public getRelativePath() {
        return this.dirEnd.map((value: string) => {
            return value.replace(this.path, '');
        });
    }

    private getChildDirectory(path: string= ''): any {
        if (!fs.lstatSync(path).isDirectory()) {
            if (this.dirTask.length === 0) {
                return;
            }
            return this.getChildDirectory(this.dirTask.pop());
        }
        const childDir = fs.readdirSync(path).filter((value: string) => {
            return value.indexOf('.') === -1;
        }).map((value: string) => {
            return path + '/' + value;
        });

        this.dirTask = this.dirTask.concat(childDir);

        if (childDir.length === 0) {
            this.dirEnd.push(path);
        }
        if (this.dirTask.length === 0) {
            return this.dirEnd;
        }

        return this.getChildDirectory(this.dirTask.pop());
    }
}
