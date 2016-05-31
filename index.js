module.exports = function(source) {
    var translateCfg = JSON.parse(source);
    var callback = this.async();
    this.options.closures.translate && this.options.closures.translate({
        language: translateCfg.devLanguage
    }).then(function(response) {
        if (typeof response === 'string') {
            var PO = require('pofile');
            PO.load(response, function(err, po) {
                if (err) throw err;
                var translations = po.items.reduce((languages, msg) => {
                    languages[msg.msgid] = msg.msgstr[0] || msg.msgid;
                    return languages;
                }, {});
                callback(null, 'module.exports = ' + JSON.stringify(translations, undefined, '\t') + ';');
            });
        } else {
            var translations = response[0].reduce((languages, msg) => {
                languages[msg.dictionaryKey] = msg.translatedValue;
                return languages;
            }, {});
            callback(null, 'module.exports = ' + JSON.stringify(translations, undefined, '\t') + ';');
        }
    });
};
