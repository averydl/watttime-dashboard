import React, {Component} from 'react';
import dummyData from '../../DummyData/power.json';
import scraperData from '../../DummyData/DummyScraperData.json';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import * as d3 from 'd3';
import {pivotJsonTableData, timeStampStringToDate, getDateString, subtractDays} from '../../DummyData/dataFormatter';
import axios, {requestEmissions} from '../../Containers/HttpRequestController/axiosEmissionsRequester';
import {connect} from 'react-redux';
import CustomTooltip from './CustomToolTip';
import '../../Components/Loader/Loader.css';

interface IProps {
    props?: any;
    chartRedux?: any;
}

interface IState {
    chartData?: undefined;
    today?: any;
    startDate?: any;
    endDate?: any;
    selectedBA?: any;
    days?: any;
    shouldUpdate?: boolean;
    fetchComplete?: boolean;
}

class ChartLines extends Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.chartHeader = <div className="loader">Loading...</div>;
        this.todayDate = new Date();
        this.today = getDateString(this.todayDate);
        this.state = {
            chartData: undefined,
            today: this.today,
            startDate: getDateString(this.props.chartRedux.StartDay),
            endDate: getDateString(this.props.chartRedux.EndDay),
            selectedBA: this.props.chartRedux.BA,
            days: this.props.chartRedux.DayRange,
            shouldUpdate: true,
        };
    }

    todayDate: Date;
    today: string;
    chartHeader: any;

    componentDidMount(){
        this.chartHeader = <div className="loader">Loading...</div>;
        axios.get('/' + this.props.chartRedux.BA 
            + '?start=' 
            + this.state.startDate
            + '&end='
            + this.state.endDate)
            .then(response => {
                this.setState({
                    ...this.state,
                    chartData: pivotJsonTableData(response.data),
                    days: this.props.chartRedux.DayRange,
                    selectedBA: this.props.chartRedux.BA,
                    startDate: getDateString(this.props.chartRedux.StartDay),
                    endDate: getDateString(this.props.chartRedux.EndDay),
                });
                this.chartHeader = <h1>{this.state.selectedBA + ' emissions'}</h1>;
                this.forceUpdate();
            })
            .catch(error => {
                console.log('ERROR:\n' + error);
            });
    }

    componentDidUpdate(){
        this.chartHeader = <div className="loader">Loading...</div>;
        if(this.state.startDate != getDateString(this.props.chartRedux.StartDay) ||
        this.state.endDate != getDateString(this.props.chartRedux.EndDay) ||
        this.state.selectedBA != this.props.chartRedux.BA){
            const startDate = getDateString(this.props.chartRedux.StartDay);
            const endDate = getDateString(this.props.chartRedux.EndDay);
            axios.get('/' + this.props.chartRedux.BA 
            + '?start=' 
            + startDate
            + '&end='
            + endDate)
            .then(response => {
                this.setState({
                    ...this.state,
                    chartData: pivotJsonTableData(response.data),
                    days: this.props.chartRedux.DayRange,
                    selectedBA: this.props.chartRedux.BA,
                    startDate: startDate,
                    endDate: endDate,
                });
                this.chartHeader = <h1>{this.state.selectedBA + ' emissions'}</h1>;
                this.forceUpdate();
            })
            .catch(error => {
                console.log('ERROR:\n' + error);
            });
        }
    }

    render(){
        return(
            <div>
                {this.chartHeader}
                <LineChart width={700} height={400} data={this.state.chartData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}} syncId="lineChartID_01">
                    <XAxis dataKey="shortDate" type='category' allowDuplicatedCategory={true}/>
                    <YAxis tickFormatter={(value: any) => new Intl.NumberFormat('en').format(value)}/>
                    <Tooltip content={<CustomTooltip fullData={this.state.chartData}/>}/>
                    <Legend />
                    <Line type="monotone" dataKey="load" stroke="black" dot={false} name="Load" />
                    <Line type="monotone" dataKey="carbon_free" stroke="#4db8ff" dot={false} name="Carbon Free" />
                    <Line type="monotone" dataKey="fossil" stroke="#fa0a0a" dot={false} name="Fossil" />
                </LineChart> 

                <AreaChart width={700} height={400} data={this.state.chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }} syncId="lineChartID_01">
                    <defs>
                        <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fc3003" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fc3003" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="cleanDate" hide={true}/>
                    <YAxis tickFormatter={(value: any) => new Intl.NumberFormat('en').format(value)}/>
                    <Tooltip formatter={(value: any) => new Intl.NumberFormat('en').format(value)} />
                    <Area type="monotone" dataKey="generation" stroke="#8884d8" fillOpacity={1} fill="url(#colorBlue)" />
                    <Area type="monotone" dataKey="fossil" stroke="#fc3003" fillOpacity={1} fill="url(#colorRed)" />
                    <Area type="monotone" dataKey="renewables" stroke="#82ca9d" fillOpacity={1} fill="url(#colorGreen)" />
                </AreaChart>

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

