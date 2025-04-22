const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const conn = require('./config/db.js')
const commonData = require('./middleware/commonData.js')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(commonData)
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('layout', { content: 'content_section.ejs' })
})

app.get('/404', (req, res) => {
    res.status(404).render('layout', { content: '404.ejs' })
})

app.get("/contact", (req, res) => {
  // res.render("layout", { content: "contact.ejs" });
  const success = req.query.success;
  res.render("layout", { content: "contact.ejs", success });
});

//Xu ly form contact
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Thông tin khách hàng:", name, email, message);

  const query = "INSERT INTO contacts (NAME, email, message) VALUES (?, ?, ?)";
  conn.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error inserting contact:", err);
      res.status(500).send("Error submitting contact form");
      return;
    }
    // Redirect back to the contact page with a success message
    res.redirect("/contact?success=true");
  });
});

app.listen(port, () => console.log(`Server running at http://127.0.0.1:${port}`))