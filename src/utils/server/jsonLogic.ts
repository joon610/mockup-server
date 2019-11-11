import { ApiInfo } from '@/const/mockType';

export default class JsonLogic {

    public postData(req:any, restful:ApiInfo){
        restful.index.push(req.body);
        return restful.index;
      }
    
    public selectData(data:any,params:any){
      return data.filter((value:any)=>{
        return value['id'] === params.id ? true : false; 
      });
    }
  
    public deleteData(data:any,params:any){
        const result = data.filter((value:any)=>{
        return value['id'] === params.id ? false : true; 
      });
      return result;
    }
  
    public putData(data:any,req:any){
      const result = data.map((value:any)=>{
        const hasData = value['id'] === req.params.id ? true : false; 
        return hasData ? this.objectMixin(value,req.body) : value;
      });
      return result;
    }
  
    public getJson(restful:ApiInfo) {
      return restful.status === 'success' ? restful.index : restful.error;
    }
  
    public deepCopy(value:any){
      return JSON.parse(JSON.stringify(value));
    }
  
    public objectMixin(main:any,target:any){
      const keys = Object.keys(target);
      const object = this.deepCopy(main);
        keys.forEach((key)=>{
          object[key] = target[key];
        });
      return object;
    }
}