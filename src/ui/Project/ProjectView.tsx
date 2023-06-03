import React from "react";
import ScrollArea from "../ScrollArea/Scrollarea";
import "./ProjectView.scss";
import {ReactComponent as EditIcon} from "../../Images/pen.svg";
import {ReactComponent as AddIcon} from "../../Images/add.svg";
import { IconButton } from "../Buttons/Buttons";

class ProjectView extends React.Component {

    render(): React.ReactNode {
        return (
            <div className="Hydra_ProjectView_main">
                <div className="Hydra_ProjectView_header">
                    <h1>
                        PIKA 2.0
                        <IconButton
                            Icon={EditIcon}
                        />
                    </h1>
                </div>
                <div className="Hydra_ProjectView_work">
                    <ScrollArea>
                        <div className="Hydra_ProjectView_columns">
                            {
                                (
                                    () => {
                                        const tab: React.ReactNode[] = []
                                        
                                        for(let i = 0; i < 8; i++) 
                                            tab.push(
                                                <div className="Hydra_ProjectView_column">
                                                    <a>
                                                        Stage 1dlskadasdals;kdaslkdl;askdl;askdl;a
                                                        <IconButton
                                                            Icon={AddIcon}
                                                        />
                                                    </a>
                                                    {
                                                        (
                                                            () => {
                                                                const tab: React.ReactNode[] = []
                                                                
                                                                for(let d = 0; d < 1*(i + 1); d++) 
                                                                    tab.push(
                                                                        <div>
                                                                            <span>Scrathdjskakldsajkldjsakldjsakldjakldjsakljdsakldjkslajdkslajdksaljdklsajdklsajkl</span>
                                                                            <IconButton
                                                                                Icon={EditIcon}
                                                                            />
                                                                        </div>
                                                                    )
                                                                
                                                                    tab.push(
                                                                        <div className="Hydra_ProjectView_column_item_add">
                                                                            <AddIcon/>
                                                                        </div>
                                                                    )

                                                                return tab
                                                            }
                                                        )()
                                                    }
                                                </div>
                                            )
                                        
                                        tab.push(
                                            <div className="Hydra_ProjectView_column">
                                                {/* <div className="Hydra_ProjectView_column_item_add">
                                                    <AddIcon/>
                                                </div> */}
                                                <div style={{height: "100%", flexShrink: "0"}} className="Hydra_ProjectView_column_item_add">
                                                    <AddIcon/>
                                                </div>
                                            </div>
                                        )

                                        return tab
                                    }
                                )()
                            }

                        </div>
                    </ScrollArea>
                </div>
            </div>
        )
    }

}

export default ProjectView;