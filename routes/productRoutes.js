const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const Product  = require('../models/Product');

const router = express.Router();

/* Multer config */
const storage = multer.diskStorage({
  destination: (_req,_file,cb)=>cb(null,'uploads/'),
  filename:    (_req,file,cb)=>cb(null, Date.now()+path.extname(file.originalname))
});
const upload = multer({ storage });

/* ───────────────── POST add product ───────────────── */
router.post('/', upload.array('images',10), async (req,res)=>{
  try{
    const body   = JSON.parse(req.body.payload);    // fields as JSON string
    const images = req.files.map(f=>`/uploads/${f.filename}`);
    const product = await Product.create({ ...body, images });
    res.status(201).json(product);
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Failed to add product', message:err.message });
  }
});

/* ───────────────── GET list with search/pagination ─ */
router.get('/', async (req,res)=>{
  try{
    const { status='Active', search='', page=1, limit=10 } = req.query;
    const query = {
      status,
      $or:[
        { name:        new RegExp(search,'i') },
        { productCode: new RegExp(search,'i') },
      ]
    };
    const skip = (page-1)*limit;
    const [items,total] = await Promise.all([
      Product.find(query).sort({postedOn:-1}).skip(skip).limit(+limit),
      Product.countDocuments(query)
    ]);
    res.json({ items, total });
  }catch(err){ res.status(500).json({ error:'Fetch error', message:err.message });}
});

/* ───────────────── GET single by id ───────────────── */
router.get('/:id', async (req,res)=>{
  try{
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({error:'Not found'});
    res.json(product);
  }catch(err){ res.status(500).json({error:'Fetch error', message:err.message });}
});

/* ───────────────── PUT update ─────────────────────── */
router.put('/:id', upload.array('images',10), async (req,res)=>{
  try{
    const body   = JSON.parse(req.body.payload);
    let update   = { ...body };
    if (req.files.length) update.images = req.files.map(f=>`/uploads/${f.filename}`);
    const product = await Product.findByIdAndUpdate(req.params.id, update, {new:true});
    if (!product) return res.status(404).json({ error:'Not found' });
    res.json(product);
  }catch(err){ res.status(500).json({error:'Update error', message:err.message });}
});

/* ───────────────── DELETE ─────────────────────────── */
router.delete('/:id', async (req,res)=>{
  try{
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message:'Deleted' });
  }catch(err){ res.status(500).json({ error:'Delete error', message:err.message });}
});

module.exports = router;
