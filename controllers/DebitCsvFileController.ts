import express, { Router } from 'express'
import multer from 'multer';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import iconv from 'iconv-lite';
import DateUtil from '../util/DateUtil';

import DebitRepository from "../repository/DebitRepository";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/app/temp/sbicsv/'); // アップロードされたファイルの保存先
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ファイル名をユニークにする
    }
});
const upload = multer({ storage: storage });

var router: Router = express.Router();

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
        let isSecondRow = false;

        for (const record of records) {
            if (isFirstRow) {
                isFirstRow = false;
                isSecondRow = true;
                continue;
            }

            const date = new Date(record[1]);

            if (isSecondRow) {
                const targetDateFrom = DateUtil.firstDateThisMonth(date);
                const targetDateTo = DateUtil.firstDateNextMonth(date);
                new DebitRepository().deleteByDate(targetDateFrom, targetDateTo);
                isSecondRow = false;
            }

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

        await new DebitRepository().insertMany(results);

        fs.unlinkSync(filepath);

        res.status(200).json(({ message: "CSV アップロード成功", file: req.file.filename }));

    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;
