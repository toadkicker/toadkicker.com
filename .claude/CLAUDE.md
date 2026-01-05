# toadkicker.com - Personal Website

## Project Overview
Todd Baur's personal website showcasing professional experience, portfolio, and contact information.

## Owner Profile
- **Name:** Todd Baur
- **Current Role:** Founder/Principal at Baur Software (baursoftware.com)
- **Focus:** AI and automation mixed with advisory services
- **Personal:** Married 10+ years, two kids
- **Location:** San Diego
- **Online:** @toadkicker on Twitter, GitHub

## Baur Software
- **Pitch:** We solve problems fast. We grow companies.
- **Notable work:**
  - Helped a fintech replatform in record time, consolidating their UX
  - Helped a service company double revenue through SEO, social, and ad campaigns
  - Start startups who stalled
- **Tech stack:** Rust, SolidJS, AWS

## Todd's Philosophy
Programming is like talking to computers, asking them in algorithms and data structures how to solve complex problems. Natural that AI can evolve to ask us questions back. The danger is lack of critical thinking, confirmation biases, and political motivations. Society should treat AI like a crazy experiment. Life itself feels like an experiment.

## Community Involvement
- PATH (epath.org)
- StartupSD.org
- Last Friday Coffee Crawl - different cafe each month, 10am (eventship.com)

## Architecture
Static single-page application using:
- HTML5 with embedded script templates
- CSS3 with flexbox layouts
- Vanilla JavaScript + jQuery
- Grunt build system (legacy)

### Notable Features
- Dynamic wallpapers pulled from Reddit (/r/EarthPorn, /r/iwallpaper for mobile)
- Time-based color scheme using complementary colors (shifts every second)
- Background picker with download option
- "Enjoy the View" toggle to hide UI

## File Structure
- `index.html` - Main page with embedded templates
- `main.css` - Styles
- `main.js` - JavaScript logic (color shifting, Reddit API, SPA routing)
- `dist/` - Built/deployed assets
- `Gruntfile.js` - Build configuration

## Key Modules
- **Home section:** Bio and introduction
- **Portfolio section:** Links to LinkedIn and Baur Software
- **Contact section:** Contact form (to be implemented)
- **Background picker:** Dynamic wallpaper selector

## Build Commands
```bash
npm start        # Run local dev server
npm run ghpages  # Deploy to GitHub Pages
```
