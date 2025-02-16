import express from 'express';

const app: express.Express = express();
const port = 3000;

import depositWithdrawalController from './controllers/DepositWithdrawalController';
import yearMonthController from "./controllers/YearMonthController";
import depositWithdrawalCategoryController from './controllers/DepositWithdrawalCategoryController';
import categoryController from './controllers/CategoryController';
import accountCsvFileController from './controllers/AccountCsvFileController';
import debitCsvFileController from './controllers/DebitCsvFileController';
import balanceController from './controllers/BalanceController';
import summaryController from './controllers/SummaryController';

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
  console.log(`Expenses listening on port ${port}`)
});
