const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route-1 Get All the  Notes of user:GET "api/note/fetchallnotes". Login requires
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//Route-2 Add a new  Notes of user:POST "api/note/addnote". Login requires
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newnote = new Note({ title, description, tag, user: req.user.id });
      const savenote = await newnote.save();
      res.json(savenote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route-3 Update an existing Note of user: PUT "api/note/addnote". Login requires
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a newnote object
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }

    //Find the note to be updated and update it

    //Get note by id which is to be updated
    let note = await Note.findById(req.params.id);

    //Not not exists
    if (!note) {
      return res.status(401).send("Not found");
    }
    //Not loggedin user's note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed to access this note ");
    }

    //Note is exixt and it's loggedin user's note
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//Route-4 Delete an existing Note of user: DELETE "api/note/addnote". Login requires
router.put("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //Find the note to be deleted and delete it

    //Get note by id which is to be updated
    let note = await Note.findById(req.params.id);

    //Not not exists
    if (!note) {
      return res.status(401).send("Not found");
    }
    //Not loggedin user's note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed to access this note ");
    }

    //Note is exixt and it's loggedin user's note
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has benn deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
