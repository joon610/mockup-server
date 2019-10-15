# Mock Server 

![mock-manual](https://github.com/joon610/readMEImg/blob/master/mock-server/mock-manual.gif)

## How to use

1. make root directory.
2. make child directory and add json(index.json) files in child directory.
<img src="https://github.com/joon610/readMEImg/blob/master/mock-server/mock-directory.png" width="50%" height="50%">

3. open Mock-Server and select root directory
4. you can get API list!
<img src="https://github.com/joon610/readMEImg/blob/master/mock-server/mock-server.png" width="30%" height="30%">

 + Directory becomes a API server as follows
    - /Users/jungdong-joon/Downloads/root        ==  http://loacalhost:9000/
    - /Users/jungdong-joon/Downloads/root/nice1  ==  http://loacalhost:9000/nice1
    
5. click Api Address and then get index.json file.
<img src="https://github.com/joon610/readMEImg/blob/master/mock-server/mock-api.png" width="50%" height="50%">

## Download
- mac : 
https://github.com/joon610/mock-server/releases/download/0.1.0/mock-server-0.1.0.dmg
- window :
https://github.com/joon610/mock-server/releases/download/0.1.0/mock-server.Setup.0.1.0.exe

## TodoList 
- [ ] Matching server response Json
- [ ] Mock-server icon
- [ ] Auto Update
- [ ] CRUD
- [ ] wrong text loacalhost -> localhost
- [ ] refactoring component, class name

## License

MIT License

## Project setup
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

