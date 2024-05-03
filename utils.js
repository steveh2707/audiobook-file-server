const fs = require("fs");
const path = require("path");

function findM4bFiles(directoryPath, lastAccessedDate) {
    const stack = [directoryPath];
    const fileList = [];

    while (stack.length > 0) {
        const currentDir = stack.pop();
        const files = fs.readdirSync(currentDir);

        files.forEach(function (file) {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);

            const filePathComponents = filePath.split("/")
            if (filePathComponents[filePathComponents.length - 1] === "_ss") {
                console.log(`skipped: ${filePath}`)
            } else if (stat && stat.isDirectory()) {
                stack.push(filePath);
            } else if (filePath.endsWith('.m4b')) {
                const fileName = path.basename(filePath)
                const newBook = {
                    "author": filePath.split("/")[1],
                    "title": fileName.split(".m4b")[0],
                    "image": encodeURI(`${currentDir}/cover.jpg`),
                    "series": getSeriesName(filePath),
                    "numInSeries": getNumInSeries(filePath),
                    "filePath": filePath,
                    "filePathEncoded": encodeURIComponent(filePath),
                    "fileName": fileName,
                    "fileSizeMB": Math.round(stat.size / 1000000),
                    "dateAdded": stat.birthtime
                }
                fileList.push(newBook);
                console.log(newBook)
            }
        });
    }

    fileList.sort(sortByAuthor);

    return fileList;
}

function sortByAuthor(a, b) {
    const authorA = a.author.toLowerCase();
    const authorB = b.author.toLowerCase();

    if (authorA < authorB) {
        return -1; // authorA comes before authorB
    }
    if (authorA > authorB) {
        return 1; // authorA comes after authorB
    }

    if (a.series && b.series) {
        const bookInSeriesA = a.series.toLowerCase() + " " + a.numInSeries;
        const bookInSeriesB = b.series.toLowerCase() + " " + b.numInSeries;

        if (bookInSeriesA < bookInSeriesB) {
            return -1; // authorA comes before authorB
        }
        if (bookInSeriesA > bookInSeriesB) {
            return 1; // authorA comes after authorB
        }
    }

    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (titleA < titleB) {
        return -1; // authorA comes before authorB
    }
    if (titleA > titleB) {
        return 1; // authorA comes after authorB
    }

    return 0; // authors are equal
}


function getSeriesName(filePath) {
    const parts = filePath.split('/');
    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].includes('#')) {
            return parts[i].split('#')[0].trim();
        }
    }
    return null; // If no item with "#" character found
}

function getNumInSeries(filePath) {
    const parts = filePath.split('/');
    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].includes('#')) {
            return parts[i].split('#')[1].split(' ')[0].trim();
        }
    }
    return null; // If no item with "#" character found
}


module.exports = {findM4bFiles, sortByAuthor}