import axios from 'axios';

export default axios.create({
  //baseURL: 'http://tigertruckerstest.us-east-1.elasticbeanstalk.com/api/'
  baseURL: `http://127.0.0.1:5000/api/`
  //baseURL: 'https://jsonplaceholder.typicode.com/'
});