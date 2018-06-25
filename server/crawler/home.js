const puppeteer = require('puppeteer')
const url = 'https://www.smartisan.com/'

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    // 声明brower, 相当于浏览器
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await brower.newPage()
    page.goto(url, {
        waitUntil: 'networkidle2'
    })

    await sleep(3000)

    await page.waitFor(1000)

    const result = await page.evaluate(() => {
        // banner
        let banner = document.querySelectorAll('.banner-3d-box-1')
        // theme-goods
        let theme = document.querySelectorAll('.activity-panel li img')
        // 热门商品
        let hot = document.querySelectorAll('#js-hot-wrapper .hot-cell-list .product')
        let data = []

        // banner
        banner.forEach((item, index) => {
            let imgUrl = item.childNodes[0].src
            let id = parseInt(Math.random() * 1000000)
            data.push({
                id,
                imgUrl,
                category: {
                    name: 'banner'
                }
            })
        })

        // theme-goods
        theme.forEach((item, index) => {
            let imgUrl = item.src
            let id = parseInt(Math.random() * 1000000)
            data.push({
                id,
                imgUrl,
                category: {
                    name: 'theme'
                }
            })
        })

        // hot
        for(let item of hot) {
            let id = item.id
            let imgUrl = item.childNodes[2].childNodes[2].childNodes[1].src
            let title = item.childNodes[2].childNodes[2].childNodes[5].childNodes[1].innerText
            let desc = item.childNodes[2].childNodes[2].childNodes[5].childNodes[5].innerText
            let price = item.childNodes[2].childNodes[2].childNodes[7].childNodes[3].innerText
            let orginalPrice = item.childNodes[2].childNodes[2].childNodes[7].childNodes[6].innerText || ''
            data.push({
                id,
                imgUrl,
                title,
                desc,
                price,
                orginalPrice,
                category: {
                    name: 'hot'
                }
            })
        }

        return data
    })

    page.close()
    process.send({result})
    process.exit(0)
})()