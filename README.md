# LZW.js - a JS-friendly text compression algorithm

## tl;dr
The Good:

  * Small (< 500 bytes gzip-minified)
  * Runs anywhere (no dependencies, cross-browser)
  * Decent compression. [Try it the demo](http://broofa.com/lzwjs)
  * Handles unicode strings (set `options.utf8encode = true`) (mostly)

The Bad:

  * Not super fast. Encodes at 2-5M chars/sec on a Macbook Pro.

The Ugly:

  * It's not _real_ LZW... as in it won't play nice with `compress` or other LZW utilities.  If you need support in non-JS environments, you'll have to write your own port (and please contribute back here!)

== Why ==

Sometimes clients need to push a lot of data back to the server. And sometimes that data would compress really nicely (I'm looking at you, every JSON-API out there!)  Sadly, there's zero support for this sort of thing in browsers today.  LZW.js is intended as a cheap-to-download API for doing "pretty good" compression in the client.

Is it practical?  Well... maybe. One big issue is that AJAX requests are traditionally made using `application/x-www-form-urlencoded` content types. And URL-encoding bloats the hell out of... well... pretty much any text stream.
