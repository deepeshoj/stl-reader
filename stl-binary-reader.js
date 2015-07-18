
;(function() {

  var StlBinaryReader = (function() {

    var StlBinaryReader = function(options) {
    };

    /* Header size is 80 bytes */
    var HEADER_SIZE = 80;

    /**
     * Reads the binary STL header
     *
     * @param  {DataStream} ds the file DataStream object
     */
    function readHeader(ds) {
      ds.readUint8Array(HEADER_SIZE);
    }

    /**
     * Copy a vert/normal into an existing array
     *
     * @param {Float32Array} vec the vector to copy
     * @param {Float32Array} arr the array to copy into
     * @param {number} idx the index from which to start copying
     */
    function readVec3IntoArray(vec, arr, idx) {

      for (var i = 0; i< 3; i++) {
        arr[idx + i] = vec[i];
      }
    }

    /**
     * Read each individual triangle
     *
     * @param {DataStream} ds the file DataStream object
     * @param {Float32Array} arr the array to read the triangle data into
     * @param {number} idx the index in the array from where to start
     */
    function readTriangle(ds, arr, idx) {

      var normal = ds.readFloat32Array(3);
      for (var i = 0; i<3; i++) {

        var vert = ds.readFloat32Array(3);

        readVec3IntoArray(vert, arr, idx + i*6);
        readVec3IntoArray(normal, arr, idx + i*6 + 3);
      }

      ds.readUint16();
    }

    /**
     * Reads the binary STL triangles
     *
     * @param  {DataStream} ds the file DataStream object
     * @returns {Float32Array} the typed array with the interleaved data.
     */
    function readTriangles(ds) {

      var numTri = ds.readUint32();
      var typedArray = new Float32Array(numTri*3*3*2);

      for (var i = 0; i< numTri; i++) {
        readTriangle(ds, typedArray, i*3*3*2);
      }

      return typedArray;
    }

    /**
     * Reads the triangle vertices of a binary STL file into a Float32Array
     *
     * @param  {DataStream} ds The file data as a DataStream object
     * @returns {Float23Array} contains interleaved vertex normal data
     */
    StlBinaryReader.prototype.read = function(ds) {

      readHeader(ds);
      return readTriangles(ds);
    };

    return StlBinaryReader;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = StlBinaryReader;
  } else {
    window.StlBinaryReader = StlBinaryReader;
  }

})();
