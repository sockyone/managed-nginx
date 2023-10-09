let str = "[backoffice-etsy-im585-merchize-store-bo-product-management-service-etsy-im585-merchize-store-31700]"

let splited = str.replace(/[\[\]]/g, "").split("-")
splited.pop()

let idxOfSvc = splited.indexOf("service")

let lastString = splited.slice(idxOfSvc + 1, splited.length)

let first = splited.indexOf(lastString[0])
let last = splited.indexOf(lastString[lastString.length - 1])

splited.splice(idxOfSvc, lastString.length)
splited.splice(first, last)

console.log(splited.join("-"))