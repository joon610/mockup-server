import express from 'express';
import { ApiInfo } from '@/const/mockType';
import bodyParser from 'body-parser';
import JsonLogic from './jsonLogic';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

export default class MockupServer {
    private readonly DYNAMIC_API_ID: string = 'id';

    private server: any;

    private port: string = '';

    private restfullList: ApiInfo[] = [];

    private jsonLogic: JsonLogic = new JsonLogic();

    private self: any;

    public constructor(vueComponent: any, serverPort: string) {
        this.port = serverPort;
        this.self = vueComponent;
        this.restfullList = this.self.$store.state.apiInfoList;
    }

    public start(): boolean {
        if (!this.isValidateStart) {
            return false;
        }

        this.server = app.listen(this.port, () => {
            console.log(`server started at http://localhost:${this.port}`);
        });

        this.generateAPI();
        return true;
    }

    public close(): boolean {
        if (this.server === undefined) {
            return false;
        }
        this.server.close(() => {
            console.log('Closed out remaining connections');
        });

        delete this.server;
        this.self.$store.commit('apiInfoList', []);
        return false;
    }

    private isValidateStart(): boolean {
        if (this.restfullList === undefined || this.server !== undefined) {
            return false;
        }
        return true;
    }

    private generateAPI(): void {
        this.self.$store.state.apiInfoList.forEach(
            (restful: ApiInfo, cnt: number) => {
                try {
                    this.getApi(restful, cnt);
                    this.postApi(restful, cnt);
                    this.deleteApi(restful, cnt);
                    this.putApi(restful, cnt);
                } catch (err) {
                    app.get(restful.api, (req: any, res: any) => {
                        res.send(err);
                    });
                }
            },
        );
    }

    private postApi(restful: ApiInfo, cnt: number): void {
        app.post(restful.api, (req: any, res: any) => {
            const result =
                restful.status === 'success'
                    ? this.jsonLogic.postData(req, restful)
                    : restful.error;
            this.self.$store.state.apiInfoList[cnt].index = result;
            this.setHeader(res, restful);
            res.send(result);
        });
    }

    private deleteApi(restful: ApiInfo, cnt: number): void {
        app.delete(
            restful.api + '/:' + this.DYNAMIC_API_ID,
            (req: any, res: any) => {
                const result = this.jsonLogic.getJson(restful);
                const data = req.params.hasOwnProperty(this.DYNAMIC_API_ID)
                    ? this.jsonLogic.deleteData(result, req.params)
                    : result;
                this.restfullList[cnt].index = data;
                this.setHeader(res, restful);
                res.send(data);
            },
        );
    }

    private putApi(restful: ApiInfo, cnt: number): void {
        app.put(
            restful.api + '/:' + this.DYNAMIC_API_ID,
            (req: any, res: any) => {
                const result = this.jsonLogic.getJson(restful);
                const data = req.params.hasOwnProperty(this.DYNAMIC_API_ID)
                    ? this.jsonLogic.putData(result, req)
                    : result;
                this.restfullList[cnt].index = data;
                this.setHeader(res, restful);
                res.send(data);
            },
        );
    }

    private getApi(restful: ApiInfo, cnt: number): void {
        app.get(restful.api, (req: any, res: any) => {
            const result = this.jsonLogic.getJson(
                this.self.$store.state.apiInfoList[cnt],
            );

            this.setHeader(res, restful);
            res.send(result);
        });

        app.get(
            restful.api + '/:' + this.DYNAMIC_API_ID,
            (req: any, res: any) => {
                const result = this.jsonLogic.getJson(restful);
                const data = req.params.hasOwnProperty(this.DYNAMIC_API_ID)
                    ? this.jsonLogic.selectData(result, req.params)
                    : result;

                this.setHeader(res, restful);
                res.send(data);
            },
        );
    }

    private setHeader(res: any, restful: any) {
        res.set(restful.header)
        if (restful?.cookies) {
            restful?.cookies.forEach((cookie: any, idx: number) => {
                const key = Object.keys(cookie)[0];
                const name = cookie[key];
                res.cookie(key, name, cookie.options);
            });
        }
        return;
    }
}
