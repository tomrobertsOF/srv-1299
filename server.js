const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const clone = require('clone');
const openfin = require('hadouken-js-adapter');
const fetch = require('node-fetch');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

const appConfigBase = require('./app.base.json');
const { version } = require('html-webpack-plugin');

app.get('/app.json', async (req, res) => {
    const {version='stable'} = req.query;

    let appConfig = clone(appConfigBase);
    // Override version
    appConfig.runtime.version = version;
    // Override with random uuid
    appConfig.startup_app.uuid = `test-1299-${version}-${randomID()}`;

    res.json(appConfig);
});
app.get('/versions.json', async (req, res) => {
    const fullList = await (await fetch('http://developer.openfin.co/release/meta/runtime/versions')).json();
    const extractedVersions = fullList.map(entry => entry.version);
    const sortedVersions = extractedVersions.sort((a, b) => {
        let aParts = a.split('.');
        let bParts = b.split('.');
        for (let [i, val] of aParts.entries()) {
            if (val !== bParts[i])
                return Math.sign(bParts[i] - val);
        }
        return 0;
    });

    res.json(sortedVersions);
});

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
}));

app.listen(8008, function() {
    console.log('Server listening on port 8008\n');
    console.log('Starting openfin');
    openfin.launch({manifestUrl: 'http://localhost:8008/app.json'});
});

function randomID() {
    return (Math.floor(Math.random() * 1e6)).toString().padStart(6,'0');
}
