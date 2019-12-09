import { ApiInfo } from '@/const/mockType';

export default class JsonLogic {
    public postData(req: any, restful: ApiInfo): object {
        const bodyKey = req.body['id'];

        if (this.isArray(restful.index)) {
            const hasKey = restful.index.reduce((hasKey: boolean, key: any) => {
                if (hasKey) return true;
                return String(bodyKey) === String(key.id) ? true : false;
            }, false);
            hasKey ? restful.index : restful.index.push(req.body);
            return restful.index;
        }
        return restful.index;
    }

    public selectData(data: any, params: any): boolean {
        return data.filter((value: any) => {
            return value['id'] === params.id ? true : false;
        });
    }

    public deleteData(data: any, params: any): boolean {
        const result = data.filter((value: any) => {
            return value['id'] === params.id ? false : true;
        });
        return result;
    }

    public putData(data: any, req: any): object {
        const result = data.map((value: any) => {
            const hasData = value['id'] === req.params.id ? true : false;
            return hasData ? this.objectMixin(value, req.body) : value;
        });
        return result;
    }

    public getJson(restful: ApiInfo): object {
        if (!restful) {
            return { status: 'disconnect server' };
        }
        return restful.status === 'success' ? restful.index : restful.error;
    }

    public deepCopy(value: object | []): object {
        return JSON.parse(JSON.stringify(value));
    }

    public objectMixin(main: any, target: any): object {
        const keys = Object.keys(target);
        const object: any = this.deepCopy(main);
        keys.forEach(key => {
            object[key] = target[key];
        });
        return object;
    }

    private isArray(obj: any) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}
