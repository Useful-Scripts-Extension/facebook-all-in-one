import { Spin } from 'antd';

export default function LoadingFullScreen({ onlyFillContainer = false }) {
  return (
    <div
      style={{
        ...(onlyFillContainer
          ? {
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }
          : {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#111d',
              backdropFilter: 'blur(3px)',
            }),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* <LoadingOutlined style={{ color: "blue", fontSize: "3em" }} /> */}
      <Spin size="large" />
    </div>
  );
}
