// The below are the node packages which are used in this server.
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var request=require("request");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//To connect using a driver via the standard MongoDB URI
var url = 'mongodb://htata31:tata1994@ds135993.mlab.com:35993/htata';

//In the below "get method" the input is lat and long.
//Parsing the data from the mlab(database) maintaing 2 different arrays for names address.
//The miles are calculated in this "getDistanceFromLatLonInMiles" method.
//Adding the name, address and miles into the tot_array.
//returning the data to the client
app.get('/getData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log(searchKeywords);
    var lat_array =[], long_array = [], miles_array = [], names_array = [], address_array = [], tot_array=[], threshold=5 , i=0, j=0;

    var values=searchKeywords.split(',');
    var lat=values[0];
    var long=values[1];


    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("htata");
        dbo.collection("rxsavings").find().toArray(function(err, result) {
            if (err) throw err;

            //Maintaining the lat and long list in an array
            while(i< result.length)
            {
                // console.log("entered first loop");
                lat_array.push(result[i]["latitude"]);
                long_array.push(result[i]["longitude"]);
                names_array.push(result[i]["names"]);
                address_array.push(result[i]["address"]);
                i++;
            }

            let inner_array;
            while (j < result.length) {
                var miles = getDistanceFromLatLonInMiles(lat_array[j], long_array[j], lat, long);
                //console.log("miles "+miles);
                if (miles < threshold) {
                    inner_array = [];
                    inner_array.push(result[j]["name"]);
                    inner_array.push(result[j]["address"]);
                    inner_array.push(miles);
                    tot_array.push(inner_array);
                }
                j++;
            }
            console.log(tot_array);
            res.send(tot_array);
            db.close();
        });
    });
});

// Haversine formula
function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    var miles = (d/1.609).toFixed(3);
    return miles;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

app.get('/', function(req, res) {
    res.render('/html/homepage.html');
})

var server = app.listen(8081,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});