import React, {Component} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import {BarChart, Bar} from 'recharts';
import './CustomToolTip.css';


const CustomToolTip = (props: any) => {
  const { active } = props;

  if (active && props.fullData) {
    const { payload, label } = props;
    const dataPoint: any = payload[0].payload;

    if(dataPoint 
      && dataPoint.change_fossil != undefined 
      && dataPoint.change_carbon_free != undefined
      && dataPoint.change_renewables != undefined){
      const barData: any = [
        {
          "name": "Percent Change",
          "Fossil": dataPoint.change_fossil,
          "Carbon Free": dataPoint.change_carbon_free,
          "Renewables": dataPoint.change_renewables,
        }];
      return (
        <div className="custom-tooltip">
          <p className="label">{dataPoint.cleanDate}</p>
          <BarChart width={300} height={200} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Fossil" fill='#ff1a1a' />
            <Bar dataKey="Carbon Free" fill='#4db8ff' />
            <Bar dataKey="Renewables" fill='#5cd65c' />
          </BarChart>

        </div>
      );
    } else {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time: ${dataPoint.cleanDate}`}</p>
        </div>
      );
    }

  }
  return null;
}


export default CustomToolTip;