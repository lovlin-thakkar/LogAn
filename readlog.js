const fs = require('fs')

// my implementation added as a import from other files
const reader = require('./reader.js')

async function readLog(filePath, chunkSize, lineNumber) {
  console.log("___________________________________________________________________________");
  let linesRead = 0;

  for await(const line of generateLines(filePath, chunkSize)) {
    const data = line.toString('utf8');
    if (lineNumber - 1 == linesRead) {
      return data;
    }
    linesRead++;
  }

  return "Reached end of file, line number too big!"
}

async function searchLog(filePath, chunkSize, searchString) {
    console.log("___________________________________________________________________________");

  for await(const line of generateLines(filePath, chunkSize)) {
    const data = line.toString('utf8');
    if (data.includes(searchString)) {
      return data;
    }
  }

  return "No results found for the keyword!"
}

async function* generateLines(filePath, size) {
  const sharedBuffer = Buffer.alloc(size);
  const stats = fs.statSync(filePath);
  const fd = fs.openSync(filePath);
  let bytesRead = 0;
  let prevChunkPending = "";

  // number of iterations needed to read 'size' long data from stats.size long file
  for (let i = 0; i < Math.ceil(stats.size / size); i++) {
    await reader.readBytes(fd, sharedBuffer, null);

    let linesInChunk = sharedBuffer.toString('utf-8').split("\n");

    // last line
    if (linesInChunk.length == 1) {
      bytesRead = (i + 1) * size;
      if (bytesRead > stats.size) {
        // file may not be exactly the size ==> sometimes stats.size != n_iterations * size -> in this case, we will go over-board with bytesRead, so we need to calc correct end
        let end = size - (bytesRead - stats.size);
        yield sharedBuffer.slice(0, end);
      } else {
        yield sharedBuffer;
      }

    } else {
      yield prevChunkPending + linesInChunk[0];
      for (let j = 1; j < linesInChunk.length-1; j++) {
        yield linesInChunk[j];
      }
      prevChunkPending = linesInChunk[linesInChunk.length-1];
    }
    
  }
}

module.exports = { readLog, searchLog };