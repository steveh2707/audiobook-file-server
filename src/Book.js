export class Book {
    IMAGE_NAME = "cover.jpg"

    constructor(filePath, stats) {
        this.filePath = filePath
        this.setFilePathComponents()
        this.setFileName()
        this.setTitle()
        this.setAuthor()
        this.setDirectory()
        this.setSeriesDetails()
        this.setImagePath()
        this.fileSizeMB = Math.round(stats.size / 1000000)
        this.dateAdded = stats.mtime.toISOString()
    }

    setFilePathComponents() {
        this.filePathComponents = this.filePath.split("/")
    }

    setFileName() {
        this.fileName = this.filePathComponents[this.filePathComponents.length-1]
    }

    setTitle() {
        this.title = this.fileName.split(".m4b")[0];
    }

    setAuthor() {
        this.author = this.filePathComponents[1]
    }

    setDirectory() {
        this.directory = this.filePathComponents.slice(0, this.filePathComponents.length - 1).join("/")
    }

    setSeriesDetails() {
        const isBookInASeries = this.filePathComponents[2].includes("#")
        if (isBookInASeries) {
            this.numInSeries = this.filePathComponents[2].split('#')[1].split(' ')[0].trim();
            this.seriesName = this.filePathComponents[2].split('#')[0].trim();
        } else {
            this.numInSeries = "";
            this.seriesName = "";
        }
    }

    setImagePath() {
        const imageDirectory = this.filePathComponents.slice(0, -1)
        imageDirectory.push(this.IMAGE_NAME)

        const encodedParts = imageDirectory.map(part => {
            return encodeURIComponent(part);
        });
        this.imagePath = encodedParts.join("/");
    }

    getBookDetails() {
        return {
            "author": this.author,
            "title": this.title,
            "image": this.imagePath,
            "series": this.seriesName,
            "numInSeries": this.numInSeries,
            "filePath": this.filePath,
            "filePathEncoded": encodeURIComponent(this.filePath),
            "fileName": this.fileName,
            "fileSizeMB": this.fileSizeMB,
            "dateAdded": this.dateAdded
        }
    }
}

