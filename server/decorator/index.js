const { resolve } = require('path')
const glob = require('glob')
const _ = require('lodash')
const Router = require('koa-router')

const symbolPrefix = Symbol('prefix')
const isArray = c => _.isArray(c) ? c : [c]
const routerMap = new Map()

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path)

    routerMap.set({
		target: target,
		...conf
	}, target[key])
}

export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
    method: 'get',
    path: path
})

export const post = path => router({
    method: 'post',
    path: path
})

export class Route {
    constructor(app, apiPath) {
        this.app = app
        this.apiPath = apiPath
        this.router = new Router()
    }

    init () {
        glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

        // console.log('数据集合---', routerMap)
        for (let [conf, controller] of routerMap) {
            // console.log('数据集合---', conf, '---', controller)
            let controllers = isArray(controller)
            let prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
            let routerPath = prefixPath + conf.path
            this.router[conf.method](routerPath, ...controllers)
        }
        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}