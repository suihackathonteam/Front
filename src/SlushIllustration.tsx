import React from 'react';
import './SlushIllustration.css';

const SlushIllustration: React.FC = () => {
  return (
    <div className="slush-illustration" aria-hidden>
      <svg className="slush-blob blob-1" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
          </linearGradient>
          <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>
        <path filter="url(#blur1)" transform="translate(-60 -40)" d="M180 50 C260 10 410 -10 520 80 C640 170 720 310 640 420 C560 530 340 560 210 520 C80 480 100 250 180 50Z" fill="url(#g1)" />
      </svg>

      <svg className="slush-blob blob-2" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.45" />
          </linearGradient>
          <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <path filter="url(#blur2)" transform="translate(-20 -80)" d="M640 80 C700 150 760 240 720 320 C690 390 610 420 540 470 C460 520 360 540 280 500 C200 460 140 380 120 240 C100 110 280 30 420 30 C520 30 590 40 640 80Z" fill="url(#g2)" />
      </svg>

      <svg className="slush-lines" preserveAspectRatio="none" viewBox="0 0 1200 600">
        <defs>
          <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g stroke="url(#strokeGrad)" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M -50 400 C 150 200 350 500 650 300 S 1200 250 1250 200" opacity="0.4" className="line line-1" />
          <path d="M -50 480 C 200 360 350 600 750 360 S 1200 420 1250 380" opacity="0.25" className="line line-2" />
          {/* little scribble strokes */}
          <path d="M 380 160 C 400 180 420 180 440 155" strokeDasharray="6 6" opacity="0.5" className="scribble" />
          <path d="M 520 220 C 540 240 560 240 580 220" strokeDasharray="6 6" opacity="0.4" className="scribble" />
        </g>
      </svg>

    </div>
  );
}

export default SlushIllustration;
