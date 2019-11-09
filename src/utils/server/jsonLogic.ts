import { ApiInfo } from '@/const/mockType';

export default class JsonLogic {

    protected postData(req:any, restful:ApiInfo){
        restful.index.push(req.body);
        return restful.index;
      }
    
    protected selectData(data:any,params:any){
      return data.filter((value:any)=>{
        return value['id'] === params.id ? true : false; 
      });
    }
  
    protected deleteData(data:any,params:any){
        const result = data.filter((value:any)=>{
        return value['id'] === params.id ? false : true; 
      });
      return result;
    }
  
    protected putData(data:any,req:any){
      const result = data.map((value:any)=>{
        const hasData = value['id'] === req.params.id ? true : false; 
        return hasData ? this.objectMixin(value,req.body) : value;
      });
      return result;
    }
  
    protected getJson(restful:ApiInfo) {
      return restful.status === 'success' ? restful.index : restful.error;
    }
  
    protected deepCopy(value:any){
      return JSON.parse(JSON.stringify(value));
    }
  
    protected objectMixin(main:any,target:any){
      const keys = Object.keys(target);
      const object = this.deepCopy(main);
        keys.forEach((key)=>{
          object[key] = target[key];
        });
      return object;
    }
}