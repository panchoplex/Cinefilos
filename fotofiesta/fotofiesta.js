let video = document.getElementById('camera-preview');
let canvas = document.getElementById('capture-canvas');
let instantSection = document.getElementById('instant-section');
let crudaSection = document.getElementById('cruda-section');
let stripDiv = document.getElementById('strip');
let galleryDiv = document.getElementById('cruda-gallery');

const instantModeBtn = document.getElementById('instant-mode-btn');
const crudaModeBtn = document.getElementById('cruda-mode-btn');

instantModeBtn.onclick = () => {
  instantSection.classList.remove('hidden');
  crudaSection.classList.add('hidden');
};

crudaModeBtn.onclick = () => {
  crudaSection.classList.remove('hidden');
  instantSection.classList.add('hidden');
  loadCrudaGallery();
};

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error('Camera error', err);
  }
}

startCamera();

// Instant Mode
const startStripBtn = document.getElementById('start-strip');
startStripBtn.onclick = async () => {
  stripDiv.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    await countdown(3);
    const img = takePhoto();
    stripDiv.appendChild(img);
  }
};

function countdown(sec) {
  return new Promise(resolve => {
    let counter = sec;
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.fontSize = '48px';
    document.body.appendChild(overlay);
    const interval = setInterval(() => {
      overlay.textContent = counter;
      counter--;
      if (counter < 0) {
        clearInterval(interval);
        document.body.removeChild(overlay);
        resolve();
      }
    }, 1000);
  });
}

function takePhoto() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);
  const data = canvas.toDataURL('image/png');
  const img = new Image();
  img.src = data;
  return img;
}

// Cruda Mode
const takeCrudaBtn = document.getElementById('take-cruda');
takeCrudaBtn.onclick = () => {
  const img = takePhoto();
  const delayHours = parseInt(document.getElementById('delay-hours').value, 10);
  const revealAt = Date.now() + delayHours * 60 * 60 * 1000;
  const entry = { img: img.src, revealAt };
  const items = JSON.parse(localStorage.getItem('crudaPhotos') || '[]');
  items.push(entry);
  localStorage.setItem('crudaPhotos', JSON.stringify(items));
  loadCrudaGallery();
};

function loadCrudaGallery() {
  galleryDiv.innerHTML = '';
  const items = JSON.parse(localStorage.getItem('crudaPhotos') || '[]');
  const now = Date.now();
  items.forEach((item, index) => {
    const wrapper = document.createElement('div');
    const img = new Image();
    if (now >= item.revealAt) {
      img.src = item.img;
    } else {
      img.src = '';
      img.alt = 'Locked';
      const remaining = Math.max(0, item.revealAt - now);
      const span = document.createElement('span');
      span.textContent = formatRemaining(remaining);
      wrapper.appendChild(span);
      setInterval(() => {
        const left = item.revealAt - Date.now();
        span.textContent = formatRemaining(left);
        if (left <= 0) loadCrudaGallery();
      }, 1000);
    }
    wrapper.appendChild(img);
    galleryDiv.appendChild(wrapper);
  });
}

function formatRemaining(ms) {
  if (ms <= 0) return 'Ready';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}h ${m}m ${s}s`;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
