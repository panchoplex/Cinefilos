const video = document.getElementById('camera-preview');
const canvas = document.getElementById('capture-canvas');
const galleryDiv = document.getElementById('cruda-gallery');
const sessionArea = document.getElementById('sessionArea');
const setupDiv = document.getElementById('setup');
const usernameInput = document.getElementById('usernameInput');
const revealInput = document.getElementById('revealInput');
const createSessionBtn = document.getElementById('createSessionBtn');
const joinSessionBtn = document.getElementById('joinSessionBtn');
const joinSessionArea = document.getElementById('joinSessionArea');
const qrContainer = document.getElementById('qrContainer');
const sessionInfo = document.getElementById('sessionInfo');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const participantsDiv = document.getElementById('participants');
const inviteBtn = document.getElementById('inviteBtn');
const inviteModal = document.getElementById('inviteModal');
const inviteLinkP = document.getElementById('inviteLink');
const copyInviteBtn = document.getElementById('copyInvite');
const inviteQrDiv = document.getElementById('inviteQr');
const closeInviteBtn = document.getElementById('closeInvite');

let currentSessionId = null;
let currentSession = null;
let username = null;

function getSessions() {
  return JSON.parse(localStorage.getItem('ff_sessions') || '{}');
}

function saveSessions(data) {
  localStorage.setItem('ff_sessions', JSON.stringify(data));
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch(err) {
    console.error('Camera error', err);
  }
}

function capturePhoto() {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/png');
}

function loadGallery() {
  galleryDiv.innerHTML = '';
  const now = Date.now();
  const photos = currentSession.photos || [];
  photos.forEach(p => {
    const wrapper = document.createElement('div');
    const img = new Image();
    if (now >= currentSession.revealAt) {
      img.src = p.img;
      const caption = document.createElement('div');
      caption.textContent = p.user;
      wrapper.appendChild(img);
      wrapper.appendChild(caption);
    } else {
      img.alt = 'Locked';
      wrapper.textContent = 'Locked until ' + new Date(currentSession.revealAt).toLocaleString();
    }
    wrapper.appendChild(img);
    galleryDiv.appendChild(wrapper);
  });
}

function updateParticipants() {
  participantsDiv.innerHTML = '';
  (currentSession.participants || []).forEach(name => {
    const div = document.createElement('div');
    const initials = name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    div.innerHTML = `<span>${initials}</span><span>${name}</span>`;
    participantsDiv.appendChild(div);
  });
}

function generateQr() {
  qrContainer.innerHTML = '';
  const url = `${location.origin}${location.pathname}?session=${currentSessionId}`;
  QRCode.toCanvas(url, { width: 200 }, function (err, canvas) {
    if (!err) qrContainer.appendChild(canvas);
  });
}

function openInviteModal() {
  const url = `${location.origin}${location.pathname}?session=${currentSessionId}`;
  inviteLinkP.textContent = url;
  inviteQrDiv.innerHTML = '';
  QRCode.toCanvas(url, {width:200}, (err, canvas)=>{ if(!err) inviteQrDiv.appendChild(canvas); });
  inviteModal.style.display = 'flex';
}

function startSession(isCreator) {
  setupDiv.classList.add('hidden');
  sessionArea.classList.remove('hidden');
  startCamera();
  sessionInfo.textContent = 'Reveal at ' + new Date(currentSession.revealAt).toLocaleString();
  if (isCreator) {
    generateQr();
    inviteBtn.style.display = 'flex';
  } else {
    qrContainer.classList.add('hidden');
    inviteBtn.style.display = 'none';
  }
  loadGallery();
  updateParticipants();
}

createSessionBtn.onclick = () => {
  username = usernameInput.value.trim();
  const revealAt = new Date(revealInput.value).getTime();
  if (!username || !revealAt) {
    alert('Enter username and reveal time');
    return;
  }
  localStorage.setItem('ff_username', username);
  currentSessionId = 's' + Date.now();
  const sessions = getSessions();
  sessions[currentSessionId] = { revealAt, photos: [], creator: username, participants: [username] };
  saveSessions(sessions);
  currentSession = sessions[currentSessionId];
  startSession(true);
};

joinSessionBtn.onclick = () => {
  username = usernameInput.value.trim();
  if (!username) { alert('Enter username'); return; }
  localStorage.setItem('ff_username', username);
  const sessions = getSessions();
  currentSession = sessions[currentSessionId];
  if (!currentSession) { alert('Session not found'); return; }
  if (!currentSession.participants) currentSession.participants = [];
  if (!currentSession.participants.includes(username)) {
    currentSession.participants.push(username);
    saveSessions(sessions);
  }
  startSession(false);
};

takePhotoBtn.onclick = () => {
  const data = capturePhoto();
  const sessions = getSessions();
  const sess = sessions[currentSessionId];
  if (!sess) return;
  sess.photos.push({ img: data, user: username });
  saveSessions(sessions);
  loadGallery();
};

function init() {
  const urlParams = new URLSearchParams(location.search);
  const sid = urlParams.get('session');
  if (sid) {
    currentSessionId = sid;
    joinSessionArea.classList.remove('hidden');
    document.getElementById('createSessionArea').classList.add('hidden');
  }
  const savedName = localStorage.getItem('ff_username');
  if (savedName) usernameInput.value = savedName;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

document.addEventListener('DOMContentLoaded', init);

inviteBtn.addEventListener('click', openInviteModal);
closeInviteBtn.addEventListener('click', () => inviteModal.style.display = 'none');
copyInviteBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(inviteLinkP.textContent);
  copyInviteBtn.textContent = 'Copied!';
  setTimeout(()=>{copyInviteBtn.textContent='Copy Link';},1500);
});

inviteModal.addEventListener('click', (e) => {
  if (e.target === inviteModal) inviteModal.style.display = 'none';
});

usernameInput.addEventListener('change', () => {
  localStorage.setItem('ff_username', usernameInput.value.trim());
});
