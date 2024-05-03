const fs = require('fs');

function extractCoverImage(filePath) {
    return new Promise((resolve, reject) => {
        fs.open(filePath, 'r', (err, fd) => {
            if (err) {
                reject(err);
                return;
            }

            const buffer = Buffer.alloc(512); // Read the first 512 bytes
            fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(data)
                // Check if the file contains an embedded cover image
                const imageOffset = data.indexOf('----\0'); // Adjust this based on the actual offset of your cover image
                if (imageOffset !== -1) {
                    // Extract the cover image data
                    const imageData = data.slice(imageOffset + 5); // Skip '----\0' characters
                    // Write the image data to a file
                    const imageFileName = 'cover.jpg'; // You can specify a different file name if needed
                    fs.writeFile(imageFileName, imageData, err => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(imageFileName);
                    });
                } else {
                    resolve(null); // No cover image found
                }

                fs.close(fd, err => {
                    if (err) {
                        console.error('Error closing file:', err);
                    }
                });
            });
        });
    });
}

// Example usage:
const filePath = '/Users/steve/Documents/Temp/Ramez Naam/Nexus #3 - Apex/Apex.m4b'
extractCoverImage(filePath)
    .then(imageFileName => {
        if (imageFileName) {
            console.log(`Cover image extracted and saved as ${imageFileName}`);
        } else {
            console.log('No cover image found in the file.');
        }
    })
    .catch(err => {
        console.error('An error occurred:', err);
    });
