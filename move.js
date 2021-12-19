const fs = require('fs')
const path = require('path')

const rootPath = path.resolve(__dirname,'docs/.vitepress/dist')
myForEach(rootPath);


function myForEach(currentDirPath, prePath = '.') {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        const fileName = path.basename(filePath);
        if (stat.isFile()) {
            console.log(`${prePath}/${fileName}`)
            fs.writeFileSync(path.resolve(prePath,`${fileName}`), fs.readFileSync(filePath));
        } else if (stat.isDirectory()) {
            const dirPath = path.join(__dirname, fileName)
            removeDir(dirPath)
            fs.mkdirSync(dirPath);
            myForEach(filePath, `${prePath}/${fileName}`);

        }
    });
}

function removeDir(dir) {
    try{
        const files = fs.readdirSync(dir)
        for(let i=0;i<files.length;i++){
            const newPath = path.join(dir,files[i]);
            const stat = fs.statSync(newPath)
            if(stat.isDirectory()){
                removeDir(newPath);
            }else {
                fs.unlinkSync(newPath);
            }
        }
        fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
    }catch{
        return
    }
    
  }