import React, { useEffect, useState } from 'react';

// import oimg from "./img/o-piece.png";
// import ximg from "./img/x-piece.png";
// import noimg from "./img/no-piece.png";

import { oimg, ximg, noimg } from './img'


interface props {
    boardStatus: string[];
    setBoardStatus: React.Dispatch<React.SetStateAction<string[]>>;
    index: number;
    setPlayerTurn: React.Dispatch<React.SetStateAction<boolean>>;
    respondToBoxClick: () => void;
}

let pieceSrcs = [noimg, oimg, ximg];

const Box = ({ boardStatus, setBoardStatus, index, setPlayerTurn, respondToBoxClick}  : props) => {


    

    // let src = pieceSrcs[0];

    // switch(boardStatus[index]) {
    //     case 'o':
    //         src = pieceSrcs[1];
    //         break;
    //     case 'x':
    //         src = pieceSrcs[2];
    //         break;
    // }
    
    // const [parentState, setParentState] = useState(boardStatus);

    const [boxSrc, setBoxSrc] = useState(noimg);

    useEffect(() => {
        // setParentState(boardStatus);
        let src = pieceSrcs[0];

        switch(boardStatus[index]) {
            case 'o':
                src = pieceSrcs[1];
                break;
            case 'x':
                src = pieceSrcs[2];
                break;
        }
        // console.log(index, '- Has changed')

        setBoxSrc(src);

    }, [boardStatus]);


    const handleBoxClick = () => {
        console.log("clicked");

        if(boxSrc === noimg) {
            setBoxSrc(oimg);

            setPlayerTurn(false);
            let updatedBoardStatus = boardStatus;
            updatedBoardStatus[index] = "o";
    
            // setBoardStatus(updatedBoardStatus);
            console.log(updatedBoardStatus);
    
            respondToBoxClick();
        }
 
    }


    return (
        <button className="box" onClick={() => handleBoxClick()}>
            
            <img className="pieces" src={boxSrc} alt="my image" />
        </button>
    )
};

export default Box;
