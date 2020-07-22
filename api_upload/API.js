var express = require("express");
var router = express.Router();
var exec = require("child_process").execFile;
var output = "";
var fs = require("fs");

//when net name received write it to the log file.
router.get("/:name", function (req, res, next) {
  fs.writeFile("store.txt", req.params.name, function (err) {
    if (err) return console.log("writeerror" + err);
    else next();
  });
});

// once file written, run haskell
router.get("/:name", function (req, res, next) {
  exec("INets.exe", function (err, data) {
    if (err) {
      console.log("error?:" + err);
    } else {
      output = data;
      next();
    }
  });
});

// once output received from haskell, send to frontend
router.get("/:name", function (req, res, next) {
  console.log("TO FRONT-END:   " + output);
  res.send(output);
});
module.exports = router;
