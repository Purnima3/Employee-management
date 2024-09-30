const Book = require("../models/books");

async function getbooks(req,res){
    try {
        const books = await Book.find();
        res.json(books);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
      }
}

async function bookInfo(req,res){
    const { title, author, genre, description } = req.body;

    if (!title || !author || !genre || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const newBook = new Book({
      title,
      author,
      genre,
      description,
    });
  
    try {
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add book' });
    }
}

async function bookbyid(req,res){
    console.log("hiiiiiiiiiiiiiiiiiiiiii")
    try {
        console.log("hiiiiiiiiiiiiiiiiiiiiii")
        console.log(req.params.id)
        const book = await Book.findById(req.params.id);
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

async function setReviewsByid(req,res) {
  
        const bookId = req.params.id;
        const { username, rating, comment } = req.body;
      
        try {
          const book = await Book.findById(bookId);
          if (!book) {
            return res.status(404).send('Book not found');
          }
      
 
          book.reviews.push({ username, rating, comment });
      
      
          const totalRatings = book.reviews.length;
          const sumRatings = book.reviews.reduce((acc, review) => acc + review.rating, 0);
          book.averageRating = sumRatings / totalRatings;
      
        
          await book.save();
          
          res.status(200).json(book);
        } catch (err) {
          res.status(500).send(err.message);
        }
}

async function deleteBook(req,res)
{
    const { id } = req.params;

    try {
      
      const result = await Book.findByIdAndDelete(id);
      
      if (!result) {
        return res.status(404).send('Book not found');
      }
  
      res.status(200).send('Book deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting book');
    }
}

module.exports = { bookInfo, getbooks, bookbyid, setReviewsByid ,deleteBook};
