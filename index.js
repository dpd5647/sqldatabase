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

// connection.connect();  // Needed for First Method
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

// First Method

// app.post('/items', function(request, res, next){
//     console.log(request.body)
//     var order = request.body;
//     var query = "UPDATE `items` SET `itemquantity`= items.itemquantity - " + '("'+order.itemquantity+'")';
//     query += "WHERE `itemid` = " + '("'+order.itemid+'")';
//     connection.query(query, function(error, response, fields){
//         if (error) throw error;
//             res.send(response);
//         })
// })

function orderForm(message){
    return `<!DOCTYPE html>
    <html>
    <head>
    <title>Order Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    </head>
    
    <body>
        <form action="/order/create" method="POST">
    
            <div class="form-group">
                <label for="studentid">Student ID</label>
                <input type="sid" class="form-control" id="studentid" name="studentid" aria-describedby="sidHelp" placeholder="Enter your student ID.">
                <small id="sidHelp" class="form-text text-muted">Make sure your student ID is correct.</small>
              </div>
            
            <div class="form-group">
              <label for="itemid">Item ID</label>
              <input type="sid" class="form-control" id="itemid" name="itemid" aria-describedby="iiHelp" placeholder="Enter the item ID.">
              <small id="sidHelp" class="form-text text-muted">Make sure the item ID is valid.</small>
            </div>

            <div class="form-group">
              <label for="itemquantity">Item Quantity</label>
              <input type="text" class="form-control" id="itemquantity" name="itemquantity" aria-describedby="iqHelp" placeholder="Enter the quantity of items.">
              <small id="itemquantityHelp" class="form-text text-muted">This is the quantity of items to order.</small>
            </div>
            
            <button type="submit" class="btn btn-primary">Submit Entry</button>
        </form>
        <div class="form-group">
             ${message? 'Thank you for your order' : ''}
    </body>
    </html>`
}

app.get('/order', function(request, res, next){
    res.send(orderForm(request.query.success));
})

app.post('/order/create', function(req, res, next){
    var qty = req.body.itemquantity;
    var itemCode = req.body.itemid;
    var SID = req.body.studentid;
    connection.connect(function(error, response){
        if (error) throw error;
        var query = `UPDATE items SET itemquantity = ( itemquantity - ` +qty+`) WHERE itemid = ` + itemCode;
        var orderQuery =  `INSERT INTO orders(studentid, itemname, itemquantity) VALUES (`+SID+`, `+itemCode+`, `+qty+`)`;
        connection.query(query, function(error, response, fields){
            if (error) throw error;
            if(response.changedRows == 1){
                connection.query(orderQuery, function(error, response, fields){
                    if (error) throw error;
                    console.log(response);
                })
                connection.end();
                res.redirect('/order?success=true');
            }
        });
    });
})

app.listen(port, function(){
    console.log('http://localhost:3000');
});


// Ctrl+C ends the process