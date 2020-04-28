import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import dummyData from '../Data/dummyData01.json'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";



class MapChart extends Component {
    state = {
        dummyData: dummyData
      }

    geoUrl ="https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

    colorScale = scaleLinear().domain([0, 100000]).range(["#ffedea", "#ff5233"]);

    render() {  return (
        <ComposableMap
        projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 147
        }}
        >
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        {this.state.dummyData.data.length > 0 && (
            <Geographies geography={this.geoUrl}>
            {({ geographies }) =>
                geographies.map(geo => {
                const d = this.state.dummyData.data.find(s => s.ISO3 === geo.properties.ISO_A3);
                return (
                    <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? this.colorScale(d.power) : "#F5F4F6"}
                    />
                );
                })
            }
            </Geographies>
        )}
        </ComposableMap>
    
    );}
};

export default MapChart;