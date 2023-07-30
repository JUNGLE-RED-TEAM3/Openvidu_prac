import { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import DalgonaCam from './2_DalgonaCam';


const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

const JoinSession = () => {
    const [mySessionId, setMySessionId] = useState('SessionA');
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);

    const OV = useRef(null);

    useEffect(() => {
        OV.current = new OpenVidu();
    }, []);

    const handleChangeSessionId = (e) => {
        setMySessionId(e.target.value);
    };

    const handleChangeUserName = (e) => {
        setMyUserName(e.target.value);
    };

    const joinSession = async (e) => {
        e.preventDefault();

        // --- 1) Get an OpenVidu object ---
        const ov = new OpenVidu();

        // --- 2) Init a session ---
        const mySession = ov.initSession();

        // --- 3) Specify the actions when events take place in the session ---
        // On every new Stream received...
        mySession.on('streamCreated', (event) => {
            // Subscribe to the Stream to receive it. Second parameter is undefined
            // so OpenVidu doesn't create an HTML video by its own
            const subscriber = mySession.subscribe(event.stream, undefined);
            setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        });

        // On every Stream destroyed...
        mySession.on('streamDestroyed', (event) => {
            // Remove the stream from 'subscribers' array
            deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on('exception', (exception) => {
            console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---
        // Get a token from the OpenVidu deployment
        const token = await getToken();
        // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        mySession.connect(token, { clientData: myUserName })
            .then(async () => {
                // --- 5) Get your own camera stream ---
                // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                // element: we will manage it on our own) and with the desired properties
                const newPublisher = await ov.initPublisherAsync(undefined, {
                    audioSource: undefined, // The source of audio. If undefined default microphone
                    videoSource: undefined, // The source of video. If undefined default webcam
                    publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                    publishVideo: true, // Whether you want to start publishing with your video enabled or not
                    resolution: '640x480', // The resolution of your video
                    frameRate: 30, // The frame rate of your video
                    insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                    mirror: false, // Whether to mirror your local video or not
                });

                // --- 6) Publish your stream ---
                mySession.publish(newPublisher);

                // Obtain the current video device in use
                const devices = await ov.getDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                const currentVideoDeviceId = newPublisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

                // Set the main video in the page to display our webcam and store our Publisher
                setCurrentVideoDevice(currentVideoDevice);
                setMainStreamManager(newPublisher);
                setPublisher(newPublisher);
            })
            .catch((error) => {
                console.log('There was an error connecting to the session:', error.code, error.message);
            });

        setSession(mySession);
    };

    const getToken = async () => {
        const sessionId = await createSession(mySessionId);
        return createToken(sessionId);
    };

    const createSession = async (sessionId) => {
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The sessionId
    };

    const createToken = async (sessionId) => {
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The token
    };

    const deleteSubscriber = (streamManager) => {
        setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== streamManager));
    };

    return (
        <div className="container">
            {session === undefined ? (
                <div id="join">
                    <div id="img-div">
                        <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" />
                    </div>
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1> Join a video session </h1>
                        <form className="form-group" onSubmit={joinSession}>
                            <p>
                                <label>Participant: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="userName"
                                    value={myUserName}
                                    onChange={handleChangeUserName}
                                    required
                                />
                            </p>
                            <p>
                                <label> Session: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={handleChangeSessionId}
                                    required
                                />
                            </p>
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}

            {session !== undefined && myUserName !== undefined ? (
                <DalgonaCam
                    state={{
                        mySessionId,
                        myUserName,
                        session,
                        mainStreamManager,
                        publisher,
                        subscribers,
                        currentVideoDevice,
                    }}
                />
            ) : null}
        </div>
    );
};

export default JoinSession;
