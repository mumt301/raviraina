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

    // make new request with newly obtained MBID
    httpGet(disco_query, getArtistDisco)
}

// function to get an artists discography
function getArtistDisco(xhttp) {
    let retrievedData = xhttp.responseXML;
    const artistData = retrievedData.getElementsByTagName("release-group");
    const ar = [
        [],
        []
    ];

    // fill 2D array with release title in one and date in other
    for (var i = 0; i < artistData.length; i++) {
        ar[0].push(artistData[i].getElementsByTagName("title")[0].innerHTML)
        ar[1].push(artistData[i].getElementsByTagName("first-release-date")[0].innerHTML)
    }

    // Below code is from stackoverflow, I will change it to simplify the process
    // map our values so we can add it to a table
    table = document.querySelector('table tbody');
    var r = ar[0].map(function (col, i) {
        return ar.map(function (row) {
            return row[i];
        });
    });

    // append our data to the HTML table
    r.forEach(function (e) {
        table.innerHTML += '<tr><td>' + e[0] + '</td><td>' + e[1] + '</td></tr>'
    })

}

window.onload = queryArtist;