import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Clock, Calendar, User, BookOpen, Share2, ArrowLeft } from 'lucide-react';

export const BlogPostModal: React.FC = () => {
  const { activeBlogPostModal, setActiveBlogPostModal } = useApp();

  if (!activeBlogPostModal) return null;

  const post = activeBlogPostModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0e1019] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Cover Image Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black/60">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1019] via-[#0e1019]/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setActiveBlogPostModal(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Pill */}
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow-lg">
              {post.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              {post.title}
            </h2>
          </div>
        </div>

        {/* Post Metadata */}
        <div className="px-6 sm:px-8 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono bg-[#121524]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>{post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Post Content */}
        <div className="p-6 sm:p-8 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed max-h-[50vh] overflow-y-auto">
          <p className="text-base sm:text-lg font-medium text-slate-200 leading-snug">
            {post.excerpt}
          </p>

          <div className="h-px bg-white/10 my-4" />

          <p className="whitespace-pre-line leading-relaxed text-slate-300">
            {post.content ||
              `Hosting demanding multiplayer games requires single-core performance above all else. When hundreds of entities, mob spawners, and custom plugins interact, CPUs with low IPC will drop server ticks (TPS) below 20.0.\n\nOur benchmark tests on AMD Ryzen 9 9950X Zen 5 processors showed a sustained 20.0 TPS even under heavy redstone computations and explosive TNT stress tests, outperforming traditional Xeon chips by over 64%.\n\nCombined with enterprise PCIe 5.0 NVMe storage capable of 14,000 MB/s sequential reads, world chunk generation bottlenecks are completely eliminated.`}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#121524] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setActiveBlogPostModal(null)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Knowledgebase</span>
          </button>

          <button
            onClick={() => setActiveBlogPostModal(null)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
