const puppeteer = require('puppeteer')
const nanoid = require('nanoid')
const url = 'https://www.smartisan.com/'

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    // 声明brower,相当于隐形浏览器
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })
    // 开启新页面
    const page = await brower.newPage()
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })

    await sleep(3000)

    await page.waitFor(1000)

    const result = await page.evaluate(() => {
        // banner
        // let banner = document.querySelectorAll('.banner-3d-box-1')
        // // theme-goods
        // let theme = document.querySelectorAll('.activity-panel li img')
        // 热门商品
        let hot = document.querySelectorAll('#js-hot-wrapper .hot-cell-list .product')
        // 精选商品
        let goods = document.querySelectorAll('.floor-panel .cell-list')
        // 官方精选
        let featured = document.querySelectorAll('.floor-panel .cell-list')[0]
        // 品牌周边
        let brandAround = document.querySelectorAll('.floor-panel .cell-list')[2]
        // 品牌精选
        let brandSelection = document.querySelectorAll('.floor-panel .cell-list')[3]
        let data = []
        
        // // banner
        // let bannerData = []
        // for (let item of banner) {
        //     let imgUrl = item.childNodes[0].src
        //     bannerData.push({
        //         imgUrl,
        //         category: {
        //             name: 'banner'
        //         }
        //     })
        // }

        // // theme-goods
        // let themeData = []
        // for(let item of theme) {
        //     let imgUrl = item.src
        //     themeData.push({
        //         imgUrl,
        //         category: {
        //             name: 'theme'
        //         }
        //     })
        // }

        // hot
        // for(let item of hot) {
        //     let id = item.id
        //     let imgUrl = item.childNodes[2].childNodes[2].childNodes[1].src
        //     let title = item.childNodes[2].childNodes[2].childNodes[5].childNodes[1].innerText
        //     let desc = item.childNodes[2].childNodes[2].childNodes[5].childNodes[5].innerText
        //     let price = item.childNodes[2].childNodes[2].childNodes[7].childNodes[3].innerText
        //     let orginalPrice = item.childNodes[2].childNodes[2].childNodes[7].childNodes[6].innerText || ''
        //     data.push({
        //         id,
        //         imgUrl,
        //         title,
        //         desc,
        //         price,
        //         orginalPrice,
        //         category: {
        //             name: 'hot'
        //         }
        //     })
        // }

        // goods
        goods.forEach(function (item, index) {
            let category = {}
            if (index === 0) {
                category = {
                    name: 'featured'
                }
            } else if (index === 2) {
                category = {
                    name: 'brandAround'
                }
            } else if (index === 3) {
                category = {
                    name: 'brandSelection'
                }
            }
            let themeGood = item.querySelector('.double')
            let themeImage = themeGood.childNodes[2].childNodes[1].src
            data.unshift({
                imgUrl: themeImage,
                category
            })
            if (index !== 1) {
                for (let _item of item.querySelectorAll('.product')) {
                    let id = _item.id
                    let imgUrl = _item.childNodes[6].childNodes[2].childNodes[1].src
                    let title = _item.childNodes[6].childNodes[2].childNodes[5].childNodes[1].innerText
                    let desc = _item.childNodes[6].childNodes[2].childNodes[5].childNodes[5].innerText
                    let price = _item.childNodes[6].childNodes[2].childNodes[7].childNodes[3].innerText
                    data.push({
                        id,
                        imgUrl,
                        title,
                        desc,
                        price,
                        category
                    })
                }
            }
        })
        console.log('是否已经获取', data)
        return data
    })

    brower.close()
    process.send({result})
    process.exit(0)
})()