import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

// Storage bucket name
export const PROFILE_IMAGES_BUCKET = "profile-images";

// Upload profile image
export async function uploadProfileImage(
  userId: string,
  file: File,
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}

// Delete profile image
export async function deleteProfileImage(filePath: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error("Delete error:", error);
    return false;
  }

  return true;
}

// Get signed URL for private access (if needed)
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error("Signed URL error:", error);
    return null;
  }

  return data.signedUrl;
}

export default supabase;
