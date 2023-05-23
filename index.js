const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1/olympia");

const Event = mongoose.model("Event", {
  date: String,
  name: String,
  seats: {
    orchestre: Number,
    mezzanine: Number,
  },
});

const Ticket = mongoose.model("Ticket", {
  mail: String,
  username: String,
  date: String,
  category: String,
  seats: Number,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

app.get("/events", async (req, res) => {
  try {
    //console.log(req.query.id);
    const event = await Event.findById(req.query.id);
    res.json(event);
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.get("/events/availabilities", async (req, res) => {
  try {
    const event = await Event.find({ date: req.query.date });
    res.json(event);
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.post("/events/create", async (req, res) => {
  try {
    const newEvent = new Event({
      name: req.body.name,
      date: req.body.date,
      seats: {
        orchestre: req.body.seats.orchestre,
        mezzanine: req.body.seats.mezzanine,
      },
    });
    await newEvent.save();
    res.json("Event successfully created");
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.listen(3001, () => {
  console.log("Server started");
});
