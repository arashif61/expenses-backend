import express, { Router } from 'express';
import log4js from 'log4js';

import DepositWithdrawalRepository from "../repository/DepositWithdrawalRepository";
import DateUtil from '../util/DateUtil';

var router: Router = express.Router();
// log4jsの設定
log4js.configure('log4js_setting.json');
const logger = log4js.getLogger("server");

router.get('/', async function (req, res) {
  const targetDate = typeof req.query.date == "string" ? new Date(req.query.date + "-01") : new Date();
  const targetDateFrom = DateUtil.getFirstDate(targetDate, -6);
  const targetDateTo = DateUtil.getFirstDate(targetDate, 0);

  const depositWithdrawalList = await new DepositWithdrawalRepository().group(targetDateFrom, targetDateTo);
  logger.debug(depositWithdrawalList);

  if (depositWithdrawalList == null) {
    res.status(500).json({ message: "残高情報がありません。" });
  } else {
    const bigintConvertedList = JSON.stringify(depositWithdrawalList, (key, value) => {
      return typeof value === 'bigint' ? Number(value) : value;
    });
    const resultJsonList = JSON.parse(bigintConvertedList);
    res.send({ list: resultJsonList });
  }
});

export default router;
