import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Register from './components/register';

class App extends React.Component{

  render(){
    return(
      
      <div className='app'>
        <Register />
      </div>
    );
  }

}

export default App;
