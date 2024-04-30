const fs = require("fs");
const path = require("path");

const stack = ["/Volumes/steve/Media/Audiobooks"];
const fileList = [];
let lastAccessedDate = new Date(1900,1)


while (stack.length > 0) {
    const currentDir = stack.pop();
    const files = fs.readdirSync(currentDir);

    files.forEach(function (file) {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);

        if (stat.mtime > lastAccessedDate) {
            if (stat && stat.isDirectory()) {
                stack.push(filePath);
            } else if (filePath.endsWith('.m4b')) {
                const fileName = path.basename(filePath)
                fileList.push({
                    "author": filePath.split("/")[5],
                    "title": fileName.split(".m4b")[0],
                    "series": getSeriesName(filePath),
                    "numInSeries": getNumInSeries(filePath),
                    "filePath": filePath,
                    "filePathEncoded": encodeURIComponent(filePath),
                    "fileName": fileName,
                    "fileSizeMB": Math.round(stat.size / 1000000)
                });
            }
        }
    });
}

fileList.sort(sortByAuthor);

return fileList;
