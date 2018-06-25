const Koa = require('koa')
const mongoose = require('mongoose')
const app = new Koa()
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const { router } = require('./middlewares/router')

;(async () => {
    await connect()

    // 初始化schema
    initSchemas()

    await router(app)

    // require('./tasks/mall')
    
    app.listen(3000)
})()
