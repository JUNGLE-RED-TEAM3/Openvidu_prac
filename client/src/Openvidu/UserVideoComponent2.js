import React from 'react';
import OpenViduVideoComponent2 from './OvVideo2';
// import './UserVideo.css';

const UserVideoComponent2 = ({ streamManager }) => {
    const getNicknameTag = () => {
        // Gets the nickName of the user
        return JSON.parse(streamManager.stream.connection.data).clientData;
    };

    return (
        <div>
            {streamManager !== undefined ? (
                <div>
                    <OpenViduVideoComponent2 streamManager={streamManager} />
                    <div><p>{getNicknameTag()}</p></div>
                </div>
            ) : null}
        </div>
    );
};

export default UserVideoComponent2;
