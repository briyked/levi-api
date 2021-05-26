const jsdom = require("jsdom");
const got = require('got');
const utils = require("./utils");
const getUrls = require('get-urls');
const io = require('./IO');

const baseUrl = 'https://animekisa.tv';

const {
    JSDOM
} = jsdom;

module.exports = {
    getSearchResults(url, res) {
        return getSearchResults(url, res)
    },
    getTitle(url, index, res) {
        return getTitle(url, index, res)
    },
    getThumbnail(url, index, res) {
        return getThumbnail(url, index, res)
    },
    getEpisode(url, index, episode, res) {
        return getEpisode(url, index, episode, res)
    },
    newest(res) {
        return newest(res)
    }
}

function getSearchResults(url, res) {
    got(url).then(response => {

        const respo = new Array();

        const dom = new JSDOM(response.body);
        for (let o = 0; o < dom.window.document.getElementsByClassName(`similarboxmain`).length; o++) {
            const innerHTML = dom.window.document.getElementsByClassName(`similarboxmain`).item(o).innerHTML;


            const innerDom = new JSDOM(innerHTML);
            let result = innerDom.window.document.getElementsByClassName('an');

            for (let i = 0; i < result.length; i++) {
                if (!result.item(i).getAttribute('href').toString().endsWith("/"))
                    respo.push(baseUrl + result.item(i).getAttribute('href').toString());
            }
        }

        res.send(respo);
    }).catch(err => {
        res.send('4004');
        return err;
    });
}

function getTitle(url, index, res) {
    got(url).then(response => {
        const respo = new Array();

        const dom = new JSDOM(response.body);
        for (let o = 0; o < dom.window.document.getElementsByClassName(`similarboxmain`).length; o++) {
            const innerHTML = dom.window.document.getElementsByClassName(`similarboxmain`).item(o).innerHTML;


            const innerDom = new JSDOM(innerHTML);
            let result = innerDom.window.document.getElementsByClassName('an');

            for (let i = 0; i < result.length; i++) {
                if (!result.item(i).getAttribute('href').toString().endsWith("/"))
                    respo.push(baseUrl + result.item(i).getAttribute('href').toString());
            }
        }

        got(respo[index]).then(response => {
            const titleDom = new JSDOM(response.body);
            const titleHTML = titleDom.window.document.getElementsByClassName(`infoepbox`).item(0).innerHTML;

            const titleInnerDom = new JSDOM(titleHTML);
            const titleInnerHTML = titleInnerDom.window.document.getElementsByTagName(`a`);


            const innerRespo = new Array();
            for (let i = 0; i < titleInnerHTML.length; i++) {
                innerRespo.push(baseUrl + '/' + titleInnerHTML.item(i).getAttribute('href').toString())
            }

            res.send(innerRespo.reverse());
        })
    }).catch(err => {
        res.send('4004');
        return err;
    });
}

function getThumbnail(url, index, res) {
    got(url).then(response => {
        const respo = new Array();

        const dom = new JSDOM(response.body);
        for (let o = 0; o < dom.window.document.getElementsByClassName(`similarboxmain`).length; o++) {
            const innerHTML = dom.window.document.getElementsByClassName(`similarboxmain`).item(o).innerHTML;


            const innerDom = new JSDOM(innerHTML);
            let result = innerDom.window.document.getElementsByClassName('an');

            for (let i = 0; i < result.length; i++) {
                if (!result.item(i).getAttribute('href').toString().endsWith("/"))
                    respo.push(baseUrl + result.item(i).getAttribute('href').toString());
            }
        }

        got(respo[index]).then(response => {
            const titleDom = new JSDOM(response.body);
            res.send(baseUrl + '/' + titleDom.window.document.getElementsByClassName('posteri').item(0).getAttribute('src'));
        })
    }).catch(err => {
        res.send('4004');
        return err;
    });
}

function getEpisode(url, index, episode, res) {

    got(url).then(response => {
        const respo = new Array();

        const dom = new JSDOM(response.body);
        for (let o = 0; o < dom.window.document.getElementsByClassName(`similarboxmain`).length; o++) {
            const innerHTML = dom.window.document.getElementsByClassName(`similarboxmain`).item(o).innerHTML;


            const innerDom = new JSDOM(innerHTML);
            let result = innerDom.window.document.getElementsByClassName('an');

            for (let i = 0; i < result.length; i++) {
                if (!result.item(i).getAttribute('href').toString().endsWith("/"))
                    respo.push(baseUrl + result.item(i).getAttribute('href').toString());
            }
        }

        got(respo[index]).then(response => {

            var responseCode = '4003';
            const titleDom = new JSDOM(response.body);
            const titleHTML = titleDom.window.document.getElementsByClassName(`infoepbox`).item(0).innerHTML;

            const titleInnerDom = new JSDOM(titleHTML);
            const titleInnerHTML = titleInnerDom.window.document.getElementsByTagName(`a`);


            const innerRespo = new Array();
            for (let i = 0; i < titleInnerHTML.length; i++) {
                innerRespo.push(baseUrl + '/' + titleInnerHTML.item(i).getAttribute('href').toString())
            }

            got(innerRespo.reverse()[episode]).then(r => {

                var urls = Array.from(getUrls(r.body));

                var destinationUrl;

                for (let x = 0; x < urls.length; x++) {
                    const host = urls[x].toString();
                    if (host.includes("vidstreaming.io") || host.includes("gogo-stream.com") || host.includes("gogo-play.net"))
                        destinationUrl = urls[x];
                }

                got(destinationUrl).then(response => {

                    var destUrls = Array.from(getUrls(response.body));
                    var downPage;

                    for (let x = 0; x < destUrls.length; x++) {
                        if (destUrls[x].toString().includes("googleapis")) {
                            const videoId = makeid(5);
                            io.addKey(videoId, destUrls[x]);
                            res.send(videoId);
                            return;
                        } else if (destUrls[x].toString().includes("/download?")) {
                            downPage = destUrls[x];
                        }
                    }

                    got(downPage).then(ree => {

                        const downloaderHub = new JSDOM(ree.body);
                        const available = downloaderHub.window.document.getElementsByTagName('a');

                        for (let z = 0; z < available.length; z++) {
                            if (available[z].text.includes('1080')) {
                                const videoId = makeid(5);
                                io.addKey(videoId, available[z].getAttribute('href'));
                                responseCode = videoId;
                                res.send(videoId);
                                return;
                            }

                        }

                        for (let z = 0; z < available.length; z++) {
                            if (available[z].text.includes('720')) {
                                const videoId = makeid(5);
                                io.addKey(videoId, available[z].getAttribute('href'));
                                responseCode = videoId;
                                res.send(videoId);
                                return;
                            }

                        }

                        for (let z = 0; z < available.length; z++) {
                            if (available[z].text.includes('480')) {
                                const videoId = makeid(5);
                                io.addKey(videoId, available[z].getAttribute('href'));
                                responseCode = videoId;
                                res.send(videoId);
                                return;
                            }

                        }

                        for (let z = 0; z < available.length; z++) {
                            if (available[z].text.includes('360')) {
                                const videoId = makeid(5);
                                io.addKey(videoId, available[z].getAttribute('href'));
                                responseCode = videoId;
                                res.send(videoId);
                                return;
                            }

                        }


                        for (let z = 0; z < available.length; z++) {
                            if (available[z].text.includes('144')) {
                                const videoId = makeid(5);
                                io.addKey(videoId, available[z].getAttribute('href'));
                                responseCode = videoId;
                                res.send(videoId);
                                return;
                            }

                        }


                    })

                })

            })
        })
    }).catch(err => {
        res.send('4014');
        return err;
    });
}

function newest(res) {
    const baseUrl = 'https://animekisa.tv';
    got(baseUrl).then(response => {

        const dom = new JSDOM(response.body);
        const current = new JSDOM(dom.window.document.getElementsByClassName('listAnimes').item(0).innerHTML);

        var r = new Array();

        for (let i = 0; i < current.window.document.getElementsByClassName('an').length; i++) {
            const href = current.window.document.getElementsByClassName('an').item(i).getAttribute('href');
            if (!r.toString().includes(href) && !href.endsWith('/'))
                r.push(baseUrl + href);
        }

        res.send(r);
    })
}

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}