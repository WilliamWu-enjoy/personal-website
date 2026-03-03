/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Instagram, Youtube, Twitter, Github } from 'lucide-react';
import InteractivePortrait from './components/InteractivePortrait';
import portraitImg from './2.JPG';
import revealImg from './1.png';
import card1Img from './card-1.png';
import card2Img from './card-2.png';
import card3Img from './card-3.png';
import about1Img from './about-1.png';
import about2Img from './about-2.png';

// --- Types ---
type Tab = 'HOME' | 'ABOUT' | 'ARTICLES' | 'WORKS';

// --- Components ---

const Navbar = ({ onMenuOpen, activeTab }: { onMenuOpen: () => void; activeTab: Tab }) => (
  <nav className="fixed top-0 left-0 w-full z-40 px-6 py-8 flex justify-between items-center mix-blend-difference">
    <div className="text-2xl font-black tracking-tighter text-white">WILLIAM</div>
    <button 
      onClick={onMenuOpen}
      className="p-3 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors border border-white/10"
    >
      <Menu className="w-6 h-6 text-white" />
    </button>
  </nav>
);

const MenuOverlay = ({ isOpen, onClose, onSelectTab, activeTab }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelectTab: (tab: Tab) => void;
  activeTab: Tab;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-50 bg-brand-dark flex flex-col items-center justify-center"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-6 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex flex-col items-center space-y-4">
          {(['HOME', 'ABOUT', 'ARTICLES', 'WORKS'] as Tab[]).map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onSelectTab(tab);
                onClose();
              }}
              className={`text-6xl md:text-8xl font-black tracking-tighter transition-colors ${
                activeTab === tab ? 'text-brand-lime' : 'text-white hover:text-brand-lime'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <div className="absolute bottom-12 flex space-x-8 text-xs font-bold tracking-widest text-white/50 uppercase">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
          <a href="#" className="hover:text-white transition-colors">Youtube</a>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Hero = () => (
  <InteractivePortrait
    portraitUrl={portraitImg}
    revealUrl={revealImg}
    className="h-screen"
  />
);

const QuoteSection = () => (
  <section className="py-32 px-6 max-w-7xl mx-auto flex items-center justify-center">
    <div className="relative text-center">
      <span className="absolute -top-20 -left-10 text-[12rem] font-serif text-brand-lime opacity-20 leading-none">“</span>
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight relative z-10">
        吴润灵 / <span className="text-brand-dark bg-brand-lime px-2 transform -skew-x-12 inline-block">WILLIAM</span> <br />
        关注医学和 AI 的 <br />
        跨界实践者
      </h2>
      <p className="mt-8 text-white/50 font-mono text-sm tracking-widest uppercase">— William Wu</p>
    </div>
  </section>
);

const SocialsSection = ({ onSelectTab }: { onSelectTab: (tab: Tab) => void }) => {
  const cards = [
    { 
      tab: 'ABOUT' as Tab, 
      title: '关于我', 
      image: card1Img
    },
    { 
      tab: 'ARTICLES' as Tab, 
      title: '我的文章', 
      image: card2Img
    },
    { 
      tab: 'WORKS' as Tab, 
      title: '我的作品', 
      image: card3Img
    },
  ];

  return (
    <section className="py-32 px-6 text-center overflow-hidden">
      <div className="mb-24 space-y-8">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90">
          想要更加了解我？
        </h2>
        <div className="inline-block">
          <span className="text-2xl md:text-4xl font-serif italic text-brand-dark bg-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 inline-block">
            请点击下方跳转
          </span>
        </div>
      </div>

      <div className="relative h-[500px] flex items-center justify-center">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ rotate: 0, x: 0 }}
            whileInView={{ 
              rotate: (i - 1) * 10, // 调整角度，让中间的是正的
              x: (i - 1) * 120,     // 调整间距
              y: Math.abs(i - 1) * 30 // 调整弧度
            }}
            whileHover={{ 
              scale: 1.1, 
              zIndex: 10,
              rotate: 0,
              y: -20
            }}
            onClick={() => onSelectTab(card.tab)}
            viewport={{ once: true }}
            className="absolute w-72 h-96 rounded-2xl overflow-hidden border-4 border-white shadow-2xl cursor-pointer bg-brand-dark group"
          >
            <img 
              src={card.image} 
              alt={card.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{card.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const WorksSection = () => {
  const works = [
    { 
      title: "PDF 智能翻译器", 
      category: "AI Tool", 
      img: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=600&q=80",
      link: "#" // 这里可以替换为您项目的实际链接
    },
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
          AI Vibe <br />
          <span className="font-serif italic text-brand-lime normal-case">Coding</span>
        </h2>
        <p className="mt-8 text-white/60 max-w-xl text-lg leading-relaxed">
          探索人工智能与编程的边界，用代码构建未来，用创意点亮灵感。这里展示了我基于 AI 技术开发的各类创新项目。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {works.map((work, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-brand-lime transition-colors"
          >
            <img src={work.img} alt={work.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
              <p className="text-brand-lime font-mono text-xs tracking-widest uppercase mb-1">{work.category}</p>
              <h3 className="text-2xl font-black tracking-tight uppercase">{work.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ArticlesSection = () => {
  const articles = [
    { 
      date: "2025.9.15", 
      title: "数过了，一双鞋确实能凑出 8 个标", 
      link: "https://dw4.co/t/A/1uVHR7FmD" 
    },
    { 
      date: "2025.9.21", 
      title: "把糯米涂在鞋面上？文化属性拉满！", 
      link: "https://dw4.co/t/A/1uVJRxQ9R" 
    },
    { 
      date: "2025.4.13", 
      title: "女朋友说她很喜欢", 
      link: "https://dw4.co/t/A/1uVHraS1M" 
    },
    { 
      date: "2026.2.9", 
      title: "学生党穿这双｜真的帅炸但是也贵", 
      link: "https://dw4.co/t/A/1uVK24dad" 
    },
  ];

  return (
    <section className="py-32 px-6 max-w-5xl mx-auto">
      <div className="mb-20">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
          My <br />
          <span className="font-serif italic text-brand-lime normal-case">Poizon</span>
        </h2>
      </div>

      <div className="space-y-12">
        {articles.map((article, i) => (
          <motion.a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 hover:border-brand-lime transition-colors cursor-pointer block"
          >
            <div className="mb-4 md:mb-0">
              <p className="text-white/40 font-mono text-xs tracking-widest uppercase mb-2">{article.date}</p>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase group-hover:text-brand-lime transition-colors">
                {article.title}
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-lime group-hover:text-brand-dark transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section className="py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-start">
    <div className="sticky top-32">
      <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
        About <br />
        <span className="font-serif italic text-brand-lime">William</span>
      </h2>
      <div className="mt-12 space-y-8 text-xl text-white/80 leading-relaxed font-light">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-brand-lime">吴润灵</h3>
          <p className="text-sm font-mono tracking-wider opacity-60 uppercase border-l-2 border-brand-lime pl-4">
            生物医学工程硕士 · 医疗 AI 探索者 · 球鞋摄影师
          </p>
        </div>
        
        <p>
          专注基于大语言模型的神经外科智能应用研究，致力于将前沿算法落地于临床实践。同时，作为一名对审美有偏执追求的创作者，我热衷于用摄影捕捉工业设计之美，并持续输出关于科技转型与个人审美的原创内容。
        </p>
        
        <div className="pt-4 border-t border-white/10">
          <p className="text-sm font-mono tracking-widest text-brand-lime">
            座右铭：保持好奇，严谨生活，自由表达。
          </p>
        </div>
      </div>
    </div>
    <div className="space-y-12">
      <img src={about1Img} alt="About 1" className="rounded-3xl w-full" referrerPolicy="no-referrer" />
      <img src={about2Img} alt="About 2" className="rounded-3xl w-full" referrerPolicy="no-referrer" />
    </div>
  </section>
);

const Footer = ({ onSelectTab }: { onSelectTab: (tab: Tab) => void }) => (
  <footer className="bg-brand-lime pt-20 pb-10 px-6 rounded-t-[4rem] relative overflow-hidden">
    <div className="absolute inset-0 topographic-pattern opacity-20 pointer-events-none"></div>
    <div className="max-w-7xl mx-auto bg-brand-dark rounded-[3rem] p-12 md:p-24 relative z-10">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <div className="flex justify-center md:justify-end">
          <div className="space-y-6 text-center md:text-right">
            <p className="text-white/30 font-mono text-sm tracking-widest uppercase">Pages</p>
            <ul className="space-y-4 font-black tracking-tighter text-3xl md:text-4xl uppercase">
              {(['HOME', 'ABOUT', 'ARTICLES', 'WORKS'] as Tab[]).map((tab) => (
                <li 
                  key={tab}
                  onClick={() => onSelectTab(tab)}
                  className="hover:text-brand-lime cursor-pointer transition-colors"
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center md:justify-start">
          <div className="w-48 h-48 relative">
             <img 
               src={card1Img} 
               alt="Helmet" 
               className="w-full h-full object-cover rounded-full drop-shadow-[0_20px_50px_rgba(212,255,63,0.3)]"
               referrerPolicy="no-referrer"
             />
          </div>
        </div>
      </div>
    </div>
    <div className="mt-12 text-center text-brand-dark font-mono text-xs tracking-widest uppercase">
      © 2026 WILLIAM WU — All Rights Reserved
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
            <QuoteSection />
            <SocialsSection onSelectTab={setActiveTab} />
          </motion.div>
        );
      case 'ABOUT':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AboutSection />
          </motion.div>
        );
      case 'ARTICLES':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArticlesSection />
          </motion.div>
        );
      case 'WORKS':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorksSection />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-lime selection:text-brand-dark">
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} activeTab={activeTab} />
      
      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onSelectTab={setActiveTab}
        activeTab={activeTab}
      />

      <main>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
