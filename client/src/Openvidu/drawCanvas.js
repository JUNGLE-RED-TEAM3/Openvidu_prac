import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
/**
 * 캔버스에 그리기
 * @param ctx 캔버스 컨텍스트
 * @param results 손 검출 결과
 */
let drawFlag = true;
export const drawCanvas = (ctx,videoctx,results) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    videoctx.save()
    videoctx.clearRect(0, 0, width, height)

    // 캔버스 좌우 반전
    videoctx.scale(-1, 1)
    videoctx.translate(-width, 0)

    // 캡쳐 이미지 그리기
    videoctx.drawImage(results.image, 0, 0, width, height)
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-width, 0)

    // 손 그리기
    // if (results.multiHandLandmarks) {
    //     // 뼈대 그리기
    //     for (const landmarks of results.multiHandLandmarks) {
    //         drawConnectors(videoctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 1 })
    //         drawLandmarks(videoctx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 2 })
    //     }

//560 410
//870 800

        // 선 그리기
        if(results.multiHandLandmarks.length > 0){
            const [x1, y1] = [results.multiHandLandmarks[0][8].x * width, results.multiHandLandmarks[0][8].y * height]
            if (y1 < 100) {
                if (800 < x1 && x1 < 870 ) {
                    drawFlag = true;
                } else if (410 < x1 && x1 < 560) {
                    drawFlag = false;
                }
            }
    }
        
        if (drawFlag) {
        draw(ctx, results.multiHandLandmarks)
        } else {
            erase(ctx, results.multiHandLandmarks)
        }

    videoctx.restore()
    ctx.restore()
    }

    
/**
 *  검지로 화면에 그림을 그린다.
 * @param ctx
 * @param handLandmarks
 */
let lastX, lastY;

const draw = (ctx, handLandmarks) => {
    // 두개의 손이 감지되었는지 확인 && 첫번째 손의 랜드마크가 충분히 감지되었는지 확인
    if (handLandmarks.length === 1 && handLandmarks[0].length > 8) {
        const width = ctx.canvas.width
        const height = ctx.canvas.height
        const [x1, y1] = [handLandmarks[0][8].x * width, handLandmarks[0][8].y * height]
        console.log(x1, y1)
        // 검지를 폈을 경우만 그리기
        let mid_up = false;
        let index_up = false;

        if (handLandmarks[0][12].y < handLandmarks[0][10].y){
            mid_up = true;
        }
        if (handLandmarks[0][8].y < handLandmarks[0][6].y){
            index_up = true;
        }
        // move
        if (mid_up && index_up) {
            return
        }
        if (index_up && y1 > 110) {
            // 검지 끝의 좌표에서 lineto로 선을 그린다
            ctx.strokeStyle = '#0082CF'
            ctx.lineWidth = 30
            // lastX, lastY가 설정되지 않았다면 지금 설정한다
            if (lastX === undefined || lastY === undefined) {
                lastX = x1
                lastY = y1
            }
            ctx.beginPath()
            ctx.moveTo(lastX, lastY)
            ctx.lineTo(x1, y1)
            ctx.stroke()
            // 현재 좌표를 마지막 좌표로 저장한다
            lastX = x1
            lastY = y1
        } else {
            lastX = undefined
            lastY = undefined
        }
    }
}

const erase = (ctx, handLandmarks) => {
    if (handLandmarks.length === 1 && handLandmarks[0].length > 8) {
        const width = ctx.canvas.width
        const height = ctx.canvas.height
        const [x1, y1] = [handLandmarks[0][8].x * width, handLandmarks[0][8].y * height]
        // 검지를 폈을 경우만 그리기
        if (handLandmarks[0][6].y > handLandmarks[0][8].y && y1 > 110) {
            ctx.clearRect(x1 - 5, y1 - 5, 50, 50);
            // ctx.globalCompositeOperation = 'destination-out';
            // ctx.beginPath();
            // ctx.arc(x1, y1, 25, 0, 2 * Math.PI);
            // ctx.fill();
            // ctx.globalCompositeOperation = 'source-over';
        }
    }
}