import express, { Router } from 'express';
import log4js from 'log4js';

import AccountRepository from "../repository/AccountRepository";

var router: Router = express.Router();
// log4jsの設定
log4js.configure('/app/log4js-settings.json');
const logger = log4js.getLogger("server");

router.get('/', async function (req, res) {
  const account = await new AccountRepository().selectLatestAccount();
  if (account == null) {
    res.status(500).json({ message: "残高情報がありません。" });
  } else {
    res.send({ balance: Number(account.balance) });
  }
});

export default router;
