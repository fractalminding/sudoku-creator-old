function setUpDownloadPageAsImage() {
    //let board = document.querySelector('#board-outer')
    let downloadButton = document.getElementById("download-button")
    downloadButton.onclick = function() {
      html2canvas(document.querySelector('#board')).then(function(canvas) {
        console.log(canvas);
        simulateDownloadImageClick(canvas.toDataURL(), 'sudoku.png');
      });
    };
  }
  
  function simulateDownloadImageClick(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download !== 'string') {
      window.open(uri);
    } else {
      link.href = uri;
      link.download = filename;
      accountForFirefox(clickLink, link);
    }
  }
  
  function clickLink(link) {
    link.click();
  }
  
  function accountForFirefox(click) { // wrapper function
    let link = arguments[1];
    document.body.appendChild(link);
    click(link);
    document.body.removeChild(link);
  }