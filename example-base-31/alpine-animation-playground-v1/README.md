# MotionLab — Alpine.js Animation Playground v1

## Run
1. Extract the ZIP.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Internet is required for the Alpine.js and Google Fonts CDN links.

## Stack
- HTML5
- CSS3 keyframe animations and transitions
- Alpine.js 3

## Included demos
Fade, slide, bounce, rotate, pulse, 3D flip, shake, swing, heartbeat, modal, toast.

## v1.1 fix
- Fixed Alpine initialization order: `app.js` loads before Alpine.js so `animationPlayground()` exists when Alpine initializes.
- Exposed the component factory explicitly on `window`.
- Connected the duration slider to the CSS animation duration variable.
