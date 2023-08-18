const getMimeType = (extension) => {
  const mime = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "ico": "image/vnd.microsoft.icon",
    "gif": "image/gif",
    "html": "text/html",
    "css": "text/css",
    "txt": "text/plain",
    "pdf": "application/pdf",
    "js": "text/javascript",
    "/": "text/html",
    "/login": "text/html",
    "/guest-book": "text/html",
  };

  return mime[extension];
};

module.exports = { getMimeType };
