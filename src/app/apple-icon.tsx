import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          E
        </span>
        <span
          style={{
            width: 60,
            height: 4,
            background: '#b8960c',
            marginTop: 8,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
