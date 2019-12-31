import  store  from '../../store';
import { ApiInfo } from '@/const/mockType';
import fs from 'fs';
import { Moment } from 'moment'
let moment = require('moment');
export const initLogObject = (self:any) =>{
    const data = store.state.apiInfoList;
    const initLog = data.reduce((before:any, current:ApiInfo)=>{
        before[current.api] = {
            api: current?.api,
            description: current?.description,
            requestParams: '',
            update:''
        }
        return before;
    },{});
    store.state.apiRequestLog = initLog;
    const jsonData = JSON.stringify(initLog,null, 2);
    fs.writeFileSync(store.state.rootPath + '/requestLog.json', jsonData);
}

export const writeParams = (api:any, params:any) => {
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
