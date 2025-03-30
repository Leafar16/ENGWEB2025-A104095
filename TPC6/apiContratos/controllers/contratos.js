var Contrato = require('../models/contrato')

module.exports.list = () => {
    return Contrato.find()
                .exec()   
}

module.exports.findById = id => {
    return Contrato.findOne({'_id' : id})
            .exec()   
}

module.exports.getContractByEntity = entidade => {
    return Contrato.find({'NIPC_entidade_comunicante' : entidade})
                .exec()   
}



module.exports.getContratosByTipo = tipo => {
    return Contrato.find({ 'tipoprocedimento': tipo }).exec();
} 


module.exports.getEntidades = () => {
    return Contrato.distinct('entidade_comunicante').sort().exec();
}


module.exports.getTipos = ()=> {
    return Contrato.distinct("tipoprocedimento").sort().exec();
}


module.exports.insert = contrato => {
    if(Contrato.find({_id:contrato.id}).exec().length !=1){
        var newContrato = new Contrato(contrato)
        newContrato._id=contrato.id 
        return newContrato.save()
    }
}


module.exports.delete=id=>{
    return Contrato.findByIdAndDelete(id).exec()
}


module.exports.update=(id,contrato)=>{
    return Contrato.findByIdAndUpdate(id, contrato).exec()
}