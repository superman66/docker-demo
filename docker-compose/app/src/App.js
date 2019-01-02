import React, { Component } from 'react'
import Axios from 'axios'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { data: {} }
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  handleOnClick() {
    Axios.get('http://127.0.0.1:3200').then(response => {
      this.setState({
        data: response.data,
      })
    })
  }

  render() {
    const { data } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button className="App-link" onClick={this.handleOnClick}>
            Fetch Data
          </button>
          Fetch name: {data.name}
        </header>
      </div>
    )
  }
}

export default App
