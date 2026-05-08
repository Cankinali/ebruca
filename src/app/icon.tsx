import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
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
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          E
        </span>
        <span
          style={{
            width: 12,
            height: 1.5,
            background: '#b8960c',
            marginTop: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
