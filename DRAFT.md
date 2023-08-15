```js
const uriResponses = {
  "/": {
    path: "html/index.html",
    type: "text/html",
  },
};

if (present) {
  const { path, type } = uri[uriResponses];
  readFile(path, response, type);
}
```

```js
const MIME_TYPES = {
  html: "text/html",
};

const contentType = (type) => ({ "Content-Type": type });

const contentTypes = {
  html: contentType(MIME_TYPES.html),
};
```

---

1. read the comments data and get string
2. create the comments elements
3. read html template of the page
4. replace and append the comments elements you created
5. response to client and over

```js
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
  };

  return mime[extension];
};

const getContentDisposition = (extension) => {
  const disposition = {
    jpeg: "inline",
    pdf: "attachment",
  };

  return contentDisposition[extension];
};
```
