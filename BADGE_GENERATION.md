# Badge Generation Instructions

This file contains instructions for using the `nanobanana` extension to generate the visual assets for the Chennai Civic Sentinel gamification system.

## Overview
We need a consistent set of "Badge" icons for the user profile. The aesthetic should be **"Minimal Vector Art"** or **"Flat Gamification Badge"** style to match the modern dark-mode UI of the app.

## How to Run
You can feed these prompts one by one to `nanobanana` to generate the images. Ensure you save the outputs to `public/badges/[id].png`.

## Badge Prompts

### 1. Rookie Sentinel
**Context:** First Time User
**Prompt:**
> Generate a flat vector icon of a bronze shield with a camera lens in the center. Use a white background. Style should be clean, modern, and suitable for a mobile app achievement badge.

### 2. Verified Voice
**Context:** trusted reporter
**Prompt:**
> Generate a flat vector icon of a silver microphone with a glowing blue checkmark badge attached to it. Use a white background. Style: modern civic tech.

### 3. Pothole Paladin
**Context:** Road safety achievement
**Prompt:**
> Generate a flat vector icon of a golden shovel crossed with a pickaxe over a stylized asphalt road patch. Use a white background. Colors: Gold, Dark Grey.

### 4. Garbage Guardian
**Context:** Cleanliness achievement
**Prompt:**
> Generate a flat vector icon of a green shield with a white recycling symbol and a leaf on top. Use a white background. Style: Eco-friendly, bright green.

### 5. Traffic Tamer
**Context:** Traffic safety achievement
**Prompt:**
> Generate a flat vector icon of an orange traffic cone wearing a silver sheriff star badge. Use a white background. Style: Playful but authoritative.

### 6. Night Owl
**Context:** Late night reporting
**Prompt:**
> Generate a flat vector icon of a crescent moon with a stylized wide-open eye integrated into the curve. Colors: Dark Blue and Gold. White background.

### 7. Week Warrior (Streak)
**Context:** 7-day streak
**Prompt:**
> Generate a flat vector icon of a burning orange flame with the number '7' clearly visible inside it. White background. Style: Dynamic, energetic.

### 8. Zone Hero
**Context:** Local leader
**Prompt:**
> Generate a flat vector icon of a gold medal hanging from a red ribbon, with a red map pin symbol in the center of the medal. White background.

### 9. Civic Legend
**Context:** Top tier user
**Prompt:**
> Generate a premium vector icon of a platinum crown with a small city building silhouette inside the center jewel. White background. Style: Luxury, metallic.

## Implementation Steps
1.  Run the prompts above using your installed extension.
2.  Save images to `public/badges/`.
3.  Update the `badges` array in `src/app/api/user/profile/route.ts` to reference these new image paths.
