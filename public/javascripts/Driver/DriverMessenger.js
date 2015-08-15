var sys     = require('sys')
var pg      = require('pg')
var _ = require('underscore')
var moment = require('moment')

var stages  = require('../stages')
var strings = require('../strings')
var parser  = require('../messageParser')
var db      = require('../db')
var DriverUtil = require('./DriverUtil')
var Messenger = require('../TextMessenger')
var RiderWaitingQueue = require('../Rider/RiderWaitingQueue')
var RiderMessenger = require('../Rider/RiderMessenger')

function requestLocation(res, resend, stage) {
  cookies = {"driveStage": stage}
  Messenger.requestLocation(res, resend, cookies)
}

function receiveStartShiftLocation(res, location, from) {
  DriverUtil.toggleDriverShift(res, from, true, function(err) {
    if (!err) {
      DriverUtil.updateLocation(from, +location, function(err) {
        var responseText = ""

        if (!err) {
          responseText = strings.successfulStartShift
          checkRiderWaitingQueue(from, location)
        } else {
          responseText = strings.dbError
        }

        cookies = {"driveStage": stages.driveStages.NOTHING}
        Messenger.textResponse(res, responseText, cookies)
      })
    } else {
      cookies = {"driveStage": stages.driveStages.NOTHING}
      Messenger.textResponse(res, strings.dbError, cookies)
    }
  })
}

function checkRiderWaitingQueue(driverNum, location) {
  ridersWaiting = RiderWaitingQueue.getRidersWaitingInZone(location)

  if (ridersWaiting.length > 0) {
    Messenger.text(driverNum, strings.acceptRideQuestion)
  }
}

function handleRequestResponse(res, message, from) {
  if (parser.isYesMessage(message)) {
    sendNumberToDriver(res, from)
  } else if (parser.isNoMessage(message)) {
    // DriverUtil.getDriverWithNum(from, function(err, driver) {
    //   if (!err) {
        
    //   }
    // })

    db.getDriverFromNum(from, function(driver) {
      if (driver) {
        pg.connect(process.env.DATABASE_URL, function(err, client) {
          if (!err) {
            var queryString = "SELECT * FROM rides WHERE driver_num = '" + from + "' AND end_time IS NULL"
            var query = client.query(queryString, function(err, result) {
              if (!err) {
                var ride = result.rows[0]
                var driverNum = ride.driver_num

                var queryString = "UPDATE rides SET driver_num = NULL WHERE ride_id = " + ride.ride_id
                var query = client.query(queryString, function(err, result) {
                  if (!err) {
                    var params = {
                      rideId: ride.ride_id,
                      driverTimeLastRide: driver.time_last_ride,
                      riderWaitingForResponse: true
                    }

                    db.sendRequestToAvailableDriver(params)
                  }
                })
              }
            })
          }
        })
      }
    })
  } else {
    // wasn't a response to the request, send back default message?
  }
}

function sendNumberToDriver(res, driverNum) {
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (!err) {
      var queryString = "UPDATE rides SET status = 'ACTIVE' WHERE driver_num = '" + driverNum + "' AND end_time IS NULL RETURNING rider_num"
      var query = client.query(queryString, function(err, result) {
        if (!err) {
          var riderNum = result.rows[0].rider_num
          var responseText = strings.hereIsRiderNum + riderNum

          cookies = {"driveStage": stages.driveStages.AWAITING_END_RIDE}
          Messenger.textResponse(res, responseText, cookies)

          RiderWaitingQueue.removeRiderFromQueue(riderNum)
        }
        client.end();
      });
    }
  });
}

function handleEndRideText(res, message, from) {
  if (parser.isEndRideMessage(message)) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (!err) {
        var queryString = "SELECT * FROM rides WHERE driver_num = '" + from + "' AND end_time IS NULL"
        var query = client.query(queryString, function(err, result) {
          if (!err) {
            var ride = result.rows[0]
            var riderNum = ride.rider_num
            var endTime = moment().format('YYYY-MM-DD HH:mm:ssZ')

            Messenger.text(riderNum, strings.feedbackQuestion)
            requestLocation(res, false, stages.driveStages.AWAITING_UPDATED_LOCATION)

            var queryString = "UPDATE rides SET end_time = '" + endTime + "', status = 'FINISHED' WHERE ride_id = " + ride.ride_id
            var query = client.query(queryString, function(err, result) {
              if (!err) {
                var queryString = "UPDATE drivers SET time_last_ride = '" + endTime + "' WHERE num = '" + from + "'"
                var query = client.query(queryString, function(err, result) {
                  if (!err) {
                    // Timestamp set
                  }
                  client.end()
                })
              }
            })
          }
        })
      }
    })
  }
}

function handleUpdatedLocation(res, message, driverNum) {
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (!err) {
      var queryString = "UPDATE drivers SET current_zone = " + (+message) + " WHERE num = '" + driverNum + "'";
      var query = client.query(queryString, function(err, result) {
        if (!err) {
          cookies = {"driveStage": stages.driveStages.NOTHING}
          Messenger.textResponse(res, strings.updatedDriverLocation, cookies)
          checkRiderWaitingQueue(driverNum, +message)

          var queryString = "UPDATE rides SET destination = " + (+message) + " WHERE driver_num = '" + driverNum + "' AND destination IS NULL"
          var query = client.query(queryString, function(err, result) {
            client.end()
          })
        } else {
          sys.log("handleUpdatedLocation: Error querying db, err: " + err);
        }
      })
    }
  })
}

function isShiftChange(res, message, from, driveStage) {
  if (driveStage !== stages.driveStages.AWAITING_END_RIDE) {
    if (parser.isStartShift(message)) {
      requestLocation(res, false, stages.driveStages.AWAITING_START_LOCATION)
      return true
    } else if (parser.isEndShift(message)) {
      DriverUtil.toggleDriverShift(from, false, function(err) {
        if (!err) {
          cookies = {"driveStage": stages.driveStages.NOTHING}
          Messenger.textResponse(res, strings.successfulEndShift, cookies)
        } else {
          Messenger.textResponse(res, strings.dbError)
        }
      })
      return true
    }
  }

  return false
}

module.exports = {
  handleText: function(res, message, from, driveStage) {
    if (isShiftChange(res, message, from, driveStage)) {
      return
    }
    
    switch (driveStage) {
      case stages.driveStages.AWAITING_START_LOCATION:
        receiveStartShiftLocation(res, message, from);
        break;

      case stages.driveStages.NOTHING:
        handleRequestResponse(res, message, from);
        break;

      case stages.driveStages.AWAITING_END_RIDE:
        handleEndRideText(res, message, from);
        break;

      case stages.driveStages.AWAITING_UPDATED_LOCATION:
        handleUpdatedLocation(res, message, from);
        break;
    }
  },
  textDriverForConfirmation: function(driverNumber, riderNumber) {
    Messenger.text(driverNumber, strings.acceptRideQuestion)
  }
};
