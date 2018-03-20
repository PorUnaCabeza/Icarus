/**
 * Created by cabeza on 2018/2/11.
 */
const schedule = require('node-schedule');
const mysqlUtil = require('./db/mysqlUtil');
const seeker = require('./seeker/seeker.js');
const sqls = require('./db/sql');
const express = require('express');

var expressApp = express();
expressApp.get('/price/:symbol/:time', async function (req, res) {
  let re = await mysqlUtil.query(sqls.queryPriceSql, [req.params.symbol, req.params.time]);
  res.json(re[0]);
});
expressApp.listen(9065, () => {
  console.log(`express listening at port 9065`);
});

schedule.scheduleJob('42 * * * *', () => getDataFromOkCoin());

async function getDataFromOkCoin() {
  let step = 30;
  mysqlUtil.init();
  let r = await seeker.getKeyLineData('https://www.okcoin.com/v2/spot/markets/kline?since=0&symbol=btc_usd&marketFrom=btc_usd&type=1min&coinVol=0');
  let result = r.map(v => ['btc_usd', v.createdDate, v.high, v.low, v.open, v.close, v.volume]);
  for (let i = 0; i < r.length; i += step) {
    try {
      let r = await mysqlUtil.batchInsert('INSERT INTO coin_data (SYMBOL, UNIX_TIME, HIGH_PRICE, LOW_PRICE, OPEN_PRICE, CLOSE_PRICE, VOLUME)' +
          'VALUES ? ' +
          ' ON DUPLICATE KEY UPDATE UPDATE_TIME = now()', result.splice(0, step));
      console.log(r.message);
    } catch (err) {
      console.log(err);
    }
  }
  mysqlUtil.close();
}
