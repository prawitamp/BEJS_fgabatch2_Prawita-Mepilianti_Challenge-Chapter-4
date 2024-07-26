const { Router } = require("express");
const UserController = require("../../controllers/v1/user.controller");
const router = Router();

// GET all Users
router.get("/", UserController.getAllUser);

// GET Users by id
router.get("/:id", UserController.getUserById);

// POST Users
router.post("/", UserController.createUser);

// DELETE Users by id
router.delete("/:id", UserController.deleteUserById);

// UPDATE Users by id
router.put("/:id", UserController.updateUserById);

module.exports = router;
