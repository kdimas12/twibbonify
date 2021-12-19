// const templateImageData = 'https://i.imgur.com/WS8sJsx.png';
const templateImageData = 'http://localhost:5500/assets/img/transparan.png';

$(document).ready(function () {
  const canvas = $('canvas#canvas').get(0);
  const context = canvas.getContext('2d');

  $('#tombol-klos').click(function (e) {
    $('#sweet-alert').hide();
  });

  $('button#proses').click(async function (e) {
    const userFile = getUserFile();
    if (!userFile) {
      $('#pesan-alert').html(
        'Kamu belum upload filenya atau kamu file yang kamu masukkan bukan file gambar!',
      );
      $('#sweet-alert').show();
      return -1;
    }
    const userFileAsURL = await getFileAsURL(userFile);
    renderCanvasWithUserImage(
      canvas,
      canvas.width,
      canvas.height,
      userFileAsURL,
    );
    $('#tombol-penting').show('slow');
  });

  $('#mulai-btn').click(function () {
    $('html, body').animate(
      {
        scrollTop: $('#upload-section').offset().top,
      },
      500,
    );
  });

  $('#download-btn').click(function () {
    $('#template-used').get(0).crossOrigin = 'anonymous';
    context.drawImage(
      $('#template-used').get(0),
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const btnDownload = document.createElement('a');
    btnDownload.download = `twibbonify_${Math.floor(
      Math.random() * (999999 - 666666 + 1),
    )}.png`;
    btnDownload.href = document.querySelector('canvas#canvas').toDataURL();
    btnDownload.click();
    // context.clearRect(0, 0, canvas.width, canvas.height);
  });

  $('#reset-btn').click(async function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const templateCustom = await getFileAsURLThroughURL(templateImageData);
    $('#template-used').attr('src', templateCustom);
    $('input[type=file]').val('');
    $('#tombol-penting').hide();
  });

  $('#template-list').slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    adaptiveHeight: true,
  });

  $('#template-list div img').click(async function (e) {
    const templateCustom = await getFileAsURLThroughURL(e.target.src);
    $('#template-used').attr('src', templateCustom);
    const userFile = getUserFile();
    if (!userFile) return -1;
    const userFileAsURL = await getFileAsURL(userFile);
    renderCanvasWithUserImage(
      canvas,
      canvas.width,
      canvas.height,
      userFileAsURL,
    );
  });
});

// important function
function downloadTwibbonResult(e) {
  const btn = document.createElement('a');
  btn.download = `twibbonify_${Math.floor(
    Math.random() * (999999 - 666666 + 1),
  )}.png`;
  btn.href = document.querySelector('canvas#canvas').toDataURL();
  btn.click();
  return -1;
}

function firstRenderCanvas(context, coorX, coorY) {
  context.fillStyle = '#f2f5f6';
  context.fillRect(0, 0, coorX, coorY);

  const defaultTemplate = new Image();
  defaultTemplate.crossOrigin = 'anonymous';
  defaultTemplate.src = templateImageData;

  defaultTemplate.onload = function () {
    context.drawImage(defaultTemplate, 0, 0, coorX, coorY);
  };
}

function renderCanvasWithUserImage(canvas, coorX, coorY, userCustomImage) {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, coorX, coorY);
  context.fillStyle = '#F2F5F6';
  context.fillRect(0, 0, coorX, coorY);

  const userImage = new Image();
  userImage.crossOrigin = 'anonymous';
  userImage.src = userCustomImage;
  userImage.onload = function () {
    const scaleImage = Math.max(
      canvas.width / userImage.width,
      canvas.height / userImage.height,
    );

    const imgX = canvas.width / 2 - (userImage.width / 2) * scaleImage;
    const imgY = canvas.height / 2 - (userImage.height / 2) * scaleImage;
    context.drawImage(
      userImage,
      imgX,
      imgY,
      userImage.width * scaleImage,
      userImage.height * scaleImage,
    );
  };
}

function getFileAsURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(event.target.result);
    reader.readAsDataURL(file);
  });
}

function getFileAsURLThroughURL(url) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url);
    const data = await response.blob();
    const file = new File([data], 'template', {
      type: response.headers.get('content-type') || 'image/jpeg',
    });
    resolve(await getFileAsURL(file));
  });
}

function getUserFile() {
  const userInput = $('input[type=file]').get(0);

  if (userInput.files === undefined || userInput.files.length === 0) {
    return undefined;
  }

  const userFile = userInput.files[0];
  const validExtension = ['jpeg', 'jpg', 'png', 'JPEG', 'JPG'].includes(
    userFile.name.split('.')[1],
  );
  const validMIME = ['image/jpeg', 'image/png'].includes(userFile.type);

  if (!validExtension || !validMIME) {
    return undefined;
  }
  return userFile;
}
