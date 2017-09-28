var express = require('express');
var soap = require('soap');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var app = express();
app.use(bodyParser.xml({
    limit:'1MB',
    xmlParseOptions:{
        normalize:true,
        normalizeTags:true,
        explicitArray:false
    }
}));
app.get('/',function(req,res){
    res.sendFile(__dirname + "/" + "/client.html");
})
app.post('/getAge',bodyParser.urlencoded({extended:false}),function(req,res){
    console.log(req.body);
    var input = req.body;
    console.log(input.biodata.weight);
    console.log(input.biodata.height);
    /* 
    -beginning of soap body
    -url is defined to point to server.js so that soap cient can consume soap server's remote service
    -args supplied to remote service method
    */
    var url = "http://localhost:3030/bmicalculator?wsdl";
    var args = {weight:input.biodata.weight,height:input.biodata.height};
    soap.createClient(url,function(err,client){
        if(err)
            console.error(err);
        else {
            client.calculateBMI(args,function(err,response){
                if(err)
                    console.error(err);
                else{
                    console.log(response);
                    res.send(response);
                }
            })
        }
    });
})


/** soap YES Bank api's for getStatus start */

  app.post('/getStatus',bodyParser.urlencoded({extended:false}),function(req,res){
    console.log('calling YES')
    console.log(req.body);
    var input = req.body;
    console.log(input.biodata.weight);
    console.log(input.biodata.height);
    /* 
    -beginning of soap body
    -url is defined to point to server.js so that soap cient can consume soap server's remote service
    -args supplied to remote service method
    */
    var url = "https://uatsky.yesbank.in:444/app/uat/ssl/fundsTransferByCustomerSevice2?wsdl";
    var args = {weight:input.biodata.weight,height:input.biodata.height};
    soap.createClient(url,function(err,client){
        if(err){
            console.log('error first')
            console.error(err);
        }
        else {

            client.getStatus(args,function(err,response){
                if(err)
                    console.error(err);
                else{
                    console.log(response);
                    res.send(response);
                }
            })
        }
    });
})


 /** soap YES Bank api's for getStatus end */

var server = app.listen(3036,function(){
    var host = "127.0.0.1";
    var port = server.address().port;
    console.log("server running at http://%s:%s\n",host,port);
})


