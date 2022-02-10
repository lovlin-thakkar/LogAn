const fs = require('fs')

// my implementation added as a import from other files
const reader = require('./reader.js')

async function searchLog(filePath, chunkSize, searchString) {
  console.log("___________________________________________________________________________");
  let previousChunk = "";

  for await(const chunk of generateChunks(filePath, chunkSize)) {
    const data = chunk.toString('utf8');
  
    if (data.includes(previousChunk + searchString)) {
      return data;
    } else {
      previousChunk = data;
    }
  }

  return "No results found for the keyword!"
}

async function* generateChunks(filePath, size) {
  const sharedBuffer = Buffer.alloc(size);
  const stats = fs.statSync(filePath);
  //console.log(stats);
  const fd = fs.openSync(filePath);
  let bytesRead = 0;

  // number of iterations needed to read 'size' long data from stats.size long file
  for (let i = 0; i < Math.ceil(stats.size / size); i++) {
    await reader.readBytes(fd, sharedBuffer, null);
    bytesRead = (i + 1) * size; // total bytes read - including this iterations
    if (bytesRead > stats.size) {
      // file may not be exactly the size ==> sometimes stats.size != n_iterations * size -> in this case, we will go over-board with bytesRead, so we need to calc correct end
      let end = size - (bytesRead - stats.size);
      yield sharedBuffer.slice(0, end);
    } else {
      yield sharedBuffer;
    }
  }
}

module.exports = { searchLog };