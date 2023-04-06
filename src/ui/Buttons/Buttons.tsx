import React, { FunctionComponent } from "react";
import "./Buttons.scss";

function IconButton(props: {Icon: FunctionComponent, style?: Object | undefined}) {
    return (
        <button style={props.style != undefined ? props.style : undefined} className="Hydra_Buttons_iconbutton">
            <props.Icon />
        </button>
    )
}

export {
    IconButton
}