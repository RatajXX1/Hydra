import React from "react";
import "./Headbar.scss";
import { IconButton } from "../Buttons/Buttons";
import {ReactComponent as ArrowImage} from "../../Images/undo.svg"

class HeadBar extends React.Component {

    render(): React.ReactNode {
        return (
            <div className="Hydra_Headbar_main">
                <div className="Hydra_Headbar_functions">
                    {/* <IconButton
                        Icon={ArrowImage}
                    />
                    <IconButton
                        style={{
                            transform: "rotate(180deg)",
                            fill: "red"
                        }}
                        Icon={ArrowImage}
                    /> */}
                </div>
            </div>
        )
    }
    
}

export default HeadBar