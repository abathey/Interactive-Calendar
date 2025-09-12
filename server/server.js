const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const Event = require('./events');

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/calendar')
  .then(() => console.log("Mongo connection open!"))
  .catch(err => console.error("Mongo connection error.", err));

// For fetching/loading event data
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ year: 1, month: 1, date: 1 });
        res.json(events);
    } catch (err) {
        console.error("Failed to fetch events:", err);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// For saving events
app.post('/api/events', async (req, res) => {
    try {
        const doc = await Event.create(req.body);
        res.status(201).json(doc);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to create event" });
    }
});

// For deleting events
app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Event.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Delete failed" });
    }
});

// For updating events
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updated = await Event.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Update failed" });
  }
});

app.listen(3000, () => console.log("API on port 3000"));