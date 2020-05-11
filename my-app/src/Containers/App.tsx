import React from 'react';
import './App.css';
import ChartLines from '../Components/Charts/ChartLines';

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
      <div>Placeholder for MENU</div>
      <div>Placeholder for CHART 1</div>
      <ChartLines></ChartLines>
      <div>Placeholder for CHART 2</div>
    </div>
  );
}

export default App;
