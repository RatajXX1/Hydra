import React from "react";
import "./WorkArea.scss";
import {ReactComponent as CloseIcon} from "../../Images/close.svg";
import { IconButton } from "../Buttons/Buttons";

class TabSystem extends React.Component {
    state = {
        tabs: [
            {
                Name: "Notatk#1"
            }
        ]
    };


    render(): React.ReactNode {
        return (
            <div className="Hydra_Tabs_main">
                <div className="Hydra_Tabs_tabs">
                    <div className="Hydra_Tabs_tabs_item Hydra_Tabs_tabs_item_active">
                        <a>Notatka #1</a>
                        <div></div>
                        <IconButton
                            Icon={CloseIcon}
                        />
                    </div>
                    <div className="Hydra_Tabs_tabs_item Hydra_Tabs_tabs_item_inactive">
                        <a>Notatka #1</a>
                        <div></div>
                        <IconButton
                            Icon={CloseIcon}
                        />
                    </div>
                </div>
                <div className="Hydra_Tabs_workarea">

                </div>
            </div>
        )
    }

}

export default TabSystem;