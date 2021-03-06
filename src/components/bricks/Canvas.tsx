// React adaptation of: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript


import React, { useCallback, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import useState from 'react-usestateref';
import Alert from './Alert';

// import ballSrc from "./img/ball.png";
// import bricks1Src from "./img/bricks-1.png";
// import bricks2Src from "./img/bricks-2.png";
// import bricks3Src from "./img/bricks-3.png";
// import bricks4Src from "./img/bricks-4.png";
// import bricks5Src from "./img/bricks-5.png";

// import paddleSrc from "./img/paddle.png";


import { ballSrc, bricks1Src, bricks2Src, bricks3Src, bricks4Src, bricks5Src, paddleSrc} from './img';

const ballImg = new Image();
const bricks1Img = new Image();
const bricks2Img = new Image();
const bricks3Img = new Image();
const bricks4Img = new Image();
const bricks5Img = new Image();



const paddleImg = new Image();


const scaleFactor = 2.5;

const defaultCanvasWidth = 457 * scaleFactor;
const defaultCanvasHeight = 400 * scaleFactor;


const ballWidth = 15 * scaleFactor;

const paddleHeight = 10 * scaleFactor;
const paddleWidth = 70 * scaleFactor;

const brickRows = 5;
const brickColumns = 7;
const brickWidth = 60 * scaleFactor;
const brickHeight = 20 * scaleFactor;
const brickPadding = 4 * scaleFactor;
const brickOffsetTop = 25 * scaleFactor; 
const brickOffsetLeft = 7 * scaleFactor;

type coords = { [value: string]: number }

let origin: coords = {x: 0, y: 0, count: 1};

let brickCoords:coords[][] = Array.from(Array(brickRows), () => Array(brickColumns).fill({ x: 0, y: 0, count: 1 }));

const defaultSpeed = 5 * scaleFactor;

const defaultSpeedx = 3 * scaleFactor;
const defaultSpeedy = -4 * scaleFactor;




brickCoords.forEach((row, i) => {
    row.forEach((b, j) => {
        let brickX = (j*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (i*(brickHeight+brickPadding))+brickOffsetTop;
        console.log(`i ${i} j ${j}`)
        console.log(`x ${brickX} y ${brickY}`)

        brickCoords[i][j] = {x: brickX, y: brickY, count: 1};
        

        console.log(b)
    });
});

const Canvas = () => {

    const [gameStatus, setGameStatus, gameStatusRef] = useState("ongoing");

    const [gameScore, setGameScore, gameScoreRef] = useState(0);


    const [canvasWidth, setCanvasWidth] = useState(defaultCanvasWidth);
    const [canvasHeight, setCanvasHeight] = useState(defaultCanvasHeight);


    const [ballx, setBallx, ballxRef] = useState((canvasWidth-ballWidth)/2);
    const [bally, setBally, ballyRef] = useState(canvasHeight-(2*paddleHeight)-ballWidth);


    const [ballSpeed, setBallSpeed, ballSpeedRef] = useState(defaultSpeed);
    const [balldx, setBalldx, balldxRef] = useState(defaultSpeedx);
    const [balldy, setBalldy, balldyRef] = useState(defaultSpeedy);

    const [paddlex, setPaddlex, paddlexRef] = useState((canvasWidth-paddleWidth)/2);
    const [paddley, setPaddley, paddleyRef] = useState(canvasHeight-(2*paddleHeight));
    const [paddleSpeed, setPaddleSpeed, paddleSpeedRef] = useState(defaultSpeed);

    // const [paddley, setPaddley, paddleyRef] = useState(-2);


    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const [canvasInterval, setCanvasInterval, canvasIntervalRef] = useState<NodeJS.Timer>();



    const [rightPressed, setRightPressed, rightPressedRef] = useState(false);
    const [leftPressed, setLeftPressed, leftPressedRef] = useState(false);

    useEffect(() => {
        if(canvasContext) {
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

            // draw the ball
            canvasContext.beginPath();
            canvasContext.drawImage(ballImg, ballx, bally, ballWidth, ballWidth);

            // draw the paddle
            canvasContext.beginPath();
            // canvasContext.rect(paddlex, paddley, paddleWidth, paddleHeight);
            // canvasContext.fillStyle = "#0095DD";
            // canvasContext.fill();
            // canvasContext.closePath();
            canvasContext.drawImage(paddleImg, paddlex, paddley, paddleWidth, paddleHeight);


            // draw the bricks
            brickCoords.forEach((row, i) => {
                let chosenImg = bricks3Img;
                switch (i) {
                    case 0:
                        chosenImg = bricks1Img;
                        break;
                    case 1:
                        chosenImg = bricks2Img;
                        break;
                    case 3:
                        chosenImg = bricks4Img;
                        break;
                    case 4:
                        chosenImg = bricks5Img;
                        break;
                }
                row.forEach((b, j) => {
                    if (b.count > 0) {
                        canvasContext.beginPath();
                        

                        canvasContext.drawImage(chosenImg, b.x, b.y, brickWidth, brickHeight)
                    }
                })
            });

            // display the score
            // canvasContext.font = "16px Arial";
            // canvasContext.fillStyle = "#0095DD";
            // canvasContext.fillText("Score: "+gameScore, 8, 18);

        }
    }, [canvasContext, ballx, bally])

    const draw = (ctx: CanvasRenderingContext2D) => {

        if(ctx) {
            let currentBalldx = balldxRef.current;
            let currentBalldy = balldyRef.current;

            setBallx(prevBallx => prevBallx + currentBalldx);
            setBally(prevBally => prevBally + currentBalldy);

            let currentBallx = ballxRef.current;
            let currentBally = ballyRef.current;
            let nextBallx = ballxRef.current + currentBalldx
            let nextBally = ballyRef.current + currentBalldy
            
            let currentPaddlex = paddlexRef.current;
            let currentPaddley = paddleyRef.current;

            let ballCenterx = nextBallx + (ballWidth/2)
            let ballCentery = nextBally + (ballWidth/2)

            // check if ball hit the bricks
            for(let row=0; row<brickRows; row++) {
                for(let col=0; col<brickColumns; col++) {
                    // console.log(brickCoords)
                    let b = brickCoords[row][col];
                    if (b.count > 0) {
                        
                        // hit brick vertically
                        if(ballCenterx > b.x && ballCenterx < b.x+brickWidth && 
                            nextBally >= b.y && 
                            nextBally <= b.y+brickHeight) {
                            setBalldy(prevBalldy => -prevBalldy);
                            b.count--;

                            setGameScore(prevGameScore => prevGameScore + 1);

                            if(gameScoreRef.current == brickRows*brickColumns) {
                                setGameStatus("win");
                                clearInterval(canvasInterval); // Needed for Chrome to end game
                            }
                        }
                        if(ballCentery > b.y && ballCentery < b.y+brickHeight && 
                            nextBallx-ballWidth >= b.x && nextBallx <= b.x+brickWidth) {

                            setBalldx(prevBalldx => -prevBalldx);
                            b.count--;

                            setGameScore(prevGameScore => prevGameScore + 1);
                            if(gameScoreRef.current == brickRows*brickColumns) {
                                setGameStatus("win");
                                clearInterval(canvasInterval); // Needed for Chrome to end game
                            }

                        }
                        

                    }
                
                }
            }

            // check if ball hit the side walls
            if (nextBallx > canvasWidth-ballWidth ||
                nextBallx < 0) {
                setBalldx(prevBalldx => -prevBalldx);
            } 
            
            // check if ball hit the top wall
            if (nextBally < 0) {    
                setBalldy(prevBalldy => -prevBalldy);
            }

            // check if ball is hit the ground`
            else if (nextBally > canvasHeight-ballWidth) {

                    // Game Over
                if (gameStatusRef.current === "ongoing") {
                    setGameStatus("lost");
                    console.log("gameover")
                }


                    // console.log(canvasIntervalRef.current)

                    clearInterval(canvasIntervalRef.current);
            }
            // check if ball hit the paddle
            else if (nextBally > currentPaddley-ballWidth &&
                ballCenterx > currentPaddlex &&
                ballCenterx < currentPaddlex + paddleWidth) {

                let paddleCenter = currentPaddlex + (paddleWidth/2);
                
                // angle of the ball increases towards the edge of the paddle
                let distFromCenter = Math.abs(paddleCenter-ballCenterx)
                let percentFromCenter = distFromCenter / (paddleWidth/2);
                
                let speedx = ballSpeedRef.current*percentFromCenter
                
                // if the ball hit left side of the paddle, ball bounces left  
                speedx = (ballCenterx < paddleCenter) ? -speedx : speedx 

                // using Pythagorean theorem
                let speedy = ((ballSpeedRef.current**2) - (speedx**2))**0.5
                speedy = (currentBalldy > 0) ? -speedy : speedy;
                
                
                setBalldx(speedx);
                setBalldy(speedy);

                console.log(percentFromCenter)
            
            }

            // if right key is pressed, move paddle right
            if (rightPressedRef.current) {
                setPaddlex(prevPaddlex => prevPaddlex+paddleSpeed)


                if(paddlexRef.current+paddleWidth > canvasWidth) {
                    setPaddlex(canvasWidth-paddleWidth)
                }

            }
    
            // if left key is pressed, move paddle left
            else if (leftPressedRef.current) {
                setPaddlex(prevPaddlex => prevPaddlex-paddleSpeed)

                if(paddlexRef.current < 0) {
                    setPaddlex(0)
                }
            }
        }
    };

  
    useEffect(() => {


        ballImg.src = ballSrc
        bricks1Img.src = bricks1Src
        bricks2Img.src = bricks2Src
        bricks3Img.src = bricks3Src
        bricks4Img.src = bricks4Src       
        bricks5Img.src = bricks5Src
        paddleImg.src = paddleSrc

        let canvasCnt = document.getElementById("canvas-cnt") as HTMLDivElement;
        canvasCnt.focus();


        let canvas = document.getElementById("bricks-canvas") as HTMLCanvasElement;
        let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;


        setCanvasContext(ctx);

        const intervalId = setInterval(() => draw(ctx), 15);

        console.log("INTERVAL", intervalId)
        setCanvasInterval(intervalId)

        // requestAnimationFrame(() => draw(ctx));

    }, []);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {

        if (gameStatus === "ongoing") {

            if (event.code === "ArrowLeft") {
                setLeftPressed(true);

            } else if (event.code === "ArrowRight") {

                setRightPressed(true);
            }
        }    
    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {

        if (gameStatus === "ongoing") {
            if (event.code === "ArrowLeft") {
                    
                    setLeftPressed(false);
        
            
                } else if (event.code === "ArrowRight") {
                    
                    setRightPressed(false);
                }
        }

    }
  
    return (
    <div id="canvas-cnt" className="canvas-cnt" 
        tabIndex={-1} 
        onKeyDown={(e) => handleKeyDown(e)}
        onKeyUp={(e) => handleKeyUp(e)} >
        <canvas id="bricks-canvas" 
                className="canvas" 
                width={canvasWidth} height={canvasHeight} 
                style={{ border: "1px solid #d3d3d3" }}>

        </canvas>
        { gameStatus !== "ongoing" && <Alert result ={gameStatus} />}
    </div>
  )
};

export default Canvas;