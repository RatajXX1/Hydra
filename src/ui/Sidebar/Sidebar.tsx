import React from "react";
import "./Sidebar.scss";
import { IconButton } from "../Buttons/Buttons";
import {ReactComponent as FilesIcon} from "../../Images/files.svg";
import {ReactComponent as CalendarIcon} from "../../Images/calendar.svg";
import {ReactComponent as ProjectsIcon} from "../../Images/projects.svg";
import {ReactComponent as ListIcon} from "../../Images/list.svg";
import {ReactComponent as SettingsIcon} from "../../Images/settings.svg";
import {ReactComponent as SearchIcon} from "../../Images/search.svg";
import FilesSideBar from "../FilesSideBar/FilesSideBar";
import SettingsView from "../Settings/Settings";
import CalendarView from "../CalendarView/CalendarView";
import Modal from "../Modal/Modal";
import { InputText } from "../Inputs/Inputs";
import ScrollArea from "../ScrollArea/Scrollarea";
import TodoView from "../Todo/Todo";

class SideBar extends React.Component {
    Sidebar = React.createRef<any>()

    state = {
        ActiveItem: "notes" as "notes" | "projects" | null,
        resize: false,
        StartPos: 0,
        StartWidth: 0,
        SearchOpen: false,
        Query: ""
    }

    componentDidMount(): void {
        document.addEventListener("mousemove", this.onMouseMove.bind(this))
        document.addEventListener("mouseup", this.onMouseUP.bind(this))
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousemove", this.onMouseMove.bind(this))
        document.removeEventListener("mouseup", this.onMouseUP.bind(this))
    }

    public SetActiveItem(Item: string) {
        if (this.state.ActiveItem == null) {
            this.setState({...this.state, ActiveItem: Item})
            return
        }
        if (this.state.ActiveItem != Item) {
            this.setState({...this.state, ActiveItem: Item})
        } else {
            this.setState({...this.state, ActiveItem: null})
            if (this.Sidebar.current) this.Sidebar.current.style.width = ""
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
                                this.SetActiveItem("notes")
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
                            OnClick={() => {
                                if (window.addIfTab !== undefined) {
                                    this.SetActiveItem("projects")
                                }
                            }}
                        />
                        <IconButton
                            Icon={ListIcon}
                            OnClick={() => {
                                if (window.addIfTab !== undefined) {
                                    window.addIfTab("Todo", <TodoView/>)
                                }
                            }}
                        />.
                    </div> 
                    <div>
                        <IconButton
                            Icon={SearchIcon}
                            OnClick={() => {
                                this.state.SearchOpen = true
                                this.forceUpdate()
                            }}
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
                        <FilesSideBar Title={(this.state.ActiveItem && this.state.ActiveItem == "projects") ? "Projekty" : "Notatki"} MainPath="/Users/michalratajewski/Desktop/testFolder" Mode={this.state.ActiveItem ? this.state.ActiveItem: "projects"}/>
                    }
                    </div>
                }
                {
                    this.state.ActiveItem != null && <div 
                        onMouseDown={this.onMouseDown.bind(this)}
                        className="Hydra_Sidebar_main_resize"
                    ></div>
                }
                <Modal
                    isOpen={this.state.SearchOpen}
                    OnClose={() => {
                        this.state.SearchOpen = false
                        this.state.Query = ""
                        this.forceUpdate()
                    }}
                >
                    <InputText
                        type="text"
                        placeholder="Szukaj"
                        Icon={SearchIcon}
                        OnChangeValue={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                this.state.Query = e.target.value
                                this.forceUpdate()
                            }
                        }
                    />
                    {
                        this.state.Query.length > 0 &&
                        <div className="Hydra_Sidebar_search_results">
                            <ScrollArea>
                                <div className="Hydra_Sidebar_search_results_view">
                                    {
                                        (
                                            () => {
                                                const tab: React.ReactNode[] = []
                                                for(let i = 1; i <= 15; i++)
                                                    tab.push(
                                                        <div style={{backgroundColor: i%2 == 0 ? "#F5F5F5" : ""}} className="Hydra_Sidebar_search_results_view_item">
                                                            <FilesIcon/>
                                                            <a>Notatka #{i.toString()}</a>
                                                        </div>
                                                    )
                                                return tab
                                            }
                                        )()
                                    }
                                </div>
                            </ScrollArea>
                        </div>
                    }
                </Modal>
            </div>
        )
    }

}

export default SideBar;