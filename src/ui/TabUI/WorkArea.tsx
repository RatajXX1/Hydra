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
    El: JSX.Element
}

class TabSystem extends React.Component {
    state = {
        tabs: [] as Tab[],
        ActiveTab: 0
    };

    componentDidMount(): void {
        if (typeof window !== "undefined") {
            window.addTab = (Name: string, Element: JSX.Element) => {
                this.state.tabs.push({Name: Name, El: <Element.type {...Element.props} key={this.state.tabs.length}/>})
                this.forceUpdate()
            }
        }
    }

    tabItem = (name: string, active: boolean, Index: number) => (
        <div onClick={() => this.SetActiveTab(Index)} className={"Hydra_Tabs_tabs_item " + (active ? "Hydra_Tabs_tabs_item_active" : "Hydra_Tabs_tabs_item_inactive")}>
            <a>{name}</a>
            <div></div>
            <IconButton
                Icon={CloseIcon}
                // OnClick={() => this.SetActiveTab(Index)}
            />
        </div>
    )

    public AddTab(tabElement: Tab) {
        this.state.tabs.push(tabElement)
        this.forceUpdate()
    }

    public SetActiveTab(Index: number) {
        if (this.state.ActiveTab !== Index) {
            this.state.ActiveTab = Index
            this.forceUpdate()
        }
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_Tabs_main">
                <div className="Hydra_Tabs_tabs">
                    {
                        (() => {
                            const tab: JSX.Element[] = []
                            this.state.tabs.forEach(
                                (item, index) => {
                                    tab.push(this.tabItem(item.Name, this.state.ActiveTab === index, index))
                                }
                            )
                            return tab
                        })()
                    }
                </div>
                <div className="Hydra_Tabs_workarea">
                    {
                        (
                            () => {
                                for(let i = 0; i < this.state.tabs.length; i++) 
                                    if (this.state.ActiveTab === i) {
                                        // console.log("CHANGED EL!", this.state.tabs[i].El.key )
                                        return this.state.tabs[i].El
                                    }

                                // if (this.state.tabs.length === 0) return (
                                //     <div>
                                //         <Typography></Typography>
                                //     </div>
                                // )
                            }
                        )()
                    }
                </div>
            </div>
        )
    }

}

export default TabSystem;