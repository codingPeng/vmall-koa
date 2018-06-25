const { Route } = require('../decorator')
const { resolve } = require('path')

export const router = app => {
    let apiPath = resolve(__dirname, '../routes')
    const router = new Route(app, apiPath)

    router.init()
}