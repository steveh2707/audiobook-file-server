function getSeriesName(seriesNameAndNumber) {
    return seriesNameAndNumber.split('#')[0].trim();
}

function getNumInSeries(seriesNameAndNumber) {
    return seriesNameAndNumber.split('#')[1].split(' ')[0].trim();
}


function encodeURLWithHash(url) {
    const parts = url.split("/");

    const encodedParts = parts.map(part => {
        return encodeURIComponent(part);
    });

    return encodedParts.join("/");
}

export { getSeriesName, getNumInSeries, encodeURLWithHash }