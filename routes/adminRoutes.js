const express = require("express");
const authToken = require("../middleware/authToken");
const syncTransactionsToInvestment = require("../middleware/updatingTransctions");
const userDetailsController = require("../controllers/userDetails");
const verifyIdController = require("../controllers/verifyUserKyc");
const getAllUsersWithInvestments = require("../controllers/fetchUsersController");
const getAllTransactions = require("../controllers/adminAllTransactions");
const adminAuthToken = require("../middleware/adminAuthToken");
const adminVerifyTransaction = require("../controllers/adminVerifyTransaction");
const adminFetchUsers = require("../controllers/adminFetchUsers");
const adminChangeRole = require("../controllers/adminChangeRole");

const router = express.Router(); 


router.get("/all-users",authToken, getAllUsersWithInvestments);

router.post("/verify-kyc", authToken, verifyIdController);
router.post("/all-transactions", adminAuthToken, getAllTransactions);
router.post("/verify-transaction", adminAuthToken, adminVerifyTransaction);
router.post("/fetch-users", adminAuthToken, adminFetchUsers);
router.post("/change-role", adminAuthToken, adminChangeRole);




module.exports = router;