const { controller, get } = require('../decorator/index')
const {
    getMallList
} = require('../service/mall')

@controller('/api/mall')
export class mallController {
    @get('/')
    async mallList (ctx, next) {
        const list = await getMallList()

        ctx.body = {
            success: true,
            data: list
        }
    }
}