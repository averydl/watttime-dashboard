import React, {Component} from 'react';
import dummyData from '../../DummyData/power.json';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';



class ChartBar extends Component {
  data: any = dummyData.powerData;

  render(){
    console.log(dummyData);
    return(
      <div>
        <BarChart width={600} height={300} data={this.data}
                  margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="%change in fossil generation" fill="#f24f0f" />
          <Bar dataKey="%change in carbon free generation" fill="#3985a3" />
          <Bar dataKey="%change in variable renewable generation" fill="#246936" />
        </BarChart>
      </div>
  );
  }
}

export default ChartBar;
