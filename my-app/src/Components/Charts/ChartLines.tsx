import React, {Component} from 'react';
import dummyData from '../../DummyData/power.json';
import scraperData from '../../DummyData/DummyScraperData.json';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import * as d3 from 'd3';
import {pivotJsonTableData, timeStampStringToDate} from '../../DummyData/dataFormatter';


class ChartLines extends Component {

    data: any = dummyData.powerData;

    fakeScraperData: any = scraperData;

    formattedScrapeData: object[] = pivotJsonTableData(this.fakeScraperData);

    render(){

        return(
            <div>
                <LineChart width={600} height={300} data={this.formattedScrapeData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    {/* <XAxis dataKey="dateTime" tickFormatter={d3.timeParse('%Y-%m-%d %H:%M:%S_Z')}/> */}
                    {/* <XAxis dataKey="date" tickFormatter={d3.timeFormat('%Y-%m-%d')}/> */}
                    <XAxis dataKey="dateTime"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="load" stroke="#8884d8" />
                    <Line type="monotone" dataKey="carbon_free" stroke="#5ad178" />
                    <Line type="monotone" dataKey="fossil" stroke="#fa0a0a" />
                </LineChart>
            </div>

        );
    }

}

export default ChartLines;

