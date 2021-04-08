const express = require("express");
const router = express.Router();
const {
  adminLogin,
  addProperty,
  removeProperty,
  getProperties,
  getProperty,
  updateProperty,
  removeImage,
  getPropertiesByType,
} = require("../controllers/admin");

const { adminCheck } = require("../middlewares/admin");

// router.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(password, salt);
//   try {
//     const admin = new Admin({
//       username,
//       password: hashPassword,
//     });
//     await admin.save();
//     res.send(admin);
//   } catch (err) {
//     console.log(err.message);
//   }
// });
router.post("/login", adminLogin);
router.post("/add-property", adminCheck, addProperty);
router.delete("/remove-property", adminCheck, removeProperty);
router.put("/update-property", adminCheck, updateProperty);
router.get("/get-properties", getProperties);
router.get("/get-property", getProperty);
router.delete("/remove-image", adminCheck, removeImage);
router.get("/get-properties-by-type", getPropertiesByType);

module.exports = router;
