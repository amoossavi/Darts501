// Dev tool: seeds the signed-in user's Firestore data with N test matches
// so the Stats screen has something to show.
//
// Usage:
//   1. Open the live app, sign in (NOT as guest)
//   2. DevTools → Console
//   3. Paste this entire file
//   4. Run:  await seedTestData(25)
//   5. Click the Stats button (refresh first if it was already open)
//
// Cleanup:
//   await clearSeedData()

window.seedTestData = async function seedTestData(matchCount) {
  const fs = firebase.firestore();
  const me = firebase.auth().currentUser;
  if (!me || me.isAnonymous) { console.error('Sign in first'); return; }
  matchCount = matchCount || 20;

  const rand = (a, b) => Math.floor(Math.random() * (b - a)) + a;

  // Realistic visit score distribution
  function visitScore(skill) {
    const r = Math.random();
    let s;
    if (r < 0.015) s = 180;
    else if (r < 0.07) s = rand(140, 180);
    else if (r < 0.35) s = rand(100, 140);
    else if (r < 0.85) s = rand(40, 100);
    else s = rand(0, 60);
    return Math.min(180, Math.max(0, Math.floor(s * skill)));
  }

  // Common checkout values (visit-totals that finish on a double)
  const realCheckouts = [40, 32, 36, 50, 60, 56, 80, 100, 96, 110, 120, 76, 64];

  function simulateLeg(starter, p1Skill, p2Skill) {
    const players = [{ score: 501, visits: [], darts: 0 }, { score: 501, visits: [], darts: 0 }];
    let turn = starter;
    let winnerIdx = null;
    let checkout = null;
    let safety = 60;

    while (winnerIdx === null && safety-- > 0) {
      const p = players[turn];
      const skill = turn === 0 ? p1Skill : p2Skill;

      // Force a finish if in finishable range
      if (p.score <= 170 && Math.random() < 0.35 * skill) {
        const finishers = realCheckouts.filter(c => c === p.score || c >= p.score - 1);
        const v = p.score;
        const dartsUsed = rand(1, 4);
        p.visits.push({ score: v, busted: false });
        p.darts += dartsUsed;
        winnerIdx = turn;
        checkout = { value: v, dartsUsed };
        break;
      }

      let v = visitScore(skill);
      // Cap so we don't bust trivially every time
      if (v >= p.score) v = Math.min(v, Math.max(0, p.score - 2));

      if (p.score - v < 0 || p.score - v === 1) {
        p.visits.push({ score: v, busted: true });
        p.darts += 3;
      } else {
        p.score -= v;
        p.visits.push({ score: v, busted: false });
        p.darts += 3;
      }
      turn = (turn + 1) % 2;
    }

    if (winnerIdx === null) {
      winnerIdx = players[0].score < players[1].score ? 0 : 1;
      checkout = { value: 32, dartsUsed: 3 };
    }
    return {
      winner: winnerIdx,
      starter,
      darts: { 0: players[0].darts, 1: players[1].darts },
      visits: { 0: players[0].visits, 1: players[1].visits },
      checkout
    };
  }

  function simulateMatch(opp, daysAgo) {
    const bestOfSets = [1, 1, 3][rand(0, 3)];
    const setsToWin = Math.ceil(bestOfSets / 2);
    const p1Skill = 0.95 + Math.random() * 0.25;
    const p2Skill = 0.90 + Math.random() * 0.25;

    let p1Sets = 0, p2Sets = 0, p1Legs = 0, p2Legs = 0;
    let starter = rand(0, 2);
    const legHistory = [];
    let p1Visits = [], p2Visits = [], p1Darts = 0, p2Darts = 0;
    const p1Checkouts = [], p2Checkouts = [];
    let p1Shots = 0, p2Shots = 0;

    while (p1Sets < setsToWin && p2Sets < setsToWin) {
      const leg = simulateLeg(starter, p1Skill, p2Skill);
      legHistory.push(leg);
      if (leg.winner === 0) { p1Legs++; p1Checkouts.push(leg.checkout.value); }
      else { p2Legs++; p2Checkouts.push(leg.checkout.value); }
      if (p1Legs >= 2) { p1Sets++; p1Legs = 0; p2Legs = 0; }
      else if (p2Legs >= 2) { p2Sets++; p1Legs = 0; p2Legs = 0; }
      p1Visits = p1Visits.concat(leg.visits[0]);
      p2Visits = p2Visits.concat(leg.visits[1]);
      p1Darts += leg.darts[0];
      p2Darts += leg.darts[1];
      // Approximate "shots at checkout" as visits where running score landed in range
      for (const v of leg.visits[0]) { if (!v.busted && Math.random() < 0.15) p1Shots++; }
      for (const v of leg.visits[1]) { if (!v.busted && Math.random() < 0.15) p2Shots++; }
      p1Shots += leg.winner === 0 ? 1 : 0;
      p2Shots += leg.winner === 1 ? 1 : 0;
      starter = (starter + 1) % 2;
    }

    const winnerIndex = p1Sets > p2Sets ? 0 : 1;
    const endedAt = Date.now() - daysAgo * 86400000 + rand(0, 6 * 3600000);
    const startedAt = endedAt - rand(10, 40) * 60000;

    return {
      participants: [me.uid, opp.uid],
      bestOfSets, startingScore: 501,
      startedAt, endedAt, winnerIndex,
      players: [
        { uid: me.uid, name: me.displayName || 'Me', photoURL: me.photoURL || '',
          sets: p1Sets, matchDarts: p1Darts, checkouts: p1Checkouts,
          shotsAtCheckout: p1Shots, matchVisits: p1Visits },
        { uid: opp.uid, name: opp.name, photoURL: opp.photoURL,
          sets: p2Sets, matchDarts: p2Darts, checkouts: p2Checkouts,
          shotsAtCheckout: p2Shots, matchVisits: p2Visits }
      ],
      legs: legHistory
    };
  }

  const opponents = [
    { name: 'Mike',  uid: 'seed_mike_001',  photoURL: '' },
    { name: 'Sarah', uid: 'seed_sarah_002', photoURL: '' },
    { name: 'Tom',   uid: 'seed_tom_003',   photoURL: '' },
    { name: 'Lisa',  uid: 'seed_lisa_004',  photoURL: '' }
  ];

  const matches = [];
  for (let i = 0; i < matchCount; i++) {
    const opp = opponents[i % opponents.length];
    const daysAgo = matchCount - i - 1;
    matches.push(simulateMatch(opp, daysAgo));
  }

  // Build aggregate via the app's own helpers (must be loaded in the page)
  if (typeof statsFromMatch !== 'function' || typeof mergeStats !== 'function') {
    console.error('statsFromMatch / mergeStats not in scope — load the app first.');
    return;
  }
  let agg = {};
  for (const m of matches) {
    const myIdx = m.players.findIndex(p => p.uid === me.uid);
    agg = mergeStats(agg, statsFromMatch(m, myIdx));
  }

  console.log(`Writing ${matches.length} matches + 1 userStats doc…`);
  const writes = matches.map(m => fs.collection('matches').doc(`${m.startedAt}_seed`).set(m));
  writes.push(fs.collection('userStats').doc(me.uid).set(agg));
  await Promise.all(writes);
  console.log('Seed complete. Open the Stats screen.');
};

window.clearSeedData = async function clearSeedData() {
  const fs = firebase.firestore();
  const me = firebase.auth().currentUser;
  if (!me) { console.error('Sign in first'); return; }
  const snap = await fs.collection('matches')
    .where('participants', 'array-contains', me.uid).get();
  const seed = snap.docs.filter(d => d.id.endsWith('_seed'));
  console.log(`Deleting ${seed.length} seed matches…`);
  await Promise.all(seed.map(d => d.ref.delete()));
  await fs.collection('userStats').doc(me.uid).delete();
  console.log('Seed data cleared. Refresh the Stats screen.');
};
