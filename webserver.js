const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const cors = require('cors');
const https = require('https');
const Client = require('azure-kusto-data').Client;
const KustoConnectionStringBuilder = require('azure-kusto-data').KustoConnectionStringBuilder;

const route = require('./router');

const app = express();
//fhltest
app.use(cors());
app.use(function(req, res, next){
    if (req.is('text/*')) {
      req.text = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk){ req.text += chunk });
      req.on('end', next);
    } else {
      next();
    }
  });
app.use(bodyParser.urlencoded({extended: true}));
app.use('/kusto', route);

const connectionString = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
    // kusto connection details here
);

app.locals.kustoClient = new Client(connectionString);

// generate server and cert credentials to host as https backend, as testing environment is https
// allows for api request to be made locally

https
    .createServer({
        key: fs.readFileSync("server.key"), // generate a server key
        cert: fs.readFileSync("cert.pem") // generate a cert
    },
    app
    ) .listen(2304, () => {
    console.log("Kusto server is running at https://express.server:2304");
});

