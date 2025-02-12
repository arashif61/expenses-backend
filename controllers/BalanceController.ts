import express, { Router } from 'express'
import AccountRepository from "../repository/AccountRepository";

var router: Router = express.Router();

router.get('/', async function (req, res) {
  const account = await new AccountRepository().selectLatestAccount();
  if (account == null) {
    res.status(500).json({ message: "残高情報がありません。" });
  } else {
    res.send({ balance: Number(account.balance) });
  }
});

export default router;
