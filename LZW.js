//     Copyright (c) 2012 Robert Kieffer
//     MIT license
//     www: https://github.com/broofa/lzwjs
//
// This is a simplistic LZW compression implementation for Javascript strings.
// It works well if what you care about is JS string length (as measured in #
// of unicode characters). However if what you care about is actual bytes -
// which is probably the case - be aware that UTF8 encoding will increase the
// size of the result by up to 2X.

(function() {
  var _global = this;

  var UTF8 = {
    encode: function(s) {
      return unescape(encodeURIComponent(s));
    },

    decode: function(s) {
      return decodeURIComponent(escape(s));
    }
  };

  function encode(s, options) {
    // We utf8 encode to work around issues with Unicode values being outside
    // the expected 0-255 range of values.  This is somewhat brittle in that
    // encodeURIComponent() will throw if it encounters invalid unicode
    // surrogate pairs (i.e. invalid Unicode strings which, yes, you can
    // create in JS :P)
    //
    // See also:
    // http://stackoverflow.com/questions/3744721/javascript-strings-outside-of-the-bmp
    // http://ecmanaut.blogspot.com/2006/07/encoding-decoding-UTF8.decode-in-javascript.html
    var utf8Encode = options && options.utf8Encode !== false;
    s = utf8Encode ? s : UTF8.encode(s);

    var dict = {}, out = [];
    var oldp = s.charAt(0), code = 256;

    for (var i = 1; i < s.length; i++) {
      var c = s.charAt(i);

      var newp = oldp + c;
      if (dict[newp] != null) {
        oldp += c;
      } else {
        out.push(oldp.length > 1 ? String.fromCharCode(dict[oldp]) : oldp.charAt(0));

        dict[newp] = code++;

        // Limit lookup codes to what can be stored in a JS [UCS-2, 16-bit]
        // character.
        if (code > 0xffff) throw new Error('LZW overflow');

        oldp = c;
      }
    }
    out.push(oldp.length > 1 ? String.fromCharCode(dict[oldp]) : oldp);

    s = out.join('');
    return utf8Encode ? UTF8.encode(s) : s;
  }

  function decode(s, options) {
    var utf8Encode = options && options.utf8Encode !== false;
    s = utf8Encode ? UTF8.decode(s) : s;

    var oldp = s.charAt(0), code = 256;
    var dict = [], out = [oldp];
    var cc = oldp;

    for (var i = 1; i < s.length; i++) {
      var c = s.charAt(i);
      var n = s.charCodeAt(i);

      var newp = n < 256 ? c : dict[n] || (oldp + cc);
      out.push(newp);

      cc = newp.charAt(0);
      dict[code++] = oldp + cc;
      oldp = newp;
    }

    s = out.join('');

    return utf8Encode ? UTF8.decode(s) : s;
  }

  var LZW = {
    encode: encode,
    decode: decode
  };

  if (typeof(module) != 'undefined') {
    // Play nice with node.js
    module.exports = LZW;
  } else {
    // Play nice with browsers
    var _previousRoot = _global.LZW;

    // **`noConflict()` - (browser only) to reset global 'LZW' var**
    LZW.noConflict = function() {
      _global.LZW = _previousRoot;
      return LZW;
    };
    _global.LZW = LZW;
  }
}());
