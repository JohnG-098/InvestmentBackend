const express = require("express");

const router = express.Router();

const { allUsers, addUser, Invest } = require("../controllers/users");
const loginUser = require("../controllers/loginUser");
const authToken = require("../middleware/authToken");
const userDetailsController = require("../controllers/userDetails");
const sendVerification = require("../controllers/verifyEmail");
const verifyCode = require("../controllers/verifyCode");
const createInvestment = require("../controllers/investController");
const fetchInvestments = require("../controllers/fetchInvest");
const investMore = require("../controllers/investMore");
const investmentTransaction = require("../controllers/investTransactContro");
const getUserTransactions = require("../controllers/getUserTransactions");
const syncTransactionsToInvestment = require("../middleware/updatingTransctions");
const getAllUsersWithInvestments = require("../controllers/fetchUsersController");
const verifyIdController = require("../controllers/verifyUserKyc");
const logoutUser = require("../controllers/logoutUser");


router.get("/", allUsers);
router.post("/add", addUser);
router.post("/login", loginUser);
router.post("/invest", investmentTransaction, createInvestment);
router.post("/verify", sendVerification);
router.post("/verify-code", verifyCode);
router.get("/details", authToken, syncTransactionsToInvestment, userDetailsController);
router.post("/investments", authToken, syncTransactionsToInvestment, fetchInvestments);
router.post("/invest-more", authToken, investMore);
router.post("/transactions", authToken, syncTransactionsToInvestment, getUserTransactions);
router.get("/all-users", getAllUsersWithInvestments); 
router.post("/verify-kyc", verifyIdController);
router.post("/logout", authToken, logoutUser);

module.exports = router;