import { OpenVidu } from 'openvidu-browser';

import axios from 'axios';
import React, { Component, useEffect } from 'react';
import './Webcam.css';
import UserVideoComponent from './UserVideoComponent';

const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

const DalgonaCam = (props) => {

    const {
        mySessionId,
        myUserName,
        session,
        mainStreamManager,  
        publisher,
        subscribers,
        currentVideoDevice,

    } = props.state;
 
    useEffect(() => {

    }, []);

    return (
        <div>
            {mainStreamManager !== undefined ? (
                <div id="main-video" className="col-md-6">
                    <UserVideoComponent streamManager={mainStreamManager} />

                </div>
            ) : null}
            <div id="video-container" className="col-md-6">
                {publisher !== undefined ? (
                    <div className="stream-container col-md-6 col-xs-6" onClick={() => MainVideoStream(publisher)}>
                        <UserVideoComponent
                            streamManager={publisher} />
                    </div>
                ) : null}
                {subscribers.map((sub, i) => (
                    <div key={sub.id} className="stream-container col-md-6 col-xs-6" onClick={() => MainVideoStream(sub)}>
                        <span>{sub.id}</span>
                        <UserVideoComponent streamManager={sub} />
                    </div>
                ))}
            </div>
        </div>
    );

}

export default DalgonaCam;