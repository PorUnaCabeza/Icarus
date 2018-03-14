/**
 * Created by cabeza on 2018/2/11.
 */
const mysqlUtil = require('./db/mysqlUtil');
const seeker = require('./seeker/seeker.js');

test();

async function test() {
  mysqlUtil.init();
  let r = await seeker.getKeyLineData('https://www.okcoin.com/v2/spot/markets/kline?since=0&symbol=btc_usd&marketFrom=btc_usd&type=15min&limit=1000&coinVol=0');
  let result = r.map(v => ['btc_usd', v.createdDate, v.high, v.low, v.open, v.close, v.volume]);
  for (let i = 0; i < r.length; i+=10) {
    try {
      await mysqlUtil.batchInsert('INSERT INTO coin_data (SYMBOL, UNIX_TIME, HIGH_PRICE, LOW_PRICE, OPEN_PRICE, CLOSE_PRICE, VOLUME)' +
          'VALUES ? ' +
          ' ON DUPLICATE KEY UPDATE UPDATE_TIME = now()', result.splice(0, 10));
    } catch (err) {
      console.log(err);
    }
  }
  mysqlUtil.close();
}
