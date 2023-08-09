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
