const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 适用于数据变化频繁场景，存放任何类型
const { Mixed, ObjectId } = Schema.Types

const categorySchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    mall: [{
        type: ObjectId,
        ref: 'Mall'
    }],
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

categorySchema.pre('save', function(next) {
    // 保存之前的数据是否是最新的
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

mongoose.model('Category', categorySchema)