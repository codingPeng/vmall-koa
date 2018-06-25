const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Mall = mongoose.model('Mall')

;(async () => {
    const script = resolve(__dirname, '../crawler/mall.js')
    const child = cp.fork(script, [])
    // 标识爬虫脚本是否运行
    let invoked = false

    child.on('error', (err) => {
        if (invoked) return
        invoked = true

        console.log('err1', err)
    })

    child.on('exit', code => {
        if (invoked) return
        invoked = true

        let err = code === 0 ? null : new Error('exit code' + code)
        console.log('err2', err)
    })

    child.on('message', data => {
        let result = data.result
        console.log('数据成功了111', result)

        // 把爬取到的数据存入mongodb
        result.forEach(async item => {
            let mall = await Mall.findOne({
                id: item.id
            })
            console.log('数据成功了', item)
            if (!mall) {
                mall = new Mall(item)
                await mall.save()
            }
        })

    })
})()