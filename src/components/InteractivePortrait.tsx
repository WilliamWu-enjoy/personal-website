import React, { useRef, useEffect, useState } from 'react';

interface InteractivePortraitProps {
  portraitUrl: string; // 图一（肖像）
  revealUrl: string;   // 图二（赛车）
  className?: string;
  children?: React.ReactNode;
}

const InteractivePortrait: React.FC<InteractivePortraitProps> = ({ portraitUrl, revealUrl, className = '', children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<{ portrait: HTMLImageElement; reveal: HTMLImageElement } | null>(null);

  // 初始化图片
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    let loadedCount = 0;

    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        imagesRef.current = { portrait: img1, reveal: img2 };
        setImagesLoaded(true);
      }
    };

    img1.src = portraitUrl;
    img1.onload = onLoad;
    img2.src = revealUrl;
    img2.onload = onLoad;

    return () => {
      img1.onload = null;
      img2.onload = null;
    };
  }, [portraitUrl, revealUrl]);

  // 初始化 Canvas 和 动画
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !containerRef.current || !imagesRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 创建离屏 Mask Canvas
    const maskCanvas = document.createElement('canvas');
    maskCanvasRef.current = maskCanvas;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const resize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // 设置主 Canvas 尺寸
      canvas.width = width;
      canvas.height = height;
      
      // 设置 Mask Canvas 尺寸
      maskCanvas.width = width;
      maskCanvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // 动画循环
    const animate = () => {
      if (!maskCtx || !ctx || !imagesRef.current) return;
      const { reveal } = imagesRef.current;

      // 1. Mask Canvas 淡出处理 (模拟 3秒消散)
      // 假设 60fps, 3秒 = 180帧。每次减少 alpha 1/180 ≈ 0.005
      // 但为了视觉效果，可能需要非线性或者更快的起始衰减
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.fillStyle = 'rgba(0, 0, 0, 0.02)'; // 调节这个值控制消散速度
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // 2. 绘制鼠标轨迹到 Mask Canvas
      if (mouseRef.current) {
        maskCtx.globalCompositeOperation = 'source-over';
        const gradient = maskCtx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 150 // 笔刷半径
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        maskCtx.fillStyle = gradient;
        maskCtx.beginPath();
        maskCtx.arc(mouseRef.current.x, mouseRef.current.y, 150, 0, Math.PI * 2);
        maskCtx.fill();
      }

      // 3. 合成最终画面到主 Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 先把 Mask 画上去
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(maskCanvas, 0, 0);

      // 使用 source-in 只保留 Mask 区域的像素
      ctx.globalCompositeOperation = 'source-in';
      
      // 绘制图二 (保持比例填充 Cover)
      const aspect = reveal.width / reveal.height;
      const canvasAspect = canvas.width / canvas.height;
      let drawW, drawH, offsetX, offsetY;
      
      if (canvasAspect > aspect) {
        drawW = canvas.width;
        drawH = canvas.width / aspect;
        offsetX = 0;
        offsetY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = canvas.height * aspect;
        offsetX = (canvas.width - drawW) / 2;
        offsetY = 0;
      }
      
      ctx.drawImage(reveal, offsetX, offsetY, drawW, drawH);

      // 重置混合模式
      ctx.globalCompositeOperation = 'source-over';

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [imagesLoaded]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = null;
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 底层图一 (肖像) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{ backgroundImage: `url(${portraitUrl})` }}
      />

      {/* 顶层 Canvas (图二 + 水纹消散) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'url(#turbulence)' }} 
      />
      
      {/* SVG Filter 定义 */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="turbulence">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.02" 
              numOctaves="3" 
              result="noise" 
            >
              <animate 
                attributeName="baseFrequency" 
                dur="10s" 
                values="0.02;0.01;0.02" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="20" 
            />
          </filter>
        </defs>
      </svg>
      
      {/* 内容层 */}
      <div className="relative z-10 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default InteractivePortrait;
