/*
 * Balance evaluation harness for Riftlords: Nemesis Siege.
 * Runs autonomous simulations without browser UI so balance changes can be measured quickly.
 */

const FIELD_WIDTH = 1100
const BASE_HP = 1200
const TICK_MS = 100
const TICK = TICK_MS / 1000
const MAX_BATTLE_SECONDS = 8 * 60

const unitDefs = {
  militia: { cost: 60, hp: 100, dmg: 12, range: 28, speed: 56, rate: 0.8 },
  spearman: { cost: 110, hp: 140, dmg: 16, range: 32, speed: 48, rate: 1 },
  archer: { cost: 130, hp: 90, dmg: 20, range: 160, speed: 45, rate: 1.2 },
  knight: { cost: 220, hp: 220, dmg: 27, range: 30, speed: 72, rate: 0.9 },
  priest: { cost: 170, hp: 100, dmg: -18, range: 120, speed: 40, rate: 1.1 },
  ram: { cost: 280, hp: 360, dmg: 48, range: 35, speed: 28, rate: 1.4, baseBonus: 2.3 },
}

const defaultTerritories = [
  { name: 'Ashen Ford', difficulty: 1 },
  { name: 'Blackroot Den', difficulty: 1 },
  { name: 'Grimhollow Pass', difficulty: 2 },
  { name: 'Moonshard Fields', difficulty: 2 },
  { name: 'Cinder Watch', difficulty: 3 },
  { name: 'Dreadfen', difficulty: 3 },
  { name: 'Stormgate Ruins', difficulty: 4 },
  { name: 'Nemesis Keep', difficulty: 5 },
]

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.split('=')))
const runs = Math.max(1, Number(args.runs || 50))

const enemyTypesByDifficulty = (d) => ['militia', 'spearman', 'archer', 'knight', 'priest', 'ram'].slice(0, 2 + d)

function makeBattle(difficulty, incomeMult = 1) {
  return {
    t: 0,
    gold: 240,
    income: 28 * incomeMult,
    playerBase: BASE_HP,
    enemyBase: BASE_HP + difficulty * 100,
    units: [],
    result: 'ongoing',
    playerSpawns: 0,
    enemySpawns: 0,
    firstEnemySpawnTime: null,
    lastMeaningfulEventTime: 0,
  }
}

const uid = () => Math.random().toString(36).slice(2, 9)

function spawn(state, type, side) {
  const def = unitDefs[type]
  if (!def) return false
  if (side === 'player' && state.gold < def.cost) return false
  state.units.push({ id: uid(), type, side, hp: def.hp, x: side === 'player' ? 100 : FIELD_WIDTH - 100, cd: 0 })
  if (side === 'player') {
    state.gold -= def.cost
    state.playerSpawns += 1
  } else {
    state.enemySpawns += 1
    if (state.firstEnemySpawnTime === null) state.firstEnemySpawnTime = state.t
  }
  state.lastMeaningfulEventTime = state.t
  return true
}

function choosePlayerSpawn(state) {
  // Simple autoplay policy: maintain front line, then scale damage.
  const affordable = Object.entries(unitDefs).filter(([, u]) => u.cost <= state.gold)
  if (!affordable.length) return null

  const playerCount = state.units.filter((u) => u.side === 'player').length
  if (playerCount < 2) return 'militia'

  if (state.t < 40) {
    return state.gold >= unitDefs.archer.cost ? 'archer' : 'spearman'
  }

  if (state.t > 90 && state.gold >= unitDefs.ram.cost && Math.random() < 0.35) return 'ram'
  if (state.gold >= unitDefs.knight.cost && Math.random() < 0.4) return 'knight'
  if (state.gold >= unitDefs.priest.cost && Math.random() < 0.18) return 'priest'

  const weighted = ['militia', 'spearman', 'archer', 'archer', 'spearman']
  return weighted[Math.floor(Math.random() * weighted.length)]
}

function step(state, difficulty) {
  state.t += TICK
  state.gold += state.income * TICK

  // Player auto-spawn cadence.
  if (Math.random() < 0.33) {
    const pick = choosePlayerSpawn(state)
    if (pick) spawn(state, pick, 'player')
  }

  // Enemy spawn cadence from current game logic.
  if (Math.random() < 0.3 + difficulty * 0.04) {
    const pool = enemyTypesByDifficulty(difficulty)
    spawn(state, pool[Math.floor(Math.random() * pool.length)], 'enemy')
  }

  for (const u of state.units) {
    const def = unitDefs[u.type]
    u.cd -= TICK
    const enemies = state.units.filter((x) => x.side !== u.side)
    const allies = state.units.filter((x) => x.side === u.side && x.id !== u.id)
    const near = enemies.find((e) => Math.abs(e.x - u.x) <= def.range)
    const ally = allies.find((a) => Math.abs(a.x - u.x) <= def.range && a.hp < unitDefs[a.type].hp)

    if (u.type === 'priest' && ally && u.cd <= 0) {
      ally.hp = Math.min(unitDefs[ally.type].hp, ally.hp + Math.abs(def.dmg))
      u.cd = def.rate
      state.lastMeaningfulEventTime = state.t
    } else if (near && u.cd <= 0) {
      let dmg = def.dmg
      if (u.type === 'spearman' && near.type === 'knight') dmg *= 1.4
      near.hp -= Math.max(1, dmg)
      u.cd = def.rate
      state.lastMeaningfulEventTime = state.t
    } else if (!near) {
      u.x += (u.side === 'player' ? 1 : -1) * def.speed * TICK
    }

    const enemyBaseX = u.side === 'player' ? FIELD_WIDTH - 40 : 40
    if (Math.abs(u.x - enemyBaseX) < def.range && u.cd <= 0) {
      const baseDmg = Math.max(4, def.dmg * (def.baseBonus || 1))
      if (u.side === 'player') state.enemyBase -= baseDmg
      else state.playerBase -= baseDmg
      u.cd = def.rate
      state.lastMeaningfulEventTime = state.t
    }
  }

  state.units = state.units.filter((u) => u.hp > 0)
  if (state.enemyBase <= 0) state.result = 'victory'
  if (state.playerBase <= 0) state.result = 'defeat'
}

function runOne(difficulty) {
  const state = makeBattle(difficulty)
  try {
    while (state.result === 'ongoing' && state.t < MAX_BATTLE_SECONDS) {
      step(state, difficulty)
      const stalled = state.t - state.lastMeaningfulEventTime > 35
      if (stalled) {
        return { ...state, result: 'softlock' }
      }
    }
  } catch (error) {
    return { ...state, result: 'crash', error: String(error) }
  }

  if (state.result === 'ongoing') return { ...state, result: 'timeout' }
  return state
}

function summarize(label, samples) {
  const total = samples.length
  const count = (k) => samples.filter((s) => s.result === k).length
  const victories = count('victory')
  const defeats = count('defeat')
  const crashes = count('crash')
  const softlocks = count('softlock') + count('timeout')
  const avg = (fn) => samples.reduce((a, x) => a + fn(x), 0) / total
  const firstSpawnAvg = avg((s) => (s.firstEnemySpawnTime ?? MAX_BATTLE_SECONDS))

  return {
    label,
    runs: total,
    playerWinRate: (victories / total) * 100,
    enemyWinRate: (defeats / total) * 100,
    averageBattleLengthSec: avg((s) => s.t),
    averageEnemyUnitsSpawned: avg((s) => s.enemySpawns),
    averagePlayerUnitsSpawned: avg((s) => s.playerSpawns),
    averageFirstEnemySpawnSec: firstSpawnAvg,
    crashes,
    softlocks,
  }
}

function printSummary(s) {
  console.log(`\n=== ${s.label} ===`)
  console.log(`Runs: ${s.runs}`)
  console.log(`Player win rate: ${s.playerWinRate.toFixed(1)}%`)
  console.log(`Enemy win rate: ${s.enemyWinRate.toFixed(1)}%`)
  console.log(`Avg battle length: ${(s.averageBattleLengthSec / 60).toFixed(2)} min (${s.averageBattleLengthSec.toFixed(1)}s)`)
  console.log(`Avg enemy units spawned: ${s.averageEnemyUnitsSpawned.toFixed(1)}`)
  console.log(`Avg player units spawned: ${s.averagePlayerUnitsSpawned.toFixed(1)}`)
  console.log(`Avg first enemy spawn: ${s.averageFirstEnemySpawnSec.toFixed(2)}s`)
  console.log(`Crashes: ${s.crashes}`)
  console.log(`Softlocks/timeouts: ${s.softlocks}`)
}

function checkTargets(firstBattle, normal) {
  const failures = []
  const within = (v, lo, hi) => v >= lo && v <= hi

  if (!within(firstBattle.playerWinRate, 70, 85)) failures.push('First battle player win rate target (70-85%) missed.')
  if (!within(normal.playerWinRate, 50, 65)) failures.push('Normal battles player win rate target (50-65%) missed.')
  if (!within(normal.averageBattleLengthSec, 120, 300)) failures.push('Normal battle length target (2-5 minutes) missed.')
  if (firstBattle.averageFirstEnemySpawnSec < 2.5) failures.push('Enemy spawns may be too early in first battle.')

  console.log('\n=== Target Checks ===')
  if (!failures.length) {
    console.log('PASS: Current numbers are within configured target bands.')
  } else {
    failures.forEach((f) => console.log(`- ${f}`))
  }
}

function runSuite() {
  const firstBattleRuns = Array.from({ length: runs }, () => runOne(defaultTerritories[0].difficulty))
  const normalPool = defaultTerritories.slice(1, 6)
  const normalRuns = Array.from({ length: runs }, () => {
    const t = normalPool[Math.floor(Math.random() * normalPool.length)]
    return runOne(t.difficulty)
  })

  const firstSummary = summarize('First Battle (Ashen Ford)', firstBattleRuns)
  const normalSummary = summarize('Normal Battles (Difficulties 1-3)', normalRuns)

  console.log('Riftlords balance evaluation harness')
  console.log(`Tick: ${TICK_MS}ms | Runs per scenario: ${runs}`)
  printSummary(firstSummary)
  printSummary(normalSummary)
  checkTargets(firstSummary, normalSummary)
}

runSuite()
