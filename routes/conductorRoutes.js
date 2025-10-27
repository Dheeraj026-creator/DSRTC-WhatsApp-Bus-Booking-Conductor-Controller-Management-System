const express = require("express");
const router = express.Router();
const { ensureBusAuthenticated } = require("../middlewares/busAuthMiddleware");
const conductorController = require("../controllers/conductorController");

router.get("/conductor", conductorController.getConductorPage);
router.post("/conductor", conductorController.verifyBus);
router.get("/scanner", ensureBusAuthenticated, conductorController.getScanner);
router.post("/verifyBooking", ensureBusAuthenticated, conductorController.verifyBooking);
router.get("/passengers", ensureBusAuthenticated, conductorController.getPassengers);
router.post("/passengers", ensureBusAuthenticated, conductorController.savePassenger);
module.exports = router;
