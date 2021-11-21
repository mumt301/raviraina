// base code from in-class demo
function queryArtist() {
    let params = (new URL(document.location)).searchParams;
    if (params.has('artist')) {
        let artistName = params.get('artist');
        let mbBaseURL = "https://musicbrainz.org/ws/2/";
        let mbResource = "artist?query=";
        let queryURL = mbBaseURL + mbResource + artistName;
        httpGet(queryURL, getMBID);
    }
}

// base code from in-class demo
function httpGet(theURL, cbFunction) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theURL);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cbFunction(this);
        }
    };
}

// modified function from in-class demo
function getMBID(xhttp) {
    let retrievedData = xhttp.responseXML;
    let artistData = retrievedData.getElementsByTagName("artist")[0];
    let artistMBID = artistData.id;
    let url = 'https://musicbrainz.org/ws/2/artist/';
    let params = '?inc=release-groups';
    let disco_query = url + artistMBID + params;

    // make new request with obtained MBID
    httpGet(disco_query, getArtistDisco)
}

// function to get an artists discography
function getArtistDisco(xhttp) {

    // get response and extract release group data
    let retrievedData = xhttp.responseXML;
    const artistData = retrievedData.getElementsByTagName("release-group");

    // Append album's and dates to table
    let table_entries = '<tr><th>Album/EP</th><th>Release Date</th></tr>';
    for (var i = 0; i < artistData.length; i++) {
        let title = artistData[i].getElementsByTagName("title")[0].innerHTML;
        let date = artistData[i].getElementsByTagName("first-release-date")[0].innerHTML;
        table_entries += `<tr><td>${title}</td><td>${date}</td></tr>`;
    }

    // select and append to table
    table = document.querySelector('table tbody');
    table.innerHTML = table_entries;
}

window.onload = queryArtist;