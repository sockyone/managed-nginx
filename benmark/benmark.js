const axios = require('axios')
const { pRateLimit } = require('p-ratelimit');
// import { pRateLimit } from 'p-ratelimit';       // TypeScript

// create a rate limiter that allows up to 30 API calls per second,
// with max concurrency of 10
const limit = pRateLimit({
    interval: 1000,             // 1000 ms == 1 second
    rate: 100,                  // 100 API calls per interval
    concurrency: 20,            // no more than 20 running at once
    maxDelay: 3000              // an API call delayed > 3 sec is rejected
})

let svc = [
    'rendering',
    'billing',
    'order',
    'product',
    'external',
    'google',
    'shipping',
    'woocommerce',
    'importer',
    'statistic',
    'artwork',
    'ebay',
    'setting'
]

function test() {
    let random = Math.floor(Math.random() * 46) + 3
    let service = svc[Math.floor(Math.random() * svc.length)]
    return new Promise(async (res) => {
        try {
            console.log("Sendding...")
            let res = await axios.get(`https://namphan-test${random}.merch8.com/${service}/updatedb`)
            console.log(res.data)
        } catch (e) {
            console.log(e.message)
        } finally {
            res(true)
        }
     })
}

function sleep(n) {
    return new Promise((res) => setTimeout(res, n))
}

async function main() {
  // original WITHOUT rate limiter:
  // with rate limiter:
  while (true) {
    // console.log("Hi")
    limit(() => test())
    await sleep(100)
  }
}

main();


