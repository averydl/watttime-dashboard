import React, {Component} from 'react';
import dummyData from '../../DummyData/power.json';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';

class ChartLines extends Component {

    data: any = dummyData.powerData;

    render(){
        console.log(dummyData);
        return(
            <div>
                {/* <LineChart width={600} height={300} data={this.data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis dataKey="dateTime"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="load" stroke="#8884d8" />
                    <Line type="monotone" dataKey="hydro" stroke="#5ad178" />
                    <Line type="monotone" dataKey="coal" stroke="#fa0a0a" />
                </LineChart> */}
            </div>

        );
    }

}

export default ChartLines;

