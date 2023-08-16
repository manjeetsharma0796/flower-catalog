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


POST / HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Encoding: gzip, deflate, br
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
Cache-Control: max-age=0
Connection: keep-alive
DNT: 1
Host: localhost:8000
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36
sec-ch-ua: "Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"
sec-ch-ua-mobile: ?1
sec-ch-ua-platform: "Android"