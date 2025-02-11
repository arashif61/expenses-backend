import express, { Router } from 'express'
import multer from 'multer';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import iconv from 'iconv-lite';
import DateUtil from '../util/DateUtil';

import AccountRepository from "../repository/AccountRepository";

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
            
            const date = new Date(record[0]);

            if (isSecondRow) {
                const targetDateFrom = DateUtil.firstDateThisMonth(date);
                const targetDateTo = DateUtil.firstDateNextMonth(date);
                new AccountRepository().deleteByDate(targetDateFrom, targetDateTo);
                isSecondRow = false;
            }

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

        await new AccountRepository().insertMany(results);

        fs.unlinkSync(filepath);

        res.status(200).json(({ message: "CSV アップロード成功", file: req.file.filename }));

    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;
