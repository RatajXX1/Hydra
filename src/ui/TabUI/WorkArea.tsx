import React from "react";
import "./WorkArea.scss";
import {ReactComponent as CloseIcon} from "../../Images/close.svg";
import { IconButton } from "../Buttons/Buttons";
import { RichEditor } from "../RichEditor/Richeditor";
import { Typography } from "../Text/Text";
import ScrollArea from "../ScrollArea/Scrollarea";

declare global {
    interface Window {
        addTab: (Name: string, Element: JSX.Element) => void;
        addIfTab: (Name: string, Element: JSX.Element) => void;
    }
}

type Tab = {
    Name: string,
    El: JSX.Element,
    Ref: React.RefObject<any>,
    State: Object
}

type TabList = {
    [key: string]: Tab
}

class TabSystem extends React.Component {
    ScrollTab = React.createRef<any>()
    state = {
        tabs: {} as TabList,
        ActiveTab: "" as string,
    };

    componentDidMount(): void {
        if (typeof window !== "undefined") {
            window.addTab = (Name: string, Element: JSX.Element) => {
                const tab = {
                    Name: Name,
                    Ref: React.createRef()
                } as Tab
                const id = this.GenerateID(Name.replaceAll(" ", "_"))
                tab.El =(
                    <Element.type 
                        {...Element.props}
                        ref={tab.Ref} 
                        key={id}
                    />
                )
                this.state.tabs[id] = tab as Tab   
                this.ForceSetActiveTab(id)
            }
            window.addIfTab = (Name: string, Element: JSX.Element) => {
                let i = ""
                Object.entries(this.state.tabs).forEach(
                    (item) => {
                        if (item[1].El.type == Element.type) i = item[0]
                    }
                )
                if (i !== "") this.ForceSetActiveTab(i)
                else window.addTab(Name, Element)
            }
        }
    }

    tabItem = (name: string, active: boolean, Index: string) => (
        <div key={Index} id={Index} className={"Hydra_Tabs_tabs_item " + (active ? "Hydra_Tabs_tabs_item_active" : "Hydra_Tabs_tabs_item_inactive")}>
            <a onClick={() => this.SetActiveTab(Index)}>{name}</a>
            <div></div>
            <IconButton
                style={{
                    zIndex: 2
                }}
                Icon={CloseIcon}
                OnClick={() => this.CloseTab(Index)}
            />
        </div>
    )

    GenerateID(name: string): string {
        const counts = [] as number[]
        let num = 0
        Object.keys(this.state.tabs).forEach(
            e => {
                const d = e.split("_")
                counts.push(parseInt(d[d.length - 1]))
            }
        )
        while(counts.includes(num)) num += 1
        return name + "_"  + num.toString()
    } 

    private SaveState(Index: string) {
        if (this.state.tabs[Index] !== undefined && this.state.tabs[Index].Ref.current) {
            if (this.state.tabs[Index].Ref.current.state !== undefined) this.state.tabs[Index].State = this.state.tabs[Index].Ref.current.state
        }
    }

    private LoadState(Index: string) {
        if (this.state.tabs[Index] !== undefined && this.state.tabs[Index].Ref.current) {
            if (
                this.state.tabs[Index].Ref.current.state !== undefined &&
                this.state.tabs[Index].Ref.current.setState !== undefined
            ) this.state.tabs[Index].Ref.current.setState(this.state.tabs[Index].State)
        }
    }

    public SetActiveTab(Index: string) {
        if (this.state.ActiveTab !== Index) {
            this.SaveState(this.state.ActiveTab)
            this.setState(
                {...this.state, ActiveTab: Index}, 
                () => {
                    this.LoadState(Index)
                    if (this.ScrollTab.current) this.ScrollTab.current.ScrollTo(Index)
                }
            )
        }
    }
    
    ForceSetActiveTab(Index: string) {
        this.SaveState(this.state.ActiveTab)
        this.setState(
            {...this.state, ActiveTab: Index}, 
            () => {
                this.LoadState(Index)
                if (this.ScrollTab.current) this.ScrollTab.current.ScrollTo(Index)
            }
        )
    }

    public CloseTab(Index: string) {
        if (this.state.tabs[Index] === undefined) return
        const keys = Object.keys(this.state.tabs)
        delete this.state.tabs[Index]
        const length = Object.entries(this.state.tabs).length
        if (this.state.ActiveTab === Index && length > 0) {
            if (keys[keys.indexOf(this.state.ActiveTab) + 1] !== undefined) {
                this.SetActiveTab(keys[keys.indexOf(this.state.ActiveTab) + 1])
            } else if (keys[keys.indexOf(this.state.ActiveTab) - 1] !== undefined)  {
                this.SetActiveTab(keys[keys.indexOf(this.state.ActiveTab) - 1])
            }
        } else {
            this.forceUpdate()
        }
    }

    render(): React.ReactNode {
        if ((Object.entries(this.state.tabs).length === 0 || (this.state.tabs[this.state.ActiveTab] === undefined || this.state.tabs[this.state.ActiveTab].El === undefined))) 
            console.log(this.state)
        return (
            <div className="Hydra_Tabs_main">
                <div className="Hydra_Tabs_tabs">
                    <ScrollArea ref={this.ScrollTab} BlockY>
                        <div className="Hydra_Tabs_tabs_main">
                            {
                                (() => {
                                    const tab: JSX.Element[] = []
                                    Object.entries(this.state.tabs).forEach(
                                        (item) => {
                                            tab.push(this.tabItem(item[1].Name, this.state.ActiveTab === item[0], item[0]))
                                        }
                                    )
                                    return tab
                                })()
                            }
                        </div>                        
                    </ScrollArea>
                </div>
                <div className="Hydra_Tabs_workarea">
                    {
                        (Object.entries(this.state.tabs).length > 0 && this.state.tabs[this.state.ActiveTab] !== undefined && this.state.tabs[this.state.ActiveTab].El !== undefined) && this.state.tabs[this.state.ActiveTab].El
                    }
                    {/* {
                        (Object.entries(this.state.tabs).length === 0 || (this.state.tabs[this.state.ActiveTab] === undefined || this.state.tabs[this.state.ActiveTab].El === undefined)) && JSON.stringify(this.state)
                    } */}
                </div>
            </div>
        )
    }

}

export default TabSystem;