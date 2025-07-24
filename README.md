# J.E.F.F: Joyful Emotional Fan Factory

A vibrant, interactive fan web app for Jeff Satur and his community. This app brings together fans to share messages, check tour dates, shop official merch, enjoy music videos, and interact with an AI-powered Jeff experience.

---

## Features

- **AI P’Jeff Daily Vibe**: Get a personalized daily message from an AI version of Jeff. Share your name, birthday, mood, and even a photo for a unique response.
- **Message Board & Wall**: Leave short messages for Jeff and see them displayed as colorful post-its on a virtual wall, with daily message rotation.
- **Tour Dates**: Stay up-to-date with Jeff’s upcoming concerts and events, including international appearances.
- **Official Merch Store**: Browse and shop for exclusive tour merchandise with direct links to the official store.
- **Music Video Carousel**: Watch Jeff’s latest music videos in an interactive carousel.
- **Background Music**: Enjoy Jeff’s music as background audio, with mute/unmute controls.
- **Social Links**: Quick access to Jeff’s official social media profiles and streaming platforms.
- **Modern Responsive UI**: Beautiful, mobile-friendly design with custom fonts and playful visuals.

---

## Screenshots

> _Add screenshots or a demo GIF here to showcase the app’s look and feel._

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd jeff
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production
```bash
npm run build
```
The optimized build will be in the `build/` directory.

---

## Project Structure

- `src/App.js` – Main React app with all features and UI
- `src/App.css` – Custom styles and theming
- `public/` – Static assets (images, audio, manifest, etc.)
- `package.json` – Project metadata and dependencies

---

## Customization
- **Tour Dates & Merch**: Update the `tourEvents` and `merchItems` arrays in `App.js` to add new events or products.
- **AI Endpoint**: The AI P’Jeff feature uses a webhook endpoint. Update the URL in `App.js` if you deploy your own AI backend.
- **Branding**: Replace images in `public/` for custom backgrounds, avatars, and merch photos.

---

## Dependencies
- [React](https://reactjs.org/)
- [react-scripts](https://www.npmjs.com/package/react-scripts)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)

---

## Credits
- **Jeff Satur** – Artist and inspiration
- **FVP Entertainment** – Copyright
- **Community** – For fan messages and support
- **ElevenLabs** – Conversational AI widget

---

## License
This project is for fan and educational purposes. For commercial use, please contact the copyright holders.
