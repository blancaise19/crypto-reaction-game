# Crypto Reaction Rush

## Game Description
Crypto Reaction Rush is a lightweight HTML5 reaction game built for browser-first portals like play.fun. The player has 30 seconds to tap glowing crypto coins before they disappear. The coin lifetime shrinks over time, which makes each run faster and more intense.

## Controls
- `Start Run`: begins a 30-second match
- `Restart`: starts a fresh run at any time
- `Tap / Click Coin`: scores points
- Mobile: tap the coin directly on touchscreens

## Features
- Pure HTML, CSS, and vanilla JavaScript
- No backend or wallet connection required
- Responsive layout for desktop and mobile browsers
- Built-in procedural sound effect using Web Audio API
- Local best-score saving with `localStorage`
- Total project size is well under 1MB

## Project Structure

```text
crypto-reaction-game/
  index.html
  style.css
  game.js
  assets/
  preview.png
  README.md
```

## How To Deploy To A Static Host

### GitHub Pages
1. Create a new GitHub repository.
2. Upload the contents of the `crypto-reaction-game` folder to the repository root.
3. Open the repository settings.
4. Go to `Pages`.
5. Set the source to deploy from the `main` branch root.
6. Save and wait for GitHub Pages to publish.
7. Your live URL will look like `https://your-name.github.io/repo-name/`.

### Cloudflare Pages
1. Create a new Pages project in Cloudflare.
2. Connect the Git repository or upload the folder contents.
3. Set the build command to blank.
4. Set the output directory to `/`.
5. Deploy the project.

### Any Static Host
1. Upload all files from `crypto-reaction-game`.
2. Make sure `index.html` stays at the root of the deployed folder.
3. Open the live URL in a browser and confirm the game starts without any installation step.

## How To Submit The Game To play.fun Manually
1. Deploy the folder to a public static URL first.
2. Open the play.fun submission page in your browser.
3. Fill in the required fields:
   - `Game name`: `Crypto Reaction Rush`
   - `Game description`: `Fast neon arcade game where players tap disappearing crypto coins before time runs out.`
   - `Game URL`: your public deployed URL
   - `Preview image`: upload `preview.png`
4. Review the preview and confirm the hosted URL loads directly into gameplay.
5. Submit the listing.

## Upload Notes For play.fun
- The game runs entirely in-browser.
- No install step is required.
- No backend is required.
- No wallet is required.
- `index.html` is the main entry point.
- The game is optimized for quick load on both desktop and mobile.

## Recommended Pre-Submission Checklist
- Open the live URL on desktop and mobile.
- Confirm the start button works immediately after page load.
- Confirm the timer ends the match at 30 seconds.
- Confirm sound plays after the first interaction.
- Confirm `preview.png` looks correct in the listing form.
