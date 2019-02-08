const isArray = (o) => o !== null && typeof o === 'object' && !!o.forEach && typeof o.forEach === 'function';

module.exports = isArray;
