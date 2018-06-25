const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Goods = mongoose.model('Good')

;(async () => {
    const script = resolve(__dirname, '../crawler/good')
    const child = cp.fork(script, [])
    let invoked = false

    child.on('error', err => {
        if (invoked) return
        invoked = true
    })

    child.on('exit', code => {
        if (invoked) return
        invoked = true

        let err = code === 0 ? null : new Error('code: ' + code)
        console.log('exit: ' + code)
    })

    child.on('message', data => {
        let result = data.result
        console.log('数据---', data)
        result.forEach(async item => {
            let goods = await Goods.findOne({
                id: item.id
            })

            if (!goods) {
                goods = new Goods(item)

                await goods.save()
            }
        })
    })
})()