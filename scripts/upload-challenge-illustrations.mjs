/**
 * upload-challenge-illustrations.mjs
 * ─────────────────────────────────────────────────────────────────
 * Uploads local challenge illustration images to Supabase Storage
 * (bucket: challenge-illustrations) and updates the illustration_url
 * field in the public.challenges table for each city.
 *
 * Usage:
 *   node scripts/upload-challenge-illustrations.mjs
 *
 * Requires:
 *   npm install @supabase/supabase-js  (already in project)
 * ─────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Config ──────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://rydmefudpczpxrresflx.supabase.co';
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_KEY;   // set via env var
const ANON_KEY      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZG1lZnVkcGN6cHhycmVzZmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY3MzgsImV4cCI6MjA4OTk2MjczOH0.J5hl1AbF_WcF1Kr8MPDC501eDc2MJeeL4OxJiaE0-6c';
const BUCKET        = 'challenge-illustrations';

// Use service key if available (for bypassing RLS), otherwise anon key
const API_KEY = SERVICE_KEY || ANON_KEY;

const supabase = createClient(SUPABASE_URL, API_KEY);

// ─── Mapping: city_id → local image file ────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dir, '..', 'assets', 'images');

const ILLUSTRATIONS = [
  {
    city_id:   'rabat',
    file:      join(ASSETS, 'intro-rabat-full.png'),
    storageName: 'rabat.png',
    mimeType:  'image/png',
  },
  {
    city_id:   'chefchaouen',
    file:      join(ASSETS, 'intro-chefchaouen-v2.png'),
    storageName: 'chefchaouen.png',
    mimeType:  'image/png',
  },
  {
    city_id:   'fes',
    file:      join(ASSETS, 'intro-fes-v2.png'),
    storageName: 'fes.png',
    mimeType:  'image/png',
  },
  {
    city_id:   'marrakech',
    file:      join(ASSETS, 'intro-marrakech-full.png'),
    storageName: 'marrakech.png',
    mimeType:  'image/png',
  },
  {
    city_id:   'laayoune',
    file:      join(ASSETS, 'intro-laayoune-v3.png'),
    storageName: 'laayoune.png',
    mimeType:  'image/png',
  },
  {
    city_id:   'dakhla',
    file:      join(ASSETS, 'intro-dakhla-full.png'),
    storageName: 'dakhla.png',
    mimeType:  'image/png',
  },
];

// ─── Public URL helper ───────────────────────────────────────────
function getPublicUrl(storageName) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storageName}`;
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀  Challenge Illustrations Upload Script');
  console.log('═'.repeat(50));
  console.log(`📦  Bucket : ${BUCKET}`);
  console.log(`🔑  Key    : ${SERVICE_KEY ? 'service_role (full access)' : 'anon (public read)'}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  for (const entry of ILLUSTRATIONS) {
    const { city_id, file, storageName, mimeType } = entry;

    process.stdout.write(`  ⏳  ${city_id.padEnd(14)} → ${storageName} ... `);

    // ── 1. Check local file ──────────────────────────────────────
    if (!existsSync(file)) {
      console.log(`❌  fichier introuvable: ${file}`);
      errorCount++;
      continue;
    }

    const fileBuffer = readFileSync(file);
    const fileSizeKB = (fileBuffer.length / 1024).toFixed(1);

    // ── 2. Upload to Storage (upsert) ────────────────────────────
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storageName, fileBuffer, {
        contentType: mimeType,
        upsert: true,          // overwrite if already exists
        cacheControl: '31536000',  // 1 year cache
      });

    if (uploadError) {
      console.log(`❌  upload échoué: ${uploadError.message}`);
      errorCount++;
      continue;
    }

    // ── 3. Build public URL ──────────────────────────────────────
    const publicUrl = getPublicUrl(storageName);

    // ── 4. Update challenges table ───────────────────────────────
    const { error: dbError } = await supabase
      .from('challenges')
      .update({ illustration_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('city_id', city_id);

    if (dbError) {
      console.log(`❌  DB update échoué: ${dbError.message}`);
      errorCount++;
      continue;
    }

    console.log(`✅  OK  (${fileSizeKB} KB)`);
    successCount++;
  }

  // ── Summary ──────────────────────────────────────────────────
  console.log('');
  console.log('═'.repeat(50));
  console.log(`✅  Succès   : ${successCount} / ${ILLUSTRATIONS.length}`);
  if (errorCount > 0) {
    console.log(`❌  Erreurs  : ${errorCount}`);
  }

  // ── 5. Verify DB state ────────────────────────────────────────
  console.log('\n📋  État final de la table challenges:');
  const { data: challenges, error: listError } = await supabase
    .from('challenges')
    .select('city_id, city_name_fr, illustration_url')
    .order('sort_order');

  if (listError) {
    console.log('  ⚠️  Impossible de lire la table:', listError.message);
  } else {
    challenges.forEach(c => {
      const status = c.illustration_url ? '🖼️ ' : '⬜';
      const url = c.illustration_url
        ? `...${c.illustration_url.slice(-40)}`
        : 'NULL';
      console.log(`  ${status}  ${c.city_name_fr.padEnd(16)}  ${url}`);
    });
  }

  console.log('\n🎉  Script terminé.\n');
}

main().catch(err => {
  console.error('\n💥  Erreur fatale:', err.message);
  process.exit(1);
});
