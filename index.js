const express = require('express')
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');
const _ = require('lodash');
const PythonShell = require('python-shell');
const d3 = require('d3-dsv');

let app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('port', (process.env.PORT || 7000))
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/public/index.html'));
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})


// POST endpoint for requesting trials
app.post('/trials', function (req, res) {
  console.log("trials post request received");
  console.log(req.body)
  // let subjCode = req.body.subjCode;
  // console.log("subjCode received is " + subjCode);
  let options = req.body.options;
  console.log("options: " + options);

  // Runs genTrial python script with subjCode arg
  PythonShell.defaultOptions = { args: [options.subjCode, options.lang, options.seed, options.frame, options.ori, options.respMapping, options.expName] };
  PythonShell.run('generateTrials_orientation_frame.py', function (err, results) {
    // if (err) throw err;
    let trials = [];


    fs.readFile('trials/'+options.subjCode+'_trials.txt', 'utf8',(err, raw_data) => {
      if (err) throw err;
      
      let data = d3.tsvParse(raw_data);
      console.log(data);
      res.send({success: true, trials: data});
    });
  });
})


// POST endpoint for receiving trial responses
app.post('/data', function (req, res) {
  console.log('data post request received');

  // Parses the trial response data to tab separated txt line
  let response = req.body;
  let dataString = _.map(response, (value) => {
    return value + '';
  }).join('\t')+'\n';

  // Append response string to txt file
  let path = 'data/'+response.subjCode+'_test.txt';
  if (!fs.existsSync(path)) 
    fs.openSync(path, 'a');
  else
    console.log("file exists");
  fs.appendFile(path, dataString, function (err) {
      if (err) {
        res.send({success: false});
        throw err;
      }
      res.send({success: true});
    } )
})
