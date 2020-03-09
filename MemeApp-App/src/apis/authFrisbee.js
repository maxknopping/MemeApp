import Frisbee from 'frisbee';

// create a new instance of Frisbee
export default authFrisbee = new Frisbee({
  baseURI: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});