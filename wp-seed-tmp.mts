import postgres from 'postgres';
import fs from 'fs';

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]; })
);

const sql = postgres(env.DATABASE_URL!, { ssl: 'require' });
const hikeId = process.argv[2];
const mode = process.argv[3];

if (mode === 'clean') {
  await sql`delete from hike_waypoints where hike_id = ${hikeId}`;
  console.log('cleaned');
} else {
  const rows = [
    { c: 'start', n: 'Parking du col', d: 'Départ tôt le matin, brume dans la vallée.', i: 0, a: null, p: null },
    { c: 'poi', n: 'Lac de la Muzelle', d: null, i: 60, a: null, p: 'sight' },
    { c: 'logistics', n: 'Source', d: "Dernier point d'eau avant la montée.", i: 110, a: null, p: null },
    { c: 'accommodation', n: 'Refuge du Pigeonnier', d: 'Nuit au refuge, soupe et dortoir.', i: 150, a: 'refuge', p: null },
    { c: 'hazard', n: 'Passage câblé', d: 'Section exposée, prudence par temps humide.', i: 190, a: null, p: null },
    { c: 'poi', n: 'Sommet', d: null, i: 210, a: null, p: 'peak' },
    { c: 'end', n: 'Retour au parking', d: null, i: 231, a: null, p: null },
  ];
  for (const r of rows) {
    await sql`insert into hike_waypoints (hike_id, category, name, description, index_from_start, accommodation_type, poi_type)
      values (${hikeId}, ${r.c}::waypoint_category, ${r.n}, ${r.d}, ${r.i}, ${r.a}::accommodation_type, ${r.p}::poi_type)`;
  }
  console.log('seeded', rows.length);
}
await sql.end();
