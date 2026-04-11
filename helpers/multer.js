const multer = require("multer");

// store files temporarily
const storage = multer.diskStorage({});

const upload = multer({ storage });

module.exports = upload;
