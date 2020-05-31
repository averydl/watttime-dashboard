import React, {Component} from 'react';
import dummyData from '../../DummyData/power.json';
import scraperData from '../../DummyData/DummyScraperData.json';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import * as d3 from 'd3';
import {pivotJsonTableData, timeStampStringToDate, getDateString, subtractDays} from '../../DummyData/dataFormatter';
import axios from '../../Containers/HttpRequestController/axiosEmissionsRequester';
import {connect} from 'react-redux';
interface IProps {
    props?: any;
    chartRedux?: any;
}

interface IState {
    chartData?: undefined;
    today?: string;
    startDate?: string;
}

class ChartLines extends Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.todayDate = new Date();
        this.today = getDateString(this.todayDate);
        this.state = {
            chartData: undefined,
            today: this.today,
            startDate: getDateString(subtractDays(this.todayDate, this.props.chartRedux.DayRange))
        };
    }

    // scraperData: any;
    todayDate: Date;
    today: string;

    componentDidMount(){
        axios.get('/' + this.props.chartRedux.BA 
            + '?start=' 
            + this.state.startDate 
            + '&end=' 
            + this.state.today )
            .then(response => {
                this.setState({chartData: pivotJsonTableData(response.data)});
            })
            .catch(error => {
                console.log('ERROR:\n' + error);
            });
    }

    render(){
        return(
            <div>
                <LineChart width={600} height={300} data={this.state.chartData}
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

function mapStateToProps(reduxState: any){
    return {
        chartRedux: reduxState
    }
}

// export default ChartLines;
export default connect(mapStateToProps)(ChartLines)

