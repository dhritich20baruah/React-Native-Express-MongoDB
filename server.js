const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 4000;
const Note = require("./models/Note");
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Connect to mongodb
// mongoose
//   .connect("mongodb://0.0.0.0:27017/reactNote", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err));

//Cloud Database
const db = process.env.MONGO_URI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

// CREATE
app.post("/addNote", (req, res) => {
  const title = req.body.title;
  const note = req.body.note;

  const newNote = new Note({
    title,
    note,
  });
  newNote.save((err, data) => {
    if (err) {
      console.log(err);
    }
    Note.find({}, function (err, data) {
      res.json(data);
    });
  });
  console.log(newNote);
});
// READ
app.get("/notes", (req, res) => {
  Note.find({}, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});
// DELETE
app.delete("/deleteNote/:id", (req, res) => {
  Note.deleteOne({ _id: req.params.id }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("deleted");
    }
  });
});
//FETCH ONE
app.get("/oneNote/:id", (req, res) => {
  Note.findById({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});
// UPDATE
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const title = req.body.title;
  const note = req.body.note;
  try {
    if (!title || !note) {
      return res.status(400).json({ error: "Title and note are required" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, note },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the note" });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server started at port ${PORT}`);
// });

module.exports = app