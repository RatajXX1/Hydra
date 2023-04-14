import React, { FunctionComponent } from "react";
import "./Buttons.scss";

type ButtonProps = {
    Icon: FunctionComponent, 
    style?: Object | undefined, 
    OnClick?: () => void,
    Seleted?: boolean
}

function IconButton(props: ButtonProps) {
    return (
        <button 
            style={props.style != undefined ? props.style : undefined} 
            className={"Hydra_Buttons_iconbutton" + (props.Seleted? " Hydra_Buttons_iconbutton_selected" : "")}
            onClick={props.OnClick}
        >
            <props.Icon />
        </button>
    )
}

export {
    IconButton
}