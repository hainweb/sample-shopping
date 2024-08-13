var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const products = await productHelpers.getAllProducts();
    for (let product of products) {
      product.ordercount = await productHelper.getOrdersCount(product._id);
    }
    res.render('admin/view-products', { admin: true, products });
  } catch (error) {
    console.log(error);
    next(error);
  }
});


router.get('/add-product', function (req, res) {
  res.render('admin/add-product')
})
router.post('/add-product', (req, res) => {
  console.log(req.body);
  console.log(req.files.Image);

  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image;

    // Check if image is provided
    if (!image) {
      return res.status(400).send("No image file uploaded.");
    }

    // Define the path where the image will be saved
    const imagePath = './public/product-images/' + id + '.jpg';

    // Move the image to the specified path
    image.mv(imagePath, (err) => {
      if (err) {
        console.error("Error saving image:", err);
        return res.status(500).send("Error saving image");
      }
      
      // Render the response if the image is saved successfully
      res.render("admin/add-product");
    });
  });
});


router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })



})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetailes(req.params.id)

  res.render('admin/edit-product', { product })
});

router.post('/edit-product/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id
  productHelpers.UpdateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files) {
      let image = req.files.Image
      image.mv('./public/product-images/' + id + '.jpg')

    }
  })
})





module.exports = router;
