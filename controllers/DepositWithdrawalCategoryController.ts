import express, { Router } from 'express';
import log4js from 'log4js';

import DepositWithdrawalCategoryRepository from "../repository/DepositWithdrawalCategoryRepository";
import DepositWithdrawalRepository from "../repository/DepositWithdrawalRepository";
import CategoryRepository from '../repository/CategoryRepository';
import DateUtil from '../util/DateUtil';

var router: Router = express.Router();
// log4jsの設定
log4js.configure('./../log4js_settings.json');
const logger = log4js.getLogger("server");

router.put('/', async function (req, res) {
    const body = req.body;
    const list = await new DepositWithdrawalCategoryRepository().select(body.date, body.content, body.amount);
    if (list.length > 0) {
        await new DepositWithdrawalCategoryRepository().update(list[0].id, body.categoryId);
    } else {
        await new DepositWithdrawalCategoryRepository().insert(body.date, body.content, body.amount, body.categoryId);
    }
    res.status(200).json({ message: "成功" });
});

// 洗替処理
router.put('/replace', async function (req, res) {
    const initCategory = await new CategoryRepository().selectInitCategory();
    if (initCategory == null) {
        res.status(500).json({ message: "初期カテゴリが見つかりません" });
        return;
    }

    const targetDate = new Date();
    const targetDateFrom = DateUtil.getFirstDate(targetDate, -1);
    const targetDateTo = DateUtil.getFirstDate(targetDate, 1);
    const depositWithdrawalList = await new DepositWithdrawalRepository().selectByDate(targetDateFrom, targetDateTo);

    const results = [];
    for (let depositWithdrawal of depositWithdrawalList) {
        const list = await new DepositWithdrawalCategoryRepository().select(depositWithdrawal.date, depositWithdrawal.content, depositWithdrawal.amount);
        // カテゴリ未登録
        if (list.length == 0) {
            const record = {
                depositWithdrawalDate: depositWithdrawal.date,
                depositWithdrawalContent: depositWithdrawal.content,
                depositWithdrawalAmnount: depositWithdrawal.amount,
                categoryId: initCategory.id
            };
            const similarly = await new DepositWithdrawalCategoryRepository().selectByContent(depositWithdrawal.content);
            if (similarly != null) {
                // 類似の入出金がある場合、同様のカテゴリで登録
                record["categoryId"] = similarly.categoryId
            }
            results.push(record);
        }
    }
    await new DepositWithdrawalCategoryRepository().insertMany(results);
    res.status(200).json({ message: "洗替成功" });
});

export default router;
