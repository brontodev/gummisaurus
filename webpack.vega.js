const path = require('path');
const { merge } = require('webpack-merge');

const production = require('./webpack.prod');

module.exports = merge(production, {
    output: {
        path: path.resolve(__dirname, 'vega/assets/web')
    }
});
