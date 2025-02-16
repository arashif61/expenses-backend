import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import iconv from 'iconv-lite';
import DateUtil from '../util/DateUtil';
import crypto from 'crypto';
import log4js from 'log4js';

import AccountRepository from "../repository/AccountRepository";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '/app/temp/sbicsv/'); // アップロードされたファイルの保存先
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + crypto.randomUUID() + path.extname(file.originalname)); // ファイル名をユニークにする
    }
});
const upload = multer({ storage: storage });
// log4jsの設定
log4js.configure('log4js_setting.json');
const logger = log4js.getLogger("server");

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

        if (records.length > 1) {
            const date = new Date(records[1][1]);
            const targetDateFrom = DateUtil.getFirstDate(date, 0);
            const targetDateTo = DateUtil.getFirstDate(date, 1);
            await new AccountRepository().deleteByDate(targetDateFrom, targetDateTo);
            logger.debug(`deleted.`);
        }

        for (const record of records) {
            if (isFirstRow) {
                isFirstRow = false;
                continue;
            }
            
            const date = new Date(record[0]);
            const content = String(record[1]);
            
            let debitApprovalNo = null;
            if (content.startsWith("デビット　")) {
                const debitApprovalNoFullWidth = content.replace("デビット　", "");
                debitApprovalNo = parseInt(debitApprovalNoFullWidth.normalize("NFKC"));
            }
            
            let withdrawAmount = null;
            if (record[2] != "") {
                withdrawAmount = parseInt(String(record[2]).replaceAll(",", ""));
            }
            
            let depositAmount = null;
            if (record[3] != "") {
                depositAmount = parseInt(String(record[3]).replaceAll(",", ""));
            }
            
            const balance = parseInt(String(record[4]).replaceAll(",", ""));
            const csvRowNo = records.indexOf(record);
            
            results.push({
                date: date,
                content: content,
                debitApprovalNo: debitApprovalNo,
                withdrawAmount: withdrawAmount,
                depositAmount: depositAmount,
                balance: balance,
                csvRowNo: csvRowNo
            });
        }

        logger.debug(results);
        await new AccountRepository().insertMany(results);
        logger.debug(`inserted.`);

        fs.unlinkSync(filepath);

        res.status(200).json(({ message: "CSV アップロード成功", file: req.file.filename }));

    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;
