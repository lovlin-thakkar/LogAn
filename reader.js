const fs = require('fs')

function readBytes(fd, sharedBuffer, offset) {
  return new Promise((resolve, reject) => {
    fs.read(
      fd,
      sharedBuffer,
      0,
      sharedBuffer.length,
      offset,
      (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      }
    );
  });
}

module.exports = { readBytes };