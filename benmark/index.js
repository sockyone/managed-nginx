const fs = require('fs')
let LineByLineReader = require('line-by-line')
let lr = new LineByLineReader('from_users.txt')

// let writeStream = fs.createWriteStream("from_users.txt")

let totalCount = 0
let totalCount2 = 0
// let fromMonitoring = 0
// let fromHttpsAck = 0

let mapOfSvc = {}
let mapOfStore = {}

lr.on('line', function (line) {
    // if (line.includes("Go-http-client/2.0")) {fromMonitoring++}
    // else if (line.includes("/.well-known/acme-challenge")) {fromHttpsAck++}
    // else {
    //     writeStream.write(line + "\n")
    // }
    let str = line.split(/\s+/)
    str = str[str.length - 1]
    let splited = str.replace(/[\[\]]/g, "").split("-")
    splited.pop()

    let idxOfSvc = splited.indexOf("service")

    let lastString = splited.slice(idxOfSvc + 1, splited.length)

    let first = splited.indexOf(lastString[0])
    let last = splited.indexOf(lastString[lastString.length - 1])

    splited.splice(idxOfSvc, lastString.length)
    splited.splice(first, last)

    svc = splited.join("-")
    if (svc) {
        totalCount++
        if (mapOfSvc[svc]) {
            mapOfSvc[svc] += 1
        } else {
            mapOfSvc[svc] = 1
        }
    }

    lastString = lastString.join("-")
    if (lastString) {
        totalCount2++
        if (mapOfStore[lastString]) {
            mapOfStore[lastString] += 1
        } else {
            mapOfStore[lastString] = 1
        }
    }
})

lr.on('end', function () {
    console.log("=========END=========")
    // console.log("From monitoring:", fromMonitoring)
    // console.log("From monitoring:", fromMonitoring/totalCount * 100 + "%")
    // console.log("From https ack:", fromHttpsAck)
    // console.log("From https ack:", fromHttpsAck/totalCount * 100 + "%")
    // console.log("From user:", totalCount - fromMonitoring - fromHttpsAck)
    // console.log("From user:", (totalCount - fromMonitoring - fromHttpsAck)/totalCount * 100 + "%")
    for (let key in mapOfSvc) {
        mapOfSvc[key] = mapOfSvc[key]/totalCount*100 + "%"
    }
    for (let key in mapOfStore) {
        mapOfStore[key] = mapOfStore[key]/totalCount2*100 + "%"
    }

    console.log(mapOfStore)
})
