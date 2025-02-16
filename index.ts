import express from 'express';
import log4js from 'log4js';

import depositWithdrawalController from './controllers/DepositWithdrawalController';
import yearMonthController from "./controllers/YearMonthController";
import depositWithdrawalCategoryController from './controllers/DepositWithdrawalCategoryController';
import categoryController from './controllers/CategoryController';
import accountCsvFileController from './controllers/AccountCsvFileController';
import debitCsvFileController from './controllers/DebitCsvFileController';
import balanceController from './controllers/BalanceController';
import summaryController from './controllers/SummaryController';

const app: express.Express = express();
const port = 3000;

// log4jsの設定
log4js.configure('./log4js_settings.json');
const logger = log4js.getLogger("server");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/depositWithdrawal", depositWithdrawalController);
app.use("/api/v1/yearMonth", yearMonthController);
app.use("/api/v1/depositWithdrawalCategory", depositWithdrawalCategoryController);
app.use("/api/v1/category", categoryController);
app.use("/api/v1/accountCsvFile", accountCsvFileController);
app.use("/api/v1/debitCsvFile", debitCsvFileController);
app.use("/api/v1/balance", balanceController);
app.use("/api/v1/summary", summaryController);

app.listen(port, () => {
  logger.debug(`Expenses listening on port ${port}`);
});
