const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://karthikeyachamarthy:<SGWdwjyEFf28R14Q>@cluster0.d6cyvy6.mongodb.net/<your-db-name>?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Mongoose Schema and Model
const journalSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

const Journal = mongoose.model("Journal", journalSchema);

// Routes
app.get("/", async (req, res) => {
  const journals = await Journal.find().sort({ date: -1 });

  let journalHTML = journals
    .map(
      (j) => `
      <div class="entry">
        <h3>${j.title}</h3>
        <p>${j.content}</p>
        <small>${j.date.toLocaleString()}</small>
      </div>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Naarchive</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="container">
        <h1>📝 My Journal</h1>
        <form action="/submit" method="POST">
          <input type="text" name="title" placeholder="Title" required />
          <br />
          <textarea name="content" placeholder="Write your thoughts here..." rows="6" required></textarea>
          <br />
          <button type="submit">Submit</button>
        </form>
        <hr>
        <h2>📓 Previous Entries</h2>
        ${journalHTML}
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.post("/submit", async (req, res) => {
  const newEntry = new Journal({
    title: req.body.title,
    content: req.body.content,
  });

  await newEntry.save();
  res.redirect("/");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
