const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

// Use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// Create call API function
const API_KEY = 'pk_2827c0f047644293b00af664f7bf1cf2';
function call_api(finishedAPI, ticker) {
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=' + API_KEY, {json: true}, (err, res, body) => {
    if (err) {return console.log(err);}
    if (res.statusCode === 200) {
        // console.log(body);
        finishedAPI(body);
        };
    });
};

// Set handlebars middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Set handlebar index GET route
app.get('/', function (req, res) {
	res.render('home');
});

// Set handlebar index POST route
app.post('/', function (req, res) {
	call_api(function(doneAPI) {
        res.render('home', {
            stock: doneAPI
        });
    }, req.body.stock_ticker);
});

app.listen(PORT, () => console.log('Server listening on port' + PORT));