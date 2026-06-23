/**
 * Curated offers catalog (hardcoded for now).
 *
 * Each offer's `url` points to the brand's real signup / pricing / plans page so
 * "Claim" deep-links to the exact site. This is a placeholder until a live offers
 * feed (affiliate network API + backend) replaces it — see docs/AFFILIATE_OFFERS_PLAN.md.
 * The schema intentionally matches the planned normalized Offer shape so the swap
 * is a drop-in: only the data source changes, not the screen.
 */

export const OFFER_CATEGORIES = [
  'All',
  'Streaming',
  'Music',
  'Productivity',
  'Cloud',
  'Gaming',
  'Security',
  'AI',
  'Design',
  'Fitness',
  'News',
  'Learning',
] as const;

export type OfferCategory = (typeof OFFER_CATEGORIES)[number];

export interface CuratedOffer {
  id: string;
  icon: string;
  fallback: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  category: Exclude<OfferCategory, 'All'>;
  url: string;
}

// Accent palette reused across offers.
const C = {
  green: '#a0d57c',
  sage: '#abd28f',
  grey: '#c8c6c5',
  coral: '#ffb4ab',
  teal: '#6BD8CB',
};

export const OFFERS: CuratedOffer[] = [
  // ── Streaming (video) ──────────────────────────────────────────────────────
  { id: 'netflix', icon: 'film.fill', fallback: '🎬', title: 'Netflix', desc: 'Plans from ad-supported to Premium 4K', tag: 'Popular', tagColor: C.green, category: 'Streaming', url: 'https://www.netflix.com/signup' },
  { id: 'hulu', icon: 'tv.fill', fallback: '📺', title: 'Hulu', desc: 'Start a free trial, ads or no-ads', tag: 'Free trial', tagColor: C.sage, category: 'Streaming', url: 'https://www.hulu.com/welcome' },
  { id: 'disneyplus', icon: 'sparkles.tv.fill', fallback: '🏰', title: 'Disney+', desc: 'Bundle with Hulu & ESPN+ to save', tag: 'Bundle', tagColor: C.teal, category: 'Streaming', url: 'https://www.disneyplus.com/sign-up' },
  { id: 'max', icon: 'play.tv.fill', fallback: '🎞️', title: 'Max', desc: 'HBO Max — annual plan saves more', tag: 'Save yearly', tagColor: C.green, category: 'Streaming', url: 'https://www.max.com/subscribe' },
  { id: 'paramountplus', icon: 'tv.fill', fallback: '⛰️', title: 'Paramount+', desc: 'Free trial on Essential & Premium', tag: 'Free trial', tagColor: C.sage, category: 'Streaming', url: 'https://www.paramountplus.com/account/signup/' },
  { id: 'peacock', icon: 'play.tv.fill', fallback: '🦚', title: 'Peacock', desc: 'See current Premium plans', tag: 'Deal', tagColor: C.grey, category: 'Streaming', url: 'https://www.peacocktv.com/plans' },
  { id: 'appletv', icon: 'appletv.fill', fallback: '', title: 'Apple TV+', desc: '7-day free trial available', tag: 'Free trial', tagColor: C.sage, category: 'Streaming', url: 'https://tv.apple.com' },
  { id: 'primevideo', icon: 'play.rectangle.fill', fallback: '📦', title: 'Prime Video', desc: 'Included with Amazon Prime', tag: 'Bundle', tagColor: C.teal, category: 'Streaming', url: 'https://www.amazon.com/primevideo' },
  { id: 'youtubepremium', icon: 'play.rectangle.fill', fallback: '▶️', title: 'YouTube Premium', desc: 'Ad-free + YouTube Music included', tag: 'Free trial', tagColor: C.sage, category: 'Streaming', url: 'https://www.youtube.com/premium' },
  { id: 'crunchyroll', icon: 'tv.fill', fallback: '🍙', title: 'Crunchyroll', desc: 'Anime — 14-day free trial', tag: 'Free trial', tagColor: C.sage, category: 'Streaming', url: 'https://www.crunchyroll.com/welcome' },

  // ── Music & audio ───────────────────────────────────────────────────────────
  { id: 'spotify', icon: 'music.note', fallback: '🎵', title: 'Spotify', desc: 'Individual, Duo, Family & Student', tag: 'Student', tagColor: C.green, category: 'Music', url: 'https://www.spotify.com/us/premium/' },
  { id: 'applemusic', icon: 'music.note', fallback: '🎶', title: 'Apple Music', desc: '1-month free trial', tag: 'Free trial', tagColor: C.sage, category: 'Music', url: 'https://music.apple.com' },
  { id: 'youtubemusic', icon: 'music.note', fallback: '🎧', title: 'YouTube Music', desc: 'Free trial on Premium', tag: 'Free trial', tagColor: C.sage, category: 'Music', url: 'https://music.youtube.com' },
  { id: 'tidal', icon: 'waveform', fallback: '🌊', title: 'Tidal', desc: 'Hi-Fi audio — see plans', tag: 'Deal', tagColor: C.grey, category: 'Music', url: 'https://tidal.com/' },
  { id: 'amazonmusic', icon: 'music.note', fallback: '🎼', title: 'Amazon Music', desc: 'Unlimited — free trial', tag: 'Free trial', tagColor: C.sage, category: 'Music', url: 'https://www.amazon.com/music/unlimited' },
  { id: 'siriusxm', icon: 'dot.radiowaves.left.and.right', fallback: '📻', title: 'SiriusXM', desc: 'Streaming & in-car plans', tag: 'Deal', tagColor: C.grey, category: 'Music', url: 'https://www.siriusxm.com' },
  { id: 'audible', icon: 'headphones', fallback: '🎙️', title: 'Audible', desc: '30-day free trial + 1 credit', tag: 'Free trial', tagColor: C.sage, category: 'Music', url: 'https://www.audible.com' },
  { id: 'pandora', icon: 'music.note', fallback: '🎵', title: 'Pandora', desc: 'Upgrade to Plus or Premium', tag: 'Deal', tagColor: C.grey, category: 'Music', url: 'https://www.pandora.com/upgrade' },

  // ── Productivity & work ──────────────────────────────────────────────────────
  { id: 'microsoft365', icon: 'doc.fill', fallback: '📄', title: 'Microsoft 365', desc: 'Personal & Family plans', tag: 'Popular', tagColor: C.green, category: 'Productivity', url: 'https://www.microsoft.com/microsoft-365/buy/compare-all-microsoft-365-products' },
  { id: 'googleworkspace', icon: 'briefcase.fill', fallback: '💼', title: 'Google Workspace', desc: 'Business email & docs', tag: 'Free trial', tagColor: C.sage, category: 'Productivity', url: 'https://workspace.google.com/pricing' },
  { id: 'notion', icon: 'note.text', fallback: '🗒️', title: 'Notion', desc: 'Free for personal; Plus & Business', tag: 'Free tier', tagColor: C.teal, category: 'Productivity', url: 'https://www.notion.so/pricing' },
  { id: 'evernote', icon: 'note.text', fallback: '🐘', title: 'Evernote', desc: 'Compare Personal & Professional', tag: 'Deal', tagColor: C.grey, category: 'Productivity', url: 'https://evernote.com/compare-plans' },
  { id: 'todoist', icon: 'checkmark.circle.fill', fallback: '✅', title: 'Todoist', desc: 'Pro for power users', tag: 'Free tier', tagColor: C.teal, category: 'Productivity', url: 'https://todoist.com/pricing' },
  { id: 'grammarly', icon: 'textformat', fallback: '✍️', title: 'Grammarly', desc: 'Premium writing assistance', tag: 'Free tier', tagColor: C.teal, category: 'Productivity', url: 'https://www.grammarly.com/plans' },
  { id: 'slack', icon: 'number', fallback: '💬', title: 'Slack', desc: 'Pro & Business+ for teams', tag: 'Free tier', tagColor: C.teal, category: 'Productivity', url: 'https://slack.com/pricing' },
  { id: 'zoom', icon: 'video.fill', fallback: '🎥', title: 'Zoom', desc: 'Pro plans for longer meetings', tag: 'Free tier', tagColor: C.teal, category: 'Productivity', url: 'https://zoom.us/pricing' },
  { id: 'trello', icon: 'square.grid.2x2.fill', fallback: '📋', title: 'Trello', desc: 'Standard & Premium boards', tag: 'Free tier', tagColor: C.teal, category: 'Productivity', url: 'https://trello.com/pricing' },

  // ── Cloud & storage ──────────────────────────────────────────────────────────
  { id: 'googleone', icon: 'icloud.fill', fallback: '☁️', title: 'Google One', desc: 'Expanded storage across Google', tag: 'Deal', tagColor: C.grey, category: 'Cloud', url: 'https://one.google.com/about/plans' },
  { id: 'icloud', icon: 'icloud.fill', fallback: '☁️', title: 'iCloud+', desc: 'More storage & Private Relay', tag: 'Deal', tagColor: C.grey, category: 'Cloud', url: 'https://www.apple.com/icloud/' },
  { id: 'dropbox', icon: 'shippingbox.fill', fallback: '📦', title: 'Dropbox', desc: 'Plus & Professional plans', tag: 'Free trial', tagColor: C.sage, category: 'Cloud', url: 'https://www.dropbox.com/plans' },
  { id: 'backblaze', icon: 'externaldrive.fill', fallback: '💾', title: 'Backblaze', desc: 'Unlimited cloud backup', tag: 'Free trial', tagColor: C.sage, category: 'Cloud', url: 'https://www.backblaze.com/cloud-backup/pricing' },
  { id: 'pcloud', icon: 'icloud.fill', fallback: '☁️', title: 'pCloud', desc: 'Lifetime & annual storage', tag: 'Save yearly', tagColor: C.green, category: 'Cloud', url: 'https://www.pcloud.com/cloud-storage-pricing-plans.html' },

  // ── Gaming ───────────────────────────────────────────────────────────────────
  { id: 'xboxgamepass', icon: 'gamecontroller.fill', fallback: '🎮', title: 'Xbox Game Pass', desc: 'Hundreds of games, see tiers', tag: 'Popular', tagColor: C.green, category: 'Gaming', url: 'https://www.xbox.com/xbox-game-pass' },
  { id: 'psplus', icon: 'gamecontroller.fill', fallback: '🎮', title: 'PlayStation Plus', desc: 'Essential, Extra & Premium', tag: 'Deal', tagColor: C.grey, category: 'Gaming', url: 'https://www.playstation.com/ps-plus/' },
  { id: 'nintendoonline', icon: 'gamecontroller.fill', fallback: '🕹️', title: 'Switch Online', desc: 'Individual & Family memberships', tag: 'Deal', tagColor: C.grey, category: 'Gaming', url: 'https://www.nintendo.com/switch/online/' },
  { id: 'eaplay', icon: 'gamecontroller.fill', fallback: '🎮', title: 'EA Play', desc: 'EA library & early trials', tag: 'Deal', tagColor: C.grey, category: 'Gaming', url: 'https://www.ea.com/ea-play' },
  { id: 'ubisoftplus', icon: 'gamecontroller.fill', fallback: '🎮', title: 'Ubisoft+', desc: 'Ubisoft catalog subscription', tag: 'Deal', tagColor: C.grey, category: 'Gaming', url: 'https://store.ubisoft.com/ubisoftplus' },
  { id: 'geforcenow', icon: 'bolt.fill', fallback: '⚡', title: 'GeForce NOW', desc: 'Cloud gaming — free & paid tiers', tag: 'Free tier', tagColor: C.teal, category: 'Gaming', url: 'https://www.nvidia.com/geforce-now/' },
  { id: 'applearcade', icon: 'gamecontroller.fill', fallback: '🎮', title: 'Apple Arcade', desc: '200+ games, free trial', tag: 'Free trial', tagColor: C.sage, category: 'Gaming', url: 'https://www.apple.com/apple-arcade/' },

  // ── Security & VPN ───────────────────────────────────────────────────────────
  { id: 'nordvpn', icon: 'lock.shield.fill', fallback: '🛡️', title: 'NordVPN', desc: 'Multi-year plans save most', tag: 'Save yearly', tagColor: C.green, category: 'Security', url: 'https://nordvpn.com/pricing/' },
  { id: 'expressvpn', icon: 'lock.shield.fill', fallback: '🛡️', title: 'ExpressVPN', desc: 'See current VPN plans', tag: 'Deal', tagColor: C.grey, category: 'Security', url: 'https://www.expressvpn.com/order' },
  { id: 'surfshark', icon: 'lock.shield.fill', fallback: '🦈', title: 'Surfshark', desc: 'Unlimited devices VPN', tag: 'Save yearly', tagColor: C.green, category: 'Security', url: 'https://surfshark.com/pricing' },
  { id: '1password', icon: 'key.fill', fallback: '🔑', title: '1Password', desc: 'Individual & Family vaults', tag: 'Free trial', tagColor: C.sage, category: 'Security', url: 'https://1password.com/sign-up' },
  { id: 'dashlane', icon: 'key.fill', fallback: '🔑', title: 'Dashlane', desc: 'Password manager + VPN', tag: 'Free tier', tagColor: C.teal, category: 'Security', url: 'https://www.dashlane.com/pricing' },
  { id: 'proton', icon: 'lock.fill', fallback: '🔒', title: 'Proton', desc: 'Encrypted mail, VPN & drive', tag: 'Free tier', tagColor: C.teal, category: 'Security', url: 'https://proton.me/pricing' },

  // ── AI tools ─────────────────────────────────────────────────────────────────
  { id: 'chatgpt', icon: 'sparkles', fallback: '🤖', title: 'ChatGPT Plus', desc: 'Faster access & advanced models', tag: 'Popular', tagColor: C.green, category: 'AI', url: 'https://openai.com/chatgpt/pricing/' },
  { id: 'claude', icon: 'sparkles', fallback: '✳️', title: 'Claude Pro', desc: 'More usage & latest models', tag: 'Popular', tagColor: C.green, category: 'AI', url: 'https://claude.ai/upgrade' },
  { id: 'perplexity', icon: 'magnifyingglass', fallback: '🔮', title: 'Perplexity Pro', desc: 'Advanced AI search', tag: 'Free trial', tagColor: C.sage, category: 'AI', url: 'https://www.perplexity.ai/pro' },
  { id: 'copilot', icon: 'chevron.left.forwardslash.chevron.right', fallback: '👨‍💻', title: 'GitHub Copilot', desc: 'AI pair programmer', tag: 'Free trial', tagColor: C.sage, category: 'AI', url: 'https://github.com/features/copilot/plans' },
  { id: 'midjourney', icon: 'paintbrush.pointed.fill', fallback: '🎨', title: 'Midjourney', desc: 'AI image generation plans', tag: 'Deal', tagColor: C.grey, category: 'AI', url: 'https://www.midjourney.com/account' },

  // ── Design & creative ────────────────────────────────────────────────────────
  { id: 'adobecc', icon: 'paintpalette.fill', fallback: '🎨', title: 'Adobe Creative Cloud', desc: 'All apps or single-app plans', tag: 'Student', tagColor: C.green, category: 'Design', url: 'https://www.adobe.com/creativecloud/plans.html' },
  { id: 'canva', icon: 'paintpalette.fill', fallback: '🖌️', title: 'Canva Pro', desc: 'Free trial on Pro', tag: 'Free trial', tagColor: C.sage, category: 'Design', url: 'https://www.canva.com/pricing/' },
  { id: 'figma', icon: 'pencil.and.ruler.fill', fallback: '🖊️', title: 'Figma', desc: 'Free starter; Pro for teams', tag: 'Free tier', tagColor: C.teal, category: 'Design', url: 'https://www.figma.com/pricing/' },

  // ── Fitness & health ─────────────────────────────────────────────────────────
  { id: 'peloton', icon: 'figure.run', fallback: '🚴', title: 'Peloton App', desc: 'Free trial on App membership', tag: 'Free trial', tagColor: C.sage, category: 'Fitness', url: 'https://www.onepeloton.com/app' },
  { id: 'strava', icon: 'figure.run', fallback: '🏃', title: 'Strava', desc: 'Subscription for athletes', tag: 'Free trial', tagColor: C.sage, category: 'Fitness', url: 'https://www.strava.com/subscribe' },
  { id: 'calm', icon: 'moon.stars.fill', fallback: '🧘', title: 'Calm', desc: 'Meditation & sleep — free trial', tag: 'Free trial', tagColor: C.sage, category: 'Fitness', url: 'https://www.calm.com/subscribe' },
  { id: 'headspace', icon: 'brain.head.profile', fallback: '🧠', title: 'Headspace', desc: 'Mindfulness — free trial', tag: 'Free trial', tagColor: C.sage, category: 'Fitness', url: 'https://www.headspace.com/subscriptions' },
  { id: 'myfitnesspal', icon: 'fork.knife', fallback: '🍎', title: 'MyFitnessPal', desc: 'Premium nutrition tracking', tag: 'Free tier', tagColor: C.teal, category: 'Fitness', url: 'https://www.myfitnesspal.com/premium' },

  // ── News & reading ───────────────────────────────────────────────────────────
  { id: 'nyt', icon: 'newspaper.fill', fallback: '🗞️', title: 'New York Times', desc: 'Intro subscriber offers', tag: 'Intro offer', tagColor: C.green, category: 'News', url: 'https://www.nytimes.com/subscription' },
  { id: 'wsj', icon: 'newspaper.fill', fallback: '📰', title: 'Wall Street Journal', desc: 'Digital membership deals', tag: 'Intro offer', tagColor: C.green, category: 'News', url: 'https://www.wsj.com/subscribe' },
  { id: 'economist', icon: 'newspaper.fill', fallback: '📰', title: 'The Economist', desc: 'Digital & print plans', tag: 'Deal', tagColor: C.grey, category: 'News', url: 'https://www.economist.com/subscribe' },
  { id: 'kindleunlimited', icon: 'book.fill', fallback: '📚', title: 'Kindle Unlimited', desc: 'Free trial on millions of titles', tag: 'Free trial', tagColor: C.sage, category: 'News', url: 'https://www.amazon.com/kindle-dbs/hz/subscribe/ku' },

  // ── Learning ─────────────────────────────────────────────────────────────────
  { id: 'duolingo', icon: 'graduationcap.fill', fallback: '🦉', title: 'Duolingo Super', desc: 'Ad-free language learning', tag: 'Free trial', tagColor: C.sage, category: 'Learning', url: 'https://www.duolingo.com/super' },
  { id: 'coursera', icon: 'graduationcap.fill', fallback: '🎓', title: 'Coursera Plus', desc: 'Unlimited courses & certs', tag: 'Free trial', tagColor: C.sage, category: 'Learning', url: 'https://www.coursera.org/courseraplus' },
  { id: 'skillshare', icon: 'graduationcap.fill', fallback: '🎨', title: 'Skillshare', desc: 'Creative classes membership', tag: 'Free trial', tagColor: C.sage, category: 'Learning', url: 'https://www.skillshare.com/membership' },
  { id: 'masterclass', icon: 'graduationcap.fill', fallback: '🎬', title: 'MasterClass', desc: 'Learn from the best', tag: 'Deal', tagColor: C.grey, category: 'Learning', url: 'https://www.masterclass.com/subscribe' },
  { id: 'linkedinlearning', icon: 'graduationcap.fill', fallback: '💼', title: 'LinkedIn Learning', desc: '1-month free trial', tag: 'Free trial', tagColor: C.sage, category: 'Learning', url: 'https://www.linkedin.com/learning/' },
];
