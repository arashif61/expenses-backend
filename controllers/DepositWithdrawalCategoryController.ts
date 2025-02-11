import express, { Router } from 'express'
import DepositWithdrawalCategoryRepository from "../repository/DepositWithdrawalCategoryRepository";
import DepositWithdrawalRepository from "../repository/DepositWithdrawalRepository";
import CategoryRepository from '../repository/CategoryRepository';
import DateUtil from '../util/DateUtil';

var router: Router = express.Router();

router.put('/', async function (req, res) {
    const body = req.body;
    const list = await new DepositWithdrawalCategoryRepository().select(body.date, body.content, body.amount);
    if (list.length > 0) {
        await new DepositWithdrawalCategoryRepository().update(list[0].id, body.categoryId);
    } else {
        await new DepositWithdrawalCategoryRepository().insert(body.date, body.content, body.amount, body.categoryId);
    }
});

// 洗替処理
router.put('/replace', async function (req, res) {
    const initCategory = await new CategoryRepository().selectInitCategory();
    if (initCategory == null) {
        res.status(500).json({ message: "初期カテゴリが見つかりません" });
        return;
    }

    const targetDate = new Date();
    const targetDateFrom = DateUtil.firstDatePrevMonth(targetDate);
    const targetDateTo = DateUtil.firstDateNextMonth(targetDate);
    const depositWithdrawalList = await new DepositWithdrawalRepository().selectByDate(targetDateFrom, targetDateTo);

    for (let depositWithdrawal of depositWithdrawalList) {
        const list = await new DepositWithdrawalCategoryRepository().select(depositWithdrawal.date, depositWithdrawal.content, depositWithdrawal.amount);
        // カテゴリ未登録
        if (list.length == 0) {
            const similarly = await new DepositWithdrawalCategoryRepository().selectByContent(depositWithdrawal.content);
            // 類似の入出金がある場合、同様のカテゴリで登録
            if (similarly != null) {
                await new DepositWithdrawalCategoryRepository().insert(depositWithdrawal.date, depositWithdrawal.content, depositWithdrawal.amount, similarly.categoryId);
            } else {
                // 初期カテゴリで登録
                await new DepositWithdrawalCategoryRepository().insert(depositWithdrawal.date, depositWithdrawal.content, depositWithdrawal.amount, initCategory.id);
            }
        }
    }

    res.status(200).json({ message: "洗替成功" });
});

export default router;
