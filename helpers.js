const fs = require('fs');
module.exports = {
    cloneObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
};