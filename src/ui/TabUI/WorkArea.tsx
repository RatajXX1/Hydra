import React from "react";
import "./WorkArea.scss";
import {ReactComponent as CloseIcon} from "../../Images/close.svg";
import { IconButton } from "../Buttons/Buttons";
import { RichEditor } from "../RichEditor/Richeditor";
import { Typography } from "../Text/Text";

declare global {
    interface Window {
        addTab: (Name: string, Element: JSX.Element) => void;
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
        }
    }

    tabItem = (name: string, active: boolean, Index: string) => (
        <div onClick={() => this.SetActiveTab(Index)} className={"Hydra_Tabs_tabs_item " + (active ? "Hydra_Tabs_tabs_item_active" : "Hydra_Tabs_tabs_item_inactive")}>
            <a>{name}</a>
            <div></div>
            <IconButton
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
            }
        )
    }

    public CloseTab(Index: string) {
        if (this.state.tabs[Index] === undefined) return
        delete this.state.tabs[Index]
        console.log("Zamykanie", Index)
        const length = Object.entries(this.state.tabs).length
        if (this.state.ActiveTab === Index && length > 0) {
            const keys = Object.keys(this.state.tabs)
            if (keys[keys.indexOf(this.state.ActiveTab) + 1] !== undefined) {
                this.SetActiveTab(keys[keys.indexOf(this.state.ActiveTab) + 1])
            } else if (keys[keys.indexOf(this.state.ActiveTab) - 1] !== undefined)  {
                this.SetActiveTab(keys[keys.indexOf(this.state.ActiveTab) - 1])
            }
        } else if (length !== 0) {
            const keys = Object.keys(this.state.tabs)
            this.state.ActiveTab = keys[0]
            this.ForceSetActiveTab(keys[1])
            console.log("otw", keys[1])
            this.forceUpdate()
            // console.log(this.state.tabs[this.state.ActiveTab] )
            // if (this.state.tabs[actual] === undefined) {
                
            // } else this.ForceSetActiveTab(actual)
            // console.log(Index, this.state)
            // this.ForceSetActiveTab(this.state.ActiveTab)
            // console.log(Index, this.state, this.state.tabs[this.state.ActiveTab], this.state.ActiveTab === Index)
            // console.log(Object.entries(this.state.tabs).length > 0 , this.state.tabs[this.state.ActiveTab] !== undefined , this.state.tabs[this.state.ActiveTab].El !== undefined)
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