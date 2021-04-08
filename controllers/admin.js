const Admin = require("../models/admin");
const Property = require("../models/property");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username }).exec();
    if (admin) {
      if (await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_SECRET);
        res.header("auth-token", token).send(token);
      } else res.status(400).send("Incorrect password");
    } else res.status(400).send("Not found");
  } catch (err) {
    res.status(400).send("Error occured");
  }
};

exports.addProperty = async (req, res) => {
  const {
    title,
    price,
    propertyType,
    topProperty,
    address,
    area,
    avgPrice,
    description,
  } = req.body;

  try {
    const property = new Property({
      title,
      price,
      propertyType,
      topProperty,
      address,
      area,
      avgPrice,
      description,
    });
    await property.save();
    res.send({ property, success: true });
  } catch (err) {
    res.status(400).send("Error occured");
  }
};

exports.removeProperty = async (req, res) => {
  const { id } = req.query;
  console.log("id", req.query.id);
  try {
    const prop = await Property.findOne({ _id: id });
    for (let i = 0; i < prop.images.length; i++) {
      fs.unlink("./public" + prop.images[i], (err) => {
        if (err) {
          console.error(err);
          return;
        }

        //file removed
      });
    }

    const property = await Property.findOneAndDelete({ _id: id });
    res.send({ success: true, property });
  } catch (err) {
    res.status(400).send("Error Occured");
  }
};

exports.updateProperty = async (req, res) => {
  const {
    title,
    price,
    propertyType,
    topProperty,
    address,
    area,
    avgPrice,
    description,
    id,
  } = req.body;
  try {
    const property = await Property.findOneAndUpdate(
      { _id: id },
      {
        title,
        price,
        propertyType,
        topProperty,
        address,
        area,
        avgPrice,
        description,
      },
      { new: true }
    );
    res.send({ success: true, property });
  } catch (err) {
    res.status(400).send("Error Occured");
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort([["createdAt", -1]]);
    res.send({ success: true, properties });
  } catch (err) {
    res.status(400).send("Error Occured");
  }
};

exports.getProperty = async (req, res) => {
  try {
    const { id } = req.query;
    const property = await Property.findOne({ _id: id });
    res.send({ success: true, property });
  } catch (err) {
    res.status(400).send("Error Occured");
  }
};

exports.removeImage = async (req, res) => {
  const { name, pos, id } = req.query;
  console.log("name===>", name);
  console.log("position=====>", id);

  fs.unlink("./public/" + name, (err) => {
    if (err) {
      console.log(err);
      res.send({ success: false });
      return;
    }

    //file removed
  });

  try {
    const property = await Property.findOne({ _id: id });
    let arr = property.images
      .slice(0, pos)
      .concat(property.images.slice(Number(pos) + 1));
    const updated = await Property.findOneAndUpdate(
      { _id: id },
      { images: arr }
    );
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error occured");
  }
};

exports.getPropertiesByType = async (req, res) => {
  const { type, lim } = req.query;
  try {
    let properties;
    if (type === "top") {
      if (typeof lim !== "undefined") {
        properties = await Property.find({ topProperty: true })
          .limit(Number(lim))
          .sort([["createdAt", -1]]);
      } else {
        properties = await Property.find({ topProperty: true }).sort([
          ["createdAt", -1],
        ]);
      }

      res.send({ success: true, properties });
    } else if (type === "residential") {
      if (typeof lim !== "undefined")
        properties = await Property.find({ propertyType: "residential" })
          .limit(Number(lim))
          .sort([["createdAt", -1]]);
      else
        properties = await Property.find({
          propertyType: "residential",
        }).sort([["createdAt", -1]]);

      res.send({ success: true, properties });
    } else if (type === "commercial") {
      if (typeof lim !== "undefined")
        properties = await Property.find({ propertyType: "commercial" })
          .limit(Number(lim))
          .sort([["createdAt", -1]]);
      else
        properties = await Property.find({
          propertyType: "commercial",
        }).sort([["createdAt", -1]]);

      res.send({ success: true, properties });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error Occured");
  }
};
