import './App.css';
import React, { useState, useRef, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown'; // Uncomment if you have react-markdown installed

// 確保 getTodayKey 在最上方
function getTodayKey() {
  const d = new Date();
  return `jeff-messages-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const tourEvents = [
  { date: "2025-07-19", time: null, location: "Rim Lay Samila Festival, Songkhla, Thailand" },
  { date: "2025-07-27", time: null, location: "All New Honda Scoopy (Iconic Town), Nakhon Sawan, Thailand" },
  { date: "2025-08-02", time: null, location: "The Power Band Season, Phuket, Thailand" },
  { date: "2025-08-09", time: null, location: "Marathon Concert, Bangkok, Thailand" },
  { date: "2025-08-16", time: "09:00", location: "Summer Sonic 2025, Osaka (Expo '70 Commemorative Park), Japan" },
  { date: "2025-08-17", time: "12:00", location: "Summer Sonic 2025, Tokyo (ZOZO Marine Stadium), Japan" },
  { date: "2025-08-23", time: "10:00", location: "IMPACT Challenger, Pakkret, Thailand" },
  { date: "2025-08-24", time: "12:00", location: "IMPACT Challenger, Pakkret, Thailand" },
  { date: "2025-08-24", time: null, location: "Summer Sonic 2025, Bangkok, Thailand (with Alicia Keys, Black Eyed Peas, Camila Cabello)" },
  { date: "2025-10-09", time: "19:00", location: "MacPherson Stadium, Hong Kong" },
  { date: "2025-10-12", time: "18:00", location: "Esplanade Concert Hall, Singapore" },
  { date: "2025-10-24", time: "19:00", location: "Zepp New Taipei, Taiwan" },
  { date: "2025-11-09", time: null, location: "LEO Fest 2025, Pattaya, Thailand" },
  { date: "2025-11-23", time: null, location: "The Rhythm Music Festival, Kanchanaburi, Thailand" },
  { date: "2025-12-06", time: null, location: "Overcoat Festival, Phetchabun, Thailand" },
  { date: "2025-12-07", time: "20:00", location: "Showcenter Complex, San Pedro Garza García, Mexico" }
];

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function AIJeffModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    gender: '',
    mood: '',
    location: '',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm(f => ({ ...f, photo: files[0] }));
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const closeModal = () => {
    setStep(1);
    setForm({ name: '', birthdate: '', gender: '', mood: '', location: '', photo: null });
    setPhotoPreview(null);
    setLoading(false);
    setResponse(null);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('birthdate', form.birthdate);
      data.append('gender', form.gender);
      data.append('mood', form.mood);
      data.append('location', form.location);
      if (form.photo) data.append('photo', form.photo);
      const res = await fetch('https://honne.app.n8n.cloud/webhook/9948337c-aa6c-401a-9e4f-da973a94c236', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error('Failed to get response from AI P’Jeff.');
      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jeff-modal-overlay">
      <div className="jeff-modal">
        <button className="jeff-modal-close" onClick={closeModal}>&times;</button>
        {loading ? (
          <div style={{margin: '2rem 0'}}>
            <div className="jeff-modal-spinner"></div>
            <div>AI P’Jeff is thinking...</div>
          </div>
        ) : response ? (
          <div className="jeff-modal-response">
            <h3>AI P’Jeff says:</h3>
            {(() => {
              let content = 'No message received.';
              if (Array.isArray(response) && response[0]?.message?.content) {
                content = response[0].message.content;
              } else if (response?.message?.content) {
                content = response.message.content;
              } else if (response?.content) {
                content = response.content;
              }
              // If you have react-markdown, use:
              // return <ReactMarkdown>{content}</ReactMarkdown>;
              // Otherwise, fallback to dangerouslySetInnerHTML for markdown-like HTML rendering
              return <div style={{textAlign: 'left', lineHeight: 1.7}} dangerouslySetInnerHTML={{__html: content
                .replace(/\n/g, '<br/>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/### (.*?)(<br\/>|$)/g, '<h4>$1</h4>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
              }} />;
            })()}
            <button className="jeff-modal-next" onClick={closeModal}>Close</button>
          </div>
        ) : error ? (
          <div style={{color: 'var(--jeff-red)', margin: '2rem 0'}}>
            <p>{error}</p>
            <button className="jeff-modal-next" onClick={closeModal}>Close</button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div>
                <h3>Hi! What’s your name?</h3>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
                <h3>When is your birthday?</h3>
                <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
                <h3>Gender</h3>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                <button className="jeff-modal-next" onClick={next} disabled={!form.name || !form.birthdate || !form.gender}>Next</button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3>How are you feeling today?</h3>
                <input name="mood" value={form.mood} onChange={handleChange} placeholder="Your mood" />
                <h3>Where are you now?</h3>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Your city/country" />
                <div className="jeff-modal-nav">
                  <button onClick={prev}>Back</button>
                  <button className="jeff-modal-next" onClick={next} disabled={!form.mood || !form.location}>Next</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3>Want to share a photo? (Optional)</h3>
                <input name="photo" type="file" accept="image/*" onChange={handleChange} />
                {photoPreview && <img src={photoPreview} alt="preview" className="jeff-modal-photo-preview" />}
                <div className="jeff-modal-nav">
                  <button onClick={prev}>Back</button>
                  <button className="jeff-modal-next" onClick={handleSubmit}>Send</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function JeffMessageBoard({ messages, onPost }) {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onPost(input.trim());
    setInput('');
  };
  return (
    <section className="jeff-signup jeff-message-board" id="signup" style={{position:'relative', minHeight: 140, overflow:'hidden'}}>
      <div className="jeff-signup-bg"></div>
      <h2 className="jeff-message-board-title">Jeff Message Board</h2>
      <form className="jeff-message-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          className="jeff-message-input"
          maxLength={60}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Leave a short message for Jeff..."
        />
        <button className="jeff-message-send" type="submit">Post</button>
      </form>
    </section>
  );
}

function JeffMessageWall({ messages }) {
  // Debug: log messages prop
  console.log('JeffMessageWall messages:', messages);
  // 隨機分布 Post-It 位置
  const getRandomStyle = () => {
    const top = Math.random() * 60 + 10; // 10%~70%
    const left = Math.random() * 70 + 5; // 5%~75%
    const rotate = Math.random() * 16 - 8; // -8~8 deg
    const colors = ['#fffbe6', '#ffe6f0', '#e6f7ff', '#e6ffe6', '#fff0e6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      transform: `rotate(${rotate}deg)` ,
      background: color,
      minWidth: 90,
      maxWidth: 180,
      minHeight: 60,
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
      borderRadius: '0.7rem',
      padding: '0.7rem 1rem',
      fontFamily: 'var(--jeff-font-hand)',
      fontSize: '1.1rem',
      color: '#222',
      zIndex: 1,
      wordBreak: 'break-word',
      border: '1.5px solid #f8b6d6',
      pointerEvents: 'none',
    };
  };
  return (
    <section className="jeff-message-wall-section" style={{position:'relative', minHeight: 340, overflow:'hidden', background: 'url(/postit-wall-placeholder.jpg) center/cover no-repeat'}}>
      <div className="jeff-message-wall">
        {messages.map((msg, i) => (
          <div key={msg.id} className="jeff-message-postit" style={getRandomStyle()}>{msg.text}</div>
        ))}
      </div>
    </section>
  );
}

const videoItems = [
  {
    title: 'Tell Me The Name',
    youtubeId: 'cY4TaDRejFk',
    thumbnail: 'https://img.youtube.com/vi/cY4TaDRejFk/maxresdefault.jpg',
  },
  {
    title: 'ซ่อน (ไม่) หา l Ghost',
    youtubeId: 'qguo-j5PxBE',
    thumbnail: 'https://img.youtube.com/vi/qguo-j5PxBE/maxresdefault.jpg',
  },
  {
    title: 'ลืมไปแล้วว่าลืมยังไง (Fade)',
    youtubeId: '6f5sozKp0R0',
    thumbnail: 'https://img.youtube.com/vi/6f5sozKp0R0/maxresdefault.jpg',
  },
  {
    title: 'Dum Dum (ดึมดึม)',
    youtubeId: 'xjh-mb9IuzU',
    thumbnail: 'https://img.youtube.com/vi/xjh-mb9IuzU/maxresdefault.jpg',
  },
  {
    title: 'Black Tie',
    youtubeId: 'A_sC4V-Kpi4',
    thumbnail: 'https://img.youtube.com/vi/A_sC4V-Kpi4/maxresdefault.jpg',
  },
];

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [chatboxOpen, setChatboxOpen] = useState(false);
  // Sort events by date ascending
  const sortedEvents = [...tourEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  const merchItems = [
    {
      title: 'Asia Tour Bucket Hat',
      img: '/merch-bucket-hat.jpg',
      url: 'https://warnermusicthshop.bentoweb.com/en/product/1100910/JeffSatur-AsiaTourBucketHat?category_id=133966',
    },
    {
      title: 'Asia Tour Tote Bag',
      img: '/merch-tote-bag.jpg',
      url: 'https://warnermusicthshop.bentoweb.com/en/product/1100913/JeffSatur-AsiaTourToteBag?category_id=133966',
    },
    {
      title: 'Official Light Stick V.2 (Air Traffic Control Tower)',
      img: '/merch-light-stick.jpg',
      url: 'https://warnermusicthshop.bentoweb.com/en/product/1083721/product-1083721?category_id=133966',
    },
    {
      title: 'Asia Tour Socks',
      img: '/merch-socks.jpg',
      url: 'https://warnermusicthshop.bentoweb.com/en/product/1100914/JeffSatur-AsiaTourSocks?category_id=133966',
    },
    {
      title: 'Asia Tour T-Shirt',
      img: '/merch-tshirt.jpg',
      url: 'https://warnermusicthshop.bentoweb.com/en/product/1100905/JeffSatur-AsiaTourT-Shirt?category_id=133966',
    },
  ];

  const [videoIndex, setVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = audioMuted;
    }
  }, [audioMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePrevVideo = () => {
    setVideoIndex(i => {
      setPlaying(false);
      return i === 0 ? videoItems.length - 1 : i - 1;
    });
  };
  const handleNextVideo = () => {
    setVideoIndex(i => {
      setPlaying(false);
      return i === videoItems.length - 1 ? 0 : i + 1;
    });
  };
  const handlePlayVideo = () => setPlaying(true);

  useEffect(() => {
    // Only inject the script once
    if (!document.getElementById('elevenlabs-convai-script')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      script.id = 'elevenlabs-convai-script';
      document.body.appendChild(script);
    }
  }, []);

  // Message board state
  const [messages, setMessages] = useState([]);
  // Load today's messages from localStorage
  useEffect(() => {
    const key = getTodayKey();
    const saved = localStorage.getItem(key);
    console.log('Loading messages from localStorage:', key, saved);
    if (saved) setMessages(JSON.parse(saved));
  }, []);
  // Save messages to localStorage
  useEffect(() => {
    const key = getTodayKey();
    localStorage.setItem(key, JSON.stringify(messages));
  }, [messages]);
  const handlePostMessage = (msg) => {
    setMessages(msgs => [
      ...msgs,
      { text: msg, time: Date.now(), id: Math.random().toString(36).slice(2) }
    ]);
  };

  return (
    <div className="jeff-app">
      <audio
        ref={audioRef}
        src="/rain-wedding.mp3"
        autoPlay
        loop
        muted={audioMuted}
        preload="auto"
      />
      {/* Top Navigation Bar */}
      <nav className={`jeff-navbar${scrolled ? ' scrolled' : ''}`}>
        <button
          className="jeff-navbar-mute-btn"
          onClick={() => setAudioMuted(m => !m)}
          aria-label={audioMuted ? 'Unmute music' : 'Mute music'}
        >
          {audioMuted ? (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 10v8h6l6 6V4l-6 6H4z" fill="#fff"/><line x1="20" y1="8" x2="8" y2="20" stroke="#e10600" strokeWidth="2.5"/><line x1="8" y1="8" x2="20" y2="20" stroke="#e10600" strokeWidth="2.5"/></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 10v8h6l6 6V4l-6 6H4z" fill="#fff"/><path d="M20 8a8 8 0 010 12" stroke="#e10600" strokeWidth="2.5" fill="none"/></svg>
          )}
        </button>
        <div className="jeff-navbar-title jeff-navbar-home">
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{ color: 'inherit', textDecoration: 'none' }}>
            J.E.F.F: Joyful Emotional Fan Factory
          </a>
        </div>
        <div className="jeff-navbar-links">
          <a href="#signup" onClick={e => {
            e.preventDefault();
            const el = document.getElementById('signup');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>Board</a>
          <a href="#tour">Event</a>
          <a href="#store">Store</a>
          <a href="#video" onClick={e => {
            e.preventDefault();
            const el = document.getElementById('video');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>Music</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="jeff-hero" id="hero">
        <div className="jeff-hero-bg">
          {/* Placeholder for animated logo or video background */}
        </div>
        <button className="jeff-cta" onClick={() => setModalOpen(true)}> P'Jeff, Give Me My Daily Vibe</button>
      </section>
      <AIJeffModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Sign Up Section */}
      <JeffMessageBoard messages={messages} onPost={handlePostMessage} />
      <JeffMessageWall messages={messages} />

      {/* Tour Section */}
      <section className="jeff-tour" id="tour">
        <h2>Tour Dates</h2>
        <div className="jeff-tour-table-wrapper">
          <table className="jeff-tour-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event, idx) => (
                <tr key={idx}>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.time ? event.time : '-'}</td>
                  <td>{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Merch Section */}
      <section className="jeff-merch" id="store">
        <h2>Merch</h2>
        <div className="jeff-merch-grid">
          {merchItems.map((item, idx) => (
            <a
              className="jeff-merch-item"
              href={item.url}
          target="_blank"
          rel="noopener noreferrer"
              key={idx}
            >
              <div
                className="jeff-merch-img"
                style={{ backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
            </a>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="jeff-video" id="video">
        <h2>Music Videos</h2>
        <div className="jeff-video-carousel-centered">
          <button className="jeff-video-arrow" onClick={handlePrevVideo} aria-label="Previous Video">&#8592;</button>
          <div className="jeff-video-center-item">
            {playing && videoItems[videoIndex] ? (
              <div className="jeff-video-iframe-wrapper">
                <iframe
                  width="420"
                  height="240"
                  src={`https://www.youtube.com/embed/${videoItems[videoIndex].youtubeId}?autoplay=1`}
                  title={videoItems[videoIndex].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div
                className="jeff-video-thumb"
                style={{backgroundImage: `url(${videoItems[videoIndex].thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
              >
                <button className="jeff-video-play" onClick={handlePlayVideo} aria-label="Play Video"></button>
              </div>
            )}
            <div className="jeff-video-title">{videoItems[videoIndex].title}</div>
          </div>
          <button className="jeff-video-arrow" onClick={handleNextVideo} aria-label="Next Video">&#8594;</button>
        </div>
      </section>

      {/* ElevenLabs Widget Floating Bottom Right */}
      <div style={{position: 'fixed', right: '2.5rem', bottom: '2.5rem', zIndex: 4000}}>
        <elevenlabs-convai agent-id="agent_01jzmfj087e7yt854av44yjjsb" user-transcript agent-response></elevenlabs-convai>
      </div>

      {/* Footer */}
      <footer className="jeff-footer">
        <div className="jeff-footer-socials jeff-footer-icons">
          <a href="https://x.com/jeffsatur?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><path fill="#fff" d="M28.7 7.5h3.2l-7 8.1 8.2 11.1h-6.5l-5.1-6.9-5.8 6.9h-3.2l7.5-8.8-8-10.4h6.6l4.7 6.3 5.2-6.3Zm-1.1 16.2h1.8L12.6 9.7h-1.9l16.9 14Z"/></svg>
          </a>
          <a href="https://www.instagram.com/jeffsatur/?hl=en" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="24" height="24" x="6" y="6" rx="7" fill="#fff"/><circle cx="18" cy="18" r="5" fill="#f8b6d6"/><circle cx="25" cy="11" r="1.5" fill="#f8b6d6"/></svg>
          </a>
          <a href="https://www.facebook.com/jeffsaturofficialth/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="24" height="24" x="6" y="6" rx="7" fill="#fff"/><path d="M20.5 16.5V15c0-.7.3-1 1-1h1.5V11.5h-2c-2.2 0-3 1.8-3 3v2H15v2.5h2v7h3v-7h2l.5-2.5h-2.5Z" fill="#f8b6d6"/></svg>
          </a>
          <a href="https://www.tiktok.com/@jeffsatur?lang=en" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="12" fill="#fff"/><path d="M23 14.5c-.7 0-1.3-.2-1.8-.5v5.2c0 2-1.6 3.6-3.6 3.6s-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6c.2 0 .4 0 .6.1v2.1c-.2-.1-.4-.1-.6-.1-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8v-7.1h2c0 1.1.9 2 2 2v2Z" fill="#f8b6d6"/></svg>
          </a>
          <a href="https://www.youtube.com/channel/UCSFWkjQRmSJoz9QQ4lkwlDA" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="12" fill="#fff"/><polygon points="15,13 24,18 15,23" fill="#f8b6d6"/></svg>
          </a>
          <a href="https://open.spotify.com/album/770EzwgJTG2oM0U6pX1B11?go=1&fbclid=PAQ0xDSwLt3GlleHRuA2FlbQIxMQABp69Gx9VUqx2pgMrMXhqdOGJkUCeQtKy7UblrVgMm5QBlaToTRWX8YcYAEMKp_aem_Q-trbqsK8YmY8CZTpy1-eg&referral=labelaffiliate&utm_source=10010ldSkIP&utm_medium=Warner_Thailand&utm_campaign=labelaffiliate" aria-label="Spotify" target="_blank" rel="noopener noreferrer">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="12" fill="#fff"/><path d="M13.5 20.5c2.7-1.1 6.3-1.1 9 0M14.5 18c2.1-.8 5-.8 7 0M15.5 15.5c1.5-.6 3.5-.6 5 0" stroke="#f8b6d6" stroke-width="1.5" stroke-linecap="round"/></svg>
          </a>
          <a href="https://music.apple.com/th/album/1819336682?app=music&at=1l3vpUI&ct=LFV_53ca74618c70166bae597a757ae8667a&itscg=30440&itsct=catchall_p2&lId=213312721&cId=none&sr=2&src=Linkfire&ls=1" aria-label="Apple Music" target="_blank" rel="noopener noreferrer">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="12" fill="#fff"/><path d="M24 13.5c-.6.4-1.2.7-1.9.8-.2-.6-.5-1.2-.9-1.7-.5-.6-1.2-1-2-1-.8 0-1.5.3-2 .9-.5.5-.8 1.2-.8 2 0 .2 0 .4.1.6-1.6.1-3.1.9-4.1 2.2-.5.7-.8 1.5-.8 2.4 0 1.7 1.4 3.1 3.1 3.1.7 0 1.4-.2 2-.6.5-.3 1-.7 1.6-.7.5 0 1.1.3 1.7.7.6.4 1.3.6 2 .6 1.7 0 3.1-1.4 3.1-3.1 0-1.2-.7-2.2-1.7-2.7Z" fill="#f8b6d6"/></svg>
          </a>
        </div>
        <div className="jeff-footer-copyright">
          © 2025 FVP Entertainment
        </div>
      </footer>
    </div>
  );
}

export default App;
