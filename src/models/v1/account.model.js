const prisma = require("../../../config/prisma");

class AccountModel {
  async getAllAccount() {
    try {
      const results = await prisma.bank_Accounts.findMany({
        include: {
          sentTransactions: true,
          receivedTransactions: true,
        },
      });
      const count = await prisma.bank_Accounts.count();

      return { count, results };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async getAccountById(account_id) {
    try {
      const accountExist = await prisma.bank_Accounts.findUnique({
        where: {
          id: account_id,
        },
      });

      if (!accountExist) {
        throw new Error("Account not found");
      }

      const account = await prisma.bank_Accounts.findUnique({
        where: {
          id: account_id,
        },
        include: {
          sentTransactions: true,
          receivedTransactions: true,
        },
      });
      return { status: "success", data: account };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async createAccount(user_id, bank_name, bank_account_number, balance) {
    try {
      if (!user_id || !bank_name || !bank_account_number || !balance) {
        throw new Error("Data must be included");
      }

      const acc_numbExist = await prisma.bank_Accounts.findFirst({
        where: {
          bank_account_number: bank_account_number
        },
      });

      const userExist = await prisma.users.findUnique({
        where: { id: user_id },
      });

      if (!userExist) {
        throw new Error(`User with ID ${user_id} not found`);
      }
      if (acc_numbExist) {
        throw new Error("Account Number already exists");
      }

      const result = await prisma.bank_Accounts.create({
        data: {
          user_id,
          bank_name,
          bank_account_number,
          balance,
        },
      });

      return { status: "success", data: result };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async deleteAccountById(account_id) {
    try {
      const accountExist = await prisma.bank_Accounts.findUnique({
        where: {
          id: account_id,
        },
      });

      if (!accountExist) {
        throw new Error("Account not found");
      }

      const result = await prisma.bank_Accounts.delete({
        where: {
          id: account_id,
        },
      });

      return { status: "success", data: result };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async updateAccountById(account_id, data) {
    try {
      const accountExist = await prisma.bank_Accounts.findUnique({
        where: {
          id: account_id,
        },
      });
      const acc_numbExist = await prisma.bank_Accounts.findFirst({
        where: {
          bank_account_number: data.bank_account_number,
          id: {
            not: account_id,
          },
        },
      });

      if (!accountExist) {
        throw new Error("Account not found");
      }

      if (acc_numbExist) {
        throw new Error("Account Number already exist");
      }

      const result = await prisma.bank_Accounts.update({
        where: {
          id: account_id,
        },
        data: data,
      });
      return { status: "success", data: result };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }
}

module.exports = new AccountModel();
