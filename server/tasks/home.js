const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Mall = mongoose.model('Mall')

;(async () => {
    const script = resolve(__dirname, '../crawler/home.js')
    const child = cp.fork(script, [])
    // 是否运行
    let invoked = false

    child.on('error', err => {
        if(invoked) return
        invoked = true
    })

    child.on('exit', code => {
        if(invoked) return
        invoked = true

        let err = code === 0 ? null : new Error('code:' + code)
        console.log('exit', code)
    })

    child.on('message', data => {
        let result = data.result
        
        console.log('数据----', result)
        result.forEach(async item => {
        let mall = await Mall.findOne({
            id: item.id
        })

        if (!mall) {
            mall = new Mall(item)
            await mall.save()
        }
        })
    })
})()