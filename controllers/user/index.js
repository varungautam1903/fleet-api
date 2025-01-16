const router = require("express").Router();
const controller = require("./user.controller");
const userInfoController = require("./userInfo.controller");
const adminController = require("./user.admin.controller");
const auth = require("../../components/middleware/authMiddleware");

// Unauthorized
router.post("/register", controller.register);
router.post("/login", controller.login);

// For Users
router.get("/", auth.protect, controller.index);
router.get("/me", auth.protect, controller.showLoggedUser);

// for Admins
router.get("/admin", auth.protect, adminController.index);
router.get("getbyid/:id", auth.protect, auth.admin, controller.show);
router.post("/admin/add", auth.protect, auth.admin, adminController.addUser);
router.get("/admin/:id", auth.protect, auth.admin, adminController.getUserById);
router.put("/admin/:id",auth.protect, auth.admin, adminController.update);
router.patch("/admin/:id",auth.protect, auth.admin, adminController.update);

// UserInfo Route
// router.get("/userinfo", auth.protect, userInfoController.index);
router.post("/userinfo",auth.protect, auth.admin, userInfoController.create);

module.exports = router;
