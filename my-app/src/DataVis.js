import React, { Component } from 'react';
import ReactDOM from "react-dom";
import dummyData from './Data/dummyData01.json'
import MapChart from './DataVis/MapChart'
import './App.css';


class DataVis extends Component {
    state = {
      dummyData: dummyData
    }
  
    render () {
  
      return (
        <div className="MapDiv">
          <h3>MapChart data vis</h3>
          <MapChart />
        </div>
      );
    }
  }
  
  export default DataVis;
  