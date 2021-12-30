const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve(data));
        }).on("error", e => {
            resolve(null);
        });
    });
}

function getTags(url) {
    return new Promise(async(resolve, reject) => {
        let html = await get(url);

        let title = null;
        let description = null;
        let image = null;
        if (html != null) {
            html = html.substring(html.indexOf("og:title") + 19);
            title = html.substring(0, html.indexOf('">'));
            html = html.substring(html.indexOf('content="') + 9);
            description = html.substring(0, html.indexOf('">'));
            html = html.substring(html.indexOf('content="') + 9);
            image = html.substring(0, html.indexOf('">'));
        }

        resolve({title, description, image});
    });
}

module.exports = getTags;