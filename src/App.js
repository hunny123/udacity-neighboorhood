import React, { Component } from 'react';
import Map from './Map.js'
import './App.css'

class App extends Component {
  render() {
    return (
      <div role='application'>
      <h1 className="bg-dark text-white pl-4 py-4">Neighbouhood Project</h1>
        <Map />
      </div>
    );
  }
}

export default App;
