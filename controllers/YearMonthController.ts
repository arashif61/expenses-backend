import express, { Router } from 'express';
import log4js from 'log4js';

import DepositWithdrawalRepository from "../repository/DepositWithdrawalRepository";

var router: Router = express.Router();
// log4jsの設定
log4js.configure('log4js_setting.json');
const logger = log4js.getLogger("server");

router.get('/', async function (req, res) {
  // TODO 最古の年月から現在の年月までの1ヶ月ごとリストにする
  const dateList = await new DepositWithdrawalRepository().selectYearMonth();
  const yearMonthList: { id: string; label: string }[] = [];
  for (let date of dateList) {
    const target = new Date(date.date.setDate(1));
    const targetString = `${target.getFullYear()}-${('00' + (target.getMonth() + 1)).slice(-2)}`;
    const duplicateList = yearMonthList.filter((item) => { return item.id === targetString })
    if (duplicateList.length == 0) {
      yearMonthList.push({ id: targetString, label: `${target.getFullYear()}年${(target.getMonth() + 1)}月` });
    }
  }

  res.send({ yearMonthList: yearMonthList });
});

export default router;
