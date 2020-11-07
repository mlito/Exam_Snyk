import express from 'express';
import PackageDataHelper from './packageDataHelper.js';
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.get('/packages/:package', async function (req, res) {
  let pkgName = req.params.package;
  let helper = new PackageDataHelper();
 
  try {
    let item = await helper.getPackageDataFromRepository(pkgName);
    await helper.processPackageDependencies(item);  
    res.json(item);
  }
  catch(err) { 
      let respData = {error:'Error',message:err.message};
      res.json(respData);
  }
})

app.get('/packages', function(req,res){
    res.send('Package dependencies');
})

app.get('/', function(req, res) {
  let filePath = path.join(__dirname + '/client/index.html');
  res.sendFile(filePath);
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
})