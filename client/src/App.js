import React, { Component } from 'react';
import './App.css';
import Scrap from './components/scrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tech Challenge</h1>
        </header>
        <Scrap />
      </div>
    );
  }
}

export default App;
