const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
  async getAllUser() {
    try {
      const results = await prisma.users.findMany({
        include: {
          accounts: true,
          profile: true,
        }
      });
      const count = await prisma.users.count();

      return { count, results };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async getUserById(user_id) {
    try {
      const userExist = await prisma.users.findUnique({
        where: {
          id: user_id,
        },
      });
      
      if (!userExist) {
        throw new Error("User not Found");
      }
      
      const result = await prisma.users.findUnique({
        where: {
          id: user_id,
        },
        include: {
          accounts: true,
          profile: true,
        }
      });
      return result;
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async createUser(data) {
    try {
      // const profile = await prisma.profiles
      const emailExist = await prisma.users.findFirst({
        where: {
          email: data.email,
        },
      });

      const identity_numberExist = await prisma.profiles.findFirst({
        where: {
          identity_number: data.profile.identity_number
        }
      })

      if (!data) {
        throw new Error("Data is required");
      }

      if (identity_numberExist) {
        throw new Error("Identity number already exists")
      }

      if (emailExist) {
        throw new Error("Email already exists");
      }

      const user = await prisma.users.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          profile: {
            create: {
              identity_type: data.profile.identity_type,
              identity_number: data.profile.identity_number,
              address: data.profile.address,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return { status: "success", data: user };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async deleteUserById(user_id) {
    try {
      const userExist = await prisma.users.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!userExist) {
        throw new Error("User not Found");
      }

      await prisma.profiles.deleteMany({
        where: {
          user_id: user_id,
        },
      });

      await prisma.bank_Accounts.deleteMany({
        where: {
          user_id: user_id,
        },
      });

      const result = await prisma.users.delete({
        where: {
          id: user_id,
        },
      });
      return { status: "success", data: result };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }

  async updateUserById(user_id, data) {
    try {
      if(!data) {
        throw new Error("Data is required")
      }
      const userExist = await prisma.users.findUnique({
        where: {
          id: user_id,
        },
      });
      const emailExist = await prisma.users.findFirst({
        where: {
          email: data.email,
          id: {
            not: user_id,
          },
        },
      });
      const identity_numberExist = await prisma.profiles.findFirst({
        where: {
          identity_number: data.profile.identity_number
        }
      })

      if (!userExist) {
        throw new Error("User not Found");
      }

      if (identity_numberExist) {
        throw new Error("Identity number already exists")
      }

      if (emailExist) {
        throw new Error("Email already exists");
      }

      const result = await prisma.users.update({
        where: {
          id: user_id,
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          profile: {
            update: {
              identity_type: data.profile.identity_type,
              identity_number: data.profile.identity_number,
              address: data.profile.address,
            },
          },
        },
        include: {
          profile: true,
        },
      });
      return { status: "success", data: result };
    } catch (error) {
      console.log(error.message);
      return { status: "failed", message: error.message };
    }
  }
}

module.exports = new UserModel();
