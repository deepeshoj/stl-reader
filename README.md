# StlReader

[![License](https://img.shields.io/badge/license-MIT-yellowgreen.svg)](http://opensource.org/licenses/MIT)

JavaScript library for parsing STL (Stereolithography) files into interleaved
vertex normal Float32Arrays that can be directly passed into WebGL for
rendering.

## Server-side

### Installation

```
npm install stl-reader
```

### Usage

```JavaScript
var fs = require('fs');
var StlReader = require('stl-reader');
...
fs.readFile('test/cube-binary.stl', function (err, data) {
  if (!err) {
    var stlReader = new StlReader();
    var vn = stlReader.read(toArrayBuffer(data));
  }
});
```

The returned *vn* array contains interleaved vertex normal data, like so,
[Vx, Vy, Vz, Nx, Ny, Nz, ...] and so on. This is ideal for directly passing
to a vertex shader.

The *read* function takes as input an ArrayBuffer. You can use the function
below to convert a Node Buffer to an ArrayBuffer (see discussion regarding this
code snippet [here](http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer)).

```JavaScript
function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}
```

This library depends on the [DataStream.js](https://github.com/kig/DataStream.js)
library to read binary STL files. A version of the DataStream.js library is
installed automatically as a dependency when this library is installed
server-side using npm.

### Reading large ASCII STL files server-side

When reading large ASCII STL files on the server-side with Node.js using the
*read* function you will get a RangeError (RangeError: Maximum call stack size
exceeded). It is therefore best to use the *readAscii* for reading ASCII files
(see the Additional APIs section at the end).

```JavaScript
fs.readFile('test/large-ascii.stl', function (err, data) {
  if (!err) {
    var abData = toArrayBuffer(data);
    var vn;

    var reader = new StlReader();
    var isBinary = reader.isBinary(abData);

    if (isBinary) {
      vn = reader.readBinary(abData);
    } else {
      vn = reader.readAscii(data.toString());
    }
  }
});
```

## Client-side

### Installation

```
bower install stl-reader
```

### Usage

This library depends on the DataStream.js library to read binary STL files. You
therefore will also need to install the DataStream.js library from
[here](https://github.com/kig/DataStream.js). After installation include these
JavaScript files before including the stl-reader related scripts:

```HTML
<script type="text/javascript" src="/bower_components/DataStream.js/encoding-indexes.js"></script>
<script type="text/javascript" src="/bower_components/DataStream.js/encoding.js"></script>
<script type="text/javascript" src="/bower_components/DataStream.js/DataStream.js"></script>
```

Include these three JavaScript files on the page:

```HTML
<script src="/bower_components/stl-reader/stl-ascii-reader.js" type="text/javascript"></script>
<script src="/bower_components/stl-reader/stl-binary-reader.js" type="text/javascript"></script>
<script src="/bower_components/stl-reader/stl-reader.js" type="text/javascript"></script>
```

Use an instance of the FileReader class to read the local file as an ArrayBuffer.

```Javascript
var reader = new FileReader();

reader.onload = function(e) {
  var data = reader.result;
  var stlReader = new StlReader();
  var vn = stlReader.read(data);
};

reader.readAsArrayBuffer(f);
```

The returned vn array contains interleaved vertex normal data, like so,
[Vx, Vy, Vz, Nx, Ny, Nz, ...] and so on. Ideal for directly passing onto a
vertex shader.

### Reading large ASCII STL files client-side

When reading large ASCII STL files on the client-side inside a browser you will get
a RangeError (RangeError: Maximum call stack size exceeded) when using both the
*read* and the *readAscii* functions. In this case it is best to use the
*readAsync* function. The *readAsync* function takes a callback that receives
the interleaved vertex normal array.

```Javascript
var reader = new FileReader();

reader.onload = function () {
  var stlReader, data;

  data = reader.result;
  stlReader = new StlReader();
  stlReader.readAsync(data, function (vn) {

  });
};

reader.readAsArrayBuffer(fileData);
```

## Additional APIs

If you already know that your STL file is ASCII or binary, then it is possible
to read the file faster by directly using the *readBinary* or the *readAscii*
APIs. There is also another API *isBinary* which can used to determine if the
file is binary or ASCII.

### Usage

```JavaScript
fs.readFile('test/cube-binary.stl', function (err, data) {
  if (!err) {
    var abData = toArrayBuffer(data);
    var vn;

    var reader = new StlReader();
    var isBinary = reader.isBinary(abData);

    if (isBinary) {
      vn = reader.readBinary(abData);
    } else {
      vn = reader.readAscii(data.toString());
    }
  }
});
```

Note that while the *readBinary* API takes an ArrayBuffer as input, the
*readAscii* API needs an ASCII string representation of the file as input.
