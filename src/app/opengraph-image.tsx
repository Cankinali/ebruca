import { ImageResponse } from 'next/og';

export const alt = 'Ebruca | Modern Kadın Giyim';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 700,
            letterSpacing: 24,
            marginBottom: 20,
          }}
        >
          EBRUCA
        </div>
        <div
          style={{
            width: 80,
            height: 3,
            background: '#b8960c',
            marginBottom: 24,
          }}
        />
        <div
          style={{
            fontSize: 32,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: 4,
          }}
        >
          MODERN KADIN GİYİM
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: 3,
          }}
        >
          ebruca.com
        </div>
      </div>
    ),
    { ...size }
  );
}
