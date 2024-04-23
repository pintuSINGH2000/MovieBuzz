const User = require("../models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const braintree = require("braintree");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const verifyEmailController = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(200).send({
        success: true,
      });
    } else {
      res.status(409).send({
        success: false,
        message: "Email Already exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Registration",
      error,
    });
  }
};

const registerController = async (req, res) => {
  try {
    let total = 0;
    const currDate = new Date();
    currDate.setDate(currDate.getDate() + 30);
    let newTransaction = gateway.transaction.sale(
      {
        amount: req.body.amount,
        paymentMethodNonce: req.body.nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result?.success) {
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
              req.body.password,
              process.env.SECRET_KEY
            ).toString(),
            plan: req.body.selectedPlan,
            expiryDate:currDate,
          });
          const user = newUser.save();
          res.status(201).json(user);
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error In Registration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("Invalid Username or Password");
      return;
    }

    const decrypt = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = decrypt.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      res.status(401).json("Invalid Username or Password");
      return;
    }

    const accessToken = JWT.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const { password, ...info } = user._doc;
    if (user?.profilePic&&user.profilePic.contentType) {
      res.set("content-type", user.profilePic.contentType);
    }

    res.status(200).json({ ...info, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//payment
//gettoken
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error In Payment",
      error,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const userId = req.params.userid;
    const { username, passwd } = req.fields;
    const { profilePic } = req.files;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (username) {
      user.username = username;
    }
    if (passwd) {
      const temp = CryptoJS.AES.encrypt(
        passwd,
        process.env.SECRET_KEY
      ).toString();
      user.password = temp;
    }
    if (profilePic) {
      user.profilePic.data = fs.readFileSync(profilePic.path);
      user.profilePic.contentType = profilePic.type;
    }
    await user.save();
    let change = {};
    if (username) {
      change.username = user.username;
    }
    if (profilePic) {
      change.profilePic = user.profilePic;
    }
    res.status(201).send({
      success: true,
      message: "Profile Updated Successfully",
      change,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Updating",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  braintreeTokenController,
  verifyEmailController,
  updateUserController,
};
