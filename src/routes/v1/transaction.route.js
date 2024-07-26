const { Router } = require("express");
const TransactionController = require("../../controllers/v1/transaction.controller");
const router = Router();

// GET all Transactions
router.get("/", TransactionController.getAllTransaction);

// GET Transactions by Id
router.get("/:id", TransactionController.getTransactionById);

// POST Transactions
router.post("/", TransactionController.createTransaction);

// DELETE Transactions by Id
router.delete("/:id", TransactionController.deleteTransactionById);

// UPDATE Transactions by Id
router.put("/:id", TransactionController.updateTransactionById);

module.exports = router;
