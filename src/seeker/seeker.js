/**
 * Created by cabeza on 2018/2/10.
 */
import request from 'superagent';
const userAgentList = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
];
const api = function ({url, success, error}) {
  request.get(url).set('User-Agent', userAgentList[parseInt(Math.random() * userAgentList.length)])
      .end(function (err, res) {
        if (err) {
          console.log(err);
          error && error(err);
          return;
        }
        let result = res;
        if (res.type.toLowerCase() === 'application/json')
          result = JSON.parse(res.text);
        else if (res.type.toLowerCase() === 'text/html')
          result = res.text;
        else if (res.type.toLowerCase().indexOf('image') > -1)
          result = res.body;
        success && success(result);
      });
};

export default {
  api
};