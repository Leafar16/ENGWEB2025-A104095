var Classifier = require('../models/classifier')

module.exports.list = () => {
    return Classifier
        .find()
        .exec()
}

module.exports.findByIdClassifier = id => {
    return Classifier
        .findOne({_id : id})
        .exec()
}

module.exports.insert = classifier => {
        var newclassifier = new Classifier(classifier)
        return newclassifier.save()
}

module.exports.update = (id, classifier) => {
    return Classifier.findByIdAndUpdate(id, classifier, {new : true})
    .exec()
}

module.exports.delete = id => {
    return Classifier.findByIdAndDelete(id)
    .exec()
}
