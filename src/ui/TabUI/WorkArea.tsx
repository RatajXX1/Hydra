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

class TabSystem extends React.Component {
    state = {
        tabs: [] as Tab[],
        ActiveTab: 0,
        
    };

    componentDidMount(): void {
        if (typeof window !== "undefined") {
            window.addTab = (Name: string, Element: JSX.Element) => {
                const tab = {
                    Name: Name,
                    Ref: React.createRef()
                } as Tab
                tab.El =(
                    <Element.type 
                        {...Element.props}
                        ref={tab.Ref} 
                        key={this.state.tabs.length}
                    />)
                this.state.tabs.push(tab as Tab)
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

    private SaveState(Index: number) {
        if (this.state.tabs[Index].Ref.current) {
            if (this.state.tabs[Index].Ref.current.state !== undefined) this.state.tabs[Index].State = this.state.tabs[Index].Ref.current.state
        }
    }

    private LoadState(Index: number) {
        if (this.state.tabs[Index].Ref.current) {
            if (
                this.state.tabs[Index].Ref.current.state !== undefined &&
                this.state.tabs[Index].Ref.current.setState !== undefined
            ) this.state.tabs[Index].Ref.current.setState(this.state.tabs[Index].State)
        }
    }

    public AddTab(tabElement: Tab) {
        this.state.tabs.push(tabElement)
        this.forceUpdate()
    }

    public SetActiveTab(Index: number) {
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
                        (this.state.tabs.length > 0 && this.state.tabs[this.state.ActiveTab].El !== undefined) && this.state.tabs[this.state.ActiveTab].El
                    }
                </div>
            </div>
        )
    }

}

export default TabSystem;