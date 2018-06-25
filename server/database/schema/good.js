const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 适用于数据变化频繁场景，存放任何类型
const { ObjectId, Mixed} = Schema.Types

const goodsSchema = new Schema({
    id: {
        unique: true,
        type: String
    },
    imgUrl: String,
    category: {
        type: Mixed,
        ref: 'Category'
    },
    title: String,
    desc: String,
    price: Mixed,
    pageCount: Mixed,
    // summary: String,

    // imgKey: String,

    // productTypes: [String],

    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

// 注意：此回调用=>会又作用域问题
goodsSchema.pre('save', function(next) {
    // 保存之前的数据是否是最新的
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

mongoose.model('Good', goodsSchema)