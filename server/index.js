const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const port = 3200

// Connect to MongoDB
/**
 * https://github.com/docker/hub-feedback/issues/1255#issuecomment-386954442
 * 为连接数据库添加失败重连的机制，解决 mongodb 无法连接的问题。
 */
const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
}

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose
    .connect(
      'mongodb://mongo:27017/demo',
      options,
    )
    .then(() => {
      console.log('MongoDB is connected')
    })
    .catch(err => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
      setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.all('*', function(req, res, next) {
  if (!req.get('Origin')) return next()
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET')
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200)
  next()
})

const User = require('./models/User')

app.get('/users', (req, res) => {
  User.find().then(users => {
    return res.json({ items: users })
  })
  // .catch(err => res.status(404).json({ msg: 'No user found' }))
})

app.post('/users/add', (req, res) => {
  console.log(req.body)
  const newUser = new User({
    name: req.body.name,
  })
  newUser.save().then(item => res.json({ msg: '创建成功' }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
