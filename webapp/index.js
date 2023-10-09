const APP_PORT = process.env.APP_PORT || 3000
const POD_GROUP = process.env.POD_GROUP
const SERVICE_NAME = process.env.SERVICE_NAME || "default"

const getDbConnection = require('./mongo_connection')
const uuid = require('uuid').v4

const APP_ID = uuid()

const dbInjectionMiddleWare = (req, res, next) => {
    let dbName = req.headers["db_name"]
    if (dbName) {
        req.dbConnection = getDbConnection(dbName)
    }
    next()
}

const express = require('express')
const app = express()

app.get("/updatedb", dbInjectionMiddleWare, (req, res) => {
    req.dbConnection.LogRecord.create({
        from_pod_group: POD_GROUP || "undefined",
        service: SERVICE_NAME || "undefined",
        server_id: APP_ID
    }, (err, saved) => {
        if (err) return res.status(500).send(err.message)
        else res.json({
            from_pod_group: POD_GROUP || "undefined",
            service: SERVICE_NAME || "undefined",
            server_id: APP_ID
        })
    })
})


app.get(`/${SERVICE_NAME}/updatedb`, dbInjectionMiddleWare, (req, res) => {
    req.dbConnection.LogRecord.create({
        from_pod_group: POD_GROUP || "undefined",
        service: SERVICE_NAME || "undefined",
        server_id: APP_ID
    }, (err, saved) => {
        if (err) return res.status(500).send(err.message)
        else res.json({
            from_pod_group: POD_GROUP || "undefined",
            service: SERVICE_NAME || "undefined",
            server_id: APP_ID
        })
    })
})

app.get(`/${SERVICE_NAME}`, dbInjectionMiddleWare, (req, res) => {
    res.json({
        from_pod_group: POD_GROUP || "undefined",
        service: SERVICE_NAME || "undefined",
        server_id: APP_ID,
        route: `/${SERVICE_NAME}`
    })
})

app.get("/", dbInjectionMiddleWare, (req, res) => {
    res.json({
        from_pod_group: POD_GROUP || "undefined",
        service: SERVICE_NAME || "undefined",
        server_id: APP_ID,
        route: "/"
    })
})

app.listen(APP_PORT, () => {
    console.log("App start listen on port:", APP_PORT)
})