const transactionModel = require("../../models/v1/transaction.model");

class TransactionController {
  async getAllTransaction(req, res) {
    try {
      const result = await transactionModel.getAllTransaction();

      res.status(200).json({
        status: "success",
        message: "Transaction found",
        data: { total: result.count, transactions: result.results },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async getTransactionById(req, res) {
    try {
      const transaction_id = req.params.id;
      const result = await transactionModel.getTransactionById(transaction_id);

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Transaction Found",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async createTransaction(req, res) {
    try {
      const { source_account_id, destination_account_id, amount, notes } =
        req.body;

      const result = await transactionModel.createTransaction(req.body);

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(201).json({
        status: "success",
        message: "Transaction created",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async deleteTransactionById(req, res) {
    try {
      const transaction_id = req.params.id;
      const result = await transactionModel.deleteTransactionById(
        transaction_id
      );

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Transaction deleted",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async updateTransactionById(req, res) {
    try {
      const transaction_id = req.params.id;
      const result = await transactionModel.updateTransactionById(
        transaction_id,
        req.body
      );

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Transaction updated",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
}

module.exports = new TransactionController();
