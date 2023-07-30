import { OpenVidu } from 'openvidu-browser';

import axios from 'axios';
import React, { Component, useEffect, useRef, useState, useCallback } from 'react';
import './Webcam.css';
import UserVideoComponent2 from './UserVideoComponent2';
import { css } from '@emotion/css';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import { drawCanvas } from './drawCanvas';
import OpenViduVideoComponent2 from './OvVideo2';

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

    const getNicknameTag = () => {
        // Gets the nickName of the user
        return JSON.parse(publisher.stream.connection.data).clientData;
    };

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const drawCanvasRef = useRef(null)
    // const resultsRef = useRef(null)


    useEffect(
        () => {
        if (!publisher && !webcamRef) return;
        const hands = new Hands({
            locateFile: file => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            }
        })

        const ctx = drawCanvasRef.current?.getContext('2d')
        const videoCtx = canvasRef.current?.getContext('2d')
        // webcamRef = publisher.streamManager.videos[0].video
        //1.end

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        })
        hands.onResults((Results) => {
                drawCanvas(ctx, videoCtx, Results)
        })
        if (webcamRef.current !== null) {
            const camera = new Camera(webcamRef.current, {
                onFrame: async () => {
                    await hands.send({ image: webcamRef.current })
                },
                width: 1280,
                height: 720,
            })
            camera.start()
        }
        const img1 = new Image();
        img1.src = '/1.png';
        img1.onload = () => {
            if (ctx){
            ctx.drawImage(img1, 0, 0, 1280,100);
            }
        };
        const img2 = new Image();
        img2.src = '/hibiscus2_bg_black.png';
        img2.onload = () => {
            if (ctx) {
            ctx.drawImage(img2, 450, 200, 400,400);
            }
        };
    }, [publisher]
    )


    return (
        <div>
            {/* {mainStreamManager !== undefined ? (
                <div id="main-video" className="col-md-6">
                    <UserVideoComponent2 streamManager={mainStreamManager} />

                </div>
            ) : null} */}
            {/* <div id="video-container" className="col-md-6">
                {publisher !== undefined ? (
                    <div className="stream-container col-md-6 col-xs-6" >
                        <UserVideoComponent2
                            streamManager={publisher}
                            />
                    </div>
                ) : null}
                {subscribers.map((sub, i) => (
                    <div key={sub.id} className="stream-container col-md-6 col-xs-6" >
                        <span>{sub.id}</span>
                        <UserVideoComponent2 streamManager={sub} />
                    </div>
                ))}
            </div> */}

            {publisher !== undefined ? (
                <div className={styles.container} >
                    <OpenViduVideoComponent2 streamManager={publisher} webcamRef={webcamRef}/>
                     <canvas ref={canvasRef}
                        className={styles.canvas}
                        width={1280}
                        height={720}
                        />
                    <canvas ref={drawCanvasRef}
                        className={styles.canvas}
                        width={1280}
                        height={720}
                        />
                    <div><p>{getNicknameTag()}</p></div>
                </div>
                ) : null}
        </div>

        
    );

}

const styles = {
    container: css`
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    canvas: css`
        position: absolute;
        width: 1280px;
        height: 720px;
        background-color: transparent;
    `,
    buttonContainer: css`
        position: absolute;
        top: 20px;
        left: 20px;
    `,
    button: css`
        color: #fff;
        background-color: #0082CF;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        padding: 10px 10px;
        cursor: pointer;
    `
}


export default DalgonaCam;