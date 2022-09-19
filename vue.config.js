
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

const fs = require('fs');

const key = fs.readFileSync('./cert/key.pem');
const cert = fs.readFileSync('./cert/cert.pem');

module.exports = {
	devServer: {
        port: 80,
        https: {key, cert},
    }
};