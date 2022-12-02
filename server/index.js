// Imports
var keyUtils = require('./Utils/keyUtils.js');
var Burnup = require('./Utils/burnup.js');
var Tools = require('./Utils/tools.js');
var Cycletime = require ('./Utils/cycletime.js');
var Velocity = require ('./Utils/velocity.js');
var Aging = require ('./Utils/agingcharts.js');


// Required libraries and assets
const express = require("express");
// const fs = require('fs');
// const jsonwebtoken = require('jsonwebtoken'); // $ npm install jsonwebtoken
const request = require('request');
const cors = require('cors');
const axios = require('axios');


// Other global variables
const PORT = process.env.PORT || 3001;
const app = express();
const client_id = "e931c1d4-434e-11ed-980d-df355d201f91";


// App modification statements
app.use(cors({
    origin:'*'
}));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


// API endpoints
app.get("/data", async (req, res) => {

  var access_jwt = await keyUtils.data.get_access_JWT();

  var result = {};

  var headers = {
      'Authorization': 'Bearer ' + access_jwt,
      'X-Client-ID': client_id,
      'Accept': 'application/json'
  };
  
  var options = {
      url: 'https://zube.io/api/cards?per_page=100',
      // url: 'https://zube.io/api/cards?where%5Bproject_id%5D=29609',
      headers: headers
  };
  
  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          data = JSON.parse(body);
          // console.log(data);
          // res.json(data);
          result.agingcharts = Aging.functions.get_aging_charts_response(data);
          result.cycletime = Cycletime.functions.get_cycle_time_response(data);
          result.velocity = Velocity.functions.get_velocity_response(data);
          result.burnupburndown = Burnup.functions.get_burnup_burndown_response(data);
          result.testingData = Tools.other_functions.send_test_data();
          res.json(result);
      }
  }
  request(options, callback);

});

app.get("/proj_data", async (req, res) => { 

  var access_jwt = await keyUtils.data.get_access_JWT();
  var headers = {
      'Authorization': 'Bearer ' + access_jwt,
      'X-Client-ID': client_id,
      'Accept': 'application/json'
  };
  var options = {
      url: 'https://zube.io/api/projects',
      // url: 'https://zube.io/api/cards?where%5Bproject_id%5D=29609',
      headers: headers
  };
  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          data = JSON.parse(body);
          // console.log(data);
          // res.json(data);
          res.json(Tools.other_functions.get_proj_array(data));
      }
  }
  request(options, callback);
});

app.get("/user-velocity", async (req, res) => { 

    /* Outline 
    1. Get a list of cards
    2. Send the JSON object to a data manipulation function that will do the rest
    3. Return the result in the res.json
    */

    var access_jwt = await keyUtils.data.get_access_JWT();

    var headers = {
        'Authorization': 'Bearer ' + access_jwt,
        'X-Client-ID': client_id,
        'Accept': 'application/json'
    };
    
    var options = {
        url: 'https://zube.io/api/cards?per_page=100',
        // url: 'https://zube.io/api/cards?where%5Bproject_id%5D=29609',
        headers: headers
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(body);
            // res.json(data);
            console.log('zube call complete');
            res.json(data);
            // res.json(Aging.functions.get_aging_charts_response(data));
        }
    }
    
    console.log('zube call started');
    request(options, callback);
    
});

app.get("/testAPI", async (req, res) => { 

  var access_jwt = await keyUtils.data.get_access_JWT();
  var headers = {
      'Authorization': 'Bearer ' + access_jwt,
      'X-Client-ID': client_id,
      'Accept': 'application/json'
  };
  var options = {
      url: 'https://zube.io/api/projects',
      // url: 'https://zube.io/api/cards?where%5Bproject_id%5D=29609',
      headers: headers
  };
  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          data = JSON.parse(body);
          // console.log(data);
          console.log('zube call complete');
          // res.json(data);
          res.json(data);
      }
  }
  console.log('zube call started');
  request(options, callback);
});

app.get("/cycle-time", (req, res) => { 

    res.json();

});
