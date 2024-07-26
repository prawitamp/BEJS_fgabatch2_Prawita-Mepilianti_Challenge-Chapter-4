const AccountModel = require("../../models/v1/account.model");

class AccountController {
  async getAllAccount(req, res) {
    try {
      const result = await AccountModel.getAllAccount();

      res.status(200).json({
        status: "success",
        message: "Account found",
        data: { total: result.count, accounts: result.results },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAccountById(req, res) {
    try {
      const account_id = req.params.id;
      const result = await AccountModel.getAccountById(account_id);

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Account Found",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async createAccount(req, res) {
    try {
      const {
        user_id, bank_name, bank_account_number, balance
      } = req.body;

      const result = await AccountModel.createAccount(
        user_id, bank_name, bank_account_number, balance
      );

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(201).json({
        status: "success",
        message: "Account created",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async deleteAccountById(req, res) {
    try {
      const account_id = req.params.id;
      const result = await AccountModel.deleteAccountById(account_id);

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Account deleted",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async updateAccountById(req, res) {
    try {
      const account_id = req.params.id;
      const result = await AccountModel.updateAccountById(
        account_id,
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
        message: "Account updated",
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

module.exports = new AccountController();
