const livro = require('../models/livro')
var Livro = require('../models/livro')

module.exports.list = () => {
    return Livro.find()
                .exec()
}




module.exports.getById = (id) => {
    return Livro.findOne({_id : id})
                .exec()
}



module.exports.getLivrosByCharacter = (character) => {
    return Livro.find({ characters: {$in : character}}).exec()
};

module.exports.getLivrosByGenre = (genre) => {
    return Livro.find({ genres: {$in : genre}}).exec()
};

module.exports.getAllGenres = () => {
    return Livro.aggregate([
        { $unwind: "$genres" }, 
        { $group: { _id: "$genres" } }, // Group by genres to eliminate duplicates
        { $sort: { _id: 1 } }, // Sort genres alphabetically
        { $project: { _id: 0, genre: "$_id" } } // Return only the genre without the _id field
    ]).exec(); // Ensure the promise is returned
};

module.exports.getAllCharacters = () => {
    return Livro.aggregate([
        { $unwind: "$characters" }, // Unwind the "genres" array to process each genre individually
        { $group: { _id: "$characters" } }, // Group by genres to eliminate duplicates
        { $sort: { _id: 1 } }, // Sort genres alphabetically
        { $project: { _id: 0, character: "$_id" } } // Return only the genre without the _id field
    ]).exec(); // Ensure the promise is returned
};

module.exports.getAllBooksByAuthor = autor => {
    return Livro
        .find({ 
            author: { $in: autor }
        })
        .exec()
}

module.exports.insert = livro => {
    if(Livro.find({_id:livro.id}).exec().length !=1){
        var newLivro = new Livro(livro)
        newLivro._id=livro.id 
        return newLivro.save()
    }
}

module.exports.delete=id=>{
    return Livro.findByIdAndDelete(id).exec()
}


module.exports.update=(id,livro)=>{
    return Livro.findByIdAndUpdate(id, livro).exec()
}
