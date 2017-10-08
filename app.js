var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var mongoose = require('mongoose');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

//Connect to Mongoose
mongoose.connect('mongodb://localhost/yourhealth', { useMongoClient: true, promiseLibrary: global.Promise });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongodb');
});

//Models
Patient = require('./model/patient');

app.get('/', function(req, res) {
  res.send('Please use /api/...');
});

//Patient controller

app.get('/api/patient/:channel', function(req, res) {
  Patient.getPatientByChannel(req.params.channel, function(err, patient) {
    if (err)
      throw err;
    
    if (_.isEmpty(patient))
      res.json({ errorCode: 'patient-not-found' });
    else
      res.json(patient);
  });
});

app.post('/api/patient', function(req, res) {
  var patient = req.body;
  Patient.addPatient(patient, function(err, patient) {
    if (err)
      throw err;
    
    res.json(patient);
  });
});

//Watcher controller

app.listen(5000);
console.log('Listening on port 5000...');