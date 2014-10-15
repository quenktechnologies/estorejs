module.exports = {

	type: 'composite',
        models: [require('./PostModel')],
        controllers: [require('./BlogController')]


};
