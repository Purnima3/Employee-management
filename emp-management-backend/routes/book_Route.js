const express = require("express");
const {getbooks,bookInfo,bookbyid,setReviewsByid,deleteBook} = require("../controller/books")

const router = express.Router()

router.get("/books",getbooks)
router.post("/bookInfo",bookInfo)
router.get("/books/:id",bookbyid)
router.post("/books/:id/reviews",setReviewsByid)
router.delete("/books/:id",deleteBook)
module.exports = router;