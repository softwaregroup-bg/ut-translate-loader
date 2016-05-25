module.exports = function(source) {
    var callback = this.async();
    this.options.closures.translate && this.options.closures.translate({
        module: source
    }).then(function(response) {
        var translations = response[0].reduce((languages, msg) => {
            if (!languages[msg.language]) languages[msg.language] = {};
            languages[msg.language][msg.msgid] = msg.msgstr;
            return languages;
        }, {});
        callback(null, 'module.exports = ' + JSON.stringify(translations, undefined, '\t') + ';');
    });
};
