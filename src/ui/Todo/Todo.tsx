import React from "react";
import "./Todo.scss";
import ScrollArea from "../ScrollArea/Scrollarea";
import { IconButton } from "../Buttons/Buttons";
import {ReactComponent as EditIcon} from "../../Images/pen.svg";
import { InputCheckBox } from "../Inputs/Inputs";

class TodoView extends React.Component {

    state = {
        title: "Rzeczy do zrobienie"
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_TodoView_main">
                <div className="Hydra_TodoView_header">
                    <h1>
                        {
                            this.state.title
                        }
                        <IconButton
                            Icon={EditIcon}
                            OnClick={() => {
                                this.setState({...this.state, titleModal: true})
                            }}
                        />
                    </h1>
                </div>
                <div className="Hydra_TodoView_area">
                    <ScrollArea>
                        <div className="Hydra_TodoView_workarea">
                            {
                                (
                                    () => {
                                        const tab: React.ReactNode[] = []
                                        for(let i = 0; i < 10; i++)
                                            tab.push(
                                                <div className="Hydra_TodoView_workarea_item">
                                                    <div className="Hydra_TodoView_workarea_item_checkbox">
                                                        <InputCheckBox/>
                                                    </div>
                                                    <div className="Hydra_TodoView_workarea_item_text">
                                                        <a>In pharetra laoreet velit vel tincidunt. Vestibulum ultricies imperdiet purus, ut imperdiet ante porttitor nec.</a>
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

export default TodoView;