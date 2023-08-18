adding content disposition info to get MIME_TYPE functoin

so that i don't need to check for specific extension if i have to attach or inline it

---

> Why the url of submit and page should be different?

Suppose there is more than one form now to convey the meaning of which part of the page is submitting, the url should convey the meaning

Also when server want to redirect the page to specific form completion, the server needs to know which form is submitted

> Why the url of submit and page should not be different?

As of now i am just showing one page, with one form, and updating the comment section

---

Requirement

1. Implement POST method on form [*]
2. If other page tries the POST method, handle it as method not allowed[]

First segregate by method,
Second segreate by route

{
GET: {
      '/': handleHome,
      '/guest-book.html': handleGuestBookPage
    },
POST: {
      '/guest-book.html/add-comment': handleGuestBookPage
      }
}

---------------
on getting loginInfo,
i want to create button accordingly