import React from 'react';
import './App.css';
import ChartLines from '../Components/Charts/ChartLines';
import FilterWindow from '../Components/SideBar/FilterWindow';

function App() {
  return (
    <div className="App">
      <div className='flex-row'>
        <div className='menu-column'>
          <FilterWindow></FilterWindow>
        </div>
        <div className='chart-column'>
          <div>
            <ChartLines></ChartLines>
          </div>
          <div>
            <div>Placeholder for CHART 2</div>
          </div>
        </div>
      </div>      
    </div>
  );
}

export default App;
