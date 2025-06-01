var Item = require('../models/item')

module.exports.list = () => {
    return Item
        .find()
        .exec()
}

module.exports.findByIdItem = id => {
    return Item
        .findOne({_id : id})
        .exec()
}

module.exports.insert = item => {
        var newitem = new Item(item)
        return newitem.save()
}

module.exports.findByOwner = (owner) => {
    return Item
      .find({ owner: owner })
      .exec()
}

module.exports.update = (id, item) => {
    return Item.findByIdAndUpdate(id, item, {new : true})
    .exec()
}

module.exports.delete = id => {
    return Item.findByIdAndDelete(id)
    .exec()
}

module.exports.exists = async (id) => {
    const count = await Item.countDocuments({ _id: id });
    return count > 0;
}

module.exports.addComment = (id, comment) => {
    return Item.findByIdAndUpdate(
        id,
        { $push: { comentarios: comment } },
        { new: true }
    ).exec();
};

module.exports.findPublicByOwners = (owners) => {
    return Item
        .find({ owner: { $in: owners }, publico: true })
        .exec()
}