const express = require("express");
const noteModel = require('../models/NotesModel');
const routes = express.Router();

//TODO - Create a new Note
//http://mongoosejs.com/docs/api.html#document_Document-save
routes.post('/notes', async (req, res) => {
  try {
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
      return res.status(400).send({
        message: "Note title, description, and priority are required."
      });
    }
    const newNote = new noteModel({
      noteTitle: req.body.noteTitle,
      noteDescription: req.body.noteDescription,
      priority: req.body.priority,
    });

    const savedNote = await newNote.save();
    res.status(201).send(savedNote);
  } catch (error) {
    res.status(500).send(error);
  }
});

//TODO - Retrieve all Notes
//http://mongoosejs.com/docs/api.html#find_find
routes.get('/notes', async (req, res) => {
  try {
    const notesList = await noteModel.find({});
    res.status(200).send(notesList);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve a single Note with noteId
//http://mongoosejs.com/docs/api.html#findbyid_findById
routes.get('/notes/:noteId', async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.noteId);
    if (!note) {
      return res.status(404).send({
        message: "Note not found with id " + req.params.noteId
      });
    }
    res.status(200).send(note);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        message: "Note not found with id " + req.params.noteId
      });
    }
    res.status(500).send(error);
  }
});

// Update a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandupdate_findByIdAndUpdate
routes.put('/notes/:noteId', async (req, res) => {
  try {
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
      return res.status(400).send({
        message: "Note title, description, and priority are required."
      });
    }

    await noteModel.findByIdAndUpdate(req.params.noteId, req.body);
    res.status(200).send({ message: "Note info has been updated" });
  } catch (error) {
    res.status(500).send(error);
  }
});

//TODO - Delete a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
routes.delete('/notes/:noteId', async (req, res) => {
  try {
    const note = await noteModel.findByIdAndRemove(req.params.noteId);
    if (!note) {
      return res.status(404).send({
        message: "Note not found with id " + req.params.noteId
      });
    }
    res.status(200).send({ message: `${note.noteTitle} has been deleted` });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = routes;

