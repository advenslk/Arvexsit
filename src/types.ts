export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export type PageRoute =
  | 'home'
  | 'services'
  | 'services-minecraft'
  | 'services-game-hosting'
  | 'services-vps'
  | 'services-vds'
  | 'services-web-hosting'
  | 'services-bot-hosting'
  | 'services-domains'
  | 'dynamic-service'
  | 'dynamic-game'
  | 'dynamic-plan'
  | 'pricing'
  | 'plans'
  | 'games'
  | 'domains'
  | 'domains-search'
  | 'domains-pricing'
  | 'domains-order'
  | 'checkout'
  | 'payment'
  | 'locations'
  | 'hardware'
  | 'billing'
  | 'tickets'
  | 'support'
  | 'support-tickets'
  | 'status'
  | 'blog'
  | 'dashboard'
  | 'admin'
  | 'admin-login'
  | 'datacenter'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'sla'
  | 'not-found';

export type AppPage = PageRoute;

export interface AppRouteLocation {
  path: string;
  page: PageRoute;
  params: Record<string, string>;
  searchParams?: Record<string, string>;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export type ServiceTypeCategory =
  | 'minecraft'
  | 'game-hosting'
  | 'vps'
  | 'vds'
  | 'web-hosting'
  | 'bot-hosting'
  | 'dedicated'
  | 'domains'
  | 'storage';

export interface HostingPlan {
  id: string;
  slug: string; // e.g. 'arx-mc-2gb', 'arx-mc-4gb', 'arx-vps-4gb'
  gameId: string; // e.g. 'minecraft', 'ark', 'cs2', 'rust', 'vps', 'vds', 'web-hosting', 'bot-hosting'
  serviceType: ServiceTypeCategory;
  name: string; // e.g. 'ARX-MC-4GB', 'Cloud VPS Alpha'
  subtitle: string; // e.g. 'High-Performance Minecraft Server'
  monthlyPrice: number;
  quarterlyPrice?: number;
  yearlyPrice?: number;
  originalPrice?: number;
  ram: string; // '4 GB DDR5 RAM'
  ramGb?: number;
  cpu: string; // '2 vCPU Ryzen 9 9950X'
  cpuCores?: number;
  storage: string; // '50 GB PCIe 5.0 NVMe'
  storageGb?: number;
  bandwidth?: string; // 'Unmetered 10Gbps'
  players: string; // '50 Players' or 'Full Root Access'
  popular?: boolean;
  featured?: boolean;
  badge?: string; // 'Most Popular', 'Best Value'
  iconUrl?: string;
  orderUrl?: string;
  tier?: 'Starter' | 'Standard' | 'Premium';
  customSpecs?: { label: string; value: string }[];
  features?: string[];
  description?: string;
  availability?: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  locations?: string[];
  upgradeOptions?: { name: string; price: number; description: string }[];
  faq?: { question: string; answer: string }[];
  terms?: string;
  osOptions?: string[];
  controlPanel?: string;
  sortOrder?: number;
  status?: 'active' | 'inactive';
}

export interface GameService {
  id: string;
  name: string;
  slug: string;
  category: string;
  startingPrice: number;
  popular?: boolean;
  image: string;
  bannerImage?: string;
  activePlayers?: string;
  description?: string;
  shortDescription?: string;
  features?: string[];
  status: 'active' | 'maintenance' | 'hidden';
}

export type GameItem = GameService;

export interface GeneralService {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  startingPrice?: number;
  features?: string[];
  badge?: string;
  category?: string;
  active?: boolean;
  tag?: string;
  link?: string;
  status?: 'active' | 'hidden';
}

export type ServiceItem = GeneralService;

export interface ServerLocation {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  pingMs: number;
  xPercent: number; // For map positioning (0-100)
  yPercent: number; // For map positioning (0-100)
  status: 'online' | 'high_traffic' | 'maintenance';
}

export interface ComparisonRow {
  id: string;
  provider: string;
  isCurrentHost?: boolean;
  badge?: string;
  pricePerGb: string;
  processor: string;
  storage: string;
  support247: boolean;
  ddosProtection: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarInitial: string;
  avatarImage?: string;
  rating: number;
  quote: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Guides' | 'Security' | 'Updates' | 'News' | string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  coverImage: string;
}

export interface FeatureBox {
  id: string;
  title: string;
  description: string;
  icon: string;
  hasSparkles?: boolean;
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercentage: number;
  description: string;
  active: boolean;
  expiresAt: string; // ISO string
}

export interface SiteImagesConfig {
  logoUrl: string;
  heroBackgroundUrl: string;
  heroIllustrationUrl: string;
  controlPanelScreenshotUrl: string;
  pterodactylBannerUrl: string;
  datacenterMapUrl: string;
  switchPromoBannerUrl: string;
  paymentMethodsBannerUrl: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  announcementText: string;
  announcementCoupon: string;
  announcementActive: boolean;
  heroBadgeText: string;
  heroBadgeLink: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  domainSearchTitle: string;
  domainSearchSubtitle: string;
  gamesSectionTitle: string;
  gamesSectionSubtitle: string;
  pricingSectionTitle: string;
  pricingSectionSubtitle: string;
  switchSectionTitle: string;
  switchSectionSubtitle: string;
  switchCouponCode: string;
  switchDiscountPercent: number;
  switchCountdownTarget: string; // Target timestamp or remaining hours
  discordUrl: string;
  twitterUrl: string;
  githubUrl: string;
  supportEmail: string;
  contactSupportUrl: string;
  companyAddress: string;
  vatNumber: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'github' | 'discord';
  phone?: string;
  country?: string;
}

export interface DeployedServer {
  id: string;
  userId: string;
  serverName: string;
  gameId: string;
  gameName: string;
  planName: string;
  status: 'running' | 'offline' | 'starting' | 'installing' | 'restarting' | 'stopped';
  ipAddress: string;
  port: number;
  ramUsagePercent?: number;
  ramUsageGb?: number;
  cpuUsage?: number;
  cpuUsagePercent?: number;
  diskUsagePercent?: number;
  location: string;
  createdAt: string;
  logs?: string[];
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rateToUsd: number;
  label: string;
}

// Payment & Billing Types
export type PaymentGatewayType = 'card' | 'payhere' | 'paypal' | 'crypto' | 'bank_transfer';

export interface SavedCard {
  id: string;
  userId: string;
  cardholderName: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  period: string;
  amountUsd: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  amountUsd: number;
  amountLocal?: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled' | 'refunded';
  paymentMethod?: PaymentGatewayType;
  transactionId?: string;
  items: InvoiceItem[];
  subtotalUsd: number;
  taxUsd: number;
  discountUsd: number;
  couponUsed?: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  notes?: string;
}

export interface PaymentGatewaySettings {
  // PayHere (Sri Lanka Gateway for LKR & International)
  payhereEnabled: boolean;
  payhereMerchantId: string;
  payhereMerchantSecret: string;
  payhereSandbox: boolean;

  // PayPal
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalSandbox: boolean;

  // Direct Card Processing
  cardEnabled: boolean;
  cardAutoBilling: boolean;

  // Crypto / Web3
  cryptoEnabled: boolean;
  cryptoUsdtAddress: string;
  cryptoBtcAddress: string;

  // Bank Deposit (Sri Lanka & International Wire)
  bankEnabled: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankSwiftCode: string;
  bankInstructions: string;
}

// Support Ticket Types
export type TicketDepartment = 'Technical Support' | 'Billing & Accounts' | 'Sales & Pre-Purchase' | 'DDoS & Network';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'Customer-Reply' | 'Staff-Reply' | 'In Progress' | 'Answered' | 'Closed';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'admin' | 'staff';
  senderAvatar?: string;
  message: string;
  attachments?: { name: string; size: string; url: string }[];
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  department: TicketDepartment;
  priority: TicketPriority;
  status: TicketStatus;
  relatedServerId?: string;
  relatedServerName?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

// Order Management Types
export type OrderStatus =
  | 'Pending'
  | 'Awaiting Payment'
  | 'Paid'
  | 'Processing'
  | 'Active'
  | 'Cancelled'
  | 'Failed'
  | 'Refunded';

export interface OrderConfiguration {
  location: string;
  hostname: string;
  osOrVersion: string;
  dedicatedIp: boolean;
  dailyBackups: boolean;
  customNotes?: string;
}

export interface HostingOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  serviceType: ServiceTypeCategory;
  billingCycle: BillingCycle;
  configuration: OrderConfiguration;
  amountUsd: number;
  currency: string;
  discountUsd: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod?: PaymentGatewayType;
  transactionId?: string;
  invoiceId?: string;
  serverId?: string;
  createdAt: string;
  updatedAt: string;
  internalNotes?: string;
}

// Payment Ledger Record
export interface PaymentRecord {
  id: string;
  paymentId: string;
  orderId: string;
  invoiceId?: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  provider: PaymentGatewayType;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId: string;
  date: string;
  webhookReceived?: boolean;
  notes?: string;
}

// Customer Profile
export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  address?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLogin?: string;
  totalSpendUsd: number;
  activeServicesCount: number;
  openTicketsCount: number;
  notes?: string;
}

// Domains Management
export interface DomainTld {
  id: string;
  tld: string; // e.g. '.com', '.net', '.org', '.lk', '.host', '.xyz'
  registerPriceUsd: number;
  renewPriceUsd: number;
  transferPriceUsd: number;
  popular?: boolean;
  category: 'Popular' | 'Geographic' | 'Tech & Gaming' | 'Specialty';
  features: string[];
}

export interface DnsRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV';
  name: string;
  content: string;
  ttl: number;
  priority?: number;
}

export interface DomainRegistration {
  id: string;
  domainName: string;
  userId: string;
  userEmail: string;
  registrationDate: string;
  expiryDate: string;
  autoRenew: boolean;
  status: 'active' | 'pending' | 'expired' | 'transferred';
  whoisPrivacy: boolean;
  nameservers: string[];
  dnsRecords: DnsRecord[];
}

// Service Status & Incidents
export type ComponentHealth =
  | 'Operational'
  | 'Degraded Performance'
  | 'Partial Outage'
  | 'Major Outage'
  | 'Maintenance';

export interface StatusComponent {
  id: string;
  name: string;
  category: 'Game Nodes' | 'Compute Infrastructure' | 'Platforms & APIs' | 'Network Edge';
  status: ComponentHealth;
  description: string;
  uptimePercent30d: number;
  updatedAt: string;
}

export interface StatusIncident {
  id: string;
  title: string;
  impact: 'None' | 'Minor' | 'Major' | 'Critical';
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  affectedComponents: string[];
  createdAt: string;
  updatedAt: string;
  updates: {
    id: string;
    status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
    message: string;
    timestamp: string;
  }[];
}

// Server Nodes (Pterodactyl & Cloud Infrastructure)
export interface ServerNode {
  id: string;
  name: string;
  fqdn: string;
  location: string;
  memoryTotalMb: number;
  memoryAllocatedMb: number;
  diskTotalMb: number;
  diskAllocatedMb: number;
  cpuCores: number;
  activeContainers: number;
  status: 'connected' | 'unconfigured' | 'offline';
  daemonVersion?: string;
  scheme: 'https' | 'http';
  port: number;
}

// Admin Accounts & Staff Roles
export type AdminRole = 'super_admin' | 'admin' | 'support';

export interface AdminUserAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  createdAt: string;
  lastActive: string;
  twoFactorEnabled: boolean;
  permissions: string[];
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: 'order' | 'plan' | 'service' | 'customer' | 'server' | 'invoice' | 'ticket' | 'setting';
  targetId: string;
  details: string;
  ipAddress: string;
}

export type Location = ServerLocation;
export type OrderItem = HostingOrder;

export interface Partner {
  id: string;
  name: string;
  tagline?: string;
  category: string;
  platform?: string;
  url?: string;
  description?: string;
  followers?: string;
  logoUrl?: string;
  badge?: string;
  accent?: string;
  glow?: string;
  iconBg?: string;
  isSpecial?: boolean;
  active?: boolean;
  sortOrder?: number;
}

export interface CustomerReview {
  id: string;
  name: string;
  avatar: string;
  avatarBg?: string;
  avatarImage?: string;
  rating: number;
  role: string;
  serverType?: string;
  reviewText: string;
  verified: boolean;
  date: string;
  active?: boolean;
  sortOrder?: number;
}

// Security Configuration
export interface SecuritySettings {
  twoFactorRequiredForAdmin: boolean;
  bruteForceProtection: boolean;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  sessionTimeoutMinutes: number;
  ipWhitelistEnabled: boolean;
  whitelistedIps: string[];
  blacklistedIps: string[];
  ddosMitigationLevel: 'Standard' | 'Aggressive' | 'Under Attack Mode';
  sslTlsEnforced: boolean;
  hstsEnabled: boolean;
  contentSecurityPolicy: boolean;
  wafEnabled: boolean;
  masterSecurityPin: string;
}

export interface SecuritySession {
  sessionId: string;
  userId: string;
  userEmail: string;
  role: string;
  ipAddress: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActivity: string;
  expiresAt: string;
}



