import express, { Router } from 'express'
import CategoryRepository from "../repository/CategoryRepository";

var router: Router = express.Router();

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
});

router.put('/:id', async function (req, res) {
    const id = Number(req.params.id);
    const body = req.body;
    await new CategoryRepository().update(id, body.name, body.color, body.icon);
});

export default router;
