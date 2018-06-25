const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
// 适用于数据变化频繁场景，存放任何类型
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTORY = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
    id: String,
    username: {
        unique: true, // 唯一
        required: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: Number, // 锁定到何时
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

// 虚拟字段，不会存入数据库
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', function(next) {
    // 保存之前的数据是否是最新的
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

// 对密码进行加盐
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next()

    // 值越大复杂度越高
    bcrypt.genSalt(SALT_WORK_FACTORY, (err, salt) => {
        if(err) return next(err)

        bcrypt.hash(this.password, salt, (error, hash) => {
            if (error) return next(error)

            this.password = hash
            next()
        })
    })

    next()
})

userSchema.methods = {
    // 比对密码
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },

    // 判断当前用户是否超过登陆次数，并是否进行锁定
    incLoginAttempts: user => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, err => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }

                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }

                this.update(updates, err => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            }
        })
    }
}

mongoose.model('User', userSchema)