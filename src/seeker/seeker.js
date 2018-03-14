/**
 * Created by cabeza on 2018/2/10.
 */
const request = require('superagent');
require('superagent-proxy')(request);
const userAgentList = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
];
const api = function (url) {
  return new Promise((resolve, reject) => {
    request.get(url)
        .set('accept','text/plain, */*; q=0.01')
        .set('accept-encoding','gzip, deflate, br')
        .set('accept-language','zh-CN,zh;q=0.9,en;q=0.8')
        .set('cache-control','no-cache')
        .set('pragma','no-cache')
        .set('referer', 'https://www.okex.com/kline.do')
        .end(function (err, res) {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          let result = res;
          if (res.type.toLowerCase() === 'application/json')
            result = JSON.parse(res.text);
          else if (res.type.toLowerCase() === 'text/html' || res.type.toLowerCase() === 'text/plain')
            result = res.text;
          else if (res.type.toLowerCase().indexOf('image') > -1)
            result = res.body;
          resolve(result);
        });
  });
};
const getKeyLineData = async function (url) {
  let text = await api(url);
  let dyadicArray = JSON.parse(text).data;
  return dyadicArray;
};
module.exports = {
  api,
  getKeyLineData
};