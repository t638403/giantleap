const { Transform } = require('stream');
const pick = require('@giantleap/utils/underdash/pick');

class Pick extends Transform {
    constructor(keys) {
        super({objectMode:true});
        this.keys = keys;
    }

    _transform(data, _enc, next) {
        this.push(pick(data, this.keys));
        next();
    }
}

module.exports = Pick;