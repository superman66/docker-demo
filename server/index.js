const express = require('express')
const app = express()
const port = 3200

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

app.get('/', (req, res) => res.json({ name: 'superman' }))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
