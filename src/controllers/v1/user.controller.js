const UserModel = require("../../models/v1/user.model");

class UserController {
  async getAllUser(req, res) {
    try {
      const result = await UserModel.getAllUser();

      res.status(200).json({
        status: "success",
        message: "User found",
        data: { total: result.count, users: result.results },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user_id = req.params.id;
      const result = await UserModel.getUserById(user_id);

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "User Found",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;

      const result = await UserModel.createUser(req.body);
      if (!name || !email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Name, email, and password are required",
        });
      }

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(201).json({
        status: "success",
        message: "User created",
        data: { result },
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async deleteUserById(req, res) {
    try {
      const user_id = req.params.id;
      const result = await UserModel.deleteUserById(user_id);

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "User deleted",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async updateUserById(req, res) {
    try {
      const user_id = req.params.id;
      const result = await UserModel.updateUserById(user_id, req.body);

      if (result.status === "failed") {
        return res.status(400).json({
          status: "failed",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "User updated",
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

module.exports = new UserController();
