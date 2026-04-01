import { custom } from "@better-upload/server/clients";
import { createClient } from "@supabase/supabase-js";
import env from "dotenv";
env.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables not configured.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "", {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
    },
});
export const s3 = custom({
    host: process.env.S3_HOST?.replace(/^https?:\/\//, ""),
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    secure: true,
    forcePathStyle: true,
});

export const STORAGE_BUCKET =
    process.env.SUPABASE_STORAGE_BUCKET || "post-images";
