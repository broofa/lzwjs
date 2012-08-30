LZW.js - a JS-friendly text compression algorithm
=====

== tl;dr ==
The Good:

  * Small (< 500 bytes gzip-minified)
  * Runs anywhere (no dependencies, cross-browser)
  * Decent compression. [Try it the demo](http://broofa.com/lzwjs)
  * Handles unicode strings (set `options.utf8encode = true`)

The Bad:

  * Not super fast. Encodes at 2-5M chars/sec on a Macbook Pro.

The Ugly:

  * Encoding is non-standard.  You'll need to find (or more likely, write) a port of this for non-JS environments. (Please contribute back to this project!)
