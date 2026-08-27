import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Search,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Terminal,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  content: string;
  codeSnippet?: string;
}

export const KnowledgebasePage: React.FC = () => {
  const { currentRoute, navigateTo, showNotification } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [ratedArticle, setRatedArticle] = useState<string | null>(null);

  const articles: Article[] = [
    {
      id: 'connect-domain-srv',
      title: 'How to Connect a Custom Domain using Cloudflare SRV Records',
      category: 'Domains & DNS',
      readTime: '3 min read',
      content:
        'To connect your custom domain (e.g., play.myserver.com) to your Minecraft server without exposing numerical port numbers, create an A record pointing to your node IP followed by an SRV record.',
      codeSnippet: `Type: SRV\nName: _minecraft._tcp.play\nPriority: 0\nWeight: 5\nPort: 25565\nTarget: mc.myserver.com`,
    },
    {
      id: 'install-plugins-paper',
      title: 'Installing Plugins & Modpacks on Paper / Purpur 1.20+',
      category: 'Minecraft Hosting',
      readTime: '4 min read',
      content:
        'Installing plugins on ArveX is instantaneous. You can either use our 1-Click Plugin Downloader in the Pterodactyl panel or drag-and-drop .jar files into the /plugins directory via Web SFTP.',
      codeSnippet: `1. Stop server in console\n2. Upload plugin .jar into /plugins/\n3. Start server to generate config files\n4. Edit configs in built-in web file manager`,
    },
    {
      id: 'setup-discord-bot',
      title: 'Deploying Discord.js / Discord.py Bot with Git Auto-Pull',
      category: 'Bot Hosting',
      readTime: '5 min read',
      content:
        'Our bot hosting containers run Node.js 18-22 and Python 3.10-3.12 with full automatic process supervisors. Paste your GitHub repository URL into the container settings to enable continuous deployment upon push.',
      codeSnippet: `npm install\nnpm run build\nnode index.js`,
    },
    {
      id: 'ssh-vps-hardening',
      title: 'Hardening Ubuntu 24.04 Cloud VPS with UFW & SSH Keys',
      category: 'VPS & Cloud',
      readTime: '6 min read',
      content:
        'Secure your new ArveX KVM VPS instance by disabling root password logins and configuring uncomplicated firewall rules.',
      codeSnippet: `sudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 22/tcp\nsudo ufw enable`,
    },
    {
      id: 'mysql-database-linking',
      title: 'Creating & Linking Free MySQL Databases to Your Game Server',
      category: 'Databases',
      readTime: '2 min read',
      content:
        'Every ArveX game server includes 2 complimentary high-performance MariaDB/MySQL databases hosted in the same local subnet for ultra-low latency queries.',
      codeSnippet: `Host: 127.0.0.1\nPort: 3306\nDatabase: s1_luckperms\nUser: u1_admin`,
    },
  ];

  const selectedArticleId = currentRoute.params.articleId;
  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  const filteredArticles = articles.filter((a) => {
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    const matchQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const categories = ['all', 'Minecraft Hosting', 'VPS & Cloud', 'Bot Hosting', 'Domains & DNS', 'Databases'];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showNotification('Code snippet copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('knowledgebase')} className="hover:text-white transition-colors">Knowledgebase</button>
        {selectedArticle && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-cyan-400 font-semibold">{selectedArticle.title}</span>
          </>
        )}
      </nav>

      {selectedArticle ? (
        /* Single Article View */
        <div className="max-w-4xl mx-auto bg-[#11131e] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-cyan-400 mb-3">
            <span className="bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20 font-semibold">
              {selectedArticle.category}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{selectedArticle.readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white font-display mb-6">
            {selectedArticle.title}
          </h1>

          <div className="text-slate-300 text-sm leading-relaxed space-y-4 mb-8">
            <p>{selectedArticle.content}</p>

            {selectedArticle.codeSnippet && (
              <div className="mt-6 bg-[#090a0f] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-[#161926] border-b border-white/5 text-xs text-slate-400 font-mono">
                  <span>Configuration / Shell Command</span>
                  <button
                    onClick={() => handleCopyCode(selectedArticle.codeSnippet!)}
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto">
                  {selectedArticle.codeSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Feedback section */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-400">Was this guide helpful?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRatedArticle('yes');
                  showNotification('Thank you for your feedback!', 'success');
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  ratedArticle === 'yes' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Yes</span>
              </button>
              <button
                onClick={() => {
                  setRatedArticle('no');
                  showNotification('Thanks for letting us know. We will update this guide.', 'info');
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  ratedArticle === 'no' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>No</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Catalog View */
        <>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledgebase &amp; Tutorials</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
              Documentation &amp; Guides
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
              Step-by-step documentation, config optimization tips, and video tutorials for all games and servers.
            </p>

            <div className="relative max-w-xl mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles (e.g. plugins, SRV, VPS SSH, backups)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#11131e] border border-white/15 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-xl"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                    : 'bg-[#11131e] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => navigateTo('knowledgebase', { articleId: art.id })}
                className="bg-[#11131e] border border-white/5 hover:border-cyan-500/40 rounded-2xl p-6 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 mb-2">
                    <span className="font-semibold">{art.category}</span>
                    <span className="text-slate-500">{art.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {art.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span>Read Article</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
