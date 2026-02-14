

# Update Light Paper HTML File

## What's Happening
The Light Paper is a standalone HTML document stored at `public/SB_LightPaper.html` and displayed inside an iframe in the "Learn More" modal. You've uploaded an updated version (v1.2) with proper HTML formatting.

## Change
1. **Replace** `public/SB_LightPaper.html` with the contents of the uploaded `SeedbaseLightpaperV2-2.html` file.

That's it -- one file copy. The iframe in `LearnMoreModal.tsx` already points to `/SB_LightPaper.html`, so no code changes are needed.

## Technical Detail
- Copy `user-uploads://SeedbaseLightpaperV2-2.html` to `public/SB_LightPaper.html` (overwrite)
- No component or routing changes required

