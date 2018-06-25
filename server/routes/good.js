const { controller, get } = require('../decorator/index')
const {
    getAllGoods,
    getGoodsDetail
} = require('../service/good')


@controller('/api/goods')
export class goodsController {
    @get('/')
    async getGoods (ctx, next) {
        let { page, pageSize } = ctx.query
        console.log("测试----", page, ctx)
        const goodsList = await getAllGoods(page, pageSize)


        ctx.body = {
            success: true,
            data: goodsList
        }
    }

    @get('/:id')
    async goodsDetail (ctx, next) {
        let id = ctx.params.id
        const goodsDetail = await getGoodsDetail(id)

        ctx.body = {
            success: true,
            data: goodsDetail
        }
    }
}