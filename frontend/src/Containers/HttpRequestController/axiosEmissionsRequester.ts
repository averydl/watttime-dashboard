import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/emissions/',
});

export function requestEmissions(ba: string, start: string, end: string): Promise<any>{
  return axios.get('http://127.0.0.1:5000/emissions/' + ba 
  + '?start=' 
  + start
  + '&end=' 
  + end );
}

export default instance;