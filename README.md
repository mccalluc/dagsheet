# dagsheet
It's like a spreadsheet, but with explict representation of dependencies, and functions as data.

Live demo at https://mccalluc.github.io/dagsheet/.

To develop locally, you'll need to start an HTTP Server: AJAX will not allow the example files
to be loaded with the "file://" protocol. You'll also want to be sure that you are not
caching the files you're working on. Here's one approach:

```
$ npm install http-server -g
$ http-server -c-1
```
