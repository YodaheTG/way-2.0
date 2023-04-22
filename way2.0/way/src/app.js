

import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, useMap, Marker, Popup, GeoJSON, FeatureGroup, Circle } from 'react-leaflet'
import { useState, useEffect,useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Modal, Form, FormControl, Accordion, Table} from 'react-bootstrap'

//import { EditControl } from "react-leaflet-draw"
import axios from 'axios'
import * as XLSX from 'xlsx';
import { Icon } from "leaflet";
import L from "leaflet"
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [suggestions, setSugguestions] = useState([])
  const [order_type, setOrder_type] = useState("")
  const [text, setText] = useState('')
  const [coordinatesData, setCoordinatesData] = useState([])
  const emp_gj2 = { "type": "LineString", "coordinates": [] }
  const emp_gj3 = { "type": "LineString", "coordinates": [] }
  const emp_gj4 = { "type": "Point", "coordinates": [] }
  const emp_gj5 = { "type": "LineString", "coordinates": [] }
  const [test_update, setUpdate]= useState('')

  const [testgj, setGj] = useState(emp_gj3)
  const [testgj2, setGj2] = useState({})
  const [table, setTable] = useState({ post: [] })
  const [testgj3, setGj3] = useState({})
  const [route1, setRoute1] = useState('')
  const [route2, setRoute2] = useState('')
  const [exceldata, setExceldata] = useState({})

  const outerBounds = [
    [50.505, -29.09],
    [52.505, 29.09],
  ]
  const innerBounds = [
    [49.505, -2.09],
    [53.505, 2.09],
  ]
  const [outerBounds2, setOuterBounds2] = useState({});

// JSON used for testing the search bar 

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: '70 Dereja Grocery', label: 'Vanilla' },
    { value: 'A One Bar & Restaurant', label: 'IYVH' },
    { value: '7Up Bar & Restaurant', label: 'IYVH' },
    { value: '06 Shemachoch Medhaniyalm Akababi', label: 'IYVH' },
    { value: '06/26 Yehezb Mezenga Kebeb', label: 'IYVH' },
    { value: 'Abay Shero Bet', label: 'IYVH' }
  ]
  
  //hook to fetch data from our PostgreSQL table, in this case 
  //outlets from our outlets database
  useEffect(() => {
    const query = async () => {
    const outlets = await fetch(`http://localhost:5000/outlets`)
    const outlets_data = await outlets.json();
    setGj(outlets_data)
    }
    query();
  // the state 'test-update is used to upate other states'
    }, [test_update])
     
  //update table rows 
    useEffect(() => {
      const query = async () => {
        const { data } = await axios(`http://localhost:5000/outlets_table`)
        setTable({ post: data }) 
      }
      query();
  
    }, [testgj])  
    //create an route stae to store route Geojson and
    //store an empty Geojson in it (to avoid an exception)
    const emp_gj = { "type": "LineString", "coordinates": [] }
    const [route, setRoute] = useState(emp_gj)  
   // draw route between orders
    const draw_route = (e) => {
      fetch('http://localhost:5000/path').then(
        res => (res.json())
      ).then(res2 => (setRoute(res2)))
    };
    useEffect(() => {
      const query = async () => {
        const route = await fetch(`http://localhost:5000/route`)
        const route_plan = await route.json();
        setRoute(route_plan)
        
      }
      query();
  
    }, [testgj])

   // function to handle chaning of map frames   
   function SetBoundsRectangles() {
    const [bounds, setBounds] = useState(outerBounds)
    const map = useMap()

    const innerHandlers = useMemo(
      () => {

        if (outerBounds2[0] !== null) {
          setBounds(outerBounds3)
          map.fitBounds(outerBounds3)
        }

      },
      [map],
    )
  } 
  //set default bounds for map frame   
  const corner1 = [outerBounds2[1], outerBounds2[0]];
  const corner2 = [outerBounds2[3], outerBounds2[2]];
  const outerBounds3 = [corner1, corner2];
  
  
  //suggestion handler in the search bar 
  const onSuggestionHandler = (text) => {
    setText(text);
    setSugguestions([]);
    setOrder_type(text)
  }
// change handler 
const onChangeHandler = (text) => {
  let matches = []
  if (text.length > 0) {
    matches = options.filter(options => {
      const regex = new RegExp(`${text}`, "gi")
      return options.value.match(regex)
    })
  }
  setSugguestions(matches)
  setText(text)
}


//sumbit final query
  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { order_type };
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      setUpdate(body)
      const result = await fetch(`http://localhost:5000/outlets`)
      const parseResposne = await result.json();
      setGj(parseResposne)

    }

    catch {
      console.log('eror')
    }
  };
  
  // delete table rows  when a 
  const delete_rows = async e => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/rm_outlets", {
      })
      setGj(emp_gj5)
    }
    catch {
      console.log('eror')
    }
  };
 // makes sure the the map frame gets loaded and does not throw an exception 
  const getApiData = async () => {
    const response = await fetch(
      'http://localhost:5000'
    );
    const jsondata = await response.json();
    const { type, coordinates } = jsondata
    //console.log(coordinates)
    // update the state
    //debugger

    setCoordinatesData(coordinates)


    // console.log("Json Data Coordinates: ", jsondata);
  };
  useEffect(() => {
    getApiData();

  }, []);
  

  const _onEdited = (e) => {
    let numEdited = 0;
    e.layers.eachLayer((layer) => {
      numEdited += 1;
    });
    this._onChange();
  };

  const _onCreated = (e) => {
    let type = e.layerType;
    let layer = e.layer;
    if (type === 'marker') {
    } else {
      //console.log('_onCreated: something else created:', type, e);
    }
    this._onChange();
  };

  const _onDeleted = (e) => {
    let numDeleted = 0;
    e.layers.eachLayer((layer) => {
      numDeleted += 1;
    });

    this._onChange();
  };
  const readUploadFile = async (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jjson = XLSX.utils.sheet_to_json(worksheet);
    
        setExceldata(jjson)
        setUpdate(jjson[0])
        setGj(jjson)

      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
    try {
      var hh = exceldata.map(({ name }) => { return [name] })
      const body = hh;
      const response = await fetch("http://localhost:5000/orders_excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

    }

    catch {
      console.log('eror')
    }
   
    for (i = 0; i<=1; i++ ){
      testgj[i].icon_name= i.toString()+".png" 
      
    }
    
  }
  var test_gjj = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            38.72160884,
            9.05001876300003
          ]
        },
        "src": "./0.jpg",
        "properties": {
          "name": "06 Shemachoch Medhaniyalm Akababi",
          "id": 0
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            38.710814596,
            8.99258666800006
          ]
        },
        "src": "./1.jpg",
        "properties": {
          "name": "70 Dereja Grocery",
          "id": 1
        }
      }
    ]
  }
  var test = Object.values(test_gjj)

  const position = test_gjj.features.map(({ properties }) => { return properties })
  const position2 = position.map(({ id }) => { return id })
  const position3 = [[51.505, -0.09], [51.505, -0.09]]
  const positon4 = position2.map((id) => id.toString())
  var i;
  let people = []
  if (testgj.length>0){
    for (i = 0; i<=testgj.length-1; i++ ){
      testgj[i].icon_name= "icons/number"+"_"+i.toString()+".png" 
      people[i] = {position:{lat: testgj[i].y, lng: testgj[i].x},title: testgj[i].name.toString(), "iconName": testgj[i].icon_name.toString() }
    }
  }

  const data = people;
  console.log(data)
  
 var p = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          38.72160884,
          9.05001876300003
        ]
      },
      "properties": {
        "name": "06 Shemachoch Medhaniyalm Akababi",
        "id": 5
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          38.710814596,
          8.99258666800006
        ]
      },
      "properties": {
        "name": "70 Dereja Grocery",
        "id": 35
      }
    }
  ]
}


  return (
    <div className="Container-lg my-1 mx-3 ">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <img src="1.jpg" alt="" width="80" height="70"></img>
  </nav>
  <div className="row">
    <div className="col-2 bg-secondary">
    <Accordion defaultActiveKey="0" flush>
    <Accordion.Item eventKey="0">
      <Accordion.Header>Facilites</Accordion.Header>
      <Accordion.Body>
       hello yoda
      </Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="1">
      <Accordion.Header>products</Accordion.Header>
      <Accordion.Body>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
    </div>

    <div className="col-8">
     

      {coordinatesData.length > 0 ? (
        <MapContainer bounds={outerBounds} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* {planes.map((employee, index) => {
            return (
              <Marker position={employee} icon={myIcon}></Marker>
            );
          })} */}

          
{data.map((item, idx) => {
    const icon = L.icon({
      iconUrl: require(`./${item.iconName}`),
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -25]
    });

    return (
      <Marker key={idx} icon={icon} position={item.position}>
        <Popup>{item.title}</Popup>
      </Marker>
    );
  })}
          <GeoJSON key={Math.random()} data={route} />
 



          {/* {position2 &&
            position2.map((id, src) => (
              <GeoJSON key={id.toString()} data={test_gjj} />
            ))} */}

        



        </MapContainer>
      ) : (
        <>
          <div>Loading...</div>
        </>
      )}

    </div>
  </div>
  <div className="row my-1">
    <div className="col d-flex flex-row-reverse">
      <Button variant="secondary" onClick={handleShow}>
        Add Order
      </Button>
      <Button variant="secondary" onClick={draw_route} >
        Send Route
      </Button>
      <Button variant="secondary" onClick={delete_rows} >
        Delete orders
      </Button>


      <form>
        <label htmlFor="upload">Upload File</label>
        <input
          type="file"
          name="upload"
          id="upload"

          onChange={readUploadFile}

        />
      </form>
    </div>
  </div>
  <Table striped bordered hover size="sm" responsive="md">
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>

      </tr>
      <tr>
        {table.post &&
          table.post.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
            </tr>
          ))}
      </tr>
      <tr>
        {position2 &&
          position2.map((id) => (
            <tr key={id.toString()}>
              <td>{id.toString()}</td>
            </tr>
          ))}
      </tr>

    </tbody>
  </Table>
  <Modal
    show={show}
    onHide={handleClose}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>Search Outlets</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <FormControl placeholder="Search here" onChange={e => onChangeHandler(e.target.value)} value={text} />
      </Form>
      {suggestions && suggestions.map((suggestions, i) =>
        <div key={i} className="suggestion" onClick={() => onSuggestionHandler(suggestions.value)}>
          {suggestions.value}
        </div>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={onSubmitForm}>Save</Button>
    </Modal.Footer>
  </Modal>
</div>
  );
}

export default App;
