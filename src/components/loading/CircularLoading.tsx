import { Spin } from 'antd';

const CircularLoading = () => {
    return (
        <>
            <Spin
                size="large"
                style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                }}
            />
            <div className="fixed inset-0 bg-gray-400 opacity-50 z-10" />
        </>
    );
};

export default CircularLoading;
