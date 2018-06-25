const mongoose = require('mongoose')
const Mall = mongoose.model('Mall')

export const getMallList = async () => {
    const banner = await Mall.find({category: {name: 'banner'}}).sort({id: -1})
    const theme = await Mall.find({category: {name: 'theme'}}).sort({id: -1})
    const hot = await Mall.find({category: {name: 'hot'}}).sort({id: -1})
    const featured = await Mall.find({category: {name: 'featured'}}).sort({_id: 1})
    const brandAround = await Mall.find({category: {name: 'brandAround'}}).sort({_id: 1})
    const brandSelection = await Mall.find({category: {name: 'brandSelection'}}).sort({_id: 1})

    return {
        banner,
        theme,
        hot,
        featured,
        brandAround,
        brandSelection
    }
}