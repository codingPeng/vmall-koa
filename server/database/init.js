const mongoose = require('mongoose')
const db = 'mongodb://localhost/vmall-test'
const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

// 加载所有的schema文件
exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.connect = () => {
    // 最大链接次数
    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {
    
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
    
        mongoose.connect(db)
    
        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++

            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了！！！！！')
            }
        })
    
        mongoose.connection.on('error', err => {
            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了！！！！！')
            }
        })
    
        mongoose.connection.once('open', () => {
            // const Test = mongoose.model('Test', { name: String })
            // const str = new Test({name: '我是传奇'})

            // str.save().then(() => {
            //     console.log('ceshi122222')
            // })

            resolve()
            console.log('Mongodb connected successfully!')
        })
    })
}