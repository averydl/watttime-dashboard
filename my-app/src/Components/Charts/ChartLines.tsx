import React, {Component} from 'react';
import dummyData from '../../DummyData/power.json';
import scraperData from '../../DummyData/DummyScraperData.json';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import * as d3 from 'd3';
import {pivotJsonTableData, timeStampStringToDate, getDateString, subtractDays} from '../../DummyData/dataFormatter';
import axios, {requestEmissions} from '../../Containers/HttpRequestController/axiosEmissionsRequester';
import {connect} from 'react-redux';
import CustomTooltip from './CustomToolTip';
interface IProps {
    props?: any;
    chartRedux?: any;
}

interface IState {
    chartData?: undefined;
    today?: any;
    startDate?: any;
    selectedBA?: any;
    days?: any;
    shouldUpdate?: boolean;
}

class ChartLines extends Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.todayDate = new Date();
        this.today = getDateString(this.todayDate);
        this.state = {
            chartData: undefined,
            today: this.today,
            startDate: getDateString(subtractDays(this.todayDate, this.props.chartRedux.DayRange)),
            selectedBA: this.props.chartRedux.BA,
            days: this.props.chartRedux.DayRange,
            shouldUpdate: true,
        };
    }

    todayDate: Date;
    today: string;

    componentDidMount(){
        console.log("did mount");
        console.log(this.state);
        console.log(this.props.chartRedux);
        axios.get('/' + this.props.chartRedux.BA 
            + '?start=' 
            + this.state.startDate 
            + '&end=' 
            + this.state.today )
            .then(response => {
                this.setState({
                    ...this.state,
                    chartData: pivotJsonTableData(response.data),
                    days: this.props.chartRedux.DayRange,
                    selectedBA: this.props.chartRedux.BA
                });
            })
            .catch(error => {
                console.log('ERROR:\n' + error);
            });
    }

    shouldComponentUpdate(){
        console.log("should update");
        return true;
    }

    componentWillReceiveProps(){
        console.log("will receive props");
    }

    componentDidUpdate(){
        console.log("will update");
        if(this.state.days != this.props.chartRedux.DayRange || this.state.selectedBA != this.props.chartRedux.BA){
            const startDate = getDateString(subtractDays(this.todayDate, parseInt(this.props.chartRedux.DayRange)));
            axios.get('/' + this.props.chartRedux.BA 
            + '?start=' 
            + startDate
            + '&end=' 
            + this.state.today )
            .then(response => {
                this.setState({
                    ...this.state,
                    chartData: pivotJsonTableData(response.data),
                    days: this.props.chartRedux.DayRange,
                    selectedBA: this.props.chartRedux.BA
                });
            })
            .catch(error => {
                console.log('ERROR:\n' + error);
            });
        }
    }

    render(){
        console.log("render");
        return(
            <div>
                <h1>{this.state.selectedBA + " - past " + this.state.days + " days"}</h1>
                <LineChart width={600} height={300} data={this.state.chartData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis dataKey="cleanDate"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip content={<CustomTooltip fullData={this.state.chartData}/>}/>
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

