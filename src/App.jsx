import { useEffect, useMemo, useRef, useState } from 'react'

const FIELD_WIDTH = 1100
const BASE_HP = 1200
const TICK = 100

const unitDefs = {
  militia: { name: 'Militia', cost: 60, hp: 100, dmg: 12, range: 28, speed: 56, rate: 0.8, color: '#7f9c7d', role: 'melee' },
  spearman: { name: 'Spearman', cost: 110, hp: 140, dmg: 16, range: 32, speed: 48, rate: 1, color: '#8da8b8', role: 'anti-cavalry' },
  archer: { name: 'Archer', cost: 130, hp: 90, dmg: 20, range: 160, speed: 45, rate: 1.2, color: '#a37fbe', role: 'ranged' },
  knight: { name: 'Knight', cost: 220, hp: 220, dmg: 27, range: 30, speed: 72, rate: 0.9, color: '#d2b26f', role: 'cavalry' },
  priest: { name: 'Priest', cost: 170, hp: 100, dmg: -18, range: 120, speed: 40, rate: 1.1, color: '#e0e0f2', role: 'healer' },
  ram: { name: 'Siege Ram', cost: 280, hp: 360, dmg: 48, range: 35, speed: 28, rate: 1.4, color: '#8a6652', role: 'siege', baseBonus: 2.3 },
}

const initialTerritories = [
  ['Ashen Ford', 1, 'Fog of war: enemy ranged +10% damage'],
  ['Blackroot Den', 1, 'Savage charge: enemy knight spawn chance up'],
  ['Grimhollow Pass', 2, 'Iron discipline: enemy units +8% hp'],
  ['Moonshard Fields', 2, 'Long sight: enemy archers +25 range'],
  ['Cinder Watch', 3, 'War taxes: gold income -10%'],
  ['Dreadfen', 3, 'Bloodthirst: enemy damage +10% after kill'],
  ['Stormgate Ruins', 4, 'Siege doctrine: base damage +20%'],
  ['Nemesis Keep', 5, 'High Warlord: commander starts level +2'],
]

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const uid = () => Math.random().toString(36).slice(2, 9)

const generateCommander = (i, territory) => {
  const first = ['Gor', 'Maz', 'Thrak', 'Vorn', 'Kara', 'Ush', 'Rath', 'Sel']
  const last = ['doom', 'scar', 'grave', 'thane', 'fang', 'seer', 'breaker', 'hex']
  const title = ['the Cruel', 'the Unseen', 'the Iron', 'the Oathbreaker', 'the Sable', 'the Hollow']
  const faction = ['Riftborn', 'Ash Legion', 'Dreadclaw', 'Moonreavers']
  const traits = ['Aggressive', 'Patient', 'Cunning', 'Fanatical', 'Disciplined']
  const strengths = ['Archers', 'Heavy Armor', 'Cavalry', 'Siege Engines', 'Fast Raids']
  const weaknesses = ['Holy Damage', 'Pikes', 'Sustained fights', 'Rams', 'Flanking']
  return {
    id: `cmdr-${i}`,
    name: `${rand(first)}${rand(last)}`,
    title: rand(title),
    faction: rand(faction),
    personality: rand(traits),
    strength: rand(strengths),
    weakness: rand(weaknesses),
    level: territory[1],
    alive: true,
    memory: ['Born in shadow between worlds.'],
  }
}

const buildCampaign = () => {
  const saved = JSON.parse(localStorage.getItem('riftlords_campaign') || 'null')
  if (saved?.territories?.length === 8) return saved
  const territories = initialTerritories.map((t, i) => ({
    id: i,
    name: t[0],
    difficulty: t[1],
    modifier: t[2],
    reward: `+${10 + t[1] * 5}% gold income`,
    conquered: false,
    commander: generateCommander(i, t),
  }))
  return { territories, upgrades: { incomeMult: 1, unitHpMult: 1, unitDmgMult: 1 } }
}

function App() {
  const [campaign, setCampaign] = useState(buildCampaign)
  const [screen, setScreen] = useState('map')
  const [activeTerritory, setActiveTerritory] = useState(null)
  const [battleState, setBattleState] = useState(null)
  const timer = useRef(null)

  useEffect(() => localStorage.setItem('riftlords_campaign', JSON.stringify(campaign)), [campaign])

  useEffect(() => {
    if (screen !== 'battle' || !battleState) return
    timer.current = setInterval(() => setBattleState((s) => stepBattle(s, campaign, activeTerritory)), TICK)
    return () => clearInterval(timer.current)
  }, [screen, battleState, campaign, activeTerritory])

  useEffect(() => {
    if (!battleState || battleState.result === 'ongoing') return
    clearInterval(timer.current)
  }, [battleState])

  const startBattle = (territory) => {
    setActiveTerritory(territory)
    setBattleState(makeBattle(territory, campaign.upgrades))
    setScreen('battle')
  }

  const spawn = (type) => setBattleState((s) => trySpawn(s, type, 'player'))

  const endBattle = () => {
    const result = battleState.result
    const t = campaign.territories.find((x) => x.id === activeTerritory.id)
    const c = structuredClone(campaign)
    const tc = c.territories.find((x) => x.id === t.id)

    if (result === 'victory') {
      tc.conquered = true
      const survive = Math.random() < 0.25
      if (survive) {
        tc.commander.title = `${tc.commander.title} the Scarred`
        tc.commander.memory.push(`Survived defeat at ${tc.name}; vows revenge.`)
      } else {
        tc.commander.alive = false
      }
      tc.commander.memory.push(`Player overran my lines at ${tc.name}.`)
      c.upgrades.incomeMult += 0.05
      c.upgrades.unitDmgMult += 0.03
    } else {
      tc.commander.level += 1
      tc.commander.strength = rand(['Archers', 'Armor', 'Cavalry', 'Siege'])
      tc.commander.memory.push(`Crushed player at ${tc.name} with relentless pressure.`)
    }
    setCampaign(c)
    setScreen('map')
  }

  return (
    <div className="app">
      <h1>Riftlords: Nemesis Siege</h1>
      {screen === 'map' && (
        <MapView campaign={campaign} onStart={startBattle} />
      )}
      {screen === 'battle' && battleState && (
        <BattleView battle={battleState} territory={activeTerritory} onSpawn={spawn} onEnd={endBattle} />
      )}
    </div>
  )
}

function MapView({ campaign, onStart }) {
  return <div className="map">
    <h2>Campaign Map</h2>
    <div className="territory-grid">
      {campaign.territories.map((t) => (
        <button key={t.id} className={`card ${t.conquered ? 'conquered' : ''}`} onClick={() => onStart(t)}>
          <h3>{t.name}</h3><p>Difficulty {t.difficulty}</p><p>{t.modifier}</p><p>Reward: {t.reward}</p>
          <div className={`commander-chip faction-${t.commander.faction.toLowerCase().replace(/\s+/g, '-')}`}><div className="portrait">{t.commander.name.slice(0, 1)}</div><p><b>{t.commander.name}</b> {t.commander.title} (Lv {t.commander.level})</p></div>
          <p>"{taunt(t.commander)}"</p>
        </button>
      ))}
    </div>
  </div>
}

const taunt = (c) => c.memory[c.memory.length - 1]?.includes('Crushed') ? 'I remember your rout.' : 'Cross me and be unmade.'

function makeBattle(territory, upgrades) {
  const isLearningBattle = territory.id === 0
  return {
    t: 0, gold: 240, income: 28 * upgrades.incomeMult,
    enemyGold: 205 + territory.difficulty * 35 + (isLearningBattle ? 20 : 0), enemyIncome: 24 + territory.difficulty * 2, nextEnemySpawn: isLearningBattle ? 2.4 : 2.8,
    playerBase: BASE_HP, enemyBase: BASE_HP + territory.difficulty * 100 + (isLearningBattle ? 120 : 0),
    units: [], fallen: [], floats: [], projectiles: [], impacts: [], result: 'ongoing',
    commanderLine: `${territory.commander.name} ${territory.commander.title}: "${taunt(territory.commander)}"`,
  }
}

function trySpawn(state, type, side) {
  if (state.result !== 'ongoing') return state
  const def = unitDefs[type]
  if (!def) return state
  if (side === 'player' && state.gold < def.cost) return state
  const unit = { id: uid(), type, side, hp: def.hp, x: side === 'player' ? 100 : FIELD_WIDTH - 100, cd: 0, anim: 'idle', animUntil: 0, hitUntil: 0 }
  return { ...state, gold: side === 'player' ? state.gold - def.cost : state.gold, units: [...state.units, unit] }
}

function stepBattle(state, campaign, territory) {
  if (!state || state.result !== 'ongoing') return state
  const dt = TICK / 1000
  let s = structuredClone(state)
  s.t += dt
  s.gold += s.income * dt
  s.enemyGold += s.enemyIncome * dt

  const enemyPoolByTime = (time, difficulty) => {
    if (difficulty <= 1) {
      if (time < 18) return ['militia']
      if (time < 38) return ['militia', 'spearman']
      if (time < 70) return ['militia', 'spearman', 'archer']
    }
    if (time < 25) return ['militia']
    if (time < 50) return ['militia', 'spearman']
    if (time < 80) return ['militia', 'spearman', 'archer']
    if (time < 120) return ['militia', 'spearman', 'archer', 'knight']
    const full = ['militia', 'spearman', 'archer', 'knight', 'priest', 'ram']
    return full.slice(0, Math.min(full.length, 2 + difficulty + Math.floor(time / 120)))
  }

  if (s.t >= s.nextEnemySpawn) {
    const pool = enemyPoolByTime(s.t, territory.difficulty)
    const affordable = pool.filter((type) => unitDefs[type].cost <= s.enemyGold)
    if (affordable.length) {
      const pick = rand(affordable)
      s.enemyGold -= unitDefs[pick].cost
      s = trySpawn(s, pick, 'enemy')
    }
    const earlyEase = territory.difficulty <= 1 && s.t < 70 ? -0.15 : 0
    s.nextEnemySpawn = s.t + Math.max(1.7, 3.8 - territory.difficulty * 0.28 + earlyEase + Math.random() * 0.8)
  }
  s.floats = s.floats.filter((f) => f.life > 0).map((f) => ({ ...f, y: f.y - 16 * dt, life: f.life - dt }))
  s.projectiles = s.projectiles.filter((p) => p.life > 0).map((p) => ({ ...p, life: p.life - dt }))
  s.impacts = s.impacts.filter((e) => e.life > 0).map((e) => ({ ...e, life: e.life - dt }))
  s.fallen = s.fallen.filter((f) => f.life > 0).map((f) => ({ ...f, life: f.life - dt }))

  for (const u of s.units) {
    const def = unitDefs[u.type]
    u.cd -= dt
    const enemies = s.units.filter((x) => x.side !== u.side)
    const allies = s.units.filter((x) => x.side === u.side && x.id !== u.id)
    const near = enemies.find((e) => Math.abs(e.x - u.x) <= def.range)
    const ally = allies.find((a) => Math.abs(a.x - u.x) <= def.range && a.hp < unitDefs[a.type].hp)

    if (u.type === 'priest' && ally && u.cd <= 0) {
      const heal = Math.abs(def.dmg)
      ally.hp = Math.min(unitDefs[ally.type].hp, ally.hp + heal)
      u.cd = def.rate
      s.floats.push({ id: uid(), x: ally.x, y: 240, life: 0.7, txt: `${Math.round(heal)}`, heal: true })
      u.anim = 'cast'
      u.animUntil = s.t + 0.35
      s.impacts.push({ id: uid(), x: ally.x, y: 250, life: 0.3, type: 'heal' })
    } else if (near && u.cd <= 0) {
      let dmg = def.dmg
      if (u.type === 'spearman' && near.type === 'knight') dmg *= 1.4
      near.hp -= Math.max(1, dmg)
      u.cd = def.rate
      u.anim = u.type === 'ram' ? 'slam' : (u.type === 'archer' ? 'shoot' : 'strike')
      u.animUntil = s.t + 0.22
      near.hitUntil = s.t + 0.2
      s.floats.push({ id: uid(), x: near.x, y: 260, life: 0.7, txt: `${Math.round(Math.abs(dmg))}`, heal: false })
      s.impacts.push({ id: uid(), x: near.x, y: 260, life: 0.18, type: 'hit' })
      if (u.type === 'archer') s.projectiles.push({ id: uid(), fromX: u.x, toX: near.x, y: 244, life: 0.18, maxLife: 0.18 })
    } else if (!near) {
      u.x += (u.side === 'player' ? 1 : -1) * def.speed * dt
    }

    const enemyBaseX = u.side === 'player' ? FIELD_WIDTH - 40 : 40
    if (Math.abs(u.x - enemyBaseX) < def.range && u.cd <= 0) {
      let bd = Math.max(4, def.dmg * (def.baseBonus || 1))
      if (u.side === 'player') s.enemyBase -= bd
      else s.playerBase -= bd
      u.cd = def.rate
      u.anim = u.type === 'ram' ? 'slam' : 'strike'
      u.animUntil = s.t + 0.24
      s.floats.push({ id: uid(), x: enemyBaseX, y: 180, life: 0.7, txt: `${Math.round(bd)}` })
      s.impacts.push({ id: uid(), x: enemyBaseX, y: 190, life: 0.2, type: 'hit' })
    }
    if (u.animUntil <= s.t) u.anim = 'idle'
  }
  const survivors = []
  for (const u of s.units) {
    if (u.hp > 0) survivors.push(u)
    else s.fallen.push({ ...u, life: 0.42 })
  }
  s.units = survivors
  if (s.enemyBase <= 0) s.result = 'victory'
  if (s.playerBase <= 0) s.result = 'defeat'
  return s
}

function BattleView({ battle, territory, onSpawn, onEnd }) {
  const unitList = useMemo(() => Object.entries(unitDefs), [])
  return <div>
    <div className="hud"><p>Gold: {Math.floor(battle.gold)}</p><p>Your Base: {Math.max(0, Math.floor(battle.playerBase))}</p><p>Enemy Base: {Math.max(0, Math.floor(battle.enemyBase))}</p></div>
    <p className="taunt">{battle.commanderLine}</p>
    <div className="battlefield">
      <div className="base player-base"><div style={{width:`${(battle.playerBase/BASE_HP)*100}%`}}/></div>
      <div className="base enemy-base"><div style={{width:`${(battle.enemyBase/(BASE_HP+territory.difficulty*100))*100}%`}}/></div>
      {battle.units.map((u) => <UnitSprite key={u.id} u={u} battleTime={battle.t} />)}
      {battle.fallen.map((u) => <UnitSprite key={`dead-${u.id}-${u.life.toFixed(2)}`} u={u} dead />)}
      {battle.projectiles.map((p) => {
        const progress = 1 - p.life / p.maxLife
        const x = p.fromX + (p.toX - p.fromX) * progress
        return <div key={p.id} className="projectile arrow" style={{ left: `${(x / FIELD_WIDTH) * 100}%`, top: `${p.y}px` }} />
      })}
      {battle.impacts.map((e) => <div key={e.id} className={`impact ${e.type}`} style={{ left: `${(e.x / FIELD_WIDTH) * 100}%`, top: `${e.y}px` }} />)}
      {battle.floats.map((f) => <div key={f.id} className={`float ${f.heal ? 'heal' : ''}`} style={{ left: `${(f.x / FIELD_WIDTH) * 100}%`, top: `${f.y}px` }}>{f.heal ? '+' : '-'}{f.txt}</div>)}
    </div>
    {battle.result === 'ongoing' ? <div className="spawn-grid">{unitList.map(([k,v]) => <button key={k} onClick={() => onSpawn(k)}>{v.name} ({v.cost})</button>)}</div> :
      <div className="result"><h2>{battle.result === 'victory' ? 'Victory!' : 'Defeat!'}</h2><button onClick={onEnd}>Return to Map</button></div>}
  </div>
}

function UnitSprite({ u, battleTime = 0, dead = false }) {
  const def = unitDefs[u.type]
  return <div className={`unit ${u.side} ${u.type} anim-${u.anim} ${u.hitUntil > battleTime ? 'hit' : ''} ${dead ? 'dead' : ''}`} style={{ left: `${(u.x / FIELD_WIDTH) * 100}%`, ['--unit-color']: def.color }} title={`${def.name} ${Math.floor(Math.max(0, u.hp))}hp`}>
    <span className="shadow" />
    <span className="cape" />
    <span className="body" />
    <span className="head" />
    <span className="helmet" />
    <span className="shield" />
    <span className="weapon" />
    <span className="weapon-swing" />
    <span className="sigil" />
    <span className="wheel wheel-a" />
    <span className="wheel wheel-b" />
    <span className="ram-head" />
  </div>
}

export default App
