require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');  // for storing thre uploaded images in this folder
const path = require('path');
const cors = require('cors');
const { type } = require('os');
const { log } = require('console');
const { config } = require('process');
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 4000;

// database connection with mongodb
mongoose.connect("mongodb+srv://6005168766pd:Dogra%402005@cluster0.qein0sa.mongodb.net/e-commerce?retryWrites=true&w=majority");
//Api creation
app.get("/", (req, res) => {
  res.send("express app is running");
})

// Image storage Engine

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    )
  }
})
const upload = multer({ storage: storage })

// Creating Upload Endpoint for images
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})
// Schema for creating Products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  }

})
app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  })

  console.log(product);
  await product.save();
  console.log("Product saved");
  res.json({
    success: true,
    name: req.body.name,
  })
})
//Creating Api for deleting Products from Database
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removing product with ID:", req.body.id);
  res.json({
    success: true,
    name: req.body.name
  })
})
// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  res.send(products);
})
// sCHEMA CReating for User Model
const Users = mongoose.model('Users', {
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  }
})
// Creating API for Signipu of user
app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "Existing User found with Same email address" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  })
  await user.save();

  const data = {
    user: {
      id: user.id
    }
  }
  const token = jwt.sign(data, 'Secret_ecom');
  res.json({ success: true, token });
})
// Creating API for UserLogin
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const pascompare = req.body.password === user.password;
    if (pascompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      const token = jwt.sign(data, 'Secret_ecom');
      res.json({ success: true, token });
    }
    else {
      res.json({ success: false, errors: "Wrong password" });
    }
  }
  else {
    res.json({ Success: false, errors: "Email id not registered!" })
  }
})
// Creating API for new collection data
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("New Collection fetched");
  res.send(newcollection);
})
// Creating API for Popular in Women Section
app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popularinwomen = products.slice(0, 4);
  console.log("Popular in Women Fetched");
  res.send(popularinwomen);
})
// Creating middleware to fetch user
const fetchuser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" })
  }
  else {
    try {
      const data = jwt.verify(token, 'Secret_ecom');
      req.user = data.user;
      next();
    }
    catch (error) {
      res.status(401).send({ errors: "Please authenticate using a valid token" })
    }
  }
}
// Creatin API for saving the products in cart
app.post('/addtocart', fetchuser, async (req, res) => {
  let userdata = await Users.findOne({ _id: req.user.id });
  userdata.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userdata.cartData })
  res.json({ success: true, response: 'Added successfully' });
})
// Creating API to remove product MONGodb database
app.post('/removefromcart', fetchuser, async (req, res) => {
  let userdata = await Users.findOne({ _id: req.user.id });
  if (userdata.cartData[req.body.itemId] > 0) {
    userdata.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userdata.cartData })
    res.json({ success: true, response: 'Deleted successfully' });
  }
})
// creating API to get cartdata from mongodb
app.post('/getdata', fetchuser, async (req, res) => {
  console.log("Get data");
  let userdata = await Users.findOne({ _id: req.user.id });
  res.json(userdata.cartData);
})
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on the address http://localhost:${port}`);
  }
  else {
    console.log("Error :" + error)
  }
})