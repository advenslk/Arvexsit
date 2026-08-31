import {
  SiteSettings,
  SiteImagesConfig,
  GameService,
  HostingPlan,
  GeneralService,
  ServerLocation,
  ComparisonRow,
  FaqItem,
  Testimonial,
  BlogPost,
  FeatureBox,
  CouponCode,
  CurrencyConfig,
  DeployedServer,
  UserAccount,
  SavedCard,
  Invoice,
  PaymentGatewaySettings,
  SupportTicket,
  DomainTld,
  HostingOrder,
  PaymentRecord,
  CustomerRecord,
  StatusComponent,
  StatusIncident,
  ServerNode,
  AdminUserAccount,
  AuditLogEntry,
  Partner,
  CustomerReview,
} from '../types';

export const INITIAL_SITE_IMAGES: SiteImagesConfig = {
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
  heroBackgroundUrl: 'https://www.image2url.com/r2/default/images/1788177971214-d1820aaa-f247-467f-bdb1-974fb6d8e313.png',
  heroIllustrationUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  controlPanelScreenshotUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  pterodactylBannerUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  datacenterMapUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  switchPromoBannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  paymentMethodsBannerUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: 'ArveX Hosting',
  tagline: 'High-performance game hosting built for players who demand speed, stability, and total control.',
  announcementText: 'Get 10% off now using coupon code',
  announcementCoupon: 'VOLTUS10',
  announcementActive: true,
  heroBadgeText: 'VIEW HYTALE SERVERS',
  heroBadgeLink: 'plans',
  heroTitleLine1: 'Build it, Host it.',
  heroTitleLine2: 'No interruptions.',
  heroSubtitle: 'High-performance game hosting built for players who demand speed, stability, and total control no lag, no limits.',
  heroCtaText: 'Get Started',
  heroSecondaryCtaText: 'View Prices',
  domainSearchTitle: 'Register Your Domain',
  domainSearchSubtitle: 'Secure the perfect domain for your game server or community',
  gamesSectionTitle: 'Hundreds of Games',
  gamesSectionSubtitle: 'Host any games that comes to your mind here at ArveX.',
  pricingSectionTitle: 'GAME SERVER HOSTING',
  pricingSectionSubtitle: 'High-performance game servers with instant setup, DDoS protection, and powerful hardware for lag-free gaming.',
  switchSectionTitle: 'Make The Switch',
  switchSectionSubtitle: 'Join thousands of gamers who switched to faster, more reliable hosting. Experience the difference today.',
  switchCouponCode: 'WELCOME10',
  switchDiscountPercent: 10,
  switchCountdownTarget: new Date(Date.now() + 14 * 3600 * 1000 + 45 * 60 * 1000 + 13 * 1000).toISOString(),
  discordUrl: 'https://discord.gg/arvexhosting',
  twitterUrl: 'https://twitter.com/arvexhosting',
  githubUrl: 'https://github.com/arvexhosting',
  supportEmail: 'support@arvex.host',
  contactSupportUrl: 'mailto:support@arvex.host',
  companyAddress: 'Level 14, West Tower, World Trade Center, Colombo 01, Sri Lanka',
  vatNumber: 'VAT-LK-948120492-B',
};

export const INITIAL_GAMES: GameService[] = [
  { id: 'minecraft', name: 'Minecraft', slug: 'minecraft', category: 'Sandbox & Survival', startingPrice: 8.0, popular: true, image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', activePlayers: '14,280 active servers', shortDescription: 'Full Spigot, Paper, Forge, Fabric, & Bedrock support with 1-click modpacks.', status: 'active' },
  { id: 'rust', name: 'Rust', slug: 'rust', category: 'Action & Survival', startingPrice: 12.0, popular: true, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', activePlayers: '8,430 active servers', shortDescription: 'Instant Oxide & uMod support, automated wipes, and high-tick rate hardware.', status: 'active' },
  { id: 'ark', name: 'ARK: Survival Ascended', slug: 'ark', category: 'Action & Survival', startingPrice: 14.0, popular: false, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80', activePlayers: '4,190 active servers', shortDescription: 'Crossplay enabled, CurseForge mods, and automatic cluster syncing.', status: 'active' },
  { id: 'palworld', name: 'Palworld', slug: 'palworld', category: 'Open World RPG', startingPrice: 11.0, popular: true, image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80', activePlayers: '9,250 active servers', shortDescription: 'Memory leak prevention engine and ultra-fast NVMe processing.', status: 'active' },
  { id: 'cs2', name: 'Counter-Strike 2', slug: 'cs2', category: 'Competitive FPS', startingPrice: 9.0, popular: false, image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80', activePlayers: '6,120 active servers', shortDescription: 'Sub-tick optimized 128-tick equivalent, fast token sync and SourceMod ready.', status: 'active' },
  { id: 'garrys-mod', name: "Garry's Mod", slug: 'garrys-mod', category: 'Sandbox', startingPrice: 7.5, popular: false, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', activePlayers: '5,800 active servers', shortDescription: 'FastDL integration, custom workshop collections, and DarkRP/TTT presets.', status: 'active' },
  { id: 'hytale', name: 'Hytale', slug: 'hytale', category: 'Upcoming RPG & Sandbox', startingPrice: 10.0, popular: true, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80', activePlayers: 'Pre-order available', shortDescription: 'Day-1 instant provisioning and priority cluster queuing reserved.', status: 'active' },
  { id: 'valheim', name: 'Valheim', slug: 'valheim', category: 'Viking Survival', startingPrice: 8.5, popular: false, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', activePlayers: '3,450 active servers', shortDescription: 'Automated cloud world backups, Plus mod framework, and cross-play.', status: 'active' },
];

// IMPORTANT: Never boot the browser as an authenticated administrator.
// A real customer/admin identity must be restored from the authenticated session.
export const INITIAL_USER: UserAccount | null = null;

export const INITIAL_PLANS: HostingPlan[] = [
  { id: 'plan-mc-2gb', slug: 'arx-mc-2gb', gameId: 'minecraft', serviceType: 'minecraft', name: 'ARX-MC-2GB (Dirt Node)', subtitle: 'Entry-Level Minecraft Server', monthlyPrice: 4.5, quarterlyPrice: 12.0, yearlyPrice: 45.0, originalPrice: 6.0, ram: '2 GB DDR5 RAM', ramGb: 2, cpu: '1 vCPU Ryzen 9 9950X', cpuCores: 1, storage: '25 GB PCIe 5.0 NVMe', storageGb: 25, bandwidth: 'Unmetered 10Gbps', players: '15 Players', tier: 'Starter', popular: false, badge: 'Starter', features: ['Unmetered NVMe Storage', 'Instant Automated Setup', 'Basic DDoS Protection', 'Automated Daily Backups', 'Full SFTP Access', 'Custom Subdomain'], description: 'Perfect for small vanilla or Paper survival servers playing with friends. Powered by ultra-high single-thread AMD Ryzen 9 9950X clock speeds.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'Colombo, LK', 'London, UK'], upgradeOptions: [{ name: 'Dedicated IPv4', price: 2.5, description: 'Direct connection on default port 25565 without port numbers.' }, { name: 'Hourly Automated Snapshot Backups', price: 1.5, description: 'Store up to 10 historical snapshots in distributed S3 storage.' }], faq: [{ question: 'Can I install Paper, Spigot, or Fabric?', answer: 'Yes, our 1-Click Version Switcher allows changing between Vanilla, Paper, Purpur, Fabric, and Forge instantly.' }, { question: 'Can I upgrade my RAM later?', answer: 'Yes! Upgrade anytime seamlessly through your dashboard with zero world data loss.' }], terms: 'Fair-use CPU policy applied. 99.99% network uptime SLA guarantee. 48-hour money-back policy for first-time orders.', sortOrder: 1, status: 'active' },
  { id: 'plan-mc-4gb', slug: 'arx-mc-4gb', gameId: 'minecraft', serviceType: 'minecraft', name: 'ARX-MC-4GB (Iron Node)', subtitle: 'Popular SMP & Community Tier', monthlyPrice: 8.0, quarterlyPrice: 22.0, yearlyPrice: 79.0, originalPrice: 12.0, ram: '4 GB DDR5 RAM', ramGb: 4, cpu: '2 vCPU Ryzen 9 9950X', cpuCores: 2, storage: '40 GB PCIe 5.0 NVMe', storageGb: 40, bandwidth: 'Unmetered 10Gbps', players: '35 Players', tier: 'Starter', popular: false, badge: 'Budget Friendly', features: ['Unmetered NVMe Storage', 'Sub-domain & Free MySQL DB', 'Corero SmartWall 3.2Tbps DDoS', 'Modpack 1-Click Installer', 'Automated Daily Backups'], description: 'Great for medium survival servers, light modpacks, and plugin-heavy Spigot/Paper setups.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'Colombo, LK', 'London, UK', 'Sydney, AU'], upgradeOptions: [{ name: 'Dedicated IPv4', price: 2.5, description: 'Dedicated static IP for your server.' }, { name: 'VIP Priority CPU Scheduling', price: 3.0, description: 'Pinned thread priority on AMD Zen 5 hardware.' }], faq: [{ question: 'Does this plan support CurseForge & Modrinth modpacks?', answer: 'Yes, over 2,000 modpacks can be installed in a single click from the Pterodactyl console.' }], terms: 'Standard hosting terms apply. Instant automated provisioning within 30 seconds.', sortOrder: 2, status: 'active' },
  { id: 'plan-mc-8gb', slug: 'arx-mc-8gb', gameId: 'minecraft', serviceType: 'minecraft', name: 'ARX-MC-8GB (Gold Node)', subtitle: 'Heavy Modpack & Network Node', monthlyPrice: 14.0, quarterlyPrice: 38.0, yearlyPrice: 139.0, originalPrice: 19.0, ram: '8 GB DDR5 RAM', ramGb: 8, cpu: '4 vCPU Ryzen 9 9950X', cpuCores: 4, storage: '75 GB PCIe 5.0 NVMe', storageGb: 75, bandwidth: 'Unmetered 10Gbps', players: '75 Players', tier: 'Standard', popular: true, featured: true, badge: 'Most Popular', features: ['Unmetered NVMe Storage', 'Sub-domain & Free MySQL DB', 'Corero SmartWall 3.2Tbps DDoS', 'Modpack 1-Click Installer', '99.99% Uptime SLA', 'Priority Discord Support'], description: 'Our flagship Minecraft plan. Handles large modpacks and populated networks with ease.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'Colombo, LK', 'London, UK', 'Sydney, AU'], upgradeOptions: [{ name: 'Dedicated IPv4', price: 2.5, description: 'Custom static IP without extra port numbers.' }, { name: 'Offsite Hourly Cloud Backups', price: 2.0, description: 'Multi-datacenter distributed backup vault.' }], faq: [{ question: 'Will this run heavy 1.20+ Fabric/Forge modpacks?', answer: 'Yes! 8GB DDR5 6000MHz memory is optimized for high entity counts and large render distances.' }], terms: 'Includes 99.99% uptime guarantee and free BGP Anycast routing.', sortOrder: 3, status: 'active' },
  { id: 'plan-mc-16gb', slug: 'arx-mc-16gb', gameId: 'minecraft', serviceType: 'minecraft', name: 'ARX-MC-16GB (Diamond Node)', subtitle: 'Extreme Enterprise Network', monthlyPrice: 24.0, quarterlyPrice: 65.0, yearlyPrice: 239.0, originalPrice: 32.0, ram: '16 GB DDR5 RAM', ramGb: 16, cpu: '6 vCPU Ryzen 9 9950X', cpuCores: 6, storage: '150 GB PCIe 5.0 NVMe', storageGb: 150, bandwidth: 'Unmetered 10Gbps', players: 'Unlimited Players', tier: 'Premium', popular: false, badge: 'Enterprise Performance', features: ['Dedicated IP Included', 'High Priority Thread Scheduling', 'VIP Discord Support', 'Unlimited Player Slots', 'Automated Offsite Hourly Backups', 'Free MySQL Database Cluster'], description: 'Built for enterprise Minecraft networks, BungeeCord/Velocity setups, large competitive servers, and massive modpacks.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'Colombo, LK', 'London, UK', 'Sydney, AU'], upgradeOptions: [{ name: 'Direct BGP Anycast Prefix', price: 10.0, description: 'Custom BGP session with your own ASN & IP prefix.' }], faq: [{ question: 'Is Dedicated IP free with this plan?', answer: 'Yes, 1 dedicated static IPv4 address is included at no extra charge.' }], terms: 'Premium enterprise SLA with direct senior engineer ticketing.', sortOrder: 4, status: 'active' },
  { id: 'plan-vps-2gb', slug: 'arx-vps-2gb', gameId: 'vps', serviceType: 'vps', name: 'ARX-VPS-2GB (Nano)', subtitle: 'High-Frequency Cloud VPS', monthlyPrice: 6.5, quarterlyPrice: 18.0, yearlyPrice: 65.0, originalPrice: 9.0, ram: '2 GB DDR5 ECC', ramGb: 2, cpu: '1 vCPU Ryzen 9 9950X', cpuCores: 1, storage: '35 GB NVMe Gen4', storageGb: 35, bandwidth: '2 TB @ 10Gbps', players: 'Full Root Access', tier: 'Starter', popular: false, badge: 'KVM Virtualization', features: ['Full KVM Virtualization', 'Dedicated IPv4 + /64 IPv6', 'Custom ISO Installation', '10Gbps Uplink Port', 'Instant Reinstall & Console'], description: 'Fast, isolated KVM virtual private server with dedicated NVMe storage and root access.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'London, UK'], osOptions: ['Ubuntu 24.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 12 Bookworm', 'AlmaLinux 9', 'Arch Linux'], sortOrder: 10, status: 'active' },
  { id: 'plan-vps-4gb', slug: 'arx-vps-4gb', gameId: 'vps', serviceType: 'vps', name: 'ARX-VPS-4GB (Pro)', subtitle: 'High-Frequency Cloud VPS', monthlyPrice: 12.0, quarterlyPrice: 32.0, yearlyPrice: 119.0, originalPrice: 16.0, ram: '4 GB DDR5 ECC', ramGb: 4, cpu: '2 vCPU Ryzen 9 9950X', cpuCores: 2, storage: '65 GB NVMe Gen4', storageGb: 65, bandwidth: '5 TB @ 10Gbps', players: 'Full Root Access', tier: 'Standard', popular: true, featured: true, badge: 'Top Value', features: ['Full KVM Virtualization', 'Dedicated IPv4 + /64 IPv6', 'Custom ISO & Snapshots', '10Gbps Uplink Port', 'Corero 3.2Tbps DDoS Protection'], description: 'High-frequency cloud compute built on Zen 5 architecture.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'London, UK', 'Colombo, LK'], osOptions: ['Ubuntu 24.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 12 Bookworm', 'AlmaLinux 9', 'Rocky Linux 9', 'Windows Server 2022'], sortOrder: 11, status: 'active' },
  { id: 'plan-vps-8gb', slug: 'arx-vps-8gb', gameId: 'vps', serviceType: 'vps', name: 'ARX-VPS-8GB (Ultra)', subtitle: 'Extreme Cloud Compute', monthlyPrice: 22.0, quarterlyPrice: 60.0, yearlyPrice: 219.0, originalPrice: 29.0, ram: '8 GB DDR5 ECC', ramGb: 8, cpu: '4 vCPU Ryzen 9 9950X', cpuCores: 4, storage: '120 GB NVMe Gen4', storageGb: 120, bandwidth: '10 TB @ 10Gbps', players: 'Full Root Access', tier: 'Standard', popular: false, badge: 'High Performance', features: ['Full KVM Virtualization', 'Dedicated IPv4 + /64 IPv6', 'Custom ISO & 3 Snapshots', '10Gbps Unmetered Uplink', 'BGP Anycast Routing'], description: 'Ideal for heavy database workloads, game hosting clusters, and demanding containerized applications.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'London, UK', 'Colombo, LK'], osOptions: ['Ubuntu 24.04 LTS', 'Debian 12 Bookworm', 'AlmaLinux 9', 'Windows Server 2022'], sortOrder: 12, status: 'active' },
  { id: 'plan-vds-16gb', slug: 'arx-vds-16gb', gameId: 'vds', serviceType: 'vds', name: 'ARX-VDS-16GB (Dedicated Slice)', subtitle: '100% Dedicated CPU Cores', monthlyPrice: 34.0, quarterlyPrice: 92.0, yearlyPrice: 339.0, originalPrice: 45.0, ram: '16 GB DDR5 ECC', ramGb: 16, cpu: '4 Dedicated vCPU Ryzen 9 9950X', cpuCores: 4, storage: '200 GB Enterprise NVMe', storageGb: 200, bandwidth: 'Unmetered 10Gbps', players: 'Full Root / Dedicated Cores', tier: 'Premium', popular: true, badge: '100% Dedicated Cores', features: ['Dedicated Non-Shared CPU Cores', '100% NVMe Gen4 RAID-10', 'Dedicated IPv4 + /64 IPv6', 'Direct BGP Routing', '24/7 SLA Hotline'], description: 'Virtual Dedicated Server with 100% non-oversubscribed CPU cores.', availability: 'In Stock', locations: ['Frankfurt, DE', 'Dallas, TX', 'Singapore'], sortOrder: 20, status: 'active' },
  { id: 'plan-vds-32gb', slug: 'arx-vds-32gb', gameId: 'vds', serviceType: 'vds', name: 'ARX-VDS-32GB (Enterprise Slice)', subtitle: '100% Dedicated CPU Cores', monthlyPrice: 59.0, quarterlyPrice: 160.0, yearlyPrice: 589.0, originalPrice: 79.0, ram: '32 GB DDR5 ECC', ramGb: 32, cpu: '8 Dedicated vCPU Ryzen 9 9950X', cpuCores: 8, storage: '400 GB Enterprise NVMe', storageGb: 400, bandwidth: 'Unmetered 10Gbps', players: 'Full Root / Dedicated Cores', tier: 'Premium', popular: false, badge: 'Bare-Metal Power', features: ['8 Dedicated 5.7GHz Cores', 'Enterprise NVMe RAID', '2 Dedicated IPv4 Addresses', 'Sub-millisecond Latency', 'Dedicated Account Manager'], description: 'Enterprise virtual dedicated node with massive compute throughput.', availability: 'In Stock', locations: ['Frankfurt, DE', 'Dallas, TX', 'Singapore'], sortOrder: 21, status: 'active' },
  { id: 'plan-web-starter', slug: 'arx-web-starter', gameId: 'web-hosting', serviceType: 'web-hosting', name: 'Web Starter Lite', subtitle: 'cPanel LiteSpeed Web Hosting', monthlyPrice: 2.99, quarterlyPrice: 8.0, yearlyPrice: 29.0, originalPrice: 4.5, ram: '1 GB RAM', ramGb: 1, cpu: '1 Core CloudLinux', cpuCores: 1, storage: '10 GB NVMe SSD', storageGb: 10, bandwidth: 'Unmetered Bandwidth', players: '1 Hosted Website', tier: 'Starter', popular: false, badge: 'Free SSL Included', features: ['1 Hosted Website', 'Free Let’s Encrypt SSL', '5 MySQL Databases', '10 Email Mailboxes', 'cPanel Control Panel', 'LiteSpeed Web Server + LSCache'], description: 'Fast, secure web hosting with cPanel and LiteSpeed caching.', availability: 'In Stock', locations: ['Frankfurt, DE', 'Dallas, TX', 'Singapore', 'Colombo, LK'], controlPanel: 'cPanel / DirectAdmin', sortOrder: 30, status: 'active' },
  { id: 'plan-web-business', slug: 'arx-web-business', gameId: 'web-hosting', serviceType: 'web-hosting', name: 'Web Business Pro', subtitle: 'cPanel LiteSpeed Web Hosting', monthlyPrice: 6.99, quarterlyPrice: 19.0, yearlyPrice: 69.0, originalPrice: 9.99, ram: '3 GB RAM', ramGb: 3, cpu: '2 Core CloudLinux', cpuCores: 2, storage: '40 GB NVMe SSD', storageGb: 40, bandwidth: 'Unmetered Bandwidth', players: 'Unlimited Websites', tier: 'Standard', popular: true, badge: 'Unlimited Domains', features: ['Unlimited Hosted Websites', 'Free Wildcard SSL Certificates', 'Unlimited MySQL Databases', 'Unlimited Email Accounts', 'Automated Daily JetBackup', 'Free Domain Registration (.com/.xyz)'], description: 'Engineered for growing businesses, e-commerce stores, and high-traffic community portals.', availability: 'In Stock', locations: ['Frankfurt, DE', 'Dallas, TX', 'Singapore', 'Colombo, LK'], controlPanel: 'cPanel / DirectAdmin', sortOrder: 31, status: 'active' },
  { id: 'plan-bot-nano', slug: 'arx-bot-nano', gameId: 'bot-hosting', serviceType: 'bot-hosting', name: 'Discord Bot Mini', subtitle: '24/7 Bot Process Hosting', monthlyPrice: 1.99, quarterlyPrice: 5.5, yearlyPrice: 19.0, originalPrice: 3.0, ram: '1 GB DDR5 RAM', ramGb: 1, cpu: '1 vCPU Ryzen 9 9950X', cpuCores: 1, storage: '10 GB NVMe SSD', storageGb: 10, bandwidth: 'Unmetered 10Gbps', players: '1 Bot Instance', tier: 'Starter', popular: true, badge: '24/7 Keep-Alive', features: ['Supports Node.js, Python, Java, Go', 'Git Push Auto-Deploy', 'Persistent SQLite / MySQL DB', 'Live Console & Log Streaming', 'Automatic Crash Recovery'], description: 'Keep your Discord, Telegram, or custom automation bots running 24/7.', availability: 'In Stock', locations: ['Frankfurt, DE', 'Dallas, TX', 'Singapore', 'Colombo, LK'], sortOrder: 40, status: 'active' },
  { id: 'plan-bot-pro', slug: 'arx-bot-pro', gameId: 'bot-hosting', serviceType: 'bot-hosting', name: 'Discord Bot Cluster', subtitle: 'Heavy Sharded Bot Instance', monthlyPrice: 4.99, quarterlyPrice: 13.5, yearlyPrice: 49.0, originalPrice: 7.0, ram: '4 GB DDR5 RAM', ramGb: 4, cpu: '2 vCPU Ryzen 9 9950X', cpuCores: 2, storage: '30 GB NVMe SSD', storageGb: 30, bandwidth: 'Unmetered 10Gbps', players: 'Multi-Shard Bot', tier: 'Standard', popular: false, badge: 'Multi-Shard Support', features: ['High-Memory Sharding Capacity', 'Redis Cache Included', 'Persistent Storage Volume', 'Custom Environment Secrets', '24/7 Uptime Monitoring'], description: 'Optimized for verified Discord bots in thousands of guilds.', availability: 'In Stock', locations: ['Frankfurt, DE', 'Dallas, TX', 'Singapore'], sortOrder: 41, status: 'active' },
  { id: 'plan-rust-starter', slug: 'arx-rust-10gb', gameId: 'rust', serviceType: 'game-hosting', name: 'Rust Survivor Node', subtitle: 'Rust High-Tick Server', monthlyPrice: 16.0, quarterlyPrice: 44.0, yearlyPrice: 159.0, originalPrice: 22.0, ram: '10 GB DDR5 RAM', ramGb: 10, cpu: '4 vCPU Ryzen 9 9950X', cpuCores: 4, storage: '60 GB NVMe', storageGb: 60, bandwidth: 'Unmetered 10Gbps', players: '75 Players', tier: 'Starter', popular: false, features: ['uMod & Carbon 1-Click', 'Automated Map/BP Wipes', 'Corero 3.2Tbps DDoS Protection', 'Rust+ Bot Sync'], description: 'Reliable Rust server hosting with automated wipe scheduling.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'London, UK'], sortOrder: 50, status: 'active' },
  { id: 'plan-pal-std', slug: 'arx-pal-16gb', gameId: 'palworld', serviceType: 'game-hosting', name: 'Palworld Tamer Pro', subtitle: 'Palworld Dedicated Server', monthlyPrice: 18.0, quarterlyPrice: 48.0, yearlyPrice: 179.0, originalPrice: 24.0, ram: '16 GB DDR5 RAM', ramGb: 16, cpu: '6 vCPU Ryzen 9 9950X', cpuCores: 6, storage: '80 GB NVMe', storageGb: 80, bandwidth: 'Unmetered 10Gbps', players: '32 Players', tier: 'Standard', popular: true, badge: 'Anti-Memory Leak', features: ['Auto-Restart Garbage Collector', 'Steam + Game Pass Compatible', 'Instant Mod Management', 'Automated Cloud Save Backups'], description: 'Custom memory management engine eliminates Palworld RAM accumulation issues.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'Colombo, LK'], sortOrder: 51, status: 'active' },
  { id: 'plan-ark-std', slug: 'arx-ark-16gb', gameId: 'ark', serviceType: 'game-hosting', name: 'ARK Ascended Survivor', subtitle: 'ARK: Survival Ascended Node', monthlyPrice: 22.0, quarterlyPrice: 59.0, yearlyPrice: 219.0, originalPrice: 28.0, ram: '16 GB DDR5 RAM', ramGb: 16, cpu: '6 vCPU Ryzen 9 9950X', cpuCores: 6, storage: '100 GB NVMe', storageGb: 100, bandwidth: 'Unmetered 10Gbps', players: '70 Players', tier: 'Standard', popular: false, badge: 'Crossplay Ready', features: ['CurseForge Mod Support', 'Crossplay Ready (PC/PS5/Xbox)', 'Automated Memory Cleanup', 'Free Cluster Syncing'], description: 'High-memory instance engineered for Unreal Engine 5 rendering and crossplay clusters.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore'], sortOrder: 52, status: 'active' },
  { id: 'plan-fivem-std', slug: 'arx-fivem-16gb', gameId: 'fivem', serviceType: 'game-hosting', name: 'FiveM GTA V City', subtitle: 'Roleplay High-Performance Node', monthlyPrice: 20.0, quarterlyPrice: 54.0, yearlyPrice: 199.0, originalPrice: 26.0, ram: '16 GB DDR5 RAM', ramGb: 16, cpu: '6 vCPU Ryzen 9 9950X', cpuCores: 6, storage: '100 GB NVMe', storageGb: 100, bandwidth: 'Unmetered 10Gbps', players: '128 Players (Patreon Key)', tier: 'Standard', popular: true, badge: 'ESX & QBCore Ready', features: ['ESX & QBCore 1-Click Installers', 'txAdmin Full Integration', 'Database Cluster Included', 'High-Bandwidth Asset Streaming'], description: 'Optimized for high-population GTA V roleplay communities.', availability: 'In Stock', locations: ['Dallas, TX', 'Frankfurt, DE', 'Singapore', 'Colombo, LK'], sortOrder: 53, status: 'active' },
  { id: 'plan-cs2-std', slug: 'arx-cs2-8gb', gameId: 'cs2', serviceType: 'game-hosting', name: 'Counter-Strike 2 Arena', subtitle: 'Competitive CS2 Server', monthlyPrice: 9.0, quarterlyPrice: 24.0, yearlyPrice: 89.0, originalPrice: 12.0, ram: '8 GB DDR5 RAM', ramGb: 8, cpu: '4 vCPU Ryzen 9 9950X', cpuCores: 4, storage: '50 GB NVMe', storageGb: 50, bandwidth: 'Unmetered 10Gbps', players: '32 Players', tier: 'Starter', popular: false, badge: '128-Tick Equiv Sub-Tick', features: ['Sub-Tick Optimized Rates', 'Fast GSLT Token Manager', 'SourceMod / CounterStrikeSharp Support', 'MatchZy Tournament Plugin 1-Click'], description: 'Sub-tick precision CS2 servers with low jitter and zero packet loss.', availability: 'In Stock', locations: ['Frankfurt, DE', 'Dallas, TX', 'Singapore', 'Colombo, LK'], sortOrder: 54, status: 'active' },
];

export const INITIAL_GENERAL_SERVICES: GeneralService[] = [
  { id: 'srv-game', title: 'Game Server Hosting', description: 'Ultra-low latency game servers powered by latest-gen AMD Ryzen 9 processors with instant setup.', icon: 'Gamepad2', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', startingPrice: 6.99, badge: 'Popular', category: 'Gaming', features: ['Sub-1ms tick processing', 'Pterodactyl Control Panel', 'Corero 3.2Tbps DDoS Protection', '1-Click Modpack Installer'], active: true },
  { id: 'srv-vps', title: 'High-Frequency VPS', description: 'KVM-based cloud virtual private servers with dedicated NVMe storage, full root access, and unmetered bandwidth.', icon: 'Server', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', startingPrice: 11.99, badge: 'High Performance', category: 'Cloud Compute', features: ['100% NVMe Gen4 SSDs', 'Full Root / Administrator Access', '10Gbps Burst Uplink', 'Instant Reinstallation'], active: true },
  { id: 'srv-dedicated', title: 'Bare-Metal Dedicated', description: 'Single-tenant physical servers without virtualization overhead, customized for extreme community workloads.', icon: 'Cpu', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', startingPrice: 89.99, badge: 'Enterprise', category: 'Dedicated', features: ['AMD Ryzen 9 9950X / EPYC', 'Unmetered 10Gbps Uplink', 'Custom IPMI / iDRAC Access', 'Hardware RAID Options'], active: true },
  { id: 'srv-web', title: 'cPanel Web Hosting', description: 'Blazing fast LiteSpeed web hosting with free SSL, NVMe SSDs, cPanel control panel, and automated daily backups.', icon: 'Globe', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', startingPrice: 3.49, badge: 'Fast & Secure', category: 'Web Solutions', features: ['LiteSpeed Web Server + LSCache', 'Free Automated SSL Certificates', 'Unlimited Mailboxes & MySQL', 'cPanel Management'], active: true },
  { id: 'srv-bot', title: 'Discord Bot Hosting', description: 'Keep your Node.js, Python, Java, or Golang Discord bots online 24/7 with zero interruption and live console telemetry.', icon: 'Bot', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', startingPrice: 1.99, badge: 'Low Cost', category: 'Development', features: ['Supports Node.js, Python, Java & Go', 'Git Auto-Deploy Webhooks', 'Persistent Database Storage', '24/7 Process Keep-Alive'], active: true },
  { id: 'srv-storage', title: 'S3-Compatible Object Storage', description: 'Ultra-reliable distributed cloud storage with unlimited egress to our hosting nodes for world backups and media assets.', icon: 'HardDrive', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', startingPrice: 4.99, badge: '99.9999% Reliability', category: 'Storage', features: ['Standard S3 API compatibility', 'Zero egress fee within ArveX DC', 'End-to-end encryption at rest', 'Multi-zone replication'], active: true },
];

export const INITIAL_SERVER_LOCATIONS: ServerLocation[] = [
  { id: 'loc-dal', name: 'Dallas, TX', country: 'United States', city: 'Dallas', flag: '🇺🇸', pingMs: 18, xPercent: 22, yPercent: 38, status: 'online' },
  { id: 'loc-fra', name: 'Frankfurt', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', pingMs: 24, xPercent: 51, yPercent: 28, status: 'online' },
  { id: 'loc-lon', name: 'London', country: 'United Kingdom', city: 'London', flag: '🇬🇧', pingMs: 22, xPercent: 47, yPercent: 27, status: 'online' },
  { id: 'loc-sin', name: 'Singapore', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', pingMs: 32, xPercent: 78, yPercent: 58, status: 'online' },
  { id: 'loc-syd', name: 'Sydney', country: 'Australia', city: 'Sydney', flag: '🇦🇺', pingMs: 44, xPercent: 88, yPercent: 78, status: 'online' },
  { id: 'loc-cmb', name: 'Colombo', country: 'Sri Lanka', city: 'Colombo', flag: '🇱🇰', pingMs: 14, xPercent: 72, yPercent: 54, status: 'online' },
];

export const INITIAL_COMPARISON_ROWS: ComparisonRow[] = [
  { id: 'comp-1', provider: 'ArveX Hosting', isCurrentHost: true, badge: 'Your Host', pricePerGb: '$1.75 / GB', processor: 'AMD Ryzen 9 9950X (5.7GHz)', storage: 'PCIe 5.0 NVMe (14,000 MB/s)', support247: true, ddosProtection: true },
  { id: 'comp-2', provider: 'Shockbyte', isCurrentHost: false, pricePerGb: '$2.50 / GB', processor: 'Intel Xeon E5 / Older i7', storage: 'Standard SATA SSD', support247: true, ddosProtection: true },
  { id: 'comp-3', provider: 'BisectHosting', isCurrentHost: false, pricePerGb: '$2.99 / GB', processor: 'AMD Ryzen 3000 / 5000', storage: 'Gen3 NVMe SSD', support247: true, ddosProtection: true },
  { id: 'comp-4', provider: 'Apex Hosting', isCurrentHost: false, pricePerGb: '$3.50 / GB', processor: 'Intel Xeon / AMD Ryzen', storage: 'NVMe Gen3', support247: true, ddosProtection: true },
  { id: 'comp-5', provider: 'Nodecraft', isCurrentHost: false, pricePerGb: '$3.99 / GB', processor: 'Intel Core i9 / Xeon', storage: 'Standard NVMe', support247: false, ddosProtection: true },
];

export const INITIAL_FAQS: FaqItem[] = [
  { id: 'faq-1', question: 'How fast is server provisioning after payment?', answer: 'Instantly! Our automated provisioning system creates your container on our Ryzen 9 9950X clusters within 15 to 45 seconds after transaction confirmation.', category: 'General' },
  { id: 'faq-2', question: 'Which payment methods are supported, and can I pay in Sri Lankan Rupees (LKR)?', answer: 'Yes! We support Sri Lankan Rupee (LKR) payments directly via PayHere as well as global PayPal, Visa, Mastercard, American Express, and Web3 Crypto.', category: 'Billing' },
  { id: 'faq-3', question: 'Can I install custom mods, plugins, and modpacks?', answer: 'Absolutely! Our custom Pterodactyl-based Control Panel includes 1-Click modpack installers for CurseForge, Modrinth, Paper, Forge, Fabric, Oxide, and full SFTP file access.', category: 'Technical' },
  { id: 'faq-4', question: 'How does your DDoS protection mitigate attacks?', answer: 'We utilize inline hardware scrubbers by Corero SmartWall with over 3.2 Tbps mitigation capacity.', category: 'Network' },
  { id: 'faq-5', question: 'Can I upgrade or downgrade my hosting plan later?', answer: 'Yes, you can seamlessly scale your RAM, CPU vCores, and NVMe disk anytime through the Client Area.', category: 'Billing' },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', name: 'Kasun Bandara', role: 'Server Network Owner (600+ Players)', avatarInitial: 'KB', avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', rating: 5, quote: 'ArveX is hands down the best hosting I have used.' },
  { id: 'test-2', name: 'Marcus Vance', role: 'Rust Clan Leader & Admin', avatarInitial: 'MV', avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', rating: 5, quote: 'The Ryzen 9 9950X hardware handles 200 player wipes without a single dropped frame.' },
  { id: 'test-3', name: 'Elena Rostova', role: 'Game Community Developer', avatarInitial: 'ER', avatarImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', rating: 5, quote: 'The automated control panel and instant Discord bot deployments made managing our community servers effortless.' },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  { id: 'blog-1', title: 'Next-Gen AMD Ryzen 9 9950X: Why Clock Speed is King for Game Servers', slug: 'amd-ryzen-9-9950x-benchmark', category: 'Guides', readTime: '4 min read', date: 'February 20, 2026', author: 'DevOps Engineering Team', excerpt: 'Deep dive into IPC enhancements, 5.7GHz boost clocks, and how DDR5 6000MHz memory eliminates Minecraft chunk generation stutter.', content: 'Game servers operate primarily on single-threaded loops.', coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  { id: 'blog-2', title: 'Mitigating Multi-Vector 3.2 Tbps DDoS Attacks with Corero SmartWall', slug: 'mitigating-ddos-attacks-smartwall', category: 'Security', readTime: '6 min read', date: 'February 12, 2026', author: 'Network Security Lead', excerpt: 'How our globally distributed Anycast edge automatically detects and filters attacks.', content: 'Game servers are prime targets for extortion and competitive sabotage.', coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80' },
  { id: 'blog-3', title: 'Step-by-Step: Setting Up Hytale Dedicated Server Clusters', slug: 'hytale-server-cluster-setup', category: 'Guides', readTime: '5 min read', date: 'February 5, 2026', author: 'Community Team', excerpt: 'Prepare your community for Hytale release with pre-configured Java runtimes, cluster nodes, and world synchronization.', content: 'Hytale brings advanced worldgen and built-in scripting tools.', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80' },
];

export const INITIAL_COUPONS: CouponCode[] = [
  { id: 'coupon-voltus', code: 'VOLTUS10', discountPercentage: 10, description: '10% off storewide coupon', active: true, expiresAt: '2026-12-31T23:59:59Z' },
  { id: 'coupon-welcome', code: 'WELCOME10', discountPercentage: 10, description: '10% off new customer switch discount', active: true, expiresAt: '2026-12-31T23:59:59Z' },
  { id: 'coupon-arvex20', code: 'ARVEX20', discountPercentage: 20, description: '20% VIP seasonal promotional code', active: true, expiresAt: '2026-12-31T23:59:59Z' },
  { id: 'coupon-lkrspecial', code: 'LKRSAVE15', discountPercentage: 15, description: '15% Sri Lanka & South Asia special promo', active: true, expiresAt: '2026-12-31T23:59:59Z' },
];

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', rateToUsd: 1.0, label: '$ USD (US Dollar)' },
  { code: 'LKR', symbol: 'Rs. ', rateToUsd: 305.0, label: 'රු LKR (Sri Lankan Rupee)' },
  { code: 'EUR', symbol: '€', rateToUsd: 0.92, label: '€ EUR (Euro)' },
  { code: 'GBP', symbol: '£', rateToUsd: 0.79, label: '£ GBP (British Pound)' },
  { code: 'CAD', symbol: 'CA$', rateToUsd: 1.36, label: '$ CAD (Canadian Dollar)' },
  { code: 'AUD', symbol: 'A$', rateToUsd: 1.52, label: '$ AUD (Australian Dollar)' },
  { code: 'JPY', symbol: '¥', rateToUsd: 154.0, label: '¥ JPY (Japanese Yen)' },
];

export const INITIAL_DEPLOYED_SERVERS: DeployedServer[] = [
  { id: 'srv-mc-01', userId: 'usr-admin-1', serverName: 'ArveX SMP Realm', gameId: 'minecraft', gameName: 'Minecraft Java 1.21', planName: 'Extreme Diamond Plan', status: 'running', ipAddress: '198.51.100.42', port: 25565, ramUsagePercent: 42, ramUsageGb: 6.7, cpuUsage: 18.2, cpuUsagePercent: 18, diskUsagePercent: 31, location: 'United States (Dallas)', createdAt: '2026-02-10T14:30:00Z', logs: ['[14:10:02 INFO]: Loading properties...', '[14:10:03 INFO]: Default game type: SURVIVAL'] },
  { id: 'srv-rust-01', userId: 'usr-admin-1', serverName: 'ArveX 2x Main Wipe', gameId: 'rust', gameName: 'Rust High-Tick Server', planName: 'Clan Warlord', status: 'running', ipAddress: '198.51.100.89', port: 28015, ramUsagePercent: 58, ramUsageGb: 11.6, cpuUsage: 24.5, cpuUsagePercent: 24, diskUsagePercent: 45, location: 'Singapore', createdAt: '2026-02-18T10:15:00Z', logs: ['[10:15:00 SYSTEM]: Carbon framework injected successfully.'] },
];

export const INITIAL_SAVED_CARDS: SavedCard[] = [
  { id: 'card-1', userId: 'usr-admin-1', cardholderName: 'Nethum Menura', brand: 'visa', last4: '4242', expMonth: '08', expYear: '28', isDefault: true, createdAt: '2026-01-15T10:00:00Z' },
  { id: 'card-2', userId: 'usr-admin-1', cardholderName: 'Nethum Menura', brand: 'mastercard', last4: '8812', expMonth: '11', expYear: '29', isDefault: false, createdAt: '2026-02-01T12:00:00Z' },
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 'inv-10042', invoiceNumber: 'INV-2026-10042', userId: 'usr-admin-1', userEmail: 'nethummenura198@gmail.com', userName: 'Nethum Menura', amountUsd: 24.0, amountLocal: 7320.0, currency: 'USD', status: 'paid', paymentMethod: 'card', transactionId: 'TXN-9842104-VISA', items: [{ description: 'Extreme Diamond Plan', period: 'Feb 10, 2026 - Mar 10, 2026', amountUsd: 24.0, quantity: 1 }], subtotalUsd: 24.0, taxUsd: 0.0, discountUsd: 0.0, dueDate: '2026-02-10T14:30:00Z', paidAt: '2026-02-10T14:31:22Z', createdAt: '2026-02-10T14:30:00Z', notes: 'Paid via Visa ending in 4242.' },
  { id: 'inv-10043', invoiceNumber: 'INV-2026-10043', userId: 'usr-admin-1', userEmail: 'nethummenura198@gmail.com', userName: 'Nethum Menura', amountUsd: 29.0, amountLocal: 8845.0, currency: 'USD', status: 'paid', paymentMethod: 'payhere', transactionId: 'PH-LK-84729103', items: [{ description: 'Clan Warlord Rust Plan', period: 'Feb 18, 2026 - Mar 18, 2026', amountUsd: 29.0, quantity: 1 }], subtotalUsd: 29.0, taxUsd: 0.0, discountUsd: 0.0, dueDate: '2026-02-18T10:15:00Z', paidAt: '2026-02-18T10:16:04Z', createdAt: '2026-02-18T10:15:00Z', notes: 'Processed via PayHere Sri Lanka Gateway.' },
  { id: 'inv-10044', invoiceNumber: 'INV-2026-10044', userId: 'usr-admin-1', userEmail: 'nethummenura198@gmail.com', userName: 'Nethum Menura', amountUsd: 14.0, amountLocal: 4270.0, currency: 'USD', status: 'unpaid', items: [{ description: 'Standard Gold Minecraft Renewal', period: 'Mar 10, 2026 - Apr 10, 2026', amountUsd: 14.0, quantity: 1 }], subtotalUsd: 14.0, taxUsd: 0.0, discountUsd: 0.0, dueDate: '2026-03-10T14:30:00Z', createdAt: '2026-02-24T00:00:00Z', notes: 'Upcoming monthly service renewal.' },
];

export const INITIAL_PAYMENT_SETTINGS: PaymentGatewaySettings = { payhereEnabled: true, payhereMerchantId: '1224892', payhereMerchantSecret: '4x99281a8c9e0d1f77a83b4291', payhereSandbox: false, paypalEnabled: true, paypalClientId: 'sb-client-id-arvex-hosting-live', paypalSandbox: false, cardEnabled: true, cardAutoBilling: true, cryptoEnabled: true, cryptoUsdtAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KMNPcq', cryptoBtcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', bankEnabled: true, bankName: 'Commercial Bank of Ceylon / Bank of Ceylon', bankAccountName: 'ArveX Hosting Pvt Ltd', bankAccountNumber: '8004928190', bankBranch: 'Colombo Main Branch (001)', bankSwiftCode: 'CCEYLKLYXXX', bankInstructions: 'Please include your Invoice Number in the payment reference / deposit slip memo.' };

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [];
export const INITIAL_TLDS: DomainTld[] = [
  { id: 'tld-com', tld: '.com', registerPriceUsd: 11.99, renewPriceUsd: 13.99, transferPriceUsd: 11.99, popular: true, category: 'Popular', features: ['Free WHOIS Privacy', 'DNS Zone Editor', 'Email Forwarding', 'EPP Transfer Lock'] },
  { id: 'tld-lk', tld: '.lk', registerPriceUsd: 18.5, renewPriceUsd: 18.5, transferPriceUsd: 18.5, popular: true, category: 'Geographic', features: ['Top-level Sri Lanka Domain', 'Local Brand Trust', 'Direct NIC Registry Routing'] },
  { id: 'tld-host', tld: '.host', registerPriceUsd: 4.99, renewPriceUsd: 24.99, transferPriceUsd: 19.99, popular: true, category: 'Tech & Gaming', features: ['Designed for Hosting Networks', 'Free WHOIS Privacy Protection', 'Instant Nameserver Delegation'] },
  { id: 'tld-net', tld: '.net', registerPriceUsd: 12.99, renewPriceUsd: 14.99, transferPriceUsd: 12.99, popular: false, category: 'Popular', features: ['Enterprise Global Recognition', 'Free WHOIS Privacy', 'Fast Anycast DNS'] },
  { id: 'tld-org', tld: '.org', registerPriceUsd: 12.5, renewPriceUsd: 14.5, transferPriceUsd: 12.5, popular: false, category: 'Popular', features: ['Community & Organization Standard', 'Free WHOIS Privacy'] },
  { id: 'tld-gg', tld: '.gg', registerPriceUsd: 28.0, renewPriceUsd: 29.0, transferPriceUsd: 28.0, popular: true, category: 'Tech & Gaming', features: ['The Gamer Choice', 'High Prestige Esports & Community Domain', 'Free DNSSEC Management'] },
  { id: 'tld-xyz', tld: '.xyz', registerPriceUsd: 2.99, renewPriceUsd: 14.99, transferPriceUsd: 12.99, popular: true, category: 'Specialty', features: ['Low Entry Price', 'Web3 & Community Friendly', 'Free WHOIS Privacy'] },
  { id: 'tld-io', tld: '.io', registerPriceUsd: 32.0, renewPriceUsd: 36.0, transferPriceUsd: 32.0, popular: false, category: 'Tech & Gaming', features: ['Tech Startup Gold Standard', 'Developer Friendly', 'Fast Anycast Resolution'] },
];

export const INITIAL_ORDERS: HostingOrder[] = [];
export const INITIAL_PAYMENT_RECORDS: PaymentRecord[] = [];
export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  { id: 'usr-admin-1', name: 'Nethum Menura', email: 'nethummenura198@gmail.com', phone: '+94 77 123 4567', country: 'Sri Lanka', address: 'World Trade Center, Colombo 01', role: 'admin', status: 'active', createdAt: '2025-01-01T00:00:00Z', lastLogin: '2026-02-26T18:30:00Z', totalSpendUsd: 148.5, activeServicesCount: 2, openTicketsCount: 1, notes: 'Superadmin & Primary System Owner' },
  { id: 'usr-cust-2', name: 'Kasun Bandara', email: 'kasun.b@gamerzone.lk', phone: '+94 71 892 1199', country: 'Sri Lanka', address: 'Kandy Road, Colombo', role: 'customer', status: 'active', createdAt: '2025-08-15T10:00:00Z', lastLogin: '2026-02-25T14:20:00Z', totalSpendUsd: 284.0, activeServicesCount: 3, openTicketsCount: 0 },
  { id: 'usr-cust-3', name: 'Marcus Vance', email: 'marcus.vance@clanwarlord.gg', phone: '+1 (214) 555-0192', country: 'United States', address: 'Dallas, TX', role: 'customer', status: 'active', createdAt: '2025-11-20T08:00:00Z', lastLogin: '2026-02-24T22:10:00Z', totalSpendUsd: 195.0, activeServicesCount: 1, openTicketsCount: 0 },
];

export const INITIAL_STATUS_COMPONENTS: StatusComponent[] = [
  { id: 'cmp-dal-nodes', name: 'Dallas Ryzen 9 9950X Game Nodes (US-East)', category: 'Game Nodes', status: 'Operational', description: 'Hardware clusters in Tier 4 Equinix DA11 Dallas data center.', uptimePercent30d: 99.99, updatedAt: '2026-02-26T18:00:00Z' },
  { id: 'cmp-fra-nodes', name: 'Frankfurt Ryzen 9 9950X Game Nodes (EU-Central)', category: 'Game Nodes', status: 'Operational', description: 'Falkenstein & Frankfurt high-speed nodes.', uptimePercent30d: 100.0, updatedAt: '2026-02-26T18:00:00Z' },
  { id: 'cmp-sin-nodes', name: 'Singapore & Colombo Anycast Edge Nodes (AP-South)', category: 'Game Nodes', status: 'Operational', description: 'Sub-20ms low jitter routing across South Asia.', uptimePercent30d: 99.98, updatedAt: '2026-02-26T18:00:00Z' },
  { id: 'cmp-vps-kvm', name: 'KVM High-Frequency Cloud VPS Hypervisors', category: 'Compute Infrastructure', status: 'Operational', description: 'Gen5 NVMe RAID-10 enterprise compute infrastructure.', uptimePercent30d: 99.99, updatedAt: '2026-02-26T18:00:00Z' },
  { id: 'cmp-wings-api', name: 'Pterodactyl Daemon (Wings) & Web API', category: 'Platforms & APIs', status: 'Operational', description: 'Automated container scheduler and SFTP daemon service.', uptimePercent30d: 99.99, updatedAt: '2026-02-26T18:00:00Z' },
  { id: 'cmp-billing-gateways', name: 'PayHere, PayPal & Instant Billing Gateway Webhooks', category: 'Platforms & APIs', status: 'Operational', description: 'Automated invoice generation and payment settlement.', uptimePercent30d: 100.0, updatedAt: '2026-02-26T18:00:00Z' },
  { id: 'cmp-corero-ddos', name: 'Corero SmartWall 3.2 Tbps DDoS Scrubbing Edge', category: 'Network Edge', status: 'Operational', description: 'Hardware inline L3/L4/L7 DDoS mitigation Anycast network.', uptimePercent30d: 100.0, updatedAt: '2026-02-26T18:00:00Z' },
];

export const INITIAL_STATUS_INCIDENTS: StatusIncident[] = [{ id: 'inc-001', title: 'Completed Scheduled Kernel Upgrades on Frankfurt Clusters', impact: 'None', status: 'Resolved', affectedComponents: ['Frankfurt Ryzen 9 9950X Game Nodes (EU-Central)'], createdAt: '2026-02-18T02:00:00Z', updatedAt: '2026-02-18T02:40:00Z', updates: [{ id: 'upd-1', status: 'Resolved', message: 'All Linux kernel hotpatches and microcode optimizations for AMD Zen 5 CPUs completed with zero downtime.', timestamp: '2026-02-18T02:40:00Z' }] }];

export const INITIAL_SERVER_NODES: ServerNode[] = [
  { id: 'node-dal-01', name: 'Node-US-Dallas-01', fqdn: 'dal01.nodes.arvex.host', location: 'Dallas, TX (United States)', memoryTotalMb: 131072, memoryAllocatedMb: 53248, diskTotalMb: 3840000, diskAllocatedMb: 1140000, cpuCores: 32, activeContainers: 18, status: 'connected', daemonVersion: 'v1.11.8', scheme: 'https', port: 8080 },
  { id: 'node-fra-01', name: 'Node-EU-Frankfurt-01', fqdn: 'fra01.nodes.arvex.host', location: 'Frankfurt (Germany)', memoryTotalMb: 131072, memoryAllocatedMb: 61440, diskTotalMb: 3840000, diskAllocatedMb: 1420000, cpuCores: 32, activeContainers: 22, status: 'connected', daemonVersion: 'v1.11.8', scheme: 'https', port: 8080 },
  { id: 'node-sin-01', name: 'Node-AP-Singapore-01', fqdn: 'sin01.nodes.arvex.host', location: 'Singapore (Asia)', memoryTotalMb: 65536, memoryAllocatedMb: 32768, diskTotalMb: 1920000, diskAllocatedMb: 760000, cpuCores: 16, activeContainers: 12, status: 'connected', daemonVersion: 'v1.11.8', scheme: 'https', port: 8080 },
  { id: 'node-cmb-01', name: 'Node-LK-Colombo-01 (Direct SLT/Dialog Peer)', fqdn: 'cmb01.nodes.arvex.host', location: 'Colombo (Sri Lanka)', memoryTotalMb: 65536, memoryAllocatedMb: 24576, diskTotalMb: 1920000, diskAllocatedMb: 490000, cpuCores: 16, activeContainers: 8, status: 'connected', daemonVersion: 'v1.11.8', scheme: 'https', port: 8080 },
];

export const INITIAL_ADMIN_USERS: AdminUserAccount[] = [
  { id: 'adm-1', name: 'Nethum Menura', email: 'nethummenura198@gmail.com', role: 'super_admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', createdAt: '2025-01-01T00:00:00Z', lastActive: 'Just now', twoFactorEnabled: true, permissions: ['all'] },
  { id: 'adm-2', name: 'Alex Vance (Lead DevOps)', email: 'alex.vance@arvex.host', role: 'admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', createdAt: '2025-03-15T00:00:00Z', lastActive: '12 minutes ago', twoFactorEnabled: true, permissions: ['servers', 'nodes', 'tickets', 'status'] },
  { id: 'adm-3', name: 'Sarah Connor (Support Specialist)', email: 'sarah.c@arvex.host', role: 'support', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', createdAt: '2025-06-01T00:00:00Z', lastActive: '1 hour ago', twoFactorEnabled: false, permissions: ['tickets', 'customers_view'] },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];
export const INITIAL_PARTNERS: Partner[] = [];
export const INITIAL_REVIEWS: CustomerReview[] = [];
