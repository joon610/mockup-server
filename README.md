
<p align="center">
    <img src="https://joon610.github.io/assets/images/mockupServer/mockup-logo.png" alt="logo" width="128px" height="128px">
</p>

# MockUp Server [![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg)]() [![GitHub release](https://img.shields.io/badge/release-v1.0.3-blue)](https://https://github.com/joon610/mockup-server/releases)

<p align="center">
<img src="https://joon610.github.io/assets/images/mockupServer/main.gif" width="435px" height="345px" alt="mainGif">
</p>


## Why make it
 Used when developing Front-end and Back-ends at the same time. Since Front-End developers have to develop without a server,  there is a possibility of future problems (async, variable names, object types, API, etc.). You can reduce the problems   later by developing 

## How to use it
 1. Make Directory. (become API path)
 2. make Json File  in Directory ( response Data)
 3. select Root Directory
 4. Start Server .. finish.
 5. Share to Github for Front-End and Back-End developers  
 6. Manage using GitHub

## Initialize directory.
<img src="https://joon610.github.io/assets/images/mockupServer/directory-setting.png" alt="directory">

## Click Events
- Radio Button
    1. sucesses: response index.json
    2. error: response error.json
- buttons
    1. Select Root : choice root Directory
    2. Refresh : re rendering screen
    3. Folder icon : open current Directory
    4. RequestLog : move recod request Parame Json file
    5. Clear : logHistory clear
    6. API bar : click API bar and then get index.json or error.json

## Setting Files
- <b>index.json</b> 
    1. <b> this file is necessariness</b> 
    2. make in api Directory 
    2. Json
        ``` jsonc
        // index.json
        {
            {
                "id": "1", 
                "name": "Sara",
                "age": "13"
            }   
        }
        ```

- <b>setting.json</b>  
    1. <b> !this file will be change this json files </b>
    2. make json in Api Directory
    3. Json
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
- <b>requestLog.json</b>
    1. in root Directory.
    2. record request Parameta.
- <b>init.json</b>
    1. in root Direcotory.
    2. saved init port number;

## CRUD
- [`Get Post Put Delete`](#crud)   
    - Create, Read, Update, Delete example


### <a id="indexJson"></a> index.json
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

## <a id="crud"></a>CRUD (Create, Read, Update ,Delete)

## Post, Get
- http://localhost:9000/nice2/test  
    - if you want to send params object, and then add object in response data  (POST)
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

