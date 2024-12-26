const {Router}=require('express')
const multer=require('multer')
const path=require("path")
const Blog=require("../models/blog")
const Comment = require('../models/comment')

const router= Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/upload'))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null,fileName)
  }
})

const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
  return res.render("addblog",{
    user:req.user
  })
})

router.get('/:id',async(req,res)=>{
    try {
      const blog = await Blog.findById(req.params.id).populate("createdBy");

      if (!blog) {
        console.error("Blog not found for id:", req.params.id);
      }

      const comment= await Comment.find({blogId:req.params.id}).populate("createdBy")
      
      return res.render("blog", {
        user: req.user || null,
        blog,
        comment
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  });

  router.post('/comment/:blogId',async(req,res)=>{
    await Comment.create({
      content:req.body.content,
      blogId:req.params.blogId,
      createdBy:req.user._id
    })
 
    // console.log(comment)
    return res.redirect(`/blog/${req.params.blogId}`)
  })

router.post('/',upload.single('coverImage'),async(req,res)=>{
  const {title,body}=req.body
  const blog=await Blog.create({
    body,
    title,
    createdBy:req.user._id,
    coverImageURL:`/upload/${req.file.filename}`
  })
  return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;
