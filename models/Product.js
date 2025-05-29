// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   productCode: { type: String, required: true },
//   name: { type: String, required: true },
//   category: String,
//   subCategory: String,
//   price: Number,
//   gst: Number,
//   image: String,
//   postedOn: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Product', productSchema);


const mongoose = require('mongoose');

const colourSchema = new mongoose.Schema({
  colour:   String,          // Hex or name
  size:     String,          // “S”, “M”, “L” or number
  quantity: Number,
});

const productSchema = new mongoose.Schema({
  productCode:   { type: String, required: true, unique: true },
  name:          { type: String, required: true },
  category:      String,
  subCategory:   String,
  productType:   String,
  price:         Number,
  gst:           Number,
  status:        { type: String, enum: ['Active','Inactive','Out of Stock'], default: 'Active' },
  colours:       [colourSchema],   // ← array of {colour,size,qty}
  images:        [String],         // filenames
  postedOn:      { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);

