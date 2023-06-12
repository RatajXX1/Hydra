import React, { FunctionComponent } from "react";
import "./Buttons.scss";

type ButtonProps = {
    Icon: FunctionComponent, 
    style?: React.CSSProperties | undefined, 
    OnClick?: () => void,
    onMouseDown?: () => void,
    onMouseUp?: () => void,
    Seleted?: boolean,
    type?: "button" | "submit"
}

function IconButton(props: ButtonProps) {
    return (
        <button 
            type={props.type != undefined ? props.type! : "button"}
            style={props.style != undefined ? props.style : undefined} 
            className={"Hydra_Buttons_iconbutton" + (props.Seleted? " Hydra_Buttons_iconbutton_selected" : "")}
            onClick={props.OnClick}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
        >
            <props.Icon />
        </button>
    )
}

type NormalButtonProps = {
    text: string,
    style?: React.CSSProperties | undefined, 
    OnClick?: () => void,
    onMouseDown?: () => void,
    onMouseUp?: () => void,
    Seleted?: boolean,
    variant?: "text" | "filled",
    type?: "button" | "submit"
}

const NormalButtonsStyle = {
    "text": "Hydra_Buttons_button_text",
    "filled": "Hydra_Buttons_button_filled",
}

function Button(props: NormalButtonProps) {
    return (
        <button 
            type={props.type != undefined ? props.type! : "button"}
            style={props.style != undefined ? props.style : undefined} 
            className={"Hydra_Buttons_button" + (props.variant != undefined? " " + NormalButtonsStyle[props.variant] : " Hydra_Buttons_button_text") + (props.Seleted? " Hydra_Buttons_iconbutton_selected" : "")}
            onClick={props.OnClick != undefined ? props.OnClick : () => {}}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
        >
            {
                props.text
            }
        </button>
    )
}


export {
    IconButton,
    Button
}