import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import iconv from 'iconv-lite';
import log4js from 'log4js';

import DateUtil from '../util/DateUtil';
import DebitRepository from "../repository/DebitRepository";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '/app/temp/sbicsv/'); // アップロードされたファイルの保存先
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + crypto.randomUUID() + path.extname(file.originalname)); // ファイル名をユニークにする
    }
});
const upload = multer({ storage: storage });

var router: Router = express.Router();
// log4jsの設定
log4js.configure('./../log4js_settings.json');
const logger = log4js.getLogger("server");

router.post('/', upload.single('file'), async function (req, res) {
    try {
        if (req.file == undefined) {
            throw new Error('ファイルがありません。');
        }

        const filepath = req.file.path;
        const data = fs.readFileSync(filepath);
        const utf8Data = iconv.decode(data, 'Shift_JIS');
        const results = [];
        const records = parse(utf8Data, { quote: '"' });
        let isFirstRow = true;

        if (records.length > 1) {
            const date = new Date(records[1][1]);
            const targetDateFrom = DateUtil.getFirstDate(date, 0);
            const targetDateTo = DateUtil.getFirstDate(date, 1);
            logger.debug(`deleted.`);
            await new DebitRepository().deleteByDate(targetDateFrom, targetDateTo);
        }

        for (const record of records) {
            if (isFirstRow) {
                isFirstRow = false;
                continue;
            }

            const date = new Date(record[1]);
            const content = String(record[2]);
            const debitApprovalNo = parseInt(record[3]);
            const amount = parseInt(String(record[5]).replaceAll(",", ""));
            const csvRowNo = records.indexOf(record);

            results.push({
                date: date,
                content: content,
                debitApprovalNo: debitApprovalNo,
                amount: amount,
                csvRowNo: csvRowNo
            });
        }
        logger.debug(results);
        await new DebitRepository().insertMany(results);
        logger.debug(`inserted.`)

        fs.unlinkSync(filepath);

        res.status(200).json(({ message: "CSV アップロード成功", file: req.file.filename }));

    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;
