// import './App.css'
// import { useLocation } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes'
// import { useEffect, useState } from 'react';
// import ReactGA from 'react-ga4';
// import axios from 'axios';
function App() {
  // const location = useLocation();
  // const [ip, setIp]=useState();
  // useEffect(() => {
  //   console.log(location)
  //   GetuserIp()
  //   ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  // }, [location]);
  // const GetuserIp=async()=>{
  //   const ip = await axios.get('https://ipapi.co/json')
  //   setIp(ip.data);
  //   console.log(ip.data);
  // } 
  return (
    <PublicRoutes />
  )
}

export default App
