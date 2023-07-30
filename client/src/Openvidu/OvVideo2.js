import React, { useEffect, useRef } from 'react';

const OpenViduVideoComponent2 = ({ streamManager, webcamRef }) => {

    useEffect(() => {
        if (streamManager && !!webcamRef.current) {
            streamManager.addVideoElement(webcamRef.current);
        }

        return () => {
            if (streamManager && !!webcamRef.current) {
                streamManager.removeVideoElement(webcamRef.current);
            }
        };
    }, [streamManager]);

    return <video autoPlay={true} ref={webcamRef} style={{visibility: 'hidden', width: '1280px', height: '720px'} }/>;
};

export default OpenViduVideoComponent2;