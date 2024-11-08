const express = require("express");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + "/date.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://chuks-admin:Test123@blinknikeapp.xr06o.mongodb.net/todolistDB")
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas.");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });

// Define your schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  listTitle: String, // List title that the item belongs to
});

const Item = mongoose.model("Item", itemSchema);

// Handle the "/" route to show items of the current day
app.get("/", async (req, res) => {
  const day = date.getDate();

  try {
    const items = await Item.find({ listTitle: day }); // Retrieve items for the current day
    const itemNames = items.map(item => item.name);
    res.render("list", {
      listTitle: day,
      newListItems: itemNames,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("An error occurred while fetching items.");
  }
});

// Handle the form submission for adding a new item
app.post("/", async (req, res) => {
  const itemName = req.body.newItem;
  const listTitle = req.body.list; // Getting the listTitle dynamically from the form

  const item = new Item({
    name: itemName,
    listTitle: listTitle, // Save the listTitle along with the item name
  });

  try {
    await item.save();
    res.redirect("/"); // Redirect to the home page after saving
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).send("An error occurred while saving the item.");
  }
});

// Handle the "/work" route to show items for the work list
app.get("/work", async (req, res) => {
  const listTitle = "Work List";

  try {
    const items = await Item.find({ listTitle: listTitle }); // Retrieve items for the Work List
    const itemNames = items.map(item => item.name);
    res.render("list", {
      listTitle: listTitle,
      newListItems: itemNames,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("An error occurred while fetching items.");
  }
});

// Handle the form submission for the work list
app.post("/work", async (req, res) => {
  const item = req.body.newItem;
  const listTitle = "Work List"; // The listTitle for the work list

  const newItem = new Item({
    name: item,
    listTitle: listTitle, // Save the listTitle as "Work List"
  });

  try {
    await newItem.save();
    res.redirect("/work");
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).send("An error occurred while saving the item.");
  }
});

// Handle the "/about" route
app.get("/about", (req, res) => {
  res.render("about");
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
