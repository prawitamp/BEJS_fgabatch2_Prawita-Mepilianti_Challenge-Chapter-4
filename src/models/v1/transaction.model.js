const { TransactionType } = require("@prisma/client");
const prisma = require("../../../config/prisma");

class TransactionModel {
  async getAllTransaction() {
    try {
      const results = await prisma.transactions.findMany({});

      const count = await prisma.transactions.count();
      return { count, results };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async getTransactionById(transaction_id) {
    try {
      const transactionExist = await prisma.transactions.findUnique({
        where: {
          id: transaction_id,
        },
      });

      if (!transactionExist) {
        throw new Error("Transaction not found");
      }

      const result = await prisma.transactions.findUnique({
        where: {
          id: transaction_id,
        },
      });

      return result;
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async createTransaction(data) {
    try {
      const sourceAccountExist = await prisma.bank_Accounts.findUnique({
        where: { id: data.source_account_id },
      });

      const destinationAccountExist = await prisma.bank_Accounts.findUnique({
        where: { id: data.destination_account_id },
      });

      if (!data) {
        throw new Error("Transaction is required");
      }
      if ((data.source_account_id && data.destination_account_id) === "") {
        throw new Error("Input account id");
      }
      if (!sourceAccountExist) {
        throw new Error(`User with ID ${data.account_id} not found`);
      }
      if (!destinationAccountExist) {
        throw new Error(`User with ID ${data.account_id} not found`);
      }
      if (sourceAccountExist.balance < data.amount) {
        throw new Error(`Insufficient balance`);
      }

      const transaction = await prisma.transactions.create({
        data: {
          source_account_id: data.source_account_id,
          destination_account_id: data.destination_account_id,
          amount: data.amount,
          notes: data.notes,
        },
      });

      await prisma.bank_Accounts.update({
        where: {
          id: data.source_account_id,
        },
        data: {
          balance: sourceAccountExist.balance - data.amount,
        },
      });

      await prisma.bank_Accounts.update({
        where: {
          id: data.destination_account_id,
        },
        data: {
          balance: destinationAccountExist.balance + data.amount,
        },
      });

      return { status: "success", data: transaction };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async deleteTransactionById(transaction_id) {
    try {
      const transactionExist = await prisma.transactions.findUnique({
        where: {
          id: transaction_id,
        },
      });

      if (!transactionExist) {
        throw new Error("Transaction not found");
      }

      const sourceAccount = await prisma.bank_Accounts.findUnique({
        where: { id: transactionExist.source_account_id },
      });

      const destinationAccount = await prisma.bank_Accounts.findUnique({
        where: { id: transactionExist.destination_account_id },
      });

      await prisma.bank_Accounts.update({
        where: {
          id: transactionExist.source_account_id,
        },
        data: {
          balance: sourceAccount.balance + transactionExist.amount,
        },
      });

      await prisma.bank_Accounts.update({
        where: {
          id: transactionExist.destination_account_id,
        },
        data: {
          balance: destinationAccount.balance - transactionExist.amount,
        },
      });

      const result = await prisma.transactions.delete({
        where: {
          id: transaction_id,
        },
      });

      return { status: "success", data: result };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async updateTransactionById(transaction_id, item) {
    try {
      const transactionExist = await prisma.transactions.findUnique({
        where: {
          id: transaction_id,
        },
      });

      if (!transactionExist) {
        throw new Error("Transaction not found");
      }

      if (item.notes === undefined || Object.keys(item).length > 1) {
        throw new Error("Only notes can be updated");
      }

      const result = await prisma.transactions.update({
        where: {
          id: transaction_id,
        },
        data: {
          notes: item.notes,
        },
      });

      return { status: "success", data: result };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }
}

module.exports = new TransactionModel();
