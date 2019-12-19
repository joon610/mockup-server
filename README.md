# Mock Server 

![mock-manual](https://github.com/joon610/readMEImg/blob/master/mock-server/mock-manual.gif)

## Translate
한국어 : <https://joon610.github.io/sideproject/MockUp-Server> <br> 
日本語 : <https://qiita.com/joon610/items/f5aae93815b536a3f56b>

## Usage
- [`Start`](#Start)
- [`index.json`](#indexJson) 
    - set response Data
- [`setting.json`](#settingJson)
    - set header, cookies 
    - set Api description
    - set dynamic Route key 
- [`Get Post Put Delete`](#crud)   
    - Create, Read, Update, Delete example

## <a id="Start"></a> Start
<img src="https://joon610.github.io/assets/images/mockupServer/graph.png" alt="graph">

1. created directory.
2. make index.json file in each directory
3. If you want to configure more, and then add error.json, setting.json
4. Mockup Server start! 

## <a id="indexJson"></a> index.json
``` jsonc
// response json
[
  {
        "id": "1",      //dynamic api key   ex) localhost/bla/:id
        "name": "Sara",
        "age": "13"
    },
    {
        "id": "2",
        "name": "teddy",
        "age": "14"
    }   
]
```

## <a id="settingJson"></a> setting.json
```jsonc
// setting header, cookies, api description etc 
{
    "header": {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": "123",
        "ETag": "12345"
    },
    "cookies": [
        {  //cookie1
            "cookiekey": "cookieName",
            "options": {
                "maxAge": 30000
            }
        },
        { //cookie2
            "hello": "hi",
            "options": {
                "maxAge": 10000
            }
        }
    ],
    "dynamicRoute":"hello",      //  ex) localhost/bla/:hello
    "description": "this API is holy shit" // api description

}
```
#### Set Cookies
<img src="https://joon610.github.io/assets/images/mockupServer/headerSetting.png" alt="headerSetting">

#### API Description tooltip
<img src="https://joon610.github.io/assets/images/mockupServer/tooltip.png" width="300" height="300" alt="tooltip">


## <a id="crud"></a>CRUD (Create, Read, Update ,Delete)
``` jsonc
// index.json
[
  {
        "id": "1", 
        "name": "Sara",
        "age": "13"
    },
    {
        "id": "2",
        "name": "teddy",
        "age": "14"
    }   
]
```

## Post, Get
- http://localhost:9000/nice2/test   if you send params object, and then add object in response data  (POST)
```jsonc
//response data
[
    {
      "id": "1", 
      "name": "Sara",
      "age": "13"
    },
    {
      "id": "2",
      "name": "teddy",
      "age": "14"
    }   
]
```
- http://localhost:9000/nice2/test/1
```jsonc
//response data
[
    {
      "id": "1",   
      "name": "Sara",
      "age": "13"
    }
]
```
## Put
- http://localhost:9000/nice2/test/1   
```jsonc
//request data
{
  "id": "3", 
  "name": "Sara",
  "age": "13"
}
```
```jsonc
//response data
[
    {
      "id": "3",   
      "name": "Sara",
      "age": "13"
    },
    {
      "id": "2",
      "name": "teddy",
      "age": "14"
    }   
]
```
## Delete
- http://localhost:9000/nice2/test/1
```jsonc
//response data
[
    {
        "id": "2",
        "name": "teddy",
        "age": "14"
    }   
]
```
### DownLoad
- Mac, Windows: 
  - <https://github.com/joon610/mockup-server/releases>


## TodoList 
- [X] allow cross origin option
- [X] add header and cookie  
- [x] Api Description
- [ ] request parameter check
- [ ] dealy response 
- [x] change Dynamic Route name 

## License
MIT License

## Project setupø
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and minifies for production(electront)
```
build:electron
```

