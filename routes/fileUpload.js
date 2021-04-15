const express = require("express");
const Property = require("../models/property");
const router = express.Router();
const { adminCheck } = require("../middlewares/admin");
router.post("/upload", adminCheck, async (req, res) => {
  console.log("req", req.file);
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  // accessing the file
  const myFile = req.files.file;
  const { id } = req.query;
  const property = await Property.findOne({ _id: id });
  let images = property.images ? property.images : [];
  console.log("id", id);
  //  mv() method places the file inside public directory
  // console.log("files", req.files);
  console.log("length", myFile);
  if (Array.isArray(myFile)) {
    for (let i = 0; i < myFile.length; i++) {
      let path = "/" + Date.now() + "-" + myFile[i].name;
      images.push("/images" + path);
      await myFile[i].mv(`public/images${path}`, function (err) {
        if (err) {
          console.log("The error is", err);
          return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        console.log("file added", myFile[i].name);
      });
    }
    console.log("Images", images);
    const property = await Property.findOneAndUpdate(
      { _id: id },
      { images },
      { new: true }
    );
    console.log("Property", property);
    res.send({ success: true });
  } else {
    let path = "/" + Date.now() + "-" + myFile.name;
    images.push("/images" + path);
    await myFile.mv(`public/images${path}`, function (err) {
      if (err) {
        console.log("The error is", err);
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      console.log("file added", myFile.name);
    });
    await Property.findOneAndUpdate({ _id: id }, { images });
    res.send({ success: true });
  }

  // for (let i = 0; i < myFile.length; i++) {
  //   await myFile[i].mv(`public/${myFile[i].name}`, function (err) {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send({ msg: "Error occured" });
  //     }
  //     // returing the response with file path and name
  //   });
  // }
});
module.exports = router;
