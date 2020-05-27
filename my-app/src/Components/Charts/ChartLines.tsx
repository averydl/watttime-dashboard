import React, {Component} from 'react';
import dummyData from '../../DummyData/power.json';
import scraperData from '../../DummyData/DummyScraperData.json';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import * as d3 from 'd3';
import {pivotJsonTableData, timeStampStringToDate} from '../../DummyData/dataFormatter';
import axios from '../../Containers/HttpRequestController/axiosEmissionsRequester';

interface IState {
    axiosData?: any;
  }

class ChartLines extends Component {

    state = {
        axiosData: undefined,
        dataLoaded: false
    }

    scraperData: any;

    componentDidMount(){
        axios.get('/PJM?start=2020-04-01-01&end=2020-04-02-23')
            .then(response => {
                this.setState(
                    {
                        axiosData: pivotJsonTableData(response.data),
                        dataLoaded: true
                    });
                this.scraperData = response.data;
            })
            .catch(error => {
                console.log('ERROR:\n' + error);
            });
    }

    render(){

        return(
            <div>
                <LineChart width={600} height={300} data={this.state.axiosData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis dataKey="cleanDate"/>
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

