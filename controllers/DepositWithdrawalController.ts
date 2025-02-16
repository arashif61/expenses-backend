import express, { Router } from 'express';
import log4js from 'log4js';

import DepositWithdrawalRepository from "../repository/DepositWithdrawalRepository";
import DepositWithdrawalCategoryRepository from "../repository/DepositWithdrawalCategoryRepository";
import AccountRepository from '../repository/AccountRepository';
import DebitRepository from '../repository/DebitRepository';
import DateUtil from '../util/DateUtil';

var router: Router = express.Router();
// log4jsの設定
log4js.configure('/app/log4js-settings.json');
const logger = log4js.getLogger("server");

router.get('/', async function (req, res) {
    const targetDate = typeof req.query.date == "string" ? new Date(req.query.date + "-01") : new Date();
    const targetDateFrom = DateUtil.getFirstDate(targetDate, 0);
    const targetDateTo = DateUtil.getFirstDate(targetDate, 1);
    const depositWithdrawalList = await new DepositWithdrawalRepository().selectByDate(targetDateFrom, targetDateTo);
    const depositWithdrawalListTemp: { date: Date, content: string, amount: bigint, categoryId: bigint }[] = [];
    depositWithdrawalList.forEach((item) => {
        const dict: { id: bigint, date: Date, content: string, amount: bigint, categoryId: bigint } = {
            id: BigInt(0), date: new Date(), content: "", amount: BigInt(0), categoryId: BigInt(0)
        };
        dict["id"] = item.id;
        dict["date"] = item.date;
        dict["content"] = item.content;
        dict["amount"] = item.amount;
        depositWithdrawalListTemp.push(dict);
    });
    const depositWithdrawalCategoryList = await new DepositWithdrawalCategoryRepository().selectAll(targetDateFrom, targetDateTo);
    for (let depositWithdrawal of depositWithdrawalListTemp) {
        const list = depositWithdrawalCategoryList.filter((item) => {
            if (depositWithdrawal.date.getTime() == item.depositWithdrawalDate.getTime()
                && depositWithdrawal.content == item.depositWithdrawalContent
                && depositWithdrawal.amount == item.depositWithdrawalAmount) {
                return item;
            }
        });
        if (list.length > 0) {
            depositWithdrawal["categoryId"] = list[0].categoryId;
        }
    }
    const bigintConvertedList = JSON.stringify(depositWithdrawalListTemp, (key, value) => {
        return typeof value === 'bigint' ? Number(value) : value;
    });
    const resultJsonList = JSON.parse(bigintConvertedList);
    res.send({ list: resultJsonList });
});

// 洗替処理
router.put('/replace', async function (req, res) {
    const targetDate = new Date();
    const targetDateFrom = DateUtil.getFirstDate(targetDate, -1);
    const targetDateTo = DateUtil.getFirstDate(targetDate, 1);
    const accountList = await new AccountRepository().selectByDate(targetDateFrom, targetDateTo);
    const targetList = [];
    for (const account of accountList) {
        let date = account.date;
        let content = account.content;
        let amount = null;
        if (account.withdrawAmount != null) {
            amount = -account.withdrawAmount;
        } else {
            amount = account.depositAmount;
        }
        const accountId = account.id;
        let debitId = null;
        const descNo = account.csvRowNo;
        if (account.debitApprovalNo != null) {
            const debit = await new DebitRepository().selectByDebitApprovalNo(account.debitApprovalNo)
            if (debit != null) {
                date = debit.date;
                content = debit.content;
                amount = -debit.amount;
                debitId = debit.id;
            }
        }
        targetList.push({ date: date, content: content, amount: amount, accountId: accountId, debitId: debitId, descNo: descNo });
    }

    await new DepositWithdrawalRepository().insertMany(targetList);

    res.status(200).json({ message: "洗替成功" });
});

export default router;
