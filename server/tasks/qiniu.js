const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)

const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({key})
                } else {
                    reject(info)
                }
            }
        })
    })
}

;(async () => {
    const list = [{
        images1: 'https://resource.smartisan.com/resource/2/24401108web1.png?x-oss-process=image/resize,w_1220/format,webp/quality,Q_100',
        images2: 'https://resource.smartisan.com/resource/2/24401108web1.png?x-oss-process=image/resize,w_1220/format,webp/quality,Q_100',
        images3: 'https://resource.smartisan.com/resource/2/24401108web1.png?x-oss-process=image/resize,w_1220/format,webp/quality,Q_100'
    }]

    list.map(async item => {
        if (item.images1 && !item.key) {
            try {
                let img = await uploadToQiniu(item.images1, nanoid() + '.png')

                if (img.key) {
                    item.imgKey = img.key
                }

                console.log(item)
            } catch(err) {
                console.log(err)
            }
        }
    })
})()