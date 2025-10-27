const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { getAdmin, createBus, editBus, updateBus, deleteBus } = require("../controllers/adminController");
const router = express.Router();

router.get("/admin", isLoggedIn, getAdmin);
router.post("/admin", isLoggedIn, createBus);
router.get("/admin/edit/:id", isLoggedIn, editBus);
router.post("/admin/edit/:id", isLoggedIn, updateBus);
router.post("/admin/delete/:id", isLoggedIn, deleteBus);

module.exports = router;
