import React, {Component} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import * as d3 from 'd3';
import './CustomToolTip.css';


const CustomToolTip = (props: any) => {
  const { active } = props;

  if (active && props.fullData) {
    const { payload, label } = props;
    const dataPoint: any = props.fullData.find((o: { cleanDate: any; }) => {
      return o.cleanDate === label;
    });

    if(dataPoint.change_fossil && dataPoint.change_carbon_free && dataPoint.change_renewables){
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time: ${label}`}</p>
          <p className="label">{`Fossil Fuel Change: ${dataPoint.change_fossil.toFixed(4)}`}</p>
          <p className="label">{`Carbon Free Change: ${dataPoint.change_carbon_free.toFixed(4)}`}</p>
          <p className="label">{`Renewables Change: ${dataPoint.change_renewables.toFixed(4)}`}</p>
        </div>
      );
    } else {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time: ${label}`}</p>
        </div>
      );
    }

  }
  return null;
}


export default CustomToolTip;