/* global $ addImage showImage clearImages*/

const imageContainer = $('#imageContainer');
let currentImage;

/* eslint no-unused-vars: "off" */
function addImage(url) {
  const image = $('<img/>');
  image.attr('src', url);

  imageContainer.append(image); // To be change to img tag

  if (image.is(':first-child')) {
    currentImage = image;
  } else {
    image.hide();
  }
  return image;
}

function showImage(image) {
  currentImage.hide();
  currentImage = image;
  currentImage.show();
  currentImage.trigger('show');
}

function nextImage() {
  let nextImage;
  nextImage = currentImage.next();
  if (nextImage.length===0) {
    nextImage = imageContainer.children().first();
  }
  showImage(nextImage);
}

$('#nextButton').click(()=>nextImage());

function prevImage() {
  let prevImage = currentImage.prev();
  if (prevImage.length===0) {
    prevImage = imageContainer.children().last();
  }
  showImage(prevImage);
}

$('#prevButton').click(()=>prevImage());

function clearImages() {
  imageContainer.empty();
}


// let img1 = addImage('http://img.avatv.fi/mn_kuvat/mtv3/helmi/minisaitit/kapalakerho/kissat/2012/03/1356549.jpg');
// let img2 = addImage('http://img.avatv.fi/mn_kuvat/mtv3/helmi/minisaitit/kapalakerho/kissat/2012/05/1406247.jpg');
// This function call should show the 2nd image
// showImage(img2);
