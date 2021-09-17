var express = require('express');
var app = express();

var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(requestTime);

app.get('/', function (req, res) {
  
  responseText += '\n Requested at: ' + req.requestTime + '';
  console.log('logg a : ' + req.requestTime )
  res.send({status: 'ON', message: 'Salut bg!'});
});

app.listen(3000);
