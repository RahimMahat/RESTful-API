const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// Long method of making requests to the same route
// // Get all articles from our database
// app.get("/articles", //callbackFunction );

// // Post request for our RESTful API
// app.post("/articles", //callbackFunction);

// // Delete request to delete all the articles
// app.delete("/articles", //callbackFunction );

// // Testing and Making requests using Thunder Client

//////////////////Request targeting all articles //////////////////////////
// Easy & short method of making requests to the same route
app
  .route("/articles")

  .get((req, res) => {
    Article.find({}, (err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added new article");
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all the articles");
      } else {
        res.send(err);
      }
    });
  });

//////////////////Request targeting specific article //////////////////////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      if (article) {
        res.send(article);
      } else {
        res.send("No article found");
      }
    });
  })

  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        res.send("Successfully updated the article");
      }
    );
  })

  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully patched the article");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      res.send("Successfully deleted the given article");
    });
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
