import React from 'react';
import {INK} from './lib';

/** Cartoon text: thick ink outline + hard drop shadow, like the thumbnails. */
export const ST: React.FC<{
  text: string; font: string; size: number; color: string; sw?: number; weight?: number;
  shadow?: number; style?: React.CSSProperties; spacing?: number;
}> = ({text, font, size, color, sw = 10, weight, shadow = 0.07, style, spacing = 0}) => {
  const base: React.CSSProperties = {
    fontFamily: font, fontSize: size, lineHeight: 1, whiteSpace: 'pre', letterSpacing: spacing,
    fontWeight: weight as any, display: 'block',
  };
  const sh = Math.round(size * shadow);
  return (
    <div style={{position: 'relative', ...style}}>
      {shadow > 0 && (
        <div style={{...base, position: 'absolute', left: 0, top: sh, color: 'rgba(0,0,0,0.45)', WebkitTextStroke: `${sw * 2}px rgba(0,0,0,0.45)`}}>{text}</div>
      )}
      <div style={{...base, position: 'absolute', left: 0, top: 0, color: INK, WebkitTextStroke: `${sw * 2}px ${INK}`}}>{text}</div>
      <div style={{...base, position: 'relative', color}}>{text}</div>
    </div>
  );
};

/** centered absolutely positioned wrapper */
export const At: React.FC<{x: number; y: number; s?: number; r?: number; o?: number; children: any; origin?: string; style?: React.CSSProperties}> =
  ({x, y, s = 1, r = 0, o = 1, children, origin = '50% 50%', style}) => (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${r}deg)`, transformOrigin: origin, opacity: o, ...style}}>
      {children}
    </div>
  );
