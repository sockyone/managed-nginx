//schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MONGO_BASE_URI = process.env.MONGO_BASE_URI || "mongodb://localhost:27017"

const LogRecord = new Schema({
    created_at: {type: Date, default: Date.now},
    from_pod_group: String,
    service: String
})

const __DB_CONNECTION_CACHE = {}

setInterval(function () {
	Object.keys(__DB_CONNECTION_CACHE).forEach(function (cache) {
		let dbConnect = __DB_CONNECTION_CACHE[cache]
		if (Date.now() - dbConnect.timestamp > 1000 * 60 * 5) {
			//delete cache and close sequelize connection if not working for 5 mins
            delete __DB_CONNECTION_CACHE[cache]
			try {
                console.log(`[DB CONNECTION EVENT] Closing connection to db ${cache}`)
                dbConnect.instance.close()
			} catch (err) {
				console.error(`Error while closing connection to db ${cache}`)
			}
		}
	});
}, 1000 * 60)

function getDbConnection(dbName) {
    // check in cache
    if (__DB_CONNECTION_CACHE[dbName]) {
        // update timestamp
        __DB_CONNECTION_CACHE[dbName].timestamp = Date.now()
    } else {
        // create new connection then save to cache
        __DB_CONNECTION_CACHE[dbName] = {
            instance: createConnectionWithDB(dbName),
            timestamp: Date.now()
        }
    }
    return __DB_CONNECTION_CACHE[dbName].instance
}

function createConnectionWithDB(dbName) {
    const dbConnection = mongoose.createConnection(`${MONGO_BASE_URI}/${dbName}?replicaSet=rs0`, { useNewUrlParser: true, useUnifiedTopology: true })

    dbConnection.LogRecord = dbConnection.model('LogRecord', LogRecord)

    dbConnection.on('connected', function() {
        console.log("[DB CONNECTION EVENT] Mongoose connection is open to", dbName)
    })

    dbConnection.on('error', function(err) {
        console.error("[DB CONNECTION EVENT] Mongoose connection has occured " + err + " error");
    })

    dbConnection.on('disconnected', function() {
        console.error(`[DB CONNECTION EVENT] Mongoose connection to ${dbName} is disconnected`);
    })

    dbConnection.on('close', function () {
        // make sure connection has been removed from cache
        if (__DB_CONNECTION_CACHE[dbName]) {
            delete __DB_CONNECTION_CACHE[cache]
        }
        console.error(`[DB CONNECTION EVENT] Mongoose connection to ${dbName} is closed`);
    })

    process.on('SIGINT', function() {
        dbConnection.close(function() {
            console.log(`[DB CONNECTION EVENT] Mongoose connection to ${dbName} is disconnected due to application termination`);
            process.exit(0)
        })
    })

    return dbConnection
}

module.exports = getDbConnection