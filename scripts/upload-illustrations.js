require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://rydmefudpczpxrresflx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZG1lZnVkcGN6cHhycmVzZmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY3MzgsImV4cCI6MjA4OTk2MjczOH0.J5hl1AbF_WcF1Kr8MPDC501eDc2MJeeL4OxJiaE0-6c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET_NAME = 'challenge-illustrations';

const imagesToUpload = [
  { city: 'fes', fileName: 'intro-fes-v2.png' },
  { city: 'chefchaouen', fileName: 'intro-chefchaouen-v2.png' },
  { city: 'marrakech', fileName: 'intro-marrakech-full.png' },
  { city: 'rabat', fileName: 'intro-rabat-full.png' },
  { city: 'laayoune', fileName: 'intro-laayoune-v3.png' },
];

async function uploadImages() {
  for (const item of imagesToUpload) {
    const filePath = path.join(__dirname, '../assets/images', item.fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${item.city}, file not found: ${filePath}`);
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const fileExt = path.extname(item.fileName);
      const newPath = `${item.city}/image_${Date.now()}${fileExt}`;

      console.log(`Uploading ${item.city}...`);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(newPath, fileBuffer, {
          contentType: `image/${fileExt.replace('.', '')}`,
          upsert: true
        });

      if (uploadError) {
        console.error(`Upload error for ${item.city}:`, uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);

      const publicUrl = publicUrlData.publicUrl;
      console.log(`Uploaded! Public URL: ${publicUrl}`);

      console.log(`Updating database for ${item.city}...`);
      const { error: dbError } = await supabase
        .from('challenges')
        .update({ illustration_url: publicUrl })
        .eq('city_id', item.city);

      if (dbError) {
        console.error(`DB Update error for ${item.city}:`, dbError);
      } else {
        console.log(`Successfully updated DB for ${item.city}`);
      }
    } catch (err) {
      console.error(`Unexpected error for ${item.city}:`, err);
    }
  }
}

uploadImages().then(() => console.log('Done!'));
