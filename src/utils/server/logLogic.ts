import  store  from '../../store';
import { ApiInfo } from '@/const/mockType';
import { REQUEST_PARAM_JSON } from '@/const/mockConst';
import fs from 'fs';
import { Moment } from 'moment'
let moment = require('moment');
export const initLogObject = (self:any) =>{
    const data = store.state.apiInfoList;
    const path = store.state.rootPath + REQUEST_PARAM_JSON;
    const initLog = data.reduce((before:any, current:ApiInfo)=>{
        before[current.api] = {
            api: current?.api,
            description: current?.description,
            requestParams: '',
            update:''
        }
        return before;
    },{});

    if (fs.existsSync(path)) {
        const logObject = JSON.parse(fs.readFileSync(path,'utf8'));
        store.state.apiRequestLog = logObject;
    } else {
        console.log('no files');
        store.state.apiRequestLog = initLog;
        const jsonData = JSON.stringify(initLog,null, 2);
        fs.writeFileSync(path, jsonData);
    }
}

export const saveLogInfo = (api:any, params:any) => {
    // if(Object.keys(params).length === 0) return;
    moment.locale();
    let now = moment().format('LLL');
    // @ts-ignore
    store.state.apiRequestLog[api].requestParams = params
    // @ts-ignore
    store.state.apiRequestLog[api].update = now
    //@ts-ignore
    const jsonData = JSON.stringify(store.state.apiRequestLog,null, 2);
    fs.writeFileSync(store.state.rootPath + '/requestLog.json', jsonData, 'utf8');
}

export const addLogHistroy  = (api:string, http:any, params:any) => {
    // if(Object.keys(params).length === 0) return;
    const historyInfo = {
        restful: http,
        api,
        params:JSON.stringify(params),
    }
    //@ts-ignore
    store.state.logHistroy.push(historyInfo);
}
