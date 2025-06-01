var User = require('../models/user')

module.exports.getUsers = () => {
    return User.find()
                .exec()   
}

module.exports.getUserById = (id) => {
    return User.findById(id)
                .exec()
}

module.exports.getUserByUsername = (username) => {
    return User.find({ username: username }).exec()
}

module.exports.createUser = (user) => {
    var newUser = new User(user)
    return newUser.save()
}

module.exports.updateUser = (id, user) => {
    return User.findByIdAndUpdate(id, user, {new : true})
    .exec()
}

module.exports.editUser = (username, user) => {
    return User.find({ username: username })
                .then(users => {
                    if (users.length > 0) {
                        return User.findByIdAndUpdate(users[0]._id, user, { new: true })
                                    .exec();
                    } else {
                        throw new Error('User not found');
                    }
                }); 
}

module.exports.deleteUser = (id) => {
    return User.findByIdAndDelete(id)
                .exec()
}

module.exports.findByName = name => {
    return User
        .findOne({username : name})
        .exec()
}