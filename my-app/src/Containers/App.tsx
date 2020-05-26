import React from 'react';
import './App.css';
import ChartLines from '../Components/Charts/ChartLines';
import FilterWindow from '../Components/SideBar2/FilterWindow';

function App() {
  //-----------------------------------------------
  // demo block for using types in TypeScript
  // TODO: delete this block later
  const testStringConstant: string = "string constant";
  let testNotConstant: any = "I was a string, but my type = any";
  console.log(testNotConstant);
  testNotConstant = 1;
  testNotConstant = "Now I'm a string again";
  //-----------------------------------------------
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
