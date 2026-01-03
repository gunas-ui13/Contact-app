const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. IMPROVED CORS (This fixes the 'Delete failed' issue)
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Added DELETE and OPTIONS
  credentials: true
}));

app.use(express.json());

// 2. Database Connection
const MONGO_URI = 'mongodb+srv://admin:gunasheela123@cluster0.bgbzorz.mongodb.net/contactDB?retryWrites=true&w=majority'; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// 3. Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: String,
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// 4. API Routes

// POST: Save a contact
app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Fetch all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Remove a contact by ID
// Using POST here to match your frontend code exactly
app.post('/api/contacts/delete/:id', async (req, res) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));