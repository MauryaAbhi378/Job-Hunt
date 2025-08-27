import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
  let extName = path.extname(file.originalname).toLowerCase();

  // Force correct mime for pdf
  let mimeType = "";
  if (extName === ".pdf") {
    mimeType = "application/pdf";
  } else {
    mimeType = file.mimetype; // fallback
  }

  return parser.format(extName, file.buffer, mimeType);
};

export default getDataUri;
