import express, { Router } from 'express';
import log4js from 'log4js';

import CategoryRepository from "../repository/CategoryRepository";
import DepositWithdrawalCategoryRepository from "../repository/DepositWithdrawalCategoryRepository";

var router: Router = express.Router();
// log4jsの設定
log4js.configure('log4js_setting.json');
const logger = log4js.getLogger("server");

router.get('/', async function (req, res) {
    const list = await new CategoryRepository().selectAll();
    const bigintConvertedList = JSON.stringify(list, (key, value) => {
        return typeof value === 'bigint' ? Number(value) : value;
    });
    const resultJsonList = JSON.parse(bigintConvertedList);
    res.send({ list: resultJsonList });
});

router.get('/:id', async function (req, res) {
    const id = Number(req.params.id);
    const list = await new CategoryRepository().select(id);
    const bigintConvertedList = JSON.stringify(list, (key, value) => {
        return typeof value === 'bigint' ? Number(value) : value;
    });
    const resultJsonList = JSON.parse(bigintConvertedList);
    res.send({ category: resultJsonList[0] });
});

router.post('/', async function (req, res) {
    const body = req.body;
    await new CategoryRepository().insert(body.name, body.color, body.icon);
    res.status(200).json({ message: "成功" });
});

router.put('/:id', async function (req, res) {
    const id = Number(req.params.id);
    const body = req.body;
    await new CategoryRepository().update(id, body.name, body.color, body.icon);
    res.status(200).json({ message: "成功" });
});

router.delete('/:id', async function (req, res) {
    const id = Number(req.params.id);
    // TODO 削除するカテゴリに紐づく入出金のカテゴリ変更
    await new CategoryRepository().delete(id);
    res.status(200).json({ message: "成功" });
});

export default router;
