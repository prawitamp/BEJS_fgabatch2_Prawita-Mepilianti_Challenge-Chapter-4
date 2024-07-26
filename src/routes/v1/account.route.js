const { Router } = require("express");
const AccountController = require("../../controllers/v1/account.controller");
const router = Router();

// GET all Accounts
router.get("/", AccountController.getAllAccount);

// GET Accounts by id
router.get("/:id", AccountController.getAccountById);

// POST Accounts
router.post("/", AccountController.createAccount);

// DELETE Accounts by id
router.delete("/:id", AccountController.deleteAccountById);

// UPDATE Users by id
router.put("/:id", AccountController.updateAccountById);

module.exports = router;
