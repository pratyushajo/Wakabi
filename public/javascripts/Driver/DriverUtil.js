var sys = require('sys')
var pg = require('pg')

module.exports = {
  toggleDriverShift: function(from, starting, cb) {
	  sys.log("From " + from + " starting " + starting);
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (!err) {
        var queryString = "UPDATE drivers SET working = " + starting + " WHERE phone_number = '" + from + "'"
        var query = client.query(queryString, function(err, result) {
          client.end()

          if (err) {
            cb(err)
          } else {
            cb()
          }
        })
      } else {
        cb(err)
      }
    })
  },
  updateLocation: function(driverNum, location, cb) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (!err) {
        var queryString = "UPDATE drivers SET current_zone = " + location + " WHERE phone_number = '" + driverNum + "'"
        var query = client.query(queryString, function(err, result) {
          client.end()

          if (err) {
            cb(err)
          } else {
            cb()
          }
        })
      } else {
        cb(err)
      }
    })
  },
  getDriverWithNum: function(driverNum, cb) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (!err) {
        var queryString = "SELECT * FROM drivers WHERE phone_number = '" + driverNum + "'"
        var query = client.query(queryString, function(err, result) {
          client.end()

          if (err) {
            cb(err)
          } else if (result.rows.length == 0) {
            cb("No driver found with number")
          } else {
            cb(null, result.rows[0])
          }
        })
      }
    })
  }
}