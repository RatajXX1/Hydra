import React from "react";
import "./Sidebar.scss";
import { IconButton } from "../Buttons/Buttons";
import {ReactComponent as FilesIcon} from "../../Images/files.svg";
import {ReactComponent as CalendarIcon} from "../../Images/calendar.svg";
import {ReactComponent as ProjectsIcon} from "../../Images/projects.svg";
import {ReactComponent as ListIcon} from "../../Images/list.svg";
import {ReactComponent as SettingsIcon} from "../../Images/settings.svg";
import {ReactComponent as SearchIcon} from "../../Images/search.svg";
import { RichEditor } from "../RichEditor/Richeditor";
import BlockEditor from "../BlockEditor/BlockEditor";

class SideBar extends React.Component {

    count = 1

    render(): React.ReactNode {
        return (
            <div className="Hydra_Sidebar_main">
                <div className="Hydra_Sidebar_functions">
                    <div>
                        <IconButton
                            Icon={FilesIcon}
                            OnClick={() => {
                                if (window.addTab !== undefined) {
                                    this.count += 1
                                    window.addTab(
                                        "Notatka z SIDE Notatka z SIDE Notatka z SIDE Notatka z SIDE",
                                        <BlockEditor/>
                                    )
                                }
                            }}
                        />
                        <IconButton
                            Icon={CalendarIcon}
                            OnClick={() => {
                                if (window.addTab !== undefined) {
                                    this.count += 1
                                    window.addTab(
                                        "Notatka z SIDE",
                                        <RichEditor/>
                                    )
                                }
                            }}
                        />
                        <IconButton
                            Icon={ProjectsIcon}
                        />
                        <IconButton
                            Icon={ListIcon}
                        />
                    </div> 
                    <div>
                        <IconButton
                            Icon={SearchIcon}
                        />
                        <IconButton
                            Icon={SettingsIcon}
                        />
                    </div> 
                </div>
                <div className="Hydra_Sidebar_workarea">

                </div>
            </div>
        )
    }

}

export default SideBar;