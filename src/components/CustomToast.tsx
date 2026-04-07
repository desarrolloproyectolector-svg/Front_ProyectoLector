'use client';

import React, { useEffect, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface CustomToastProps {
  id: string | number;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

// ─── Icon SVGs ───────────────────────────────────────────────────────────────

const icons: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
      <path d="M5.5 10.5L8.5 13.5L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
      <path d="M6.5 6.5L13.5 13.5M13.5 6.5L6.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
      <path d="M10 6V11" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="1" fill="white" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
      <path d="M10 9V14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="white" />
    </svg>
  ),
  loading: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="toast-spin">
      <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M10 2a8 8 0 018 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

// ─── Gradient map ────────────────────────────────────────────────────────────

const gradients: Record<ToastVariant, string> = {
  success: 'linear-gradient(135deg, #1a6b4a 0%, #0d4e35 100%)',
  error:   'linear-gradient(135deg, #7b1d1d 0%, #5a1212 100%)',
  warning: 'linear-gradient(135deg, #7b5a0d 0%, #5a400a 100%)',
  info:    'linear-gradient(135deg, #1a3a6b 0%, #0d2550 100%)',
  loading: 'linear-gradient(135deg, #2d1f5e 0%, #1a1040 100%)',
};

const accentColors: Record<ToastVariant, string> = {
  success: '#34d399',
  error:   '#f87171',
  warning: '#fbbf24',
  info:    '#60a5fa',
  loading: '#a78bfa',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function CustomToast({
  id,
  variant,
  title,
  description,
  duration = 4000,
  action,
}: CustomToastProps) {
  const [progress, setProgress] = useState(100);
  const [mounted, setMounted] = useState(false);
  const isLoading = variant === 'loading';
  const accent = accentColors[variant];

  // Mount animation
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Progress bar
  useEffect(() => {
    if (isLoading) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [duration, isLoading]);

  return (
    <div
      onClick={() => !isLoading && sonnerToast.dismiss(id)}
      style={{
        background: gradients[variant],
        border: `1px solid ${accent}30`,
        boxShadow: `0 0 0 1px ${accent}15, 0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)`,
        borderRadius: '14px',
        padding: '14px 16px',
        minWidth: '320px',
        maxWidth: '400px',
        cursor: isLoading ? 'default' : 'pointer',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-lora), serif',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
        transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Shimmer line at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
      }} />

      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Icon */}
        <div style={{
          flexShrink: 0,
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: `${accent}20`,
          border: `1px solid ${accent}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '1px',
        }}>
          {icons[variant]}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            color: '#f0e6d2',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '1.4',
            letterSpacing: '0.01em',
          }}>
            {title}
          </p>
          {description && (
            <p style={{
              margin: '3px 0 0',
              color: 'rgba(240,230,210,0.65)',
              fontSize: '12.5px',
              lineHeight: '1.5',
              fontWeight: 400,
            }}>
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={(e) => { e.stopPropagation(); action.onClick(); }}
              style={{
                marginTop: '8px',
                padding: '4px 12px',
                background: `${accent}20`,
                border: `1px solid ${accent}50`,
                borderRadius: '6px',
                color: accent,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = `${accent}35`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = `${accent}20`;
              }}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss X (only non-loading) */}
        {!isLoading && (
          <button
            onClick={(e) => { e.stopPropagation(); sonnerToast.dismiss(id); }}
            style={{
              flexShrink: 0,
              width: '20px',
              height: '20px',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '5px',
              color: 'rgba(240,230,210,0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              padding: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = '#f0e6d2';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,230,210,0.5)';
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar */}
      {!isLoading && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '0 0 14px 14px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accent}80, ${accent})`,
            borderRadius: '0 0 14px 14px',
            transition: 'width 0.1s linear',
            boxShadow: `0 0 8px ${accent}60`,
          }} />
        </div>
      )}
    </div>
  );
}
