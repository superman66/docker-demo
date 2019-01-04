import React, { Component } from 'react'
import Axios from 'axios'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '', users: [] }
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.fetchUsers()
  }

  fetchUsers() {
    Axios.get('http://127.0.0.1:3200/users').then(response => {
      this.setState({
        users: response.data.items,
      })
    })
  }
  handleOnClick() {
    const { value } = this.state
    if (value !== '') {
      Axios.post('http://127.0.0.1:3200/users/add', { name: value }).then(
        response => {
          this.fetchUsers()
          this.setState({
            value: '',
          })
        },
      )
    }
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  render() {
    const { value, users } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            React + Nginx + Node + Mongodb Docker-Compose Demo
          </p>
          <input value={value} onChange={this.handleChange} />
          <button className="App-link" onClick={this.handleOnClick}>
            Add
          </button>
          <ul>
            {users.map(user => (
              <li>{user.name}</li>
            ))}
          </ul>
        </header>
      </div>
    )
  }
}

export default App
