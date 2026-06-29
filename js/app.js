// ============================================================
// Darts 501 Scoring App
// ============================================================

const THEME_STORAGE_KEY = 'darts501_theme';
const legWonAudio = new Audio('audio/leg-won.mp3');

// ============================================================
// Theme Switcher
// ============================================================

function applyTheme(theme, persist) {
  if (theme === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  // Update active state on theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });

  if (persist && db && currentUser && !currentUser.isAnonymous) {
    db.collection('users').doc(currentUser.uid).set({
      uid: currentUser.uid,
      theme: theme
    }, { merge: true }).catch(err => console.warn('Theme write failed:', err));
    if (currentUserDocCache) currentUserDocCache.theme = theme;
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) || 'default';
  applyTheme(saved, false);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme, true);
    });
  });
}

// Checkout suggestion table (scores 2-170)
const CHECKOUTS = {
  170: 'T20 T20 Bull',
  167: 'T20 T19 Bull',
  164: 'T20 T18 Bull',
  161: 'T20 T17 Bull',
  160: 'T20 T20 D20',
  158: 'T20 T20 D19',
  157: 'T20 T19 D20',
  156: 'T20 T20 D18',
  155: 'T20 T19 D19',
  154: 'T20 T18 D20',
  153: 'T20 T19 D18',
  152: 'T20 T20 D16',
  151: 'T20 T17 D20',
  150: 'T20 T18 D18',
  149: 'T20 T19 D16',
  148: 'T20 T16 D20',
  147: 'T20 T17 D18',
  146: 'T20 T18 D16',
  145: 'T20 T15 D20',
  144: 'T20 T18 D15',
  143: 'T20 T17 D16',
  142: 'T20 T14 D20',
  141: 'T20 T19 D12',
  140: 'T20 T16 D16',
  139: 'T20 T13 D20',
  138: 'T20 T14 D18',
  137: 'T20 T15 D16',
  136: 'T20 T20 D8',
  135: 'T20 T13 D18',
  134: 'T20 T14 D16',
  133: 'T20 T19 D8',
  132: 'T20 T16 D12',
  131: 'T20 T13 D16',
  130: 'T20 T18 D8',
  129: 'T19 T16 D12',
  128: 'T18 T14 D16',
  127: 'T20 T17 D8',
  126: 'T19 T15 D12',
  125: 'T20 T15 D10',
  124: 'T20 T16 D8',
  123: 'T19 T16 D9',
  122: 'T18 T18 D7',
  121: 'T20 T11 D14',
  120: 'T20 S20 D20',
  119: 'T19 T12 D13',
  118: 'T20 S18 D20',
  117: 'T20 S17 D20',
  116: 'T20 S16 D20',
  115: 'T20 S15 D20',
  114: 'T20 S14 D20',
  113: 'T20 S13 D20',
  112: 'T20 S12 D20',
  111: 'T20 S19 D16',
  110: 'T20 S10 D20',
  109: 'T20 S9 D20',
  108: 'T20 S16 D16',
  107: 'T19 S10 D20',
  106: 'T20 S6 D20',
  105: 'T20 S5 D20',
  104: 'T18 S10 D20',
  103: 'T20 S3 D20',
  102: 'T20 S2 D20',
  101: 'T20 S1 D20',
  100: 'T20 D20',
  99: 'T19 S10 D16',
  98: 'T20 D19',
  97: 'T19 D20',
  96: 'T20 D18',
  95: 'T19 D19',
  94: 'T18 D20',
  93: 'T19 D18',
  92: 'T20 D16',
  91: 'T17 D20',
  90: 'T18 D18',
  89: 'T19 D16',
  88: 'T16 D20',
  87: 'T17 D18',
  86: 'T18 D16',
  85: 'T15 D20',
  84: 'T20 D12',
  83: 'T17 D16',
  82: 'T14 D20',
  81: 'T19 D12',
  80: 'T20 D10',
  79: 'T13 D20',
  78: 'T18 D12',
  77: 'T15 D16',
  76: 'T20 D8',
  75: 'T17 D12',
  74: 'T14 D16',
  73: 'T19 D8',
  72: 'T16 D12',
  71: 'T13 D16',
  70: 'T18 D8',
  69: 'T19 D6',
  68: 'T20 D4',
  67: 'T17 D8',
  66: 'T10 D18',
  65: 'T19 D4',
  64: 'T16 D8',
  63: 'T13 D12',
  62: 'T10 D16',
  61: 'T15 D8',
  60: 'S20 D20',
  59: 'S19 D20',
  58: 'S18 D20',
  57: 'S17 D20',
  56: 'S16 D20',
  55: 'S15 D20',
  54: 'S14 D20',
  53: 'S13 D20',
  52: 'S12 D20',
  51: 'S11 D20',
  50: 'Bull',
  49: 'S9 D20',
  48: 'S16 D16',
  47: 'S15 D16',
  46: 'S6 D20',
  45: 'S13 D16',
  44: 'S4 D20',
  43: 'S3 D20',
  42: 'S10 D16',
  41: 'S9 D16',
  40: 'D20',
  39: 'S7 D16',
  38: 'D19',
  37: 'S5 D16',
  36: 'D18',
  35: 'S3 D16',
  34: 'D17',
  33: 'S1 D16',
  32: 'D16',
  31: 'S15 D8',
  30: 'D15',
  29: 'S13 D8',
  28: 'D14',
  27: 'S11 D8',
  26: 'D13',
  25: 'S9 D8',
  24: 'D12',
  23: 'S7 D8',
  22: 'D11',
  21: 'S5 D8',
  20: 'D10',
  19: 'S3 D8',
  18: 'D9',
  17: 'S1 D8',
  16: 'D8',
  15: 'S7 D4',
  14: 'D7',
  13: 'S5 D4',
  12: 'D6',
  11: 'S3 D4',
  10: 'D5',
  9: 'S1 D4',
  8: 'D4',
  7: 'S3 D2',
  6: 'D3',
  5: 'S1 D2',
  4: 'D2',
  3: 'S1 D1',
  2: 'D1'
};

// ============================================================
// Speech Synthesis (Pre-recorded audio with Web Audio API)
// ============================================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = new Map(); // clip name → AudioBuffer
let voiceReady = false;

// All audio segment filenames (without extension)
const VOICE_CLIPS = [
  '1'
];

async function preloadVoiceClips() {
  const results = await Promise.allSettled(
    VOICE_CLIPS.map(async name => {
      try {
        const res = await fetch(`audio/voice/${name}.mp3`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        const audioBuf = await audioCtx.decodeAudioData(buf);
        audioBuffers.set(name, audioBuf);
      } catch (err) {
        console.warn(`Voice clip missing: ${name}.mp3`);
      }
    })
  );
  voiceReady = audioBuffers.size > 0;
  console.log(`Voice: ${audioBuffers.size}/${VOICE_CLIPS.length} clips loaded`);
}

// Play a sequence of audio buffers back-to-back with no gap
function playBufferSequence(buffers) {
  if (buffers.length === 0) return Promise.resolve();

  return new Promise(resolve => {
    // Resume context if suspended (autoplay policy)
    if (audioCtx.state === 'suspended') audioCtx.resume();

    let offset = audioCtx.currentTime;
    let lastNode = null;

    for (const buf of buffers) {
      const source = audioCtx.createBufferSource();
      source.buffer = buf;
      source.connect(audioCtx.destination);
      source.start(offset);
      offset += buf.duration;
      lastNode = source;
    }

    if (lastNode) {
      lastNode.onended = resolve;
    } else {
      resolve();
    }
  });
}

// Speech queue — each item plays only after the previous finishes
const speechQueue = [];
let isSpeaking = false;

function speak(clipNames) {
  speechQueue.push(clipNames);
  if (!isSpeaking) processQueue();
}

async function processQueue() {
  if (speechQueue.length === 0) {
    isSpeaking = false;
    return;
  }

  isSpeaking = true;
  const clipNames = speechQueue.shift();

  if (voiceReady) {
    const buffers = clipNames
      .map(name => audioBuffers.get(name))
      .filter(Boolean);
    await playBufferSequence(buffers);
  }

  processQueue();
}

// Convert a number (0-180) to an array of clip names
function numberToClips(n) {
  const ones = ['zero','one','two','three','four','five','six','seven','eight','nine',
    'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

  if (n < 20) return [ones[n]];
  if (n < 100) {
    const clips = [tens[Math.floor(n / 10)]];
    if (n % 10) clips.push(ones[n % 10]);
    return clips;
  }
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  const clips = [ones[h], 'hundred'];
  if (remainder) {
    clips.push('and');
    clips.push(...numberToClips(remainder));
  }
  return clips;
}

function announceScore(points, busted) {
  if (busted) {
    speak(['bust']);
    return;
  }
  if (points === 180) {
    speak(['one-hundred-and-eighty']);
  } else if (points === 0) {
    speak(['no-score']);
  } else {
    speak(numberToClips(points));
  }
}

function announceCheckout(player) {
  const checkout = getCheckoutSuggestion(player.score);
  if (checkout) {
    speak(['you-require', ...numberToClips(player.score)]);
  }
}

function announceWinner() {
  speak(['game-shot-and-the-match']);
}

function playEventAudio(event) {
  switch (event.type) {
    case 'score':
      announceScore(event.points, false);
      if (event.checkoutPlayerScore && event.checkoutPlayerName) {
        const co = getCheckoutSuggestion(event.checkoutPlayerScore);
        if (co) speak(['you-require', ...numberToClips(event.checkoutPlayerScore)]);
      }
      break;
    case 'bust':
      announceScore(event.points, true);
      if (event.checkoutPlayerScore && event.checkoutPlayerName) {
        const co = getCheckoutSuggestion(event.checkoutPlayerScore);
        if (co) speak(['you-require', ...numberToClips(event.checkoutPlayerScore)]);
      }
      break;
    case 'legWon':
      legWonAudio.currentTime = 0;
      legWonAudio.play().catch(() => {});
      speak(['game-shot-and-the-leg']);
      break;
    case 'setWon':
      legWonAudio.currentTime = 0;
      legWonAudio.play().catch(() => {});
      speak(['game-shot-and-the-set']);
      break;
    case 'matchWon':
      legWonAudio.currentTime = 0;
      legWonAudio.play().catch(() => {});
      announceWinner();
      break;
    case 'gameStart':
      speak(['game-on']);
      break;
  }
}

function fireEvent(event) {
  game.lastEvent = event;
  lastProcessedEventId = event.id;
  playEventAudio(event);
}

// ============================================================
// Score Overlay Animation
// ============================================================

let scoreOverlayTimeout = null;

function showScoreOverlay(points, busted) {
  const overlay = document.getElementById('score-overlay');
  const scoreText = document.getElementById('score-overlay-text');

  if (scoreOverlayTimeout) {
    clearTimeout(scoreOverlayTimeout);
  }
  overlay.classList.remove('active');
  scoreText.classList.remove('big-score');
  void overlay.offsetWidth;

  if (busted) {
    scoreText.textContent = 'BUST!';
    scoreText.style.color = '#e94560';
  } else if (points === 180) {
    scoreText.textContent = '180!';
    scoreText.style.color = '#fdcb6e';
    scoreText.classList.add('big-score');
  } else if (points >= 100) {
    scoreText.textContent = points;
    scoreText.style.color = '#00b894';
    scoreText.classList.add('big-score');
  } else if (points === 0) {
    scoreText.textContent = 'No Score';
    scoreText.style.color = '#8899aa';
  } else {
    scoreText.textContent = points;
    scoreText.style.color = '#ffffff';
  }

  overlay.classList.add('active');

  scoreOverlayTimeout = setTimeout(() => {
    overlay.classList.remove('active');
  }, 1200);
}

// ============================================================
// Firebase Real-time Sync
// ============================================================

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
  measurementId: ENV.FIREBASE_MEASUREMENT_ID
};

let db = null;
let auth = null;
let currentUser = null;
let roomCode = null;
let isHost = false;
let unsubscribeGame = null;
let isOnline = false;
let lastProcessedEventId = null;
let firebaseAvailable = false;

function initFirebase() {
  try {
    if (typeof firebase === 'undefined' || !ENV.FIREBASE_API_KEY) {
      console.warn('Firebase not available — sign-in disabled');
      showFatalAuthError('Sign-in is unavailable. Please try again later.');
      return;
    }
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    firebaseAvailable = true;
  } catch (err) {
    console.error('Firebase init failed:', err);
    showFatalAuthError('Sign-in is unavailable. Please try again later.');
  }
}

function showFatalAuthError(msg) {
  const el = document.getElementById('login-error');
  if (el) el.textContent = msg;
  const btn = document.getElementById('google-signin-btn');
  if (btn) btn.disabled = true;
}

async function signInWithGoogle() {
  if (!firebaseAvailable) return;
  const errEl = document.getElementById('login-error');
  if (errEl) errEl.textContent = '';
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  } catch (err) {
    console.error('Sign-in failed:', err);
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return;
    }
    if (errEl) errEl.textContent = 'Sign-in failed. Please try again.';
  }
}

async function signOut() {
  if (!firebaseAvailable) return;
  try {
    if (isOnline) await leaveRoom();
  } catch {}
  try { await auth.signOut(); } catch (err) { console.error('Sign-out failed:', err); }
}

function onAuthChanged(user) {
  currentUser = user;
  if (user) {
    const chip = document.getElementById('user-chip');
    const avatar = document.getElementById('user-chip-avatar');
    const name = document.getElementById('user-chip-name');
    const signBtn = document.getElementById('sign-out-btn');
    const friendsCard = document.getElementById('friends-card');

    const onlineToggle = document.querySelector('.mode-toggle-btn[data-mode="online"]');
    const statsBtn = document.getElementById('stats-link-btn');
    if (user.isAnonymous) {
      if (avatar) avatar.style.display = 'none';
      if (name) name.textContent = 'Guest';
      if (signBtn) signBtn.textContent = 'Sign in';
      if (onlineToggle) onlineToggle.hidden = true;
      if (statsBtn) statsBtn.hidden = true;
      switchMode('local');
      stopHeartbeat();
      unsubscribeFriendships();
      unsubscribeChallenges();
    } else {
      if (avatar && user.photoURL) { avatar.src = user.photoURL; avatar.style.display = ''; }
      else if (avatar) { avatar.style.display = 'none'; }
      if (name) name.textContent = user.displayName || user.email || 'Signed in';
      if (signBtn) signBtn.textContent = 'Sign out';
      if (onlineToggle) onlineToggle.hidden = false;
      if (statsBtn) statsBtn.hidden = false;

      startHeartbeat();
      subscribeFriendships();
      subscribeChallenges();
      writeUserProfile(user).then(loadUserDoc).then(data => {
        applyUserChipName(data);
        if (data && data.theme) applyTheme(data.theme, false);
        // Default the local-play Player 1 input to the username if set,
        // falling back to the OAuth display name.
        const p1 = document.getElementById('player1-name');
        const preferredName = (data && data.username) || user.displayName || '';
        if (p1 && !p1.value.trim() && preferredName) p1.value = preferredName;
        checkCurrentGame();
      });
    }

    if (chip) chip.style.display = '';
    showScreen('setup-screen');
  } else {
    stopHeartbeat();
    unsubscribeFriendships();
    unsubscribeChallenges();
    showScreen('login-screen');
  }
}

const HEARTBEAT_INTERVAL_MS = 60000;
const ONLINE_THRESHOLD_MS = 90000;
let heartbeatInterval = null;

function startHeartbeat() {
  if (heartbeatInterval) return;
  heartbeatInterval = setInterval(() => {
    if (currentUser && !currentUser.isAnonymous) {
      writeUserProfile(currentUser);
      renderFriendships();
    }
  }, HEARTBEAT_INTERVAL_MS);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function writeUserProfile(user) {
  if (!db || !user) return Promise.resolve();
  return db.collection('users').doc(user.uid).set({
    uid: user.uid,
    displayName: user.displayName || '',
    email: (user.email || '').toLowerCase(),
    photoURL: user.photoURL || '',
    lastSeenAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch(err => console.warn('Profile write failed:', err));
}

let currentUserDocCache = null;

async function loadUserDoc() {
  if (!db || !currentUser) return null;
  try {
    const snap = await db.collection('users').doc(currentUser.uid).get({ source: 'server' });
    currentUserDocCache = snap.exists ? snap.data() : null;
  } catch (err) {
    console.warn('Load user doc failed:', err);
  }
  return currentUserDocCache;
}

function applyUserChipName(data) {
  const nameEl = document.getElementById('user-chip-name');
  if (!nameEl || !currentUser) return;
  const username = data && data.username;
  nameEl.textContent = username || currentUser.displayName || currentUser.email || 'Signed in';
}

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;
const USERNAME_COOLDOWN_MS = 24 * 60 * 60 * 1000;

function openUsernameDialog() {
  if (!currentUser || currentUser.isAnonymous) return;
  const overlay = document.getElementById('username-overlay');
  const input = document.getElementById('username-input');
  const error = document.getElementById('username-error');
  input.value = (currentUserDocCache && currentUserDocCache.username) || '';
  error.textContent = '';
  overlay.style.display = '';
  setTimeout(() => input.focus(), 50);
}

function closeUsernameDialog() {
  document.getElementById('username-overlay').style.display = 'none';
}

async function saveUsername() {
  const input = document.getElementById('username-input');
  const error = document.getElementById('username-error');
  const saveBtn = document.getElementById('username-save-btn');
  const raw = (input.value || '').trim();
  error.textContent = '';

  if (!USERNAME_RE.test(raw)) {
    error.textContent = 'Usernames must be 3–20 chars: A–Z, a–z, 0–9, _';
    return;
  }

  // Firestore doc IDs are case-sensitive — claim by the lowercase form so
  // uniqueness is case-insensitive. The user doc keeps the chosen casing.
  const claimKey = raw.toLowerCase();
  const existing = currentUserDocCache || {};
  const existingClaimKey = existing.username ? existing.username.toLowerCase() : null;

  if (existing.username === raw) {
    closeUsernameDialog();
    return;
  }

  // Skip cooldown for a casing-only change of your own username — no claim
  // moves, so the rate limit isn't protecting anything in that case.
  const casingOnly = existingClaimKey === claimKey;
  if (!casingOnly && existing.usernameUpdatedAt && typeof existing.usernameUpdatedAt.toMillis === 'function') {
    const elapsed = Date.now() - existing.usernameUpdatedAt.toMillis();
    if (elapsed < USERNAME_COOLDOWN_MS) {
      const hoursLeft = Math.ceil((USERNAME_COOLDOWN_MS - elapsed) / 3600000);
      error.textContent = `You can change your username again in about ${hoursLeft}h.`;
      return;
    }
  }

  saveBtn.disabled = true;
  try {
    const claimRef = db.collection('usernames').doc(claimKey);
    const claimSnap = await claimRef.get();
    if (claimSnap.exists && claimSnap.data().uid !== currentUser.uid) {
      error.textContent = 'That username is taken.';
      saveBtn.disabled = false;
      return;
    }

    await claimRef.set({ uid: currentUser.uid });

    if (existingClaimKey && existingClaimKey !== claimKey) {
      await db.collection('usernames').doc(existingClaimKey).delete().catch(() => {});
    }

    await db.collection('users').doc(currentUser.uid).set({
      uid: currentUser.uid,
      username: raw,
      usernameUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    currentUserDocCache = { ...existing, username: raw, usernameUpdatedAt: { toMillis: () => Date.now() } };
    applyUserChipName(currentUserDocCache);
    closeUsernameDialog();
  } catch (err) {
    console.error('Save username failed:', err);
    error.textContent = 'Could not save username. Please try again.';
    saveBtn.disabled = false;
  } finally {
    saveBtn.disabled = false;
  }
}

function setActiveGameRoom(code) {
  if (!db || !currentUser || currentUser.isAnonymous) return;
  const value = code
    ? code
    : firebase.firestore.FieldValue.delete();
  db.collection('users').doc(currentUser.uid).set({
    uid: currentUser.uid,
    activeGameRoomCode: value
  }, { merge: true }).catch(err => console.warn('activeGameRoom write failed:', err));
}

// ============================================================
// Match persistence + stats aggregation
// ============================================================

let lastPersistedMatchSig = null;
let lastPersistedSeriesSig = null;

function buildMatchData() {
  const participants = game.players.map(p => p.uid).filter(Boolean);
  const data = {
    participants,
    bestOfSets: game.bestOfSets,
    startingScore: game.startingScore,
    startedAt: game.startedAt,
    endedAt: game.endedAt || Date.now(),
    winnerIndex: game.winner,
    players: game.players.map(p => ({
      uid: p.uid || null,
      name: p.name,
      photoURL: p.photoURL || '',
      sets: p.sets,
      matchDarts: p.matchDarts,
      checkouts: p.checkouts.slice(),
      shotsAtCheckout: p.shotsAtCheckout || 0,
      matchVisits: p.matchVisits.slice()
    })),
    legs: game.legHistory || []
  };
  if (testSeries) {
    data.testSeriesId = `${testSeries.startedAt}_${roomCode || 'local'}`;
  }
  return data;
}

function statsFromMatch(matchData, myIndex) {
  const me = matchData.players[myIndex];
  const visits = me.matchVisits || [];
  const validVisits = visits.filter(v => !v.busted);
  const busts = visits.length - validVisits.length;
  const totalScore = validVisits.reduce((s, v) => s + v.score, 0);
  const c180 = validVisits.filter(v => v.score === 180).length;
  const c140 = validVisits.filter(v => v.score >= 140).length;
  const c100 = validVisits.filter(v => v.score >= 100).length;
  const highestVisit = validVisits.reduce((m, v) => Math.max(m, v.score), 0);
  const highestCheckout = me.checkouts.reduce((m, c) => Math.max(m, c), 0);

  let bestLeg = null;
  let first9Score = 0;
  let first9Darts = 0;
  for (const leg of matchData.legs || []) {
    if (leg.winner === myIndex) {
      const myLegDarts = leg.darts && leg.darts[myIndex];
      if (typeof myLegDarts === 'number' && (bestLeg === null || myLegDarts < bestLeg)) {
        bestLeg = myLegDarts;
      }
    }
    const myVisits = (leg.visits && leg.visits[myIndex]) || [];
    let darts = 0;
    let score = 0;
    for (const v of myVisits) {
      if (darts >= 9) break;
      if (!v.busted) score += v.score;
      darts += 3;
    }
    first9Score += score;
    first9Darts += Math.min(9, darts);
  }

  return {
    matchesPlayed: 1,
    matchesWon: matchData.winnerIndex === myIndex ? 1 : 0,
    totalDarts: me.matchDarts,
    totalScore,
    totalVisits: visits.length,
    bustCount: busts,
    count180: c180,
    count140Plus: c140,
    count100Plus: c100,
    highestVisit,
    highestCheckout,
    bestLeg,
    shotsAtCheckout: me.shotsAtCheckout || 0,
    successfulCheckouts: me.checkouts.length,
    first9Score,
    first9Darts,
    lastMatchAt: matchData.endedAt
  };
}

function mergeStats(existing, delta) {
  const merged = { ...existing };
  const add = (k) => { merged[k] = (existing[k] || 0) + (delta[k] || 0); };
  ['matchesPlayed','matchesWon','totalDarts','totalScore','totalVisits','bustCount',
   'count180','count140Plus','count100Plus','shotsAtCheckout','successfulCheckouts',
   'first9Score','first9Darts'].forEach(add);

  merged.highestVisit = Math.max(existing.highestVisit || 0, delta.highestVisit || 0);
  merged.highestCheckout = Math.max(existing.highestCheckout || 0, delta.highestCheckout || 0);
  if (typeof delta.bestLeg === 'number') {
    merged.bestLeg = existing.bestLeg ? Math.min(existing.bestLeg, delta.bestLeg) : delta.bestLeg;
  }

  if (delta.matchesWon === 1) {
    merged.currentWinStreak = (existing.currentWinStreak || 0) + 1;
    merged.longestWinStreak = Math.max(existing.longestWinStreak || 0, merged.currentWinStreak);
  } else {
    merged.currentWinStreak = 0;
  }

  if (delta.testSeriesPlayed) {
    merged.testSeriesPlayed = (existing.testSeriesPlayed || 0) + (delta.testSeriesPlayed || 0);
    merged.testSeriesWon = (existing.testSeriesWon || 0) + (delta.testSeriesWon || 0);
  }

  merged.lastMatchAt = delta.lastMatchAt;
  return merged;
}

async function persistMatchDoc(matchData) {
  if (!db) return;
  if (!matchData.participants || matchData.participants.length === 0) return;
  const matchId = `${matchData.startedAt}_${roomCode || 'local'}`;
  try {
    await db.collection('matches').doc(matchId).set(matchData, { merge: true });
  } catch (err) {
    console.warn('Match doc write failed:', err);
  }
}

async function persistOwnStats(matchData) {
  if (!db || !currentUser || currentUser.isAnonymous) return;
  const myIndex = matchData.players.findIndex(p => p.uid === currentUser.uid);
  if (myIndex < 0) return;
  const delta = statsFromMatch(matchData, myIndex);
  const ref = db.collection('userStats').doc(currentUser.uid);
  try {
    await db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const existing = snap.exists ? snap.data() : {};
      tx.set(ref, mergeStats(existing, delta));
    });
  } catch (err) {
    console.warn('userStats update failed:', err);
  }
}

async function persistFinishedMatch() {
  if (!game || !game.gameOver) return;
  const sig = `${game.startedAt}_${roomCode || 'local'}`;
  if (lastPersistedMatchSig === sig) return;
  lastPersistedMatchSig = sig;
  const matchData = buildMatchData();
  await Promise.all([
    persistMatchDoc(matchData),
    persistOwnStats(matchData)
  ]);
}

async function persistTestSeries() {
  if (!testSeries || !isSeriesOver()) return;
  if (!db || !currentUser || currentUser.isAnonymous) return;
  const seriesSig = `${testSeries.startedAt}_${roomCode || 'local'}`;
  if (lastPersistedSeriesSig === seriesSig) return;
  lastPersistedSeriesSig = seriesSig;
  const s = testSeries;
  const seriesWinner = s.matchWins[0] >= s.targetWins ? 0 : 1;
  const seriesId = `${s.startedAt}_${roomCode || 'local'}`;
  const participants = [s.playerInfo.uid1, s.playerInfo.uid2].filter(Boolean);
  if (participants.length === 0) return;

  const seriesData = {
    participants,
    players: [
      { uid: s.playerInfo.uid1 || null, name: s.playerInfo.name1, photoURL: s.playerInfo.photoURL1 || '', matchWins: s.matchWins[0] },
      { uid: s.playerInfo.uid2 || null, name: s.playerInfo.name2, photoURL: s.playerInfo.photoURL2 || '', matchWins: s.matchWins[1] }
    ],
    targetWins: s.targetWins,
    matchesPlayed: s.matchesPlayed,
    winnerIndex: seriesWinner,
    startedAt: s.startedAt,
    endedAt: Date.now(),
    bestOfSets: s.playerInfo.bestOfSets,
    startingScore: s.playerInfo.startingScore
  };

  try {
    await db.collection('testSeries').doc(seriesId).set(seriesData, { merge: true });
  } catch (err) {
    console.warn('Test series doc write failed:', err);
  }

  await persistTestSeriesStats(seriesData);
}

async function persistTestSeriesStats(seriesData) {
  if (!db || !currentUser || currentUser.isAnonymous) return;
  const myIndex = seriesData.players.findIndex(p => p.uid === currentUser.uid);
  if (myIndex < 0) return;
  const won = seriesData.winnerIndex === myIndex ? 1 : 0;
  const ref = db.collection('userStats').doc(currentUser.uid);
  try {
    await db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const existing = snap.exists ? snap.data() : {};
      tx.set(ref, {
        ...existing,
        testSeriesPlayed: (existing.testSeriesPlayed || 0) + 1,
        testSeriesWon: (existing.testSeriesWon || 0) + won
      });
    });
  } catch (err) {
    console.warn('Test series stats update failed:', err);
  }
}

// ============================================================
// Stats screen
// ============================================================

let statsMatchesCache = [];

function switchStatsTab(tab) {
  document.querySelectorAll('[data-stats-tab]').forEach(btn => {
    const active = btn.dataset.statsTab === tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('[data-stats-panel]').forEach(panel => {
    panel.hidden = panel.dataset.statsPanel !== tab;
  });
}

async function openStatsScreen() {
  if (!currentUser || currentUser.isAnonymous) return;
  showScreen('stats-screen');
  const empty = document.getElementById('stats-empty');
  const body = document.getElementById('stats-body');
  empty.hidden = true;
  body.hidden = false;
  try {
    const [statsSnap, matchesSnap] = await Promise.all([
      db.collection('userStats').doc(currentUser.uid).get({ source: 'server' }),
      db.collection('matches').where('participants', 'array-contains', currentUser.uid).get()
    ]);
    const stats = statsSnap.exists ? statsSnap.data() : null;
    const matches = matchesSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.endedAt || 0) - (b.endedAt || 0));
    statsMatchesCache = matches;
    if (!stats || !stats.matchesPlayed) {
      body.hidden = true;
      empty.hidden = false;
      return;
    }
    renderHeadlineStats(stats);
    renderRecords(stats);
    renderHeadToHead(matches);
    renderAverageChart(matches, stats);
    renderMatchesList(matches);
  } catch (err) {
    console.warn('Stats load failed:', err);
  }
}

function formatMatchDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return `Today ${time}`;
  if (isYesterday) return `Yesterday ${time}`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + time;
}

function renderMatchesList(matches) {
  const container = document.getElementById('stats-matches');
  if (!matches.length) {
    container.innerHTML = '<div class="friends-empty">No matches yet.</div>';
    return;
  }
  const me = currentUser.uid;
  const recent = matches.slice().reverse();
  container.innerHTML = recent.map(m => {
    const myIdx = m.players.findIndex(p => p.uid === me);
    if (myIdx < 0) return '';
    const oppIdx = myIdx === 0 ? 1 : 0;
    const opp = m.players[oppIdx] || {};
    const won = m.winnerIndex === myIdx;
    const photo = opp.photoURL
      ? `<img class="friend-avatar" src="${escapeHtml(opp.photoURL)}" alt="" referrerpolicy="no-referrer">`
      : '<div class="friend-avatar friend-avatar-placeholder"></div>';
    const mySets = m.players[myIdx].sets;
    const oppSets = opp.sets || 0;
    const seriesBadge = m.testSeriesId ? '<span class="match-row-series-badge">TS</span>' : '';
    return `
      <button class="match-row" data-match-id="${escapeHtml(m.id)}">
        <div class="friend-avatar-wrap">${photo}</div>
        <div class="match-row-info">
          <div class="match-row-opponent">vs. ${escapeHtml(opp.name || 'Unknown')}${seriesBadge}</div>
          <div class="match-row-date">${escapeHtml(formatMatchDate(m.endedAt))}</div>
        </div>
        <div class="match-row-score">${mySets}–${oppSets}</div>
        <span class="match-row-result ${won ? 'win' : 'loss'}">${won ? 'W' : 'L'}</span>
      </button>`;
  }).join('');
}

function openMatchDetail(matchId) {
  const m = statsMatchesCache.find(x => x.id === matchId);
  if (!m) return;
  const me = currentUser.uid;
  const myIdx = m.players.findIndex(p => p.uid === me);
  if (myIdx < 0) return;
  const oppIdx = myIdx === 0 ? 1 : 0;
  const opp = m.players[oppIdx] || {};
  const won = m.winnerIndex === myIdx;

  document.getElementById('match-detail-title').textContent = `vs. ${opp.name || 'Unknown'}`;

  function playerStatsBlock(p, isMe) {
    const visits = p.matchVisits || [];
    const valid = visits.filter(v => !v.busted);
    const total = valid.reduce((s, v) => s + v.score, 0);
    const avg = p.matchDarts ? (total / p.matchDarts) * 3 : 0;
    const highest = valid.reduce((mx, v) => Math.max(mx, v.score), 0);
    const c180 = valid.filter(v => v.score === 180).length;
    const c140 = valid.filter(v => v.score >= 140 && v.score < 180).length;
    const c100 = valid.filter(v => v.score >= 100 && v.score < 140).length;
    const checkoutPct = p.shotsAtCheckout ? (p.checkouts.length / p.shotsAtCheckout) * 100 : 0;
    const highestCheckout = (p.checkouts || []).reduce((mx, c) => Math.max(mx, c), 0);
    const photo = p.photoURL
      ? `<img src="${escapeHtml(p.photoURL)}" alt="" referrerpolicy="no-referrer">`
      : '<div class="friend-avatar-placeholder"></div>';
    return `
      <div class="stats-tile">
        <h4>${photo}<span>${escapeHtml(p.name || 'Player')}${isMe ? ' (you)' : ''}</span></h4>
        <div class="mps-row"><span class="mps-label">3-dart avg</span><span class="mps-value">${avg.toFixed(1)}</span></div>
        <div class="mps-row"><span class="mps-label">Sets / darts</span><span class="mps-value">${p.sets} · ${p.matchDarts}</span></div>
        <div class="mps-row"><span class="mps-label">Highest visit</span><span class="mps-value">${highest || '—'}</span></div>
        <div class="mps-row"><span class="mps-label">180 / 140+ / 100+</span><span class="mps-value">${c180} · ${c140} · ${c100}</span></div>
        <div class="mps-row"><span class="mps-label">Checkouts</span><span class="mps-value">${p.checkouts.length}/${p.shotsAtCheckout || 0} · ${checkoutPct.toFixed(0)}%</span></div>
        <div class="mps-row"><span class="mps-label">Best checkout</span><span class="mps-value">${highestCheckout || '—'}</span></div>
      </div>`;
  }

  function legBlock(leg, i) {
    const winnerName = m.players[leg.winner] ? m.players[leg.winner].name : 'Player';
    const totalDarts = (leg.darts && leg.darts[leg.winner]) || 0;
    const visitsFor = idx => (leg.visits && leg.visits[idx]) || [];
    function renderVisits(idx, isCheckoutPlayer) {
      const arr = visitsFor(idx);
      const last = arr.length - 1;
      const chips = arr.map((v, j) => {
        let cls = 'leg-visit-chip';
        if (v.busted) cls += ' bust';
        if (isCheckoutPlayer && j === last && !v.busted && leg.winner === idx) cls += ' checkout';
        return `<span class="${cls}">${v.score}</span>`;
      }).join('');
      return `<div class="leg-visit-row">
        <span class="leg-visit-name">${escapeHtml(m.players[idx].name)}</span>${chips}
      </div>`;
    }
    return `
      <div class="leg-detail">
        <div class="leg-detail-header">
          <span class="leg-detail-title">Leg ${i + 1}</span>
          <span class="leg-detail-meta">Won by ${escapeHtml(winnerName)} · ${totalDarts} darts · checkout ${leg.checkout ? leg.checkout.value : '—'}</span>
        </div>
        <div class="leg-detail-visits">
          ${renderVisits(0, true)}
          ${renderVisits(1, true)}
        </div>
      </div>`;
  }

  const oppPhoto = opp.photoURL
    ? `<img class="friend-avatar" src="${escapeHtml(opp.photoURL)}" alt="" referrerpolicy="no-referrer">`
    : '<div class="friend-avatar friend-avatar-placeholder"></div>';

  document.getElementById('match-detail-body').innerHTML = `
    <div class="match-detail-summary">
      <div class="match-detail-vs">
        <div class="friend-avatar-wrap">${oppPhoto}</div>
        <div>
          <div class="match-detail-vs-text">vs. <strong>${escapeHtml(opp.name || 'Unknown')}</strong></div>
          <div class="match-detail-vs-meta">${formatMatchDate(m.endedAt)} · ${m.startingScore} · ${formatMatchFormat(m.bestOfSets)}</div>
        </div>
      </div>
      <span class="match-detail-result ${won ? 'win' : 'loss'}">${won ? 'Won' : 'Lost'}</span>
    </div>
    <div class="match-player-stats">
      ${playerStatsBlock(m.players[myIdx], true)}
      ${playerStatsBlock(m.players[oppIdx], false)}
    </div>
    ${(m.legs || []).map(legBlock).join('')}
  `;

  showScreen('match-detail-screen');
}

function fmt(value, decimals) {
  if (value == null || isNaN(value)) return '—';
  return decimals === undefined ? String(value) : Number(value).toFixed(decimals);
}

function renderHeadlineStats(s) {
  const winRate = s.matchesPlayed ? (s.matchesWon / s.matchesPlayed) * 100 : 0;
  const avg = s.totalDarts ? (s.totalScore / s.totalDarts) * 3 : 0;
  const first9 = s.first9Darts ? (s.first9Score / s.first9Darts) * 3 : 0;
  const checkoutPct = s.shotsAtCheckout ? (s.successfulCheckouts / s.shotsAtCheckout) * 100 : 0;
  const tiles = [
    { label: '3-dart avg', value: fmt(avg, 1) },
    { label: 'First 9 avg', value: fmt(first9, 1) },
    { label: 'Matches', value: fmt(s.matchesPlayed), sub: `${fmt(s.matchesWon)}W / ${fmt(s.matchesPlayed - s.matchesWon)}L` },
    { label: 'Win %', value: fmt(winRate, 0) + '%' },
    { label: '180s', value: fmt(s.count180) },
    { label: 'Checkout %', value: fmt(checkoutPct, 0) + '%' }
  ];
  if (s.testSeriesPlayed) {
    tiles.push({ label: 'Test Series', value: fmt(s.testSeriesPlayed), sub: `${fmt(s.testSeriesWon || 0)}W / ${fmt((s.testSeriesPlayed || 0) - (s.testSeriesWon || 0))}L` });
  }
  document.getElementById('stats-headline').innerHTML = tiles.map(t => `
    <div class="stats-tile">
      <div class="stats-tile-label">${escapeHtml(t.label)}</div>
      <div class="stats-tile-value">${escapeHtml(String(t.value))}</div>
      ${t.sub ? `<div class="stats-tile-sub">${escapeHtml(t.sub)}</div>` : ''}
    </div>
  `).join('');
}

function renderRecords(s) {
  const records = [
    { label: 'Highest checkout', value: fmt(s.highestCheckout) },
    { label: 'Highest visit', value: fmt(s.highestVisit) },
    { label: 'Best leg (darts)', value: fmt(s.bestLeg) },
    { label: '140+', value: fmt(s.count140Plus) },
    { label: '100+', value: fmt(s.count100Plus) },
    { label: 'Busts', value: fmt(s.bustCount) },
    { label: 'Current streak', value: fmt(s.currentWinStreak) },
    { label: 'Longest streak', value: fmt(s.longestWinStreak) }
  ];
  document.getElementById('stats-records').innerHTML = records.map(r => `
    <div class="stats-tile">
      <div class="stats-tile-label">${escapeHtml(r.label)}</div>
      <div class="stats-tile-value">${escapeHtml(String(r.value))}</div>
    </div>
  `).join('');
}

// userStats is an incremental aggregate (mergeStats only sums/maxes forward).
// If the matches collection diverges from it (e.g. seed matches deleted out of
// band), this rebuild walks the user's current matches in chronological order
// and overwrites the userStats doc with the resulting aggregate.
async function recomputeUserStats() {
  if (!currentUser || currentUser.isAnonymous || !db) return;
  const btn = document.getElementById('recompute-stats-btn');
  const status = document.getElementById('recompute-status');
  if (!confirm('Rebuild Records from your current matches? This overwrites the stored totals.')) return;
  btn.disabled = true;
  status.textContent = 'Recomputing…';
  try {
    const snap = await db.collection('matches')
      .where('participants', 'array-contains', currentUser.uid).get();
    const matches = snap.docs.map(d => d.data())
      .sort((a, b) => (a.endedAt || 0) - (b.endedAt || 0));
    let agg = {};
    for (const m of matches) {
      const myIdx = m.players.findIndex(p => p.uid === currentUser.uid);
      if (myIdx < 0) continue;
      agg = mergeStats(agg, statsFromMatch(m, myIdx));
    }

    const seriesSnap = await db.collection('testSeries')
      .where('participants', 'array-contains', currentUser.uid).get();
    let seriesPlayed = 0, seriesWon = 0;
    for (const doc of seriesSnap.docs) {
      const s = doc.data();
      const myIdx = s.players.findIndex(p => p.uid === currentUser.uid);
      if (myIdx < 0) continue;
      seriesPlayed++;
      if (s.winnerIndex === myIdx) seriesWon++;
    }
    agg.testSeriesPlayed = seriesPlayed;
    agg.testSeriesWon = seriesWon;

    const ref = db.collection('userStats').doc(currentUser.uid);
    if (matches.length === 0 && seriesPlayed === 0) {
      await ref.delete();
      document.getElementById('stats-body').hidden = true;
      document.getElementById('stats-empty').hidden = false;
      status.textContent = 'No matches — cleared.';
    } else {
      await ref.set(agg);
      renderHeadlineStats(agg);
      renderRecords(agg);
      status.textContent = `Rebuilt from ${matches.length} match${matches.length === 1 ? '' : 'es'} and ${seriesPlayed} series.`;
    }
  } catch (err) {
    console.warn('Recompute failed:', err);
    status.textContent = 'Recompute failed — see console.';
  } finally {
    btn.disabled = false;
  }
}

function renderHeadToHead(matches) {
  const me = currentUser.uid;
  const byOpponent = new Map();
  for (const m of matches) {
    const myIdx = m.players.findIndex(p => p.uid === me);
    if (myIdx < 0) continue;
    const oppIdx = myIdx === 0 ? 1 : 0;
    const opp = m.players[oppIdx];
    if (!opp || !opp.uid) continue;
    const rec = byOpponent.get(opp.uid) || { name: opp.name, photoURL: opp.photoURL, wins: 0, losses: 0 };
    rec.name = opp.name; rec.photoURL = opp.photoURL;
    if (m.winnerIndex === myIdx) rec.wins++; else rec.losses++;
    byOpponent.set(opp.uid, rec);
  }
  const rows = [...byOpponent.values()].sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));
  const container = document.getElementById('stats-h2h');
  if (rows.length === 0) {
    container.innerHTML = '<div class="friends-empty">No online matches yet.</div>';
    return;
  }
  container.innerHTML = rows.map(r => {
    const photo = r.photoURL
      ? `<img class="friend-avatar" src="${escapeHtml(r.photoURL)}" alt="" referrerpolicy="no-referrer">`
      : '<div class="friend-avatar friend-avatar-placeholder"></div>';
    return `
      <div class="friend-row">
        <div class="friend-avatar-wrap">${photo}</div>
        <div class="friend-info">
          <div class="friend-name">${escapeHtml(r.name || 'Unknown')}</div>
        </div>
        <div class="stats-h2h-record">${r.wins}W – ${r.losses}L</div>
      </div>`;
  }).join('');
}

function renderAverageChart(matches, stats) {
  const wrap = document.getElementById('stats-chart-wrap');
  const me = currentUser.uid;
  const points = [];
  for (const m of matches) {
    const myIdx = m.players.findIndex(p => p.uid === me);
    if (myIdx < 0) continue;
    const player = m.players[myIdx];
    const visits = player.matchVisits || [];
    const validVisits = visits.filter(v => !v.busted);
    const totalScore = validVisits.reduce((s, v) => s + v.score, 0);
    if (!player.matchDarts) continue;
    const avg = (totalScore / player.matchDarts) * 3;
    const oppIdx = myIdx === 0 ? 1 : 0;
    const opp = m.players[oppIdx] || {};
    points.push({
      x: m.endedAt || 0,
      y: avg,
      oppName: opp.name || 'Unknown',
      won: m.winnerIndex === myIdx,
      matchId: m.id,
      endedAt: m.endedAt || 0
    });
  }
  if (points.length === 0) {
    wrap.innerHTML = '<div class="friends-empty">No completed matches yet.</div>';
    return;
  }

  const w = 640, h = 220, padL = 36, padR = 12, padT = 14, padB = 24;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const maxY = Math.max(...points.map(p => p.y), 60);
  const minY = Math.min(...points.map(p => p.y), 20);
  const niceMax = Math.ceil(maxY / 10) * 10;
  const niceMin = Math.max(0, Math.floor(minY / 10) * 10);
  const yRange = niceMax - niceMin || 1;
  const xStep = points.length > 1 ? innerW / (points.length - 1) : 0;
  const xy = points.map((p, i) => ({
    x: padL + i * xStep,
    y: padT + innerH - ((p.y - niceMin) / yRange) * innerH
  }));
  const pathD = xy.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');

  const lifetimeAvg = stats.totalDarts ? (stats.totalScore / stats.totalDarts) * 3 : 0;
  const meanY = padT + innerH - ((lifetimeAvg - niceMin) / yRange) * innerH;

  const yTicks = 4;
  const tickLines = [];
  const tickLabels = [];
  for (let i = 0; i <= yTicks; i++) {
    const y = padT + (innerH * i / yTicks);
    const value = niceMax - ((niceMax - niceMin) * i / yTicks);
    tickLines.push(`<line class="chart-grid" x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}"></line>`);
    tickLabels.push(`<text class="chart-label" x="${padL - 6}" y="${y + 3}" text-anchor="end">${value.toFixed(0)}</text>`);
  }

  // Visible markers + a fatter transparent hit-area so hovering doesn't need
  // pixel-perfect aim (esp. on touch).
  const pointEls = xy.map((p, i) => `
    <circle class="chart-point" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3"></circle>
    <circle class="chart-hit" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="12" data-idx="${i}"></circle>
  `).join('');

  wrap.innerHTML = `
    <svg class="stats-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
      ${tickLines.join('')}
      <line class="chart-axis" x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + innerH}"></line>
      <line class="chart-axis" x1="${padL}" y1="${padT + innerH}" x2="${w - padR}" y2="${padT + innerH}"></line>
      ${tickLabels.join('')}
      <line class="chart-mean" x1="${padL}" y1="${meanY.toFixed(1)}" x2="${w - padR}" y2="${meanY.toFixed(1)}"></line>
      <path class="chart-line" d="${pathD}"></path>
      ${pointEls}
    </svg>
    <div class="chart-tooltip" hidden></div>`;

  attachChartInteractions(wrap, points);
}

function attachChartInteractions(wrap, points) {
  const svg = wrap.querySelector('svg');
  const tooltip = wrap.querySelector('.chart-tooltip');
  if (!svg || !tooltip) return;

  function showFor(circle) {
    const idx = parseInt(circle.dataset.idx, 10);
    const p = points[idx];
    if (!p) return;
    // Highlight the matching visible point.
    svg.querySelectorAll('.chart-point.active').forEach(el => el.classList.remove('active'));
    const visible = svg.querySelectorAll('.chart-point')[idx];
    if (visible) visible.classList.add('active');

    const result = p.won ? 'W' : 'L';
    tooltip.innerHTML = `
      <div class="chart-tt-row"><strong>${escapeHtml(p.oppName)}</strong> <span class="chart-tt-result ${p.won ? 'win' : 'loss'}">${result}</span></div>
      <div class="chart-tt-row">3-dart avg: <strong>${p.y.toFixed(1)}</strong></div>
      <div class="chart-tt-row chart-tt-date">${escapeHtml(formatMatchDate(p.endedAt))}</div>`;

    const wrapRect = wrap.getBoundingClientRect();
    const dotRect = circle.getBoundingClientRect();
    const cx = dotRect.left + dotRect.width / 2 - wrapRect.left;
    const cy = dotRect.top + dotRect.height / 2 - wrapRect.top;
    tooltip.hidden = false;
    // Clamp so the tooltip doesn't overflow the wrap horizontally.
    const ttWidth = tooltip.offsetWidth;
    const half = ttWidth / 2;
    const clampedX = Math.max(half + 4, Math.min(wrapRect.width - half - 4, cx));
    tooltip.style.left = `${clampedX}px`;
    tooltip.style.top = `${cy}px`;
  }

  function hide() {
    tooltip.hidden = true;
    svg.querySelectorAll('.chart-point.active').forEach(el => el.classList.remove('active'));
  }

  svg.addEventListener('pointerover', (e) => {
    const hit = e.target.closest('.chart-hit');
    if (hit) showFor(hit);
  });
  svg.addEventListener('pointerleave', hide);
  svg.addEventListener('click', (e) => {
    const hit = e.target.closest('.chart-hit');
    if (!hit) return;
    const idx = parseInt(hit.dataset.idx, 10);
    const p = points[idx];
    if (p && p.matchId) openMatchDetail(p.matchId);
  });
}

async function checkCurrentGame() {
  const card = document.getElementById('current-game-card');
  if (!card) return;
  card.hidden = true;
  if (!db || !currentUser || currentUser.isAnonymous) return;
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get({ source: 'server' });
    const userData = userDoc.data();
    const code = userDoc.exists && userData && userData.activeGameRoomCode;
    if (!code) return;
    const gameDoc = await db.collection('games').doc(code).get({ source: 'server' });
    if (!gameDoc.exists) {
      setActiveGameRoom(null);
      return;
    }
    const data = gameDoc.data() || {};
    if (data.game && data.game.gameOver) {
      setActiveGameRoom(null);
      return;
    }
    // Don't surface a "Resume" card for a room that hasn't started yet (e.g.
    // host sent a challenge but the friend hasn't accepted). Hitting Resume on
    // it would join the user as a guest into their own room and strand them
    // on the "Waiting for host" overlay. Pending invitations live in the
    // Challenges tab; this card is strictly for in-progress games.
    if (!data.game) return;
    const myUsername = (currentUserDocCache && currentUserDocCache.username) || '';
    const myName = myUsername || currentUser.displayName || '';
    const opponent = (data.game.players)
      ? (data.game.players.find(p => p.name !== myName) || data.game.players[1] || {})
      : {};
    document.getElementById('current-game-opponent').textContent = opponent.name || 'Opponent';
    document.getElementById('current-game-meta').textContent =
      `${data.game.startingScore} • ${formatMatchFormat(data.game.bestOfSets)}`;
    const avatar = document.getElementById('current-game-avatar');
    if (opponent.photoURL) {
      avatar.src = opponent.photoURL;
      avatar.hidden = false;
    } else {
      avatar.hidden = true;
    }
    card.dataset.roomCode = code;
    card.hidden = false;
  } catch (err) {
    console.warn('Current-game check failed:', err);
  }
}

// ============================================================
// Friends
// ============================================================

let friendshipsUnsub = null;
let friendshipsCache = [];
let friendPresenceUnsub = null;
const friendPresence = {};

function pairIdFor(a, b) {
  return [a, b].sort().join('_');
}

function profileFromUser(u) {
  return {
    displayName: u.displayName || '',
    email: (u.email || '').toLowerCase(),
    photoURL: u.photoURL || ''
  };
}

function setFriendStatus(msg, isError) {
  const el = document.getElementById('friend-status');
  if (!el) return;
  el.textContent = msg || '';
  el.classList.toggle('error', !!isError);
}

async function sendFriendRequest(rawEmail) {
  if (!firebaseAvailable || !currentUser) return;
  const email = (rawEmail || '').trim().toLowerCase();
  setFriendStatus('');
  if (!email) { setFriendStatus('Enter an email', true); return; }
  if (email === (currentUser.email || '').toLowerCase()) {
    setFriendStatus("That's you", true); return;
  }

  try {
    const snap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) { setFriendStatus('No account found for that email', true); return; }
    const other = snap.docs[0].data();
    if (other.uid === currentUser.uid) { setFriendStatus("That's you", true); return; }

    const pairId = pairIdFor(currentUser.uid, other.uid);
    const ref = db.collection('friendships').doc(pairId);
    const existing = await ref.get();
    if (existing.exists) {
      const s = existing.data().status;
      setFriendStatus(s === 'accepted' ? 'Already friends' : 'Request already pending', true);
      return;
    }

    await ref.set({
      uids: [currentUser.uid, other.uid].sort(),
      status: 'pending',
      requester: currentUser.uid,
      profiles: {
        [currentUser.uid]: profileFromUser(currentUser),
        [other.uid]: { displayName: other.displayName, email: other.email, photoURL: other.photoURL }
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('friend-email-input').value = '';
    setFriendStatus('Request sent');
    switchFriendsTab('requests');
  } catch (err) {
    console.error('Friend request failed:', err);
    setFriendStatus('Could not send request', true);
  }
}

async function acceptFriendRequest(pairId) {
  if (!firebaseAvailable) return;
  try {
    await db.collection('friendships').doc(pairId).update({
      status: 'accepted',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    console.error('Accept failed:', err);
    setFriendStatus('Could not accept request', true);
  }
}

async function removeFriendship(pairId) {
  if (!firebaseAvailable) return;
  try {
    await db.collection('friendships').doc(pairId).delete();
  } catch (err) {
    console.error('Remove failed:', err);
    setFriendStatus('Could not update friend', true);
  }
}

function subscribeFriendships() {
  if (!firebaseAvailable || !currentUser) return;
  unsubscribeFriendships();
  friendshipsUnsub = db.collection('friendships')
    .where('uids', 'array-contains', currentUser.uid)
    .onSnapshot(snap => {
      friendshipsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      updateFriendPresenceSubscription();
      renderFriendships();
    }, err => {
      console.error('Friendships listener error:', err);
    });
}

function unsubscribeFriendships() {
  if (friendshipsUnsub) {
    friendshipsUnsub();
    friendshipsUnsub = null;
  }
  if (friendPresenceUnsub) {
    friendPresenceUnsub();
    friendPresenceUnsub = null;
  }
  for (const k of Object.keys(friendPresence)) delete friendPresence[k];
  friendshipsCache = [];
  renderFriendships();
}

function updateFriendPresenceSubscription() {
  if (friendPresenceUnsub) { friendPresenceUnsub(); friendPresenceUnsub = null; }
  if (!currentUser) return;
  const friendUids = friendshipsCache
    .filter(f => f.status === 'accepted')
    .map(f => f.uids.find(u => u !== currentUser.uid))
    .filter(Boolean)
    .slice(0, 10);
  if (friendUids.length === 0) return;
  friendPresenceUnsub = db.collection('users')
    .where('uid', 'in', friendUids)
    .onSnapshot(snap => {
      for (const doc of snap.docs) {
        const d = doc.data();
        if (d.uid) friendPresence[d.uid] = d.lastSeenAt || null;
      }
      renderFriendships();
    }, err => console.error('Friend presence listener error:', err));
}

function isFriendOnline(uid) {
  const ts = friendPresence[uid];
  if (!ts || typeof ts.toMillis !== 'function') return false;
  return (Date.now() - ts.toMillis()) < ONLINE_THRESHOLD_MS;
}

function renderFriendships() {
  const incoming = document.getElementById('friends-incoming');
  const outgoing = document.getElementById('friends-outgoing');
  const accepted = document.getElementById('friends-accepted');
  const incomingSection = document.getElementById('friends-incoming-section');
  const outgoingSection = document.getElementById('friends-outgoing-section');
  if (!incoming || !outgoing || !accepted) return;

  const myUid = currentUser ? currentUser.uid : null;
  const inc = [], out = [], acc = [];
  for (const f of friendshipsCache) {
    if (f.status === 'accepted') acc.push(f);
    else if (f.status === 'pending') (f.requester === myUid ? out : inc).push(f);
  }

  incomingSection.style.display = inc.length ? '' : 'none';
  outgoingSection.style.display = out.length ? '' : 'none';
  document.getElementById('requests-empty').style.display = (inc.length || out.length) ? 'none' : '';

  incoming.innerHTML = inc.map(f => friendRowHtml(f, myUid, 'incoming')).join('');
  outgoing.innerHTML = out.map(f => friendRowHtml(f, myUid, 'outgoing')).join('');
  accepted.innerHTML = acc.length
    ? acc.map(f => friendRowHtml(f, myUid, 'accepted')).join('')
    : '<div class="friends-empty">No friends yet — use the Add tab.</div>';

  updateTabBadge('requests', inc.length);
}

// ============================================================
// Challenges
// ============================================================

let challengesUnsub = null;
let challengesCache = [];
let activeChallengeId = null;
let activeChallengeUnsub = null;

function subscribeChallenges() {
  if (!firebaseAvailable || !currentUser) return;
  unsubscribeChallenges();
  challengesUnsub = db.collection('challenges')
    .where('participants', 'array-contains', currentUser.uid)
    .onSnapshot(snap => {
      challengesCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderChallenges();
    }, err => console.error('Challenges listener error:', err));
}

function unsubscribeChallenges() {
  if (challengesUnsub) { challengesUnsub(); challengesUnsub = null; }
  detachActiveChallenge();
  challengesCache = [];
  renderChallenges();
}

function detachActiveChallenge() {
  if (activeChallengeUnsub) { activeChallengeUnsub(); activeChallengeUnsub = null; }
  activeChallengeId = null;
}

function readSetupSettings() {
  return {
    bestOfSets: parseInt(document.querySelector('#sets-selector .set-option.active').dataset.sets, 10),
    startingScore: parseInt(document.querySelector('#score-selector .set-option.active').dataset.score, 10),
    isTestSeries: document.querySelector('#sets-selector .set-option.active').dataset.series === 'true'
  };
}

function formatMatchFormat(bestOfSets) {
  const n = parseInt(bestOfSets, 10) || 1;
  // For long formats, "First to N" reads more naturally than "Best of 19".
  return n >= 9 ? `First to ${Math.ceil(n / 2)}` : `Best of ${n}`;
}

function challengeMetaLine(c) {
  const base = `${c.startingScore} • ${formatMatchFormat(c.bestOfSets)}`;
  return c.isTestSeries ? `${base} • Test Series` : base;
}

async function challengeFriend(pairId) {
  if (!firebaseAvailable || !currentUser) return;
  if (isOnline || activeChallengeId) {
    showMessage('Already in a game or challenge');
    return;
  }
  const f = friendshipsCache.find(x => x.id === pairId);
  if (!f || f.status !== 'accepted') return;
  const otherUid = f.uids.find(u => u !== currentUser.uid);
  const otherProfile = (f.profiles && f.profiles[otherUid]) || {};

  const settings = readSetupSettings();
  await hostGame();
  if (!isOnline || !roomCode) return;

  try {
    const ref = db.collection('challenges').doc();
    const myUsername = (currentUserDocCache && currentUserDocCache.username) || null;
    await ref.set({
      from: currentUser.uid,
      to: otherUid,
      participants: [currentUser.uid, otherUid],
      fromProfile: profileFromUser(currentUser),
      toProfile: { displayName: otherProfile.displayName || '', email: otherProfile.email || '', photoURL: otherProfile.photoURL || '' },
      fromUsername: myUsername,
      status: 'pending',
      bestOfSets: settings.bestOfSets,
      startingScore: settings.startingScore,
      isTestSeries: settings.isTestSeries || false,
      roomCode: roomCode,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    activeChallengeId = ref.id;
    watchActiveChallenge(ref);
    showMessage('Challenge sent');
  } catch (err) {
    console.error('Challenge send failed:', err);
    showMessage('Could not send challenge');
    leaveRoom();
  }
}

function watchActiveChallenge(ref) {
  activeChallengeUnsub = ref.onSnapshot(doc => {
    if (!doc.exists) {
      detachActiveChallenge();
      return;
    }
    const c = doc.data();
    if (c.status === 'accepted') {
      const myUsername = (currentUserDocCache && currentUserDocCache.username) || null;
      const myName = c.fromUsername || myUsername || currentUser.displayName || 'Player 1';
      const theirName = c.toUsername || (c.toProfile && c.toProfile.displayName) || 'Player 2';
      const myPhoto = currentUser.photoURL || '';
      const theirPhoto = (c.toProfile && c.toProfile.photoURL) || '';
      detachActiveChallenge();
      ref.delete().catch(() => {});
      if (c.isTestSeries) {
        startTestSeries(myName, theirName, c.bestOfSets, c.startingScore, myPhoto, theirPhoto, currentUser.uid, c.to);
      } else {
        startGame(myName, theirName, c.bestOfSets, c.startingScore, myPhoto, theirPhoto, currentUser.uid, c.to);
      }
    } else if (c.status === 'declined' || c.status === 'cancelled') {
      const who = (c.toUsername) || (c.toProfile && c.toProfile.displayName) || 'Friend';
      showMessage(`${who} declined`);
      detachActiveChallenge();
      ref.delete().catch(() => {});
      leaveRoom();
    }
  }, err => console.error('Active challenge listener error:', err));
}

async function acceptChallenge(challengeId) {
  if (!firebaseAvailable || !currentUser) return;
  if (isOnline) { showMessage('Leave your current game first'); return; }
  try {
    const ref = db.collection('challenges').doc(challengeId);
    const snap = await ref.get();
    if (!snap.exists) { showMessage('Challenge no longer available'); return; }
    const c = snap.data();
    if (c.to !== currentUser.uid || c.status !== 'pending') return;
    const myUsername = (currentUserDocCache && currentUserDocCache.username) || null;
    await ref.update({ status: 'accepted', toUsername: myUsername });
    await joinRoom(c.roomCode);
    setActiveGameRoom(c.roomCode);
  } catch (err) {
    console.error('Accept challenge failed:', err);
    showMessage('Could not accept challenge');
  }
}

async function declineChallenge(challengeId) {
  try {
    await db.collection('challenges').doc(challengeId).update({ status: 'declined' });
  } catch (err) {
    console.error('Decline failed:', err);
  }
}

async function cancelChallenge(challengeId) {
  try {
    await db.collection('challenges').doc(challengeId).update({ status: 'cancelled' });
  } catch (err) {
    console.error('Cancel failed:', err);
  }
  detachActiveChallenge();
  if (isHost) leaveRoom();
}

function renderChallenges() {
  const incoming = document.getElementById('challenges-incoming');
  const outgoing = document.getElementById('challenges-outgoing');
  const incomingSection = document.getElementById('challenges-incoming-section');
  const outgoingSection = document.getElementById('challenges-outgoing-section');
  if (!incoming || !outgoing) return;

  const myUid = currentUser ? currentUser.uid : null;
  const inc = [], out = [];
  for (const c of challengesCache) {
    if (c.status !== 'pending') continue;
    if (c.to === myUid) inc.push(c);
    else if (c.from === myUid) out.push(c);
  }

  incomingSection.style.display = inc.length ? '' : 'none';
  outgoingSection.style.display = out.length ? '' : 'none';
  document.getElementById('challenges-empty').style.display = (inc.length || out.length) ? 'none' : '';
  incoming.innerHTML = inc.map(c => challengeRowHtml(c, 'incoming')).join('');
  outgoing.innerHTML = out.map(c => challengeRowHtml(c, 'outgoing')).join('');

  updateTabBadge('challenges', inc.length);
}

function updateTabBadge(tab, count) {
  const badge = document.getElementById(`badge-${tab}`);
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

function switchMode(mode) {
  document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.getElementById('local-play-card').hidden = mode !== 'local';
  document.getElementById('friends-card').hidden = mode !== 'online';
}

function switchFriendsTab(tab) {
  document.querySelectorAll('.friends-tab').forEach(btn => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.friends-tab-panel').forEach(panel => {
    const active = panel.dataset.panel === tab;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}

function challengeRowHtml(c, kind) {
  const p = kind === 'incoming' ? (c.fromProfile || {}) : (c.toProfile || {});
  const name = escapeHtml(p.displayName || p.email || 'Unknown');
  const photo = p.photoURL
    ? `<img class="friend-avatar" src="${escapeHtml(p.photoURL)}" alt="" referrerpolicy="no-referrer">`
    : '<div class="friend-avatar friend-avatar-placeholder"></div>';
  const meta = escapeHtml(challengeMetaLine(c));
  const id = escapeHtml(c.id);
  const actions = kind === 'incoming'
    ? `<button class="btn btn-primary btn-small" data-challenge-accept="${id}">Play</button>
       <button class="btn btn-secondary btn-small" data-challenge-decline="${id}">Decline</button>`
    : `<button class="btn btn-secondary btn-small" data-challenge-cancel="${id}">Cancel</button>`;
  return `
    <div class="friend-row challenge-row">
      ${photo}
      <div class="friend-info">
        <div class="friend-name">${name}</div>
        <div class="friend-email">${meta}</div>
      </div>
      <div class="friend-actions">${actions}</div>
    </div>`;
}

function friendRowHtml(f, myUid, kind) {
  const otherUid = f.uids.find(u => u !== myUid);
  const p = (f.profiles && f.profiles[otherUid]) || {};
  const name = escapeHtml(p.displayName || p.email || 'Unknown');
  const photo = p.photoURL ? `<img class="friend-avatar" src="${escapeHtml(p.photoURL)}" alt="" referrerpolicy="no-referrer">` : '<div class="friend-avatar friend-avatar-placeholder"></div>';
  const dot = (kind === 'accepted' && isFriendOnline(otherUid)) ? '<span class="presence-dot" title="Online" aria-label="Online"></span>' : '';
  let actions = '';
  if (kind === 'incoming') {
    actions = `
      <button class="btn btn-primary btn-small" data-friend-accept="${escapeHtml(f.id)}">Accept</button>
      <button class="btn btn-secondary btn-small" data-friend-remove="${escapeHtml(f.id)}">Decline</button>`;
  } else if (kind === 'outgoing') {
    actions = `<button class="btn btn-secondary btn-small" data-friend-remove="${escapeHtml(f.id)}">Cancel</button>`;
  } else {
    actions = `<button class="btn btn-primary btn-small" data-friend-challenge="${escapeHtml(f.id)}">Challenge</button>`;
  }
  return `
    <div class="friend-row">
      <div class="friend-avatar-wrap">${photo}${dot}</div>
      <div class="friend-info">
        <div class="friend-name">${name}</div>
      </div>
      <div class="friend-actions">${actions}</div>
    </div>`;
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function hostGame() {
  if (isOnline) return;
  if (!firebaseAvailable) {
    showMessage('Online play is unavailable');
    return;
  }

  // Generate a unique room code with collision detection
  let code;
  let attempts = 0;
  let found = false;
  do {
    code = generateRoomCode();
    try {
      const existing = await db.collection('games').doc(code).get();
      if (!existing.exists) { found = true; break; }
    } catch (err) {
      showMessage('Network error — check your connection');
      console.error(err);
      return;
    }
    attempts++;
  } while (attempts < 5);

  if (!found) {
    showMessage('Could not create room — try again');
    return;
  }

  roomCode = code;
  isHost = true;
  try {
    await db.collection('games').doc(roomCode).set({
      status: 'waiting',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    isOnline = true;
    setActiveGameRoom(roomCode);
  } catch (err) {
    showMessage('Failed to create room');
    isHost = false;
    console.error(err);
  }
}

async function joinRoom(code) {
  if (!firebaseAvailable) {
    showMessage('Online play is unavailable');
    return;
  }
  code = code.toUpperCase().trim();
  if (!code || code.length < 6) {
    showMessage('Enter a valid room code');
    return;
  }
  try {
    const doc = await db.collection('games').doc(code).get();
    if (!doc.exists) {
      showMessage('Room not found');
      return;
    }

    // Stale-room check: prefer lastActivityAt (bumped on each sync) so long
    // formats like First-to-10 can be paused and resumed without expiring.
    // Falls back to createdAt for rooms written before this field existed.
    const data = doc.data();
    roomCode = code;
    isHost = false;
    isOnline = true;
    await db.collection('games').doc(roomCode).update({ joined: true });

    if (data.game && !data.game.gameOver) {
      game = data.game;
      showScreen('game-screen');
      updateGameScreenHeaders();
      showRoomCodeOnGameScreen();
      render();
    } else if (data.game && data.game.gameOver) {
      game = data.game;
      showRoomCodeOnGameScreen();
      showGameOver();
    } else {
      document.getElementById('waiting-room-code').textContent = roomCode;
      document.getElementById('waiting-overlay').style.display = '';
    }

    subscribeToGame();
  } catch (err) {
    showMessage('Failed to join room');
    console.error(err);
  }
}

async function forceSyncFromFirestore() {
  if (!isOnline || !roomCode || !db) return;
  const btn = document.getElementById('sync-btn');
  const original = btn ? btn.textContent : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Syncing…'; }
  try {
    const doc = await db.collection('games').doc(roomCode).get({ source: 'server' });
    if (!doc.exists) {
      showMessage('Room no longer exists');
      return;
    }
    const data = doc.data();
    if (!data || !data.game) {
      showMessage('No game data yet');
      return;
    }
    game = data.game;
    if (game.gameOver) {
      setActiveGameRoom(null);
      showRoomCodeOnGameScreen();
      showGameOver();
    } else {
      showScreen('game-screen');
      updateGameScreenHeaders();
      showRoomCodeOnGameScreen();
      render();
    }
    if (btn) { btn.textContent = 'Synced'; setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 900); }
  } catch (err) {
    console.warn('Force sync failed:', err);
    showMessage('Sync failed — check connection');
    if (btn) { btn.textContent = original; btn.disabled = false; }
  }
}

function subscribeToGame() {
  if (unsubscribeGame) unsubscribeGame();
  unsubscribeGame = db.collection('games').doc(roomCode).onSnapshot(doc => {
    if (!doc.exists) {
      leaveRoom();
      showMessage('Room was closed');
      return;
    }
    const data = doc.data();
    if (!data || !data.game) return;

    game = data.game;
    if (data.testSeries) {
      testSeries = data.testSeries;
    }
    document.getElementById('waiting-overlay').style.display = 'none';

    if (game.lastEvent && game.lastEvent.id !== lastProcessedEventId) {
      lastProcessedEventId = game.lastEvent.id;
      playEventAudio(game.lastEvent);
    }

    if (game.gameOver) {
      if (testSeries && !isSeriesOver()) {
        // Don't clear room during an active series
      } else {
        setActiveGameRoom(null);
        if (testSeries && isSeriesOver()) {
          persistTestSeries().catch(err => console.warn('Series persist failed:', err));
        }
      }
      persistFinishedMatch().catch(err => console.warn('Match persist failed:', err));
      showRoomCodeOnGameScreen();
      showGameOver();
    } else {
      showScreen('game-screen');
      updateGameScreenHeaders();
      showRoomCodeOnGameScreen();
      render();
    }
  }, err => {
    console.error('Game subscription error:', err);
    showMessage('Connection lost — returning to setup');
    leaveRoom();
  });
}

function updateGameScreenHeaders() {
  if (!game) return;
  for (let i = 0; i < game.players.length; i++) {
    document.getElementById(`hist-p${i + 1}-name`).textContent = game.players[i].name;
  }
}

function showRoomCodeOnGameScreen() {
  if (roomCode) {
    document.getElementById('game-room-code').textContent = roomCode;
    document.getElementById('game-room-info').style.display = '';
  }
}

let syncRetryCount = 0;
const MAX_SYNC_RETRIES = 3;

function syncGameToFirestore() {
  if (!isOnline || !roomCode || !game) return;
  const gameData = JSON.parse(JSON.stringify(game));
  const update = {
    game: gameData,
    lastActivityAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (testSeries) {
    update.testSeries = JSON.parse(JSON.stringify(testSeries));
  } else {
    update.testSeries = firebase.firestore.FieldValue.delete();
  }
  db.collection('games').doc(roomCode).update(update).then(() => {
    syncRetryCount = 0;
  }).catch(err => {
    console.error('Failed to sync game:', err);
    syncRetryCount++;
    if (syncRetryCount >= MAX_SYNC_RETRIES) {
      showMessage('Connection lost — scores may not sync');
      syncRetryCount = 0;
    }
  });
}

function leaveRoom() {
  if (unsubscribeGame) {
    unsubscribeGame();
    unsubscribeGame = null;
  }
  // Host cleans up the Firestore room document
  if (isHost && roomCode && db) {
    db.collection('games').doc(roomCode).delete().catch(err => {
      console.warn('Failed to delete room:', err);
    });
  }
  roomCode = null;
  isOnline = false;
  isHost = false;
  testSeries = null;
  lastProcessedEventId = null;
  syncRetryCount = 0;
  document.getElementById('waiting-overlay').style.display = 'none';
  document.getElementById('game-room-info').style.display = 'none';
  showScreen('setup-screen');
}

// Game state
let game = null;
let testSeries = null;

function startTestSeries(name1, name2, bestOfSets, startingScore, photoURL1, photoURL2, uid1, uid2) {
  testSeries = {
    // First to N sets; N derived from the format (e.g. "best of 19" → first to 10).
    targetWins: Math.ceil((bestOfSets || 19) / 2),
    matchWins: [0, 0],
    matchesPlayed: 0,
    startedAt: Date.now(),
    playerInfo: { name1, name2, bestOfSets, startingScore, photoURL1, photoURL2, uid1, uid2 }
  };
  startGame(name1, name2, bestOfSets, startingScore, photoURL1, photoURL2, uid1, uid2);
}

function continueTestSeries() {
  if (!testSeries) return;
  const p = testSeries.playerInfo;
  startGame(p.name1, p.name2, p.bestOfSets, p.startingScore, p.photoURL1, p.photoURL2, p.uid1, p.uid2);
}

function isSeriesOver() {
  if (!testSeries) return false;
  return testSeries.matchWins[0] >= testSeries.targetWins || testSeries.matchWins[1] >= testSeries.targetWins;
}

function abandonTestSeries() {
  testSeries = null;
  if (isOnline) {
    leaveRoom();
  } else {
    showScreen('setup-screen');
  }
}

function createPlayer(name, startingScore, photoURL, uid) {
  return {
    name: name,
    photoURL: photoURL || '',
    uid: uid || null,
    score: startingScore,
    darts: 0,
    visits: [],
    legs: 0,
    sets: 0,
    matchDarts: 0,
    matchVisits: [],
    checkouts: [],
    shotsAtCheckout: 0,
  };
}

function startGame(name1, name2, bestOfSets, startingScore, photoURL1, photoURL2, uid1, uid2) {
  const score = startingScore || 501;
  game = {
    players: [createPlayer(name1, score, photoURL1, uid1), createPlayer(name2, score, photoURL2, uid2)],
    currentPlayer: 0,
    legStartingPlayer: 0,
    bestOfSets: bestOfSets || 1,
    startingScore: score,
    gameOver: false,
    winner: null,
    startedAt: Date.now(),
    legHistory: [],
  };

  localStorage.setItem('darts501_playerNames', JSON.stringify([name1, name2]));

  // Show bull-up overlay to decide who throws first
  document.getElementById('bullup-p1').textContent = name1;
  document.getElementById('bullup-p2').textContent = name2;
  document.getElementById('bullup-overlay').style.display = '';
}

let bullUpMode = 'match-start';

function completeBullUp(playerIndex) {
  document.getElementById('bullup-overlay').style.display = 'none';

  if (bullUpMode === 'between-sets') {
    game.legStartingPlayer = playerIndex;
    game.currentPlayer = playerIndex;
    syncGameToFirestore();
    startNewLeg(true);
    bullUpMode = 'match-start';
    return;
  }

  game.currentPlayer = playerIndex;
  game.legStartingPlayer = playerIndex;

  showScreen('game-screen');
  document.getElementById('hist-p1-name').textContent = game.players[0].name;
  document.getElementById('hist-p2-name').textContent = game.players[1].name;

  fireEvent({ id: Date.now(), type: 'gameStart', playerName: game.players[playerIndex].name });

  if (isOnline) {
    showRoomCodeOnGameScreen();
    syncGameToFirestore();
    subscribeToGame();
  }

  render();
  focusScoreInput();
}

function showBetweenSetsBullUp() {
  bullUpMode = 'between-sets';
  document.getElementById('bullup-p1').textContent = game.players[0].name;
  document.getElementById('bullup-p2').textContent = game.players[1].name;
  document.getElementById('bullup-overlay').style.display = '';
}

function startNewLeg(skipAlternate) {
  // Accumulate match stats before resetting leg
  for (const p of game.players) {
    p.matchDarts += p.darts;
    p.matchVisits = p.matchVisits.concat(p.visits);
    p.score = game.startingScore;
    p.darts = 0;
    p.visits = [];
  }

  if (!skipAlternate) {
    game.legStartingPlayer = (game.legStartingPlayer + 1) % game.players.length;
    game.currentPlayer = game.legStartingPlayer;
  }

  render();
  syncGameToFirestore();
  focusScoreInput();
}

function getCurrentPlayer() {
  return game.players[game.currentPlayer];
}

function getPreviousPlayer() {
  const prev = (game.currentPlayer - 1 + game.players.length) % game.players.length;
  return game.players[prev];
}

// Returns the local user's player index in the current game, or -1 if they
// don't own a slot (local play, or spectator). Used to gate writes in online
// mode so only the player whose turn it is can mutate the shared state.
function getMySlot() {
  if (!game || !currentUser) return -1;
  return game.players.findIndex(p => p.uid && p.uid === currentUser.uid);
}

function isMyTurn() {
  if (!isOnline) return true;
  const slot = getMySlot();
  return slot !== -1 && slot === game.currentPlayer;
}

function isBust(currentScore, thrown) {
  const remaining = currentScore - thrown;
  return remaining < 0 || remaining === 1;
}

function submitScore(points) {
  if (game.gameOver) return;

  // Turn-gate: in online play, only the active player writes. This prevents
  // last-writer-wins races where the inactive client's write clobbers the
  // active client's update of the shared game doc.
  if (isOnline && !isMyTurn()) {
    showMessage("It's not your turn");
    return;
  }

  if (points < 0 || points > 180) {
    showMessage('Score must be between 0 and 180');
    return;
  }

  const player = getCurrentPlayer();

  if (player.score <= 170) player.shotsAtCheckout = (player.shotsAtCheckout || 0) + 1;

  if (isBust(player.score, points)) {
    showScoreOverlay(points, true);
    showMessage('BUST! Score reverted.');
    player.visits.push({ score: points, busted: true });
    player.darts += 3;
    fireEvent({ id: Date.now(), type: 'bust', points, checkoutPlayerName: player.name, checkoutPlayerScore: player.score });
    switchPlayer();
    render();
    syncGameToFirestore();
    focusScoreInput();
    return;
  }

  showScoreOverlay(points, false);
  player.score -= points;
  player.visits.push({ score: points, busted: false });
  player.darts += 3;

  if (player.score === 0) {
    showCheckoutDartsOverlay(player, points);
    return;
  }

  if (points === 180 && testSeries) {
    const playerIndex = game.currentPlayer;
    const bonus = Math.min(3, testSeries.targetWins - testSeries.matchWins[playerIndex]);
    testSeries.matchWins[playerIndex] += bonus;
    game.players[playerIndex].sets += bonus;
    showMessage(`180! +${bonus} set${bonus !== 1 ? 's' : ''}`);

    if (isSeriesOver()) {
      for (const p of game.players) {
        p.matchDarts += p.darts;
        p.matchVisits = p.matchVisits.concat(p.visits);
      }
      game.gameOver = true;
      game.winner = playerIndex;
      game.endedAt = Date.now();
      fireEvent({ id: Date.now(), type: 'matchWon', playerName: game.players[playerIndex].name });
      testSeries.matchesPlayed++;
      persistFinishedMatch().catch(err => console.warn('Match persist failed:', err));
      setActiveGameRoom(null);
      persistTestSeries().catch(err => console.warn('Series persist failed:', err));
      syncGameToFirestore();
      showGameOver();
      return;
    }
  }

  // Normal score — include checkout info for next player
  const nextPlayerIndex = (game.currentPlayer + 1) % game.players.length;
  const nextPlayer = game.players[nextPlayerIndex];
  fireEvent({ id: Date.now(), type: 'score', points, checkoutPlayerName: nextPlayer.name, checkoutPlayerScore: nextPlayer.score });
  switchPlayer();
  render();
  syncGameToFirestore();
  focusScoreInput();
}

function showCheckoutDartsOverlay(player, points) {
  const overlay = document.getElementById('checkout-darts-overlay');
  document.getElementById('checkout-darts-desc').textContent = `${player.name} checked out on ${points}. How many darts?`;
  overlay.style.display = 'flex';
  overlay.dataset.playerIndex = game.currentPlayer;
  overlay.dataset.points = points;
}

function processCheckout(dartsUsed) {
  const overlay = document.getElementById('checkout-darts-overlay');
  overlay.style.display = 'none';

  const winnerIndex = parseInt(overlay.dataset.playerIndex);
  const player = game.players[winnerIndex];
  const points = parseInt(overlay.dataset.points);

  // Adjust dart count (we already added 3)
  player.darts += dartsUsed - 3;

  player.checkouts.push(points);

  // Record per-leg breakdown before the leg state resets
  game.legHistory = game.legHistory || [];
  game.legHistory.push({
    winner: winnerIndex,
    starter: game.legStartingPlayer,
    darts: { 0: game.players[0].darts, 1: game.players[1].darts },
    visits: { 0: game.players[0].visits.slice(), 1: game.players[1].visits.slice() },
    checkout: { value: points, dartsUsed: dartsUsed }
  });

  player.legs++;
  const setsToWin = Math.ceil(game.bestOfSets / 2);

  if (player.legs >= 2) {
    // Set won (best of 3 legs — first to 2).
    player.sets++;
    player.legs = 0;
    for (const p of game.players) {
      if (p !== player) p.legs = 0;
    }

    if (testSeries) {
      // A test series is "first to targetWins sets" — one continuous game with
      // no intermediate "match" layer. Each set won counts toward the target.
      testSeries.matchWins[winnerIndex]++;

      if (isSeriesOver()) {
        for (const p of game.players) {
          p.matchDarts += p.darts;
          p.matchVisits = p.matchVisits.concat(p.visits);
        }
        game.gameOver = true;
        game.winner = winnerIndex;
        game.endedAt = Date.now();
        testSeries.matchesPlayed++;
        fireEvent({ id: Date.now(), type: 'matchWon', playerName: player.name });
        setActiveGameRoom(null);
        persistFinishedMatch().catch(err => console.warn('Match persist failed:', err));
        persistTestSeries().catch(err => console.warn('Series persist failed:', err));
        syncGameToFirestore();
        showGameOver();
        return;
      }

      // Set won but the series continues — bull up for the next set.
      fireEvent({ id: Date.now(), type: 'setWon', playerName: player.name });
      render();
      syncGameToFirestore();
      setTimeout(() => showBetweenSetsBullUp(), 2000);
      return;
    }

    // Non-series game: the match ends at best-of-N sets.
    if (player.sets >= setsToWin) {
      for (const p of game.players) {
        p.matchDarts += p.darts;
        p.matchVisits = p.matchVisits.concat(p.visits);
      }
      game.gameOver = true;
      game.winner = winnerIndex;
      game.endedAt = Date.now();
      fireEvent({ id: Date.now(), type: 'matchWon', playerName: player.name });
      syncGameToFirestore();
      setActiveGameRoom(null);
      persistFinishedMatch().catch(err => console.warn('Match persist failed:', err));
      showGameOver();
      return;
    }

    fireEvent({ id: Date.now(), type: 'setWon', playerName: player.name });
  } else {
    fireEvent({ id: Date.now(), type: 'legWon', playerName: player.name });
  }

  render();
  syncGameToFirestore();
  setTimeout(() => startNewLeg(), 2000);
}

function undoLastThrow() {
  if (game.gameOver) return;

  // Only the host can undo in online games to prevent conflicts
  if (isOnline && !isHost) {
    showMessage('Only the host can undo');
    return;
  }

  // Undo goes to the previous player's last throw
  const prevIndex = (game.currentPlayer - 1 + game.players.length) % game.players.length;
  const player = game.players[prevIndex];

  if (player.visits.length === 0) {
    showMessage('Nothing to undo');
    return;
  }

  const lastVisit = player.visits.pop();
  player.darts -= 3;

  if (!lastVisit.busted) {
    player.score += lastVisit.score;
  }

  game.currentPlayer = prevIndex;
  render();
  syncGameToFirestore();
  focusScoreInput();
}

function calculateAverage(player) {
  const totalDarts = player.matchDarts + player.darts;
  if (totalDarts === 0) return 0;
  const allVisits = player.matchVisits.concat(player.visits);
  const scored = allVisits
    .filter(v => !v.busted)
    .reduce((sum, v) => sum + v.score, 0);
  return (scored / totalDarts) * 3;
}

function calculateLegAverage(player) {
  if (player.darts === 0) return 0;
  const scored = player.visits
    .filter(v => !v.busted)
    .reduce((sum, v) => sum + v.score, 0);
  return (scored / player.darts) * 3;
}

function calculateSetAverage(playerIndex) {
  const history = game.legHistory || [];
  let currentSetLegs = [];
  let wins = [0, 0];

  for (const leg of history) {
    wins[leg.winner]++;
    currentSetLegs.push(leg);
    if (wins[0] >= 2 || wins[1] >= 2) {
      currentSetLegs = [];
      wins = [0, 0];
    }
  }

  const player = game.players[playerIndex];
  let totalDarts = player.darts;
  let totalScored = player.visits
    .filter(v => !v.busted)
    .reduce((sum, v) => sum + v.score, 0);

  for (const leg of currentSetLegs) {
    totalDarts += leg.darts[playerIndex];
    totalScored += leg.visits[playerIndex]
      .filter(v => !v.busted)
      .reduce((sum, v) => sum + v.score, 0);
  }

  if (totalDarts === 0) return 0;
  return (totalScored / totalDarts) * 3;
}

function getLastLegAverage(playerIndex) {
  const history = game.legHistory || [];
  if (history.length === 0) return 0;
  const lastLeg = history[history.length - 1];
  const visits = lastLeg.visits[playerIndex] || [];
  const darts = lastLeg.darts[playerIndex] || 0;
  if (darts === 0) return 0;
  return (visits.filter(v => !v.busted).reduce((s, v) => s + v.score, 0) / darts) * 3;
}

function getLastSetAverage(playerIndex) {
  const history = game.legHistory || [];
  let currentSetLegs = [];
  let lastSetLegs = [];
  let wins = [0, 0];
  for (const leg of history) {
    wins[leg.winner]++;
    currentSetLegs.push(leg);
    if (wins[0] >= 2 || wins[1] >= 2) {
      lastSetLegs = currentSetLegs.slice();
      currentSetLegs = [];
      wins = [0, 0];
    }
  }
  const setLegs = currentSetLegs.length > 0 ? currentSetLegs : lastSetLegs;
  let totalDarts = 0;
  let totalScored = 0;
  for (const leg of setLegs) {
    totalDarts += leg.darts[playerIndex] || 0;
    totalScored += (leg.visits[playerIndex] || [])
      .filter(v => !v.busted)
      .reduce((s, v) => s + v.score, 0);
  }
  if (totalDarts === 0) return 0;
  return (totalScored / totalDarts) * 3;
}

function getHighestVisit(player) {
  const allVisits = player.matchVisits.concat(player.visits);
  const valid = allVisits.filter(v => !v.busted);
  if (valid.length === 0) return 0;
  return Math.max(...valid.map(v => v.score));
}

function getCheckoutSuggestion(score) {
  if (score > 170 || score < 2) return null;
  return CHECKOUTS[score] || null;
}

function switchPlayer() {
  game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
}

let messageTimeout = null;

function showMessage(msg) {
  const el = document.getElementById('message');
  if (messageTimeout) clearTimeout(messageTimeout);
  el.classList.remove('visible');
  // Force reflow so the re-add triggers the transition
  void el.offsetWidth;
  el.textContent = msg;
  el.classList.add('visible');
  messageTimeout = setTimeout(() => {
    el.classList.remove('visible');
    messageTimeout = null;
  }, 2500);
}

function focusScoreInput() {
  setTimeout(() => {
    const input = document.getElementById('score-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }, 50);
}

// ============================================================
// Rendering
// ============================================================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if (screenId === 'setup-screen' && currentUser && !currentUser.isAnonymous) {
    checkCurrentGame();
  }
}

function render() {
  if (!game) return;

  const syncBtn = document.getElementById('sync-btn');
  if (syncBtn) syncBtn.style.display = isOnline ? '' : 'none';

  const seriesBoard = document.getElementById('series-scoreboard');
  if (testSeries) {
    seriesBoard.style.display = '';
    document.getElementById('series-score').textContent =
      `${testSeries.matchWins[0]} – ${testSeries.matchWins[1]}`;
  } else {
    seriesBoard.style.display = 'none';
  }

  for (let i = 0; i < game.players.length; i++) {
    const p = game.players[i];
    const idx = i + 1;
    const panel = document.getElementById(`player${idx}-panel`);

    panel.classList.toggle('active-player', game.currentPlayer === i);

    const avatar = document.getElementById(`p${idx}-avatar`);
    if (p.photoURL) {
      if (avatar.src !== p.photoURL) avatar.src = p.photoURL;
      avatar.hidden = false;
    } else {
      avatar.hidden = true;
    }

    document.getElementById(`p${idx}-name`).textContent = p.name;
    document.getElementById(`p${idx}-sets`).textContent = p.sets;
    document.getElementById(`p${idx}-legs`).textContent = p.legs;
    document.getElementById(`p${idx}-score`).textContent = p.score;
    document.getElementById(`p${idx}-darts`).textContent = p.matchDarts + p.darts;
    document.getElementById(`p${idx}-leg-avg`).textContent = calculateLegAverage(p).toFixed(1);
    document.getElementById(`p${idx}-set-avg`).textContent = calculateSetAverage(i).toFixed(1);
    document.getElementById(`p${idx}-average`).textContent = calculateAverage(p).toFixed(1);
    document.getElementById(`p${idx}-highest`).textContent = getHighestVisit(p);

    const checkout = getCheckoutSuggestion(p.score);
    const checkoutEl = document.getElementById(`p${idx}-checkout`);
    if (checkout) {
      checkoutEl.textContent = checkout;
      checkoutEl.parentElement.style.display = '';
    } else {
      checkoutEl.textContent = '-';
      checkoutEl.parentElement.style.display = p.score <= 170 ? '' : 'none';
    }
  }

  const myTurn = isMyTurn();
  document.getElementById('turn-indicator').textContent = (isOnline && !myTurn)
    ? `Waiting for ${getCurrentPlayer().name}…`
    : `${getCurrentPlayer().name}'s turn`;

  const scoreInput = document.getElementById('score-input');
  const submitBtn = document.getElementById('submit-btn');
  const undoBtn = document.getElementById('undo-btn');
  const lockInput = isOnline && !myTurn;
  const wasLocked = scoreInput.disabled;
  scoreInput.disabled = lockInput;
  submitBtn.disabled = lockInput;
  if (wasLocked && !lockInput) focusScoreInput();
  undoBtn.disabled = isOnline && !isHost;

  renderVisitHistory();
}

function renderVisitHistory() {
  const tbody = document.getElementById('history-body');
  tbody.innerHTML = '';

  const maxVisits = Math.max(game.players[0].visits.length, game.players[1].visits.length);

  for (let i = 0; i < maxVisits; i++) {
    const row = document.createElement('tr');

    const v1 = game.players[0].visits[i];
    const v2 = game.players[1].visits[i];

    const td1 = document.createElement('td');
    if (v1) {
      td1.textContent = v1.busted ? `${v1.score} (BUST)` : v1.score;
      if (v1.busted) td1.classList.add('bust');
    }

    const tdRound = document.createElement('td');
    tdRound.textContent = i + 1;
    tdRound.classList.add('round-number');

    const td2 = document.createElement('td');
    if (v2) {
      td2.textContent = v2.busted ? `${v2.score} (BUST)` : v2.score;
      if (v2.busted) td2.classList.add('bust');
    }

    row.appendChild(td1);
    row.appendChild(tdRound);
    row.appendChild(td2);
    tbody.appendChild(row);
  }

  // Auto-scroll to bottom
  const container = document.getElementById('history-container');
  container.scrollTop = container.scrollHeight;
}

function showGameOver() {
  document.getElementById('winner-name').textContent = game.players[game.winner].name;

  for (let i = 0; i < game.players.length; i++) {
    const p = game.players[i];
    const idx = i + 1;
    document.getElementById(`go-p${idx}-name`).textContent = p.name;
    document.getElementById(`go-p${idx}-darts`).textContent = p.matchDarts;
    document.getElementById(`go-p${idx}-sets`).textContent = p.sets;
    document.getElementById(`go-p${idx}-leg-avg`).textContent = getLastLegAverage(i).toFixed(1);
    document.getElementById(`go-p${idx}-set-avg`).textContent = getLastSetAverage(i).toFixed(1);
    document.getElementById(`go-p${idx}-average`).textContent = calculateAverage(p).toFixed(1);
    document.getElementById(`go-p${idx}-highest`).textContent = getHighestVisit(p);
  }

  const banner = document.getElementById('series-gameover-banner');
  const nextBtn = document.getElementById('next-match-btn');
  const rematchBtn = document.getElementById('rematch-btn');
  const rematchSeriesBtn = document.getElementById('rematch-series-btn');
  const abandonBtn = document.getElementById('abandon-series-btn');
  const newGameBtn = document.getElementById('new-game-btn');
  const winnerTitle = document.getElementById('winner-title');

  if (testSeries) {
    const s = testSeries;
    banner.style.display = '';
    document.getElementById('series-gameover-score').textContent =
      `${s.matchWins[0]} – ${s.matchWins[1]}`;

    if (isSeriesOver()) {
      const seriesWinner = s.matchWins[0] >= s.targetWins ? 0 : 1;
      winnerTitle.textContent = 'Series Winner';
      document.getElementById('winner-name').textContent = game.players[seriesWinner].name;
      document.getElementById('series-gameover-status').textContent = 'Series Complete';
      nextBtn.style.display = 'none';
      rematchBtn.style.display = 'none';
      rematchSeriesBtn.style.display = '';
      abandonBtn.style.display = 'none';
      newGameBtn.style.display = '';
    } else {
      winnerTitle.textContent = `Match ${s.matchesPlayed} Winner`;
      document.getElementById('series-gameover-status').textContent =
        `First to ${s.targetWins}`;
      nextBtn.style.display = '';
      rematchBtn.style.display = 'none';
      rematchSeriesBtn.style.display = 'none';
      abandonBtn.style.display = '';
      newGameBtn.style.display = 'none';
    }
  } else {
    banner.style.display = 'none';
    winnerTitle.textContent = 'Winner';
    nextBtn.style.display = 'none';
    rematchBtn.style.display = '';
    rematchSeriesBtn.style.display = 'none';
    abandonBtn.style.display = 'none';
    newGameBtn.style.display = '';
  }

  showScreen('gameover-screen');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// Event Handlers
// ============================================================

function buildDartboardBackground() {
  const el = document.getElementById('login-bg');
  if (!el) return;
  const cx = 200, cy = 200;
  const rInBull = 7, rOutBull = 18;
  const rTrebleIn = 100, rTrebleOut = 108;
  const rDoubleIn = 168, rDoubleOut = 176;
  const rBoard = 190;
  const cream = '#e6cf99';
  const black = '#1a1a1a';
  const red = '#c53030';
  const green = '#1f7a4d';
  const bullRed = '#d62828';
  const bullGreen = '#239669';
  const wire = '#bfb59a';

  function annular(a1Deg, a2Deg, rIn, rOut) {
    const a1 = (a1Deg - 90) * Math.PI / 180;
    const a2 = (a2Deg - 90) * Math.PI / 180;
    const x1o = (cx + rOut * Math.cos(a1)).toFixed(2);
    const y1o = (cy + rOut * Math.sin(a1)).toFixed(2);
    const x2o = (cx + rOut * Math.cos(a2)).toFixed(2);
    const y2o = (cy + rOut * Math.sin(a2)).toFixed(2);
    const x1i = (cx + rIn * Math.cos(a1)).toFixed(2);
    const y1i = (cy + rIn * Math.sin(a1)).toFixed(2);
    const x2i = (cx + rIn * Math.cos(a2)).toFixed(2);
    const y2i = (cy + rIn * Math.sin(a2)).toFixed(2);
    return `M${x1o},${y1o} A${rOut},${rOut} 0 0 1 ${x2o},${y2o} L${x2i},${y2i} A${rIn},${rIn} 0 0 0 ${x1i},${y1i} Z`;
  }

  const parts = [];
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${rBoard}" fill="${black}"/>`);
  for (let i = 0; i < 20; i++) {
    const a1 = -9 + i * 18;
    const a2 = a1 + 18;
    const even = i % 2 === 0;
    const singleFill = even ? black : cream;
    const ringFill = even ? red : green;
    parts.push(`<path d="${annular(a1, a2, rOutBull, rTrebleIn)}" fill="${singleFill}"/>`);
    parts.push(`<path d="${annular(a1, a2, rTrebleIn, rTrebleOut)}" fill="${ringFill}"/>`);
    parts.push(`<path d="${annular(a1, a2, rTrebleOut, rDoubleIn)}" fill="${singleFill}"/>`);
    parts.push(`<path d="${annular(a1, a2, rDoubleIn, rDoubleOut)}" fill="${ringFill}"/>`);
  }
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${rOutBull}" fill="${bullGreen}"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${rInBull}" fill="${bullRed}"/>`);
  // Wire lines between sectors for visual definition
  for (let i = 0; i < 20; i++) {
    const a = ((-9 + i * 18) - 90) * Math.PI / 180;
    const x1 = (cx + rOutBull * Math.cos(a)).toFixed(2);
    const y1 = (cy + rOutBull * Math.sin(a)).toFixed(2);
    const x2 = (cx + rDoubleOut * Math.cos(a)).toFixed(2);
    const y2 = (cy + rDoubleOut * Math.sin(a)).toFixed(2);
    parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${wire}" stroke-width="0.6" opacity="0.5"/>`);
  }

  el.innerHTML = `<svg class="login-bg-board" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">${parts.join('')}</svg>`;
}

function init() {
  initTheme();
  initFirebase();
  buildDartboardBackground();

  // Auth gates the app — login screen until signed in, setup screen after.
  if (firebaseAvailable) {
    auth.onAuthStateChanged(onAuthChanged);
  } else {
    showScreen('login-screen');
  }
  document.getElementById('google-signin-btn').addEventListener('click', signInWithGoogle);
  document.getElementById('sign-out-btn').addEventListener('click', signOut);

  document.getElementById('stats-link-btn').addEventListener('click', openStatsScreen);
  document.getElementById('stats-back-btn').addEventListener('click', () => showScreen('setup-screen'));
  document.getElementById('match-detail-back-btn').addEventListener('click', () => showScreen('stats-screen'));

  document.querySelectorAll('[data-stats-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchStatsTab(btn.dataset.statsTab));
  });

  document.getElementById('stats-matches').addEventListener('click', (e) => {
    const row = e.target.closest('.match-row');
    if (row) openMatchDetail(row.dataset.matchId);
  });

  document.getElementById('recompute-stats-btn').addEventListener('click', recomputeUserStats);

  // Edit username
  document.getElementById('user-chip-name').addEventListener('click', openUsernameDialog);
  document.getElementById('username-cancel-btn').addEventListener('click', closeUsernameDialog);
  document.getElementById('username-save-btn').addEventListener('click', saveUsername);
  document.getElementById('username-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveUsername();
    else if (e.key === 'Escape') closeUsernameDialog();
  });

  // Mode toggle (Local / Online)
  document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // Friends card tabs
  document.querySelectorAll('.friends-tab').forEach(btn => {
    btn.addEventListener('click', () => switchFriendsTab(btn.dataset.tab));
  });

  // Friends card
  document.getElementById('friend-add-btn').addEventListener('click', () => {
    sendFriendRequest(document.getElementById('friend-email-input').value);
  });
  document.getElementById('friend-email-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('friend-add-btn').click();
  });
  document.getElementById('friends-card').addEventListener('click', (e) => {
    const accept = e.target.closest('[data-friend-accept]');
    if (accept) { acceptFriendRequest(accept.dataset.friendAccept); return; }
    const remove = e.target.closest('[data-friend-remove]');
    if (remove) { removeFriendship(remove.dataset.friendRemove); return; }
    const challenge = e.target.closest('[data-friend-challenge]');
    if (challenge) { challengeFriend(challenge.dataset.friendChallenge); return; }
    const cAccept = e.target.closest('[data-challenge-accept]');
    if (cAccept) { acceptChallenge(cAccept.dataset.challengeAccept); return; }
    const cDecline = e.target.closest('[data-challenge-decline]');
    if (cDecline) { declineChallenge(cDecline.dataset.challengeDecline); return; }
    const cCancel = e.target.closest('[data-challenge-cancel]');
    if (cCancel) { cancelChallenge(cCancel.dataset.challengeCancel); }
  });

  // Load saved player names
  try {
    const saved = JSON.parse(localStorage.getItem('darts501_playerNames'));
    if (saved) {
      document.getElementById('player1-name').value = saved[0] || '';
      document.getElementById('player2-name').value = saved[1] || '';
    }
  } catch {}

  // Radio-group selectors (sets and score) — scoped to each group so they don't clobber each other
  document.querySelectorAll('.sets-selector').forEach(group => {
    group.querySelectorAll('.set-option').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.set-option').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      });
    });
  });

  // Start game button
  document.getElementById('start-btn').addEventListener('click', () => {
    const name1 = document.getElementById('player1-name').value.trim();
    const name2 = document.getElementById('player2-name').value.trim();
    if (!name1 || !name2) {
      showMessage('Enter a name for both players');
      return;
    }
    const activeSetBtn = document.querySelector('#sets-selector .set-option.active');
    const bestOfSets = parseInt(activeSetBtn.dataset.sets, 10);
    const startingScore = parseInt(document.querySelector('#score-selector .set-option.active').dataset.score, 10);
    if (activeSetBtn.dataset.series === 'true') {
      startTestSeries(name1, name2, bestOfSets, startingScore);
    } else {
      startGame(name1, name2, bestOfSets, startingScore);
    }
  });

  // Submit score
  document.getElementById('submit-btn').addEventListener('click', () => {
    const input = document.getElementById('score-input');
    const btn = document.getElementById('submit-btn');
    const val = parseInt(input.value, 10);
    if (isNaN(val)) {
      showMessage('Enter a valid number');
      return;
    }
    input.value = '';
    if (isOnline) {
      btn.disabled = true;
      btn.classList.add('btn-loading');
    }
    submitScore(val);
    if (isOnline) {
      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('btn-loading');
      }, 600);
    }
  });

  // Enter key submits score, spacebar submits 0
  document.getElementById('score-input').addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      submitScore(0);
    } else if (e.key === 'Enter') {
      document.getElementById('submit-btn').click();
    }
  });

  // Enter key on player name inputs starts game
  document.getElementById('player1-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('start-btn').click();
  });
  document.getElementById('player2-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('start-btn').click();
  });

  // Undo button
  document.getElementById('undo-btn').addEventListener('click', undoLastThrow);

  // Force-sync button (online only)
  document.getElementById('sync-btn').addEventListener('click', forceSyncFromFirestore);

  // New game button (back to setup)
  document.getElementById('new-game-btn').addEventListener('click', () => {
    game = null;
    testSeries = null;
    if (isOnline) {
      leaveRoom();
    } else {
      showScreen('setup-screen');
    }
  });

  // Rematch button
  document.getElementById('rematch-btn').addEventListener('click', () => {
    if (game) {
      startGame(game.players[0].name, game.players[1].name, game.bestOfSets, game.startingScore, game.players[0].photoURL, game.players[1].photoURL, game.players[0].uid, game.players[1].uid);
    }
  });

  // Test series buttons
  document.getElementById('next-match-btn').addEventListener('click', () => {
    if (testSeries && !isSeriesOver()) continueTestSeries();
  });

  document.getElementById('abandon-series-btn').addEventListener('click', () => {
    if (testSeries) abandonTestSeries();
  });

  document.getElementById('rematch-series-btn').addEventListener('click', () => {
    if (testSeries) {
      const p = testSeries.playerInfo;
      startTestSeries(p.name1, p.name2, p.bestOfSets, p.startingScore, p.photoURL1, p.photoURL2, p.uid1, p.uid2);
    }
  });

  // Leave-room button (waiting overlay) — explicit leave clears the resume pointer
  document.getElementById('leave-room-btn').addEventListener('click', () => {
    setActiveGameRoom(null);
    leaveRoom();
  });

  // Current-game card: Resume / Abandon
  document.getElementById('resume-game-btn').addEventListener('click', () => {
    const code = document.getElementById('current-game-card').dataset.roomCode;
    if (code) joinRoom(code);
  });
  document.getElementById('abandon-game-btn').addEventListener('click', () => {
    const card = document.getElementById('current-game-card');
    const code = card.dataset.roomCode;
    if (code && db) db.collection('games').doc(code).delete().catch(() => {});
    setActiveGameRoom(null);
    card.hidden = true;
  });

  // Checkout darts buttons
  document.querySelectorAll('.checkout-darts-btn').forEach(btn => {
    btn.addEventListener('click', () => processCheckout(parseInt(btn.dataset.darts)));
  });

  // Bull-up buttons
  document.getElementById('bullup-p1').addEventListener('click', () => completeBullUp(0));
  document.getElementById('bullup-p2').addEventListener('click', () => completeBullUp(1));

  // Preload voice clips for in-game callouts
  preloadVoiceClips();
}

// Pending challenges are transient — drop them on unload. The active game,
// if any, is preserved on Firestore so the user can resume from the home screen.
window.addEventListener('beforeunload', () => {
  if (activeChallengeId && db) {
    db.collection('challenges').doc(activeChallengeId).delete().catch(() => {});
  }
});

document.addEventListener('DOMContentLoaded', init);
