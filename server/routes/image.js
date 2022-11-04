const router = require("express").Router();
const fs = require("fs");

router.post("/:id", (req, res) => {
  const id = req.params.id;
  const image = req.body.newImg;
  const data = image.data.replace(/^data:image\/(.+);base64,/, "");
  fs.writeFile(
    `../client/src/assets/images/uploads/profile-${id}.jpg`,
    data,
    "base64",
    (err) => {
      if (err) {
        console.log(err);
        fs.writeFile(
          `../client/public/assets/images/uploads/profile-${id}.jpg`,
          data,
          "base64",
          (err) => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json({ message: "Image saved" });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
