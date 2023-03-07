const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/6d69fc9c73";

  const options = {
    method: "POST",
    auth: "Sumit:0346574cea923d3e41ef4ec3fa39f3d1-us21",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      const statusHTTP = response.statusCode;
      if (statusHTTP >= 200 && statusHTTP < 300) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});

//API- KEY  :  0346574cea923d3e41ef4ec3fa39f3d1-us21
// List id :  6d69fc9c73
