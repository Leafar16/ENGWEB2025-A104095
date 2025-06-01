const fs = require('fs');
const path = require('path');
var Log = require('../models/log');

const logsFilePath = path.join(__dirname, '../logs/logs.txt');

if (!fs.existsSync(path.dirname(logsFilePath))) {
    fs.mkdirSync(path.dirname(logsFilePath), { recursive: true });
}

if (!fs.existsSync(logsFilePath)) {
    fs.writeFileSync(logsFilePath, '');
}

function appendToLogFile(logEntry) {
    const logLine = `${new Date().toISOString()} - ${logEntry}\n`;
    fs.appendFile(logsFilePath, logLine, (err) => {
        if (err) {
            console.error('Erro ao gravar no ficheiro de logs:', err);
        }
    });
}


module.exports.createLog = async (log) => {
    try {
      const count = await Log.countDocuments().exec();
      const logId = count + 1;
  
      const newLog = new Log({
        _id: logId,
        utilizador: log.utilizador,
        acao: log.acao,
        detalhes: log.detalhes,
        timestamp: log.timestamp
      });
  
      appendToLogFile(`Utilizador: ${log.utilizador} | Ação: ${log.acao} | Detalhes: ${log.detalhes}`);
  
      return await newLog.save();
    } catch (err) {
      console.error('Erro ao criar log:', err);
      throw err;
    }
  };
  

module.exports.getLogs = () => {
    return Log.find().exec();
};

module.exports.getLogById = (id) => {
    return Log.findById(id).exec();
};

module.exports.updateLog = (id, log) => {
    return Log.findByIdAndUpdate(id, log, { new: true }).exec();
};

module.exports.count = () => {
    return Log.countDocuments().exec();
};

module.exports.deleteLog = (id) => {
    return Log.findByIdAndDelete(id).exec();
};