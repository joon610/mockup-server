# Mock Server 

![mock-manual](https://github.com/joon610/readMEImg/blob/master/mock-server/mock-manual.gif)

## How to use
<img src="https://joon610.github.io/assets/images/mockupServer/graph.png" alt="graph">

1. created directory.
2. make Json files, index.json(successe case),error.json(error case).
3. Mockup Server start! 

## CRUD (Create, Read, Update ,Delete)
```
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

### Create: post       
```
// http://localhost:9000/nice2/test/
// Body
    {
        "id": "3",
        "name": "joon",
        "age": "19"
    } 
```
- add new Json object 

### Read: Get 
```
http://localhost:9000/nice2/test
```      
- get all Json Data

### Update: Put 
 - update Json object(id == 3)
```
// http://localhost:9000/nice2/test/:id
// http://localhost:9000/nice2/test/3
// Body
    {
        "id": "3",
        "name": "hello",
        "age": "19"
    } 
```    
- update Json object

### Delete: Delete 
```
// http://localhost:9000/nice2/test/:id
// http://localhost:9000/nice2/test/3      
```
- delete Json object(id == 3)  

### DownLoad
- Mac : 
  - <https://github.com/joon610/mockup-server/releases/download/v0.2.0/mock-server-0.2.0.dmg>

- Window :
  - <https://github.com/joon610/mockup-server/releases/download/v0.2.0/mock-server.Setup.0.2.0.exe>

## TodoList 
- [ ] mockup-server icon
- [ ] Dynamic key name

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

