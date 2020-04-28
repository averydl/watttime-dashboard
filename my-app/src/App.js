import React, { Component } from 'react';
import './App.css';
import DataCard from './DataCard/DataCard';
import dummyData from './Data/dummyData01.json'

class App extends Component {
  state = {
    dummyData: dummyData
  }

  render () {
    let dataCard = (
      <div >
        {this.state.dummyData.data.map((data, index) => {
          return <DataCard 
          country={data.country} 
          power={data.power}
          date={data.date}
          key={data.id}
          />
        })}
      </div> 
    );


    return (
      <div className="App">
        <h1>Basic React components listing dummy data...</h1>
          {dataCard}
      </div>
    );
  }
}

export default App;
