import React from "react";
import ScrollArea from "../ScrollArea/Scrollarea";
import "./ProjectView.scss";
import {ReactComponent as EditIcon} from "../../Images/pen.svg";
import {ReactComponent as AddIcon} from "../../Images/add.svg";
import { Button, IconButton } from "../Buttons/Buttons";
import Modal from "../Modal/Modal";
import { InputText, InputTextArea } from "../Inputs/Inputs";

type ProjectViewProps = {
    FilePath: string,
    BlockEdit?: boolean
}

type ColumnItem = {
    title: string,
    desc: string
}

type Column = {
    StageName: string,
    Content: ColumnItem[]
}

type Columns = Column[]


class ProjectView extends React.Component<ProjectViewProps> {

    preState = {
        title: "",
        stageName: "",
        desc: ""
    }

    state = {
        title: "Untitled",
        titleModal: false,
        addModal: false,
        itemModal: false,
        selectedColumn: -1,
        content: [] as Columns
    };

    private AddNewItem(title: string, desc:string) {
        if (this.state.content[this.state.selectedColumn] !== undefined) {
            this.state.content[this.state.selectedColumn]
                .Content.push({title: title, desc: desc})
            this.forceUpdate()
        }
    }

    private AddNewStage(StageName: string) {
        this.state.content.push({
            StageName: StageName,
            Content: []
        } as Column)
        this.forceUpdate()
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_ProjectView_main">
                <div className="Hydra_ProjectView_header">
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
                <div className="Hydra_ProjectView_work">
                    <ScrollArea>
                        <div className="Hydra_ProjectView_columns">
                            {
                                this.state.content.map(
                                    (e,i) => {
                                    return (
                                        <div className="Hydra_ProjectView_column">
                                            <a>
                                                {
                                                    e.StageName
                                                }
                                                <IconButton
                                                    Icon={AddIcon}
                                                />
                                            </a>
                                            {
                                                e.Content.map(
                                                    d => {
                                                        return (
                                                            <div>
                                                                <span>{d.title}</span>
                                                                <IconButton
                                                                    Icon={EditIcon}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                )
                                            }                        
                                            <div 
                                                className="Hydra_ProjectView_column_item_add"
                                                onClick={() => {
                                                    this.setState({...this.state, itemModal: true, selectedColumn: i})
                                                }}
                                            >
                                                <AddIcon/>
                                            </div>
                                        </div>
                                    )}
                                )
                            }
                            <div className="Hydra_ProjectView_column">
                                <div 
                                    style={{height: "100%", flexShrink: "0"}}
                                    className="Hydra_ProjectView_column_item_add"
                                    onClick={() => {
                                        this.setState({...this.state, addModal: true})
                                    }}
                                >
                                    <AddIcon/>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
                <Modal
                    isOpen={this.state.titleModal}
                    OnClose={() => {
                        this.setState({...this.state, titleModal: false})
                    }}
                >
                    <InputText
                        type="text"
                        placeholder="Nazwa projektu"
                        defaultValue={this.state.title}
                        OnChangeValue={e => {
                            this.preState.title = e.target.value
                        }}
                    />
                    <div
                        style={{
                            height: "30px"
                        }}
                    >
                        <Button
                            text="Zapisz"
                            variant="filled"
                            style={{
                                float: "right"
                            }}
                            OnClick={() => {
                                this.setState({
                                    ...this.state, 
                                    titleModal: false,
                                    title: this.preState.title != this.state.title ? this.preState.title : this.state.title
                                })
                            }}
                        />
                        <Button
                            text="Anuluj"
                            style={{
                                float: "right"
                            }}
                            OnClick={() => {
                                this.setState({...this.state, titleModal: false})
                            }}
                        />
                    </div>
                </Modal>
                <Modal
                    isOpen={this.state.addModal}
                    OnClose={() => {
                        this.setState({...this.state, addModal: false})
                    }}
                >
                    <InputText
                        type="text"
                        placeholder="Nazwa etapu"
                        OnChangeValue={e => {
                            this.preState.stageName = e.target.value
                        }}
                    />
                    <div
                        style={{
                            height: "30px"
                        }}
                    >
                        <Button
                            text="Zapisz"
                            variant="filled"
                            style={{
                                float: "right"
                            }}
                            OnClick={() => {
                                this.setState({
                                    ...this.state, 
                                    addModal: false,
                                })
                                this.AddNewStage(this.preState.stageName)
                            }}
                        />
                        <Button
                            text="Anuluj"
                            style={{
                                float: "right"
                            }}
                            OnClick={() => {
                                this.setState({...this.state, addModal: false})
                            }}
                        />
                    </div>
                </Modal>
                <Modal
                    isOpen={this.state.itemModal}
                    OnClose={() => {
                        this.setState({...this.state, itemModal: false})
                    }}
                >
                    <InputText
                        type="text"
                        placeholder="Nazwa"
                        OnChangeValue={e => {
                            this.preState.stageName = e.target.value
                        }}
                    />
                    <InputTextArea
                        placeholder="Opis"
                        style={{
                            height: "200px"
                        }}
                        OnChangeValue={(e) => {
                            this.preState.desc = e.target.value
                        }}
                    />
                    <div
                        style={{
                            height: "30px"
                        }}
                    >
                        <Button
                            text="Zapisz"
                            variant="filled"
                            style={{
                                float: "right"
                            }}
                            OnClick={() => {
                                this.setState({
                                    ...this.state, 
                                    itemModal: false,
                                })
                                this.AddNewItem(this.preState.stageName, this.preState.desc)
                            }}
                        />
                        <Button
                            text="Anuluj"
                            style={{
                                float: "right"
                            }}
                            OnClick={() => {
                                this.setState({...this.state, itemModal: false})
                            }}
                        />
                    </div>
                </Modal>
            </div>
        )
    }

}

export default ProjectView;