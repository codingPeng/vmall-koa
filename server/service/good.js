const mongoose = require('mongoose')
const Goods = mongoose.model('Good')

export const getAllGoods = async (p, size) => {
    let page = Number(p)
    let pageSize = Number(size)
    const goodsList = await Goods.find({}).skip((page-1)*pageSize).limit(pageSize)
    const count = await Goods.count()

    return {
        goodsList,
        count
    }
}

export const getGoodsDetail = async (id) => {
    const good = await Goods.findOne({id: id})

    return good
}