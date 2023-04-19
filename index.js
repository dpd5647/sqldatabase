var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');      //maybe delete
var app = express();
var port = 3000;

app.use(express.static('static'));
app.use(bodyParser.urlencoded());  //maybe delete

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'ist210',
    port: 3306
})

connection.connect();
var sql1 = 'SELECT * FROM student';
var sql2 = 'INSERT INTO `student` (`universityid`, `studentid`, `firstname`, `lastname`, `email`) VALUES ("001", "00001", "dylan", "donahue", "dpd5647@psu.edu")';
// Strings in javascript need '' on outside and "" inside the string, or the opposite needs to be true in order to define strings.


app.get('/readrecord', function(req, res){
    connection.query(sql1, function(error, response, fields){
        if(error) throw error;
        console.log(response);
        res.send(response);
    })
});

app.post('/createuser', function(request, res, next){
    console.log(request.body)
    
    var profile = request.body;
    var query = 'INSERT INTO `student`(`studentid`, `firstname`, `lastname`, `email`) VALUES'; 
    query += '("'+profile.studentid+'", '+' "'+profile.firstname+'", '+' "'+profile.lastname+'", '+' "'+profile.email+'")';
    connection.query(query, function(error, response, fields){
    if (error) throw error;
        res.send(response);
    })
})

app.listen(port, function(){
    console.log('http://localhost:3000');
});


// Ctrl+C ends the process
