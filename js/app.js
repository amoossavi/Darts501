// ============================================================
// Darts 501 Scoring App
// ============================================================

const STORAGE_KEY = 'darts501_history';
const legWonAudio = new Audio('audio/leg-won.mp3');

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
  111: 'T20 S19 D17',
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
// Speech Synthesis (ElevenLabs + browser fallback)
// ============================================================

const ELEVENLABS_MODEL = 'eleven_multilingual_v2';
const audioCache = new Map();
let currentAudio = null;

function getElevenLabsKey() {
  return localStorage.getItem('darts501_elevenlabs_key') || '';
}

const DEFAULT_VOICE_ID = '0rYPA6cLftSM7CCEM9yb';

function getElevenLabsVoiceId() {
  return DEFAULT_VOICE_ID;
}

// Speech queue — each item plays only after the previous finishes
const speechQueue = [];
let isSpeaking = false;

function speak(text) {
  speechQueue.push(text);
  if (!isSpeaking) processQueue();
}

async function processQueue() {
  if (speechQueue.length === 0) {
    isSpeaking = false;
    return;
  }

  isSpeaking = true;
  const text = speechQueue.shift();
  const apiKey = getElevenLabsKey();
  const voiceId = getElevenLabsVoiceId();

  if (apiKey && voiceId) {
    await playElevenLabs(text, apiKey, voiceId);
  } else {
    await playBrowser(text);
  }

  processQueue();
}

function playBrowser(text) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { resolve(); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    speechSynthesis.speak(utterance);
  });
}

async function playElevenLabs(text, apiKey, voiceId) {
  if (!voiceId) return playBrowser(text);

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Check cache (keyed by voice+text)
  const cacheKey = voiceId + ':' + text;
  let audioUrl = audioCache.get(cacheKey);

  if (!audioUrl) {
    try {
      const res = await fetch(

        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            model_id: ELEVENLABS_MODEL,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!res.ok) {
        console.warn('ElevenLabs API error:', res.status, await res.text().catch(() => ''));
        return playBrowser(text);
      }

      const blob = await res.blob();
      audioUrl = URL.createObjectURL(blob);
      audioCache.set(cacheKey, audioUrl);
    } catch (err) {
      console.warn('ElevenLabs fetch error:', err);
      return playBrowser(text);
    }
  }

  return new Promise(resolve => {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = resolve;
    audio.onerror = () => {
      console.warn('Audio play failed');
      resolve();
    };
    audio.play().catch(err => {
      console.warn('Audio play failed:', err);
      playBrowser(text).then(resolve);
    });
  });
}

// Direct call for test button (skips queue)
async function speakElevenLabs(text, apiKey, voiceId) {
  return playElevenLabs(text, apiKey, voiceId);
}

function numberToWords(n) {
  const ones = ['zero','one','two','three','four','five','six','seven','eight','nine',
    'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

  if (n < 20) return ones[n];
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  }
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  return ones[h] + ' hundred' + (remainder ? ' and ' + numberToWords(remainder) : '');
}

function announceScore(points, busted) {
  if (busted) {
    speak('Bust!');
    return;
  }
  if (points === 180) {
    speak('One hundred and eighty!');
  } else if (points >= 140) {
    speak(numberToWords(points) + '!');
  } else if (points === 0) {
    speak('No score');
  } else {
    speak(numberToWords(points));
  }
}

function announceCheckout(player) {
  const checkout = getCheckoutSuggestion(player.score);
  if (checkout) {
    speak(player.name + ' you require ' + numberToWords(player.score));
  }
}

function announceWinner(playerName) {
  speak('Game shot and the match! ' + playerName);
}

function playEventAudio(event) {
  switch (event.type) {
    case 'score':
      announceScore(event.points, false);
      if (event.checkoutPlayerScore && event.checkoutPlayerName) {
        const co = getCheckoutSuggestion(event.checkoutPlayerScore);
        if (co) speak(event.checkoutPlayerName + ' you require ' + numberToWords(event.checkoutPlayerScore));
      }
      break;
    case 'bust':
      announceScore(event.points, true);
      if (event.checkoutPlayerScore && event.checkoutPlayerName) {
        const co = getCheckoutSuggestion(event.checkoutPlayerScore);
        if (co) speak(event.checkoutPlayerName + ' you require ' + numberToWords(event.checkoutPlayerScore));
      }
      break;
    case 'legWon':
      legWonAudio.currentTime = 0;
      legWonAudio.play().catch(() => {});
      speak('Game shot and the leg! ' + event.playerName);
      break;
    case 'setWon':
      legWonAudio.currentTime = 0;
      legWonAudio.play().catch(() => {});
      speak('Game shot and the set! ' + event.playerName);
      break;
    case 'matchWon':
      legWonAudio.currentTime = 0;
      legWonAudio.play().catch(() => {});
      announceWinner(event.playerName);
      break;
    case 'gameStart':
      speak('Game on! ' + event.playerName + ' to throw first');
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
let roomCode = null;
let unsubscribeGame = null;
let isOnline = false;
let lastProcessedEventId = null;

function initFirebase() {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function hostGame() {
  if (isOnline) return;
  roomCode = generateRoomCode();
  try {
    await db.collection('games').doc(roomCode).set({
      status: 'waiting',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    isOnline = true;
    document.getElementById('room-code-display').textContent = roomCode;
    document.getElementById('room-info').style.display = '';
    document.getElementById('host-btn').disabled = true;
    document.getElementById('host-btn').textContent = 'Hosting';
    showMessage('Room created: ' + roomCode);
    // Listen for a player joining
    let hostNotified = false;
    unsubscribeGame = db.collection('games').doc(roomCode).onSnapshot(doc => {
      if (!doc.exists) return;
      const data = doc.data();
      if (data.joined && !hostNotified) {
        hostNotified = true;
        const hint = document.querySelector('.room-hint');
        if (hint) {
          hint.textContent = 'Player joined!';
          hint.style.color = 'var(--green)';
          hint.style.fontWeight = '700';
        }
      }
    });
  } catch (err) {
    showMessage('Failed to create room');
    console.error(err);
  }
}

async function joinRoom(code) {
  code = code.toUpperCase().trim();
  if (!code || code.length < 4) {
    showMessage('Enter a valid room code');
    return;
  }
  try {
    const doc = await db.collection('games').doc(code).get();
    if (!doc.exists) {
      showMessage('Room not found');
      return;
    }
    roomCode = code;
    isOnline = true;
    await db.collection('games').doc(roomCode).update({ joined: true });

    const data = doc.data();
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
    document.getElementById('waiting-overlay').style.display = 'none';

    if (game.lastEvent && game.lastEvent.id !== lastProcessedEventId) {
      lastProcessedEventId = game.lastEvent.id;
      playEventAudio(game.lastEvent);
    }

    if (game.gameOver) {
      showRoomCodeOnGameScreen();
      showGameOver();
    } else {
      showScreen('game-screen');
      updateGameScreenHeaders();
      showRoomCodeOnGameScreen();
      render();
    }
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

function syncGameToFirestore() {
  if (!isOnline || !roomCode || !game) return;
  const gameData = JSON.parse(JSON.stringify(game));
  db.collection('games').doc(roomCode).update({ game: gameData }).catch(err => {
    console.error('Failed to sync game:', err);
  });
}

function leaveRoom() {
  if (unsubscribeGame) {
    unsubscribeGame();
    unsubscribeGame = null;
  }
  roomCode = null;
  isOnline = false;
  lastProcessedEventId = null;
  document.getElementById('room-info').style.display = 'none';
  document.getElementById('waiting-overlay').style.display = 'none';
  document.getElementById('game-room-info').style.display = 'none';
  document.getElementById('host-btn').disabled = false;
  document.getElementById('host-btn').textContent = 'Host Game';
  document.getElementById('join-code').value = '';
  showScreen('setup-screen');
  renderHistory();
}

// Game state
let game = null;

function createPlayer(name) {
  return {
    name: name,
    score: 501,
    darts: 0,
    visits: [],
    legs: 0,
    sets: 0,
    matchDarts: 0,
    matchVisits: [],
  };
}

function startGame(name1, name2, bestOfSets) {
  game = {
    players: [createPlayer(name1), createPlayer(name2)],
    currentPlayer: 0,
    legStartingPlayer: 0,
    bestOfSets: bestOfSets || 3,
    gameOver: false,
    winner: null,
  };

  localStorage.setItem('darts501_playerNames', JSON.stringify([name1, name2]));

  // Show bull-up overlay to decide who throws first
  document.getElementById('bullup-p1').textContent = name1;
  document.getElementById('bullup-p2').textContent = name2;
  document.getElementById('bullup-overlay').style.display = '';
}

function completeBullUp(playerIndex) {
  game.currentPlayer = playerIndex;
  game.legStartingPlayer = playerIndex;

  document.getElementById('bullup-overlay').style.display = 'none';

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

function startNewLeg() {
  // Accumulate match stats before resetting leg
  for (const p of game.players) {
    p.matchDarts += p.darts;
    p.matchVisits = p.matchVisits.concat(p.visits);
    p.score = 501;
    p.darts = 0;
    p.visits = [];
  }

  // Alternate who throws first
  game.legStartingPlayer = (game.legStartingPlayer + 1) % game.players.length;
  game.currentPlayer = game.legStartingPlayer;

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

function isBust(currentScore, thrown) {
  const remaining = currentScore - thrown;
  return remaining < 0 || remaining === 1;
}

function submitScore(points) {
  if (game.gameOver) return;

  if (points < 0 || points > 180) {
    showMessage('Score must be between 0 and 180');
    return;
  }

  const player = getCurrentPlayer();

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
    player.legs++;
    const setsToWin = Math.ceil(game.bestOfSets / 2);

    if (player.legs >= 2) {
      // Won the set
      player.sets++;
      player.legs = 0;
      // Reset other player's legs too
      for (const p of game.players) {
        if (p !== player) p.legs = 0;
      }

      if (player.sets >= setsToWin) {
        // Won the match
        // Accumulate final leg stats
        for (const p of game.players) {
          p.matchDarts += p.darts;
          p.matchVisits = p.matchVisits.concat(p.visits);
        }
        game.gameOver = true;
        game.winner = game.currentPlayer;
        saveGame();
        fireEvent({ id: Date.now(), type: 'matchWon', playerName: player.name });
        syncGameToFirestore();
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
    return;
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

function undoLastThrow() {
  if (game.gameOver) return;

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

function showMessage(msg) {
  const el = document.getElementById('message');
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => {
    el.classList.remove('visible');
  }, 2000);
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
}

function render() {
  if (!game) return;

  for (let i = 0; i < game.players.length; i++) {
    const p = game.players[i];
    const idx = i + 1;
    const panel = document.getElementById(`player${idx}-panel`);

    panel.classList.toggle('active-player', game.currentPlayer === i);

    document.getElementById(`p${idx}-name`).textContent = p.name;
    document.getElementById(`p${idx}-sets`).textContent = p.sets;
    document.getElementById(`p${idx}-legs`).textContent = p.legs;
    document.getElementById(`p${idx}-score`).textContent = p.score;
    document.getElementById(`p${idx}-darts`).textContent = p.matchDarts + p.darts;
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

  // Turn indicator
  const turnText = document.getElementById('turn-indicator');
  turnText.textContent = `${getCurrentPlayer().name}'s turn`;

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
    document.getElementById(`go-p${idx}-sets`).textContent = p.sets;
    document.getElementById(`go-p${idx}-darts`).textContent = p.matchDarts;
    document.getElementById(`go-p${idx}-average`).textContent = calculateAverage(p).toFixed(1);
    document.getElementById(`go-p${idx}-highest`).textContent = getHighestVisit(p);
  }

  showScreen('gameover-screen');
}

// ============================================================
// LocalStorage
// ============================================================

function saveGame() {
  const history = loadHistory();
  const entry = {
    date: new Date().toISOString(),
    winner: game.players[game.winner].name,
    bestOfSets: game.bestOfSets,
    players: game.players.map(p => ({
      name: p.name,
      sets: p.sets,
      average: parseFloat(calculateAverage(p).toFixed(1)),
      dartsThrown: p.matchDarts,
    })),
  };
  history.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function renderHistory() {
  const history = loadHistory();
  const container = document.getElementById('match-history');

  if (history.length === 0) {
    container.innerHTML = '<p class="no-history">No previous games</p>';
    return;
  }

  let html = '';
  // Show most recent first
  for (let i = history.length - 1; i >= 0; i--) {
    const g = history[i];
    const date = new Date(g.date).toLocaleDateString();

    // Support both old 2-player format and new players array format
    const players = g.players || [g.player1, g.player2];

    const resultParts = players.map(p => {
      const detail = p.sets !== undefined ? p.sets + ' sets' : p.finalScore;
      return `<span class="${g.winner === p.name ? 'history-winner' : ''}">${p.name} (${detail})</span>`;
    }).join('<span class="history-vs">vs</span>');

    const avgParts = players.map(p => p.average).join(' - ');

    html += `
      <div class="history-item">
        <div class="history-date">${date}</div>
        <div class="history-result">${resultParts}</div>
        <div class="history-stats">Avg: ${avgParts}</div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function clearHistory() {
  if (confirm('Clear all match history?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }
}

// ============================================================
// Event Handlers
// ============================================================

function init() {
  initFirebase();

  // Load saved player names
  try {
    const saved = JSON.parse(localStorage.getItem('darts501_playerNames'));
    if (saved) {
      document.getElementById('player1-name').value = saved[0] || '';
      document.getElementById('player2-name').value = saved[1] || '';
    }
  } catch {}

  // Sets selector
  document.querySelectorAll('.set-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.set-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Start game button
  document.getElementById('start-btn').addEventListener('click', () => {
    const name1 = document.getElementById('player1-name').value.trim() || 'Player 1';
    const name2 = document.getElementById('player2-name').value.trim() || 'Player 2';
    const bestOfSets = parseInt(document.querySelector('.set-option.active').dataset.sets, 10);
    startGame(name1, name2, bestOfSets);
  });

  // Submit score
  document.getElementById('submit-btn').addEventListener('click', () => {
    const input = document.getElementById('score-input');
    const val = parseInt(input.value, 10);
    if (isNaN(val)) {
      showMessage('Enter a valid number');
      return;
    }
    input.value = '';
    submitScore(val);
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

  // Enter key on API key input saves it
  document.getElementById('elevenlabs-key').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('save-key-btn').click();
  });

  // Undo button
  document.getElementById('undo-btn').addEventListener('click', undoLastThrow);

  // New game button (back to setup)
  document.getElementById('new-game-btn').addEventListener('click', () => {
    game = null;
    if (isOnline) {
      leaveRoom();
    } else {
      showScreen('setup-screen');
      renderHistory();
    }
  });

  // Rematch button
  document.getElementById('rematch-btn').addEventListener('click', () => {
    if (game) {
      startGame(game.players[0].name, game.players[1].name, game.bestOfSets);
    }
  });

  // Clear history
  document.getElementById('clear-history-btn').addEventListener('click', clearHistory);

  // Online play
  document.getElementById('host-btn').addEventListener('click', hostGame);
  document.getElementById('join-btn').addEventListener('click', () => {
    const code = document.getElementById('join-code').value;
    joinRoom(code);
  });
  document.getElementById('join-code').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('join-btn').click();
  });
  document.getElementById('leave-room-btn').addEventListener('click', leaveRoom);

  // Bull-up buttons
  document.getElementById('bullup-p1').addEventListener('click', () => completeBullUp(0));
  document.getElementById('bullup-p2').addEventListener('click', () => completeBullUp(1));

  // Voice settings
  audioCache.clear();

  const savedKey = getElevenLabsKey();
  if (savedKey) {
    document.getElementById('elevenlabs-key').value = savedKey;
    document.getElementById('voice-status').textContent = 'Key saved';
    document.getElementById('voice-status').classList.add('status-ok');
  }

  document.getElementById('settings-toggle').addEventListener('click', () => {
    const body = document.getElementById('settings-body');
    const arrow = document.getElementById('settings-arrow');
    body.classList.toggle('collapsed');
    arrow.classList.toggle('open');
  });

  document.getElementById('save-key-btn').addEventListener('click', () => {
    const key = document.getElementById('elevenlabs-key').value.trim();
    const status = document.getElementById('voice-status');
    if (key) {
      localStorage.setItem('darts501_elevenlabs_key', key);
      audioCache.clear();
      status.textContent = 'Key saved';
      status.classList.remove('status-err');
      status.classList.add('status-ok');
    } else {
      localStorage.removeItem('darts501_elevenlabs_key');
      status.textContent = 'Key removed — using browser voice';
      status.classList.remove('status-ok', 'status-err');
    }
  });

  document.getElementById('test-voice-btn').addEventListener('click', () => {
    const status = document.getElementById('voice-status');
    const key = document.getElementById('elevenlabs-key').value.trim();
    if (key) {
      localStorage.setItem('darts501_elevenlabs_key', key);
      status.textContent = 'Testing...';
      status.classList.remove('status-ok', 'status-err');
      speakElevenLabs('One hundred and eighty!', key, DEFAULT_VOICE_ID).then(() => {
        status.textContent = 'Working!';
        status.classList.add('status-ok');
      }).catch(() => {
        status.textContent = 'Error — check your key';
        status.classList.add('status-err');
      });
    } else {
      playBrowser('One hundred and eighty!');
      status.textContent = 'Browser voice (no API key)';
    }
  });

  // Render match history on setup screen
  renderHistory();
  showScreen('setup-screen');
}

document.addEventListener('DOMContentLoaded', init);
