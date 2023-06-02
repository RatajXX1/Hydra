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
import FilesSideBar from "../FilesSideBar/FilesSideBar";
import SettingsView from "../Settings/Settings";
import CalendarView from "../CalendarView/CalendarView";

class SideBar extends React.Component {
    Sidebar = React.createRef<any>()

    state = {
        ActiveItem: <FilesSideBar/>,
        resize: false,
        StartPos: 0,
        StartWidth: 0,
    }

    componentDidMount(): void {
        document.addEventListener("mousemove", this.onMouseMove.bind(this))
        document.addEventListener("mouseup", this.onMouseUP.bind(this))
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousemove", this.onMouseMove.bind(this))
        document.removeEventListener("mouseup", this.onMouseUP.bind(this))
    }

    public SetActiveItem(Item: JSX.Element) {
        if (this.state.ActiveItem == null) {
            this.setState({...this.state, ActiveItem: Item})
            return
        }
        if (this.state.ActiveItem.type != Item.type) {
            this.setState({...this.state, ActiveItem: Item})
        } else {
            this.setState({...this.state, ActiveItem: null})
        }
    }

    onMouseDown(event: React.MouseEvent) {
        if (event.button === 0)
        if (!this.state.resize && this.Sidebar.current) {
            this.state.resize = true
            this.state.StartPos = event.clientX
            this.state.StartWidth = this.Sidebar.current.clientWidth
        }
    }

    onMouseUP = (event: MouseEvent) => {
        if (event.button === 0)
        if (this.state.resize) {
            this.state.resize = false
            this.state.StartPos = 0
        }
    }

    onMouseMove = (event: MouseEvent) => {
        if (this.state.resize && this.Sidebar.current) {
            const pos = this.state.StartWidth + (event.clientX - this.state.StartPos)
            if (pos <= 196) {
                this.state.resize = false
                this.state.StartPos = 0
                return
            }
            this.Sidebar.current.style.width = `${pos}px`
        }
    }

    render(): React.ReactNode {
        return (
            <div ref={this.Sidebar} className="Hydra_Sidebar_main">
                <div className="Hydra_Sidebar_functions">
                    <div>
                        <IconButton
                            Icon={FilesIcon}
                            OnClick={() => {
                                this.SetActiveItem(<FilesSideBar/>)
                            }}
                        />
                        <IconButton
                            Icon={CalendarIcon}
                            OnClick={() => {
                                if (window.addIfTab !== undefined) {
                                    window.addIfTab("Kalendarz", <CalendarView/>)
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
                            OnClick={() => {
                                if (window.addIfTab !== undefined) {
                                    window.addIfTab("Ustawienia", <SettingsView/>)
                                }
                            }}
                        />
                    </div> 
                </div>
                {
                    this.state.ActiveItem != null && 
                    <div className="Hydra_Sidebar_workarea">
                    {
                        this.state.ActiveItem
                    }
                    </div>
                }
                {
                    this.state.ActiveItem != null && <div 
                        onMouseDown={this.onMouseDown.bind(this)}
                        className="Hydra_Sidebar_main_resize"
                    ></div>
                }

            </div>
        )
    }

}

export default SideBar;