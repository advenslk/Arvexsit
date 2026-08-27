import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Clock, Calendar, User, X } from 'lucide-react';
import { BlogPost } from '../types';

export const BlogSection: React.FC = () => {
  const { blogPosts, activeBlogPostModal, setActiveBlogPostModal } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Guides', 'Security', 'Updates'];

  const filteredPosts =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <section id="blog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Subtitle matching Screenshot 9 */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mb-2">
          Latest from Our Blog
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mb-6">
          Stay updated with tutorials, tips, and news about game server hosting
        </p>

        {/* Filter Tabs matching Screenshot 9 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-xl border transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-[#12151e] hover:bg-[#181c28] text-slate-300 border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid matching Screenshot 9 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl bg-[#11131a] border border-white/10 overflow-hidden flex flex-col justify-between shadow-xl hover:border-white/20 transition-all group"
          >
            <div>
              {/* Cover Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-transparent to-transparent" />

                {/* Category Pill Tag matching Screenshot 9 */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6">
                {/* Date & Read Time */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Post Title */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 leading-snug">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Footer Row with Author & Read More Button matching Screenshot 9 */}
            <div className="p-6 pt-0 flex items-center justify-between gap-4 border-t border-white/5 mt-4 pt-4">
              <span className="text-xs text-slate-400 font-medium">
                By {post.author}
              </span>

              <button
                id={`blog-read-more-${post.id}`}
                onClick={() => setActiveBlogPostModal(post)}
                className="bg-white hover:bg-slate-100 text-black text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <span>Read More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeBlogPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#11131a] border border-white/10 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setActiveBlogPostModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/20 mb-3">
              {activeBlogPostModal.category}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
              {activeBlogPostModal.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 pb-4 border-b border-white/10">
              <span>By {activeBlogPostModal.author}</span>
              <span>•</span>
              <span>{activeBlogPostModal.date}</span>
              <span>•</span>
              <span>{activeBlogPostModal.readTime}</span>
            </div>

            <div className="rounded-2xl overflow-hidden mb-6 h-56 w-full">
              <img
                src={activeBlogPostModal.coverImage}
                alt={activeBlogPostModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {activeBlogPostModal.content}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveBlogPostModal(null)}
                className="bg-white hover:bg-slate-100 text-black font-semibold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
