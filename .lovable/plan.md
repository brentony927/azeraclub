

## Add Avatar Upload to Founder Profile Form

Add a clickable avatar upload area at the top of the founder profile creation form, replacing the static rocket icon. The photo uploads to the existing `avatars` storage bucket and the URL is passed with the form data.

### Changes

**`src/components/FounderProfileForm.tsx`**
- Add `avatarFile` state and `avatarPreview` state
- Replace the rocket icon in the card header with a clickable circular avatar area (camera icon overlay, shows preview when selected)
- Add `avatar_url` to the `FounderFormData` interface
- Accept a `userId` prop to construct the storage path
- On form submit, upload the file to `avatars/{userId}/{timestamp}` and include the public URL in the form data

**`src/pages/FounderMatch.tsx`**
- Pass `userId={user.id}` to FounderProfileForm
- Save the returned `avatar_url` to `founder_profiles` on insert

### UI Design
- Circular avatar area (80x80) centered at the top where the rocket icon currently is
- Default state: camera icon with "Adicionar Foto" text below
- After selection: shows image preview with a subtle edit overlay on hover
- Matches the dark theme aesthetic of the form

### Storage
- Uses the existing `avatars` bucket (already public with RLS policies)
- Path: `avatars/{userId}/{timestamp}.{ext}`

