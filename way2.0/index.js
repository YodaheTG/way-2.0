const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator');
var OSRM = require('osrm')
//var osrmDecode = require("osrm-geojson");
var turf = require('@turf/turf');
var format = require('pg-format');
app.listen(3000);

//get request provides route in the form of a geojson file when given
// a pair of ccoordinates 

app.get("/route", async (req, res) => {
    try {
        var coords = [
            {
                "x": 38.733333,
                "y": 9.022222
            },
            {
                "x": 38.711111,
                "y": 8.99999
            },
            {
                "x": 38.69999,
                "y": 9.00000
            },
            {
                "x": 38.798888,
                "y": 9.0000
            },
            {
                "x": 38.72222,
                "y": 9.05555
            },
            {
                "x": 38.79999,
                "y": 9.0000
            }
        ]
        if (coords.length > 1) {
            //map json file to extract coordinates in the form of an array 
            const arr1 = coords.map(({ x, y }) => { return [x, y] })
            console.log(arr1)
            //reverse the coordinates since we want to start routing from the first entery 
            // postgreSQL stores data in reverse when updated 
            const arr2 = arr1.reverse()
            //osrm file was generated using instrucions set in this link: https://github.com/Project-OSRM/osrm-backend/blob/master/docs/nodejs/api.md
            var osrm = new OSRM("ethiopia-latest.osrm");
            osrm.route({ coordinates: arr2, geometries: "geojson" }, function (err, result) {
                if (err) throw err;
                res.json(result.routes[0].geometry)
            });
        }
        //send an empty geojson oif all orders are canceled, or there is nothing to be used 
        //for routing 
        else {
            const emp_gj = {"type":"LineString","coordinates":[]}
            res.send(emp_gj)
          }

    }
    // a json we can use for testing if the get request works.
    catch (error) {
        console.log ("error")
      } 

})
// get request to handle the bounding box 
app.get ("/bbx", async (req,res) => {
    try {
      // send a bouding box using the number of outlets included in the map frame   
      const outlets= await pool.query ("select x, y from outlets inner join odrers on outlets.name = odrers.order_type");
      var y = GeoJSON.parse(outlets.rows, {Point: ['y', 'x']});
      var bbox2 = turf.bbox(y);
      //res.json(y);
      res.send(bbox2)
      
    }
    catch 
    {
      console.log('error name')
    }
  });
  //get request to handle orders database 
  app.get ("/rm_outlets", async (req,res) => {
    try {
       //deletes orders following end user's request  
      const outlets= await pool.query ("DELETE FROM odrers");
      res.json(outlets.rows);
      
    }
    catch 
    {
      console.log('error name')
    }
  });  
// inserts orders coming from an excel file 
  app.post ("/orders_excel", async (req,res) => {
    try {
   
      const insert_data = await pool.query (format('insert into odrers (order_type) values %L returning order_type', order_type));
      res.json(insert_data);
    }
    catch 
    {
      console.log('error')
    }
  });
// add orders to the orders table 
  app.post ("/orders", async (req,res) => {
    try {
      const {order_type} = req.body;
      const orders = await pool.query ("insert into odrers (order_type) values ($1) returning order_type",[order_type]);
      res.json(orders);
    }
    catch 
    {
      console.log('error')
    }
  });