import express from 'express';
import { ApiInfo } from '@/const/mockType';
import { GET,PUT,DELETE,POST, COLOR_PALLET } from '@/const/mockConst';
import bodyParser from 'body-parser';
import JsonLogic from './jsonLogic';
import  store  from '../../store';
import cors from 'cors';
import { initLogObject, saveLogInfo, addLogHistroy } from './logLogic';
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export default class MockupServer {
    private readonly DYNAMIC_API_ID: string = 'id';

    private server: any;

    private port: string = '';

    private restfullList: ApiInfo[] = [];

    private jsonLogic: JsonLogic = new JsonLogic();

    private self: any;

    public constructor(serverPort: string) {
        this.port = serverPort;
        this.restfullList = store.state.apiInfoList;
        initLogObject(this.self);
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
        store.commit('apiInfoList', []);
        return false;
    }

    private isValidateStart(): boolean {
        if (this.restfullList === undefined || this.server !== undefined) {
            return false;
        }
        return true;
    }

    private generateAPI(): void {
        store.state.apiInfoList.forEach(
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
            
            store.state.apiInfoList[cnt]!.index = result;
            saveLogInfo(restful.api,req.body);
            addLogHistroy(restful.api,POST,req.body);
            res.send(result);
        });
        
        app.post(
            restful.api + '/:' + this.dynamicRoute(restful.dynamicRoute),
            (req: any, res: any) => {
                const result = this.jsonLogic.getJson(restful);
                const data = req.params.hasOwnProperty(this.dynamicRoute(restful.dynamicRoute))
                ? this.jsonLogic.selectData(result, req.params)
                : result;
                // res = this.setHeader(res, restful);
                saveLogInfo(restful.api, req.body);
                addLogHistroy(restful.api,POST,req.body);
                res.send(data);
            },
        );
    }

    private deleteApi(restful: ApiInfo, cnt: number): void {
        app.delete(
            restful.api + '/:' + this.dynamicRoute(restful.dynamicRoute),
            (req: any, res: any) => {
                const result = this.jsonLogic.getJson(restful);
                const data = req.params.hasOwnProperty(this.dynamicRoute(restful.dynamicRoute))
                    ? this.jsonLogic.deleteData(result, req.params)
                    : result;
                this.restfullList[cnt].index = data;
                addLogHistroy(restful.api,DELETE,req.body);
                // res = this.setHeader(res, restful);
                res.sendStatus(200)
            },
        );
    }

    private putApi(restful: ApiInfo, cnt: number): void {
        
        app.put(
            restful.api + '/:' + this.dynamicRoute(restful.dynamicRoute),
            (req: any, res: any) => {

                const result = this.jsonLogic.getJson(restful);
                const data = req.params.hasOwnProperty(this.dynamicRoute(restful.dynamicRoute))
                    ? this.jsonLogic.putData(result, req)
                    : result;
                this.restfullList[cnt].index = data;
                // res = this.setHeader(res, restful);
                addLogHistroy(restful.api,PUT,req.body);
                saveLogInfo(restful.api, req.body);
                res.sendStatus(200);
            },
        );
    }

    private getApi(restful: ApiInfo, cnt: number): void {
        app.get(restful.api, (req: any, res: any) => {
            const result = this.jsonLogic.getJson(
                store.state.apiInfoList[cnt],
            );
            // res = this.setHeader(res, restful);
            saveLogInfo(restful.api, result);
            res.send(result);
            addLogHistroy(restful.api,GET,req.body);
        });

        app.get(
            restful.api + '/:' + this.dynamicRoute(restful.dynamicRoute),
            (req: any, res: any) => {
                const result = this.jsonLogic.getJson(restful);
                const data = req.params.hasOwnProperty(this.dynamicRoute(restful.dynamicRoute))
                    ? this.jsonLogic.selectData(result, req.params)
                    : result;
                saveLogInfo(restful.api, data);
                addLogHistroy(restful.api,GET,req.body);
                res.send(data);
            },
        );
    }

    // private setHeader(res: any, restful: any) {
    //     res.set(restful.header)
    //     if (restful?.cookies) {
    //         restful?.cookies.forEach((cookie: any, idx: number) => {
    //             const key = Object.keys(cookie)[0];
    //             const name = cookie[key];
    //             res.cookie(key, name, cookie.options);
    //         });
    //     }
    //     return res;
    // }

    private dynamicRoute(dynamicRoute:string) {
        return dynamicRoute? dynamicRoute: this.DYNAMIC_API_ID;
    }

}
