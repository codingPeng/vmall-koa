const axios = require('axios')

async function goodsList() {
    const url = 'https://www.smartisan.com/product/spus?category_id=62&page=1&page_size=20&sort=sort'
    let body
    await axios.get(url).then(res => {
        body = res.data
    })
    return body
}

;(async () => {
    const result = await goodsList()
    let res = result.data.list
    let pageCount = result.data.page_count
    let data = []

    for (let item of res) {
        let id = item.id
        let imgUrl = `${item.sku_info[0].ali_image}?x-oss-process=image/resize,w_216/format,webp`
        let title = item.name
        let desc = item.shop_info.spu_sub_title
        let price = item.price

        data.push({
            id,
            pageCount,
            imgUrl,
            title,
            desc,
            price
        })
    }

    // const result = await page.evaluate(() => {
    //     let list = document.querySelectorAll('.product-box-item')
    //     let data = []

    //     for (let item of list) {
    //         let imgUrl = item.childNodes[1].childNodes[1].childNodes[1].src
    //         let title = item.childNodes[1].childNodes[3].innerText
    //         let desc = item.childNodes[1].childNodes[7].innerText
    //         let orginalPrice = item.querySelectorAll('.original-price').length && item.childNodes[10].childNodes[9].childNodes[1].childNodes[2].innerText || ''
    //         let price = item.querySelectorAll('.original-price').length && item.childNodes[10].childNodes[7].childNodes[1].childNodes[2].innerText || item.childNodes[8].childNodes[1].childNodes[2].innerText

    //         data.push({
    //             id: item.id,
    //             imgUrl,
    //             title,
    //             desc,
    //             orginalPrice,
    //             price
    //         })
    //     }

    //     // return data
    // })

    process.send({result: data})
    process.exit(0)
})()
