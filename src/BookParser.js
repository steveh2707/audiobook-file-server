function getSeriesName(seriesNameAndNumber) {
    return seriesNameAndNumber.split('#')[0].trim();
}

function getNumInSeries(seriesNameAndNumber) {
    return seriesNameAndNumber.split('#')[1].split(' ')[0].trim();
}

function getImagePath(filePathComponents, imageName) {
    const imageDirectory = filePathComponents.slice(0, -1)
    imageDirectory.push(imageName)

    return encodeURLWithHash(imageDirectory)
}

function encodeURLWithHash(filePathComponents) {
    const encodedParts = filePathComponents.map(part => {
        return encodeURIComponent(part);
    });
    return encodedParts.join("/");
}

export { getSeriesName, getNumInSeries, getImagePath }