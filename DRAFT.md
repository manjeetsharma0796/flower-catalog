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
  html: contentType(MIME_TYPES.html)
};
```
