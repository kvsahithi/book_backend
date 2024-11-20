const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://admin:adminmongo@cluster0.la28y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Book Schema and Model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
});

const Book = mongoose.model('Book', bookSchema);

// API Endpoints

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  const { title, author, description } = req.body;

  if (!title || !author || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newBook = new Book({ title, author, description });

  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
