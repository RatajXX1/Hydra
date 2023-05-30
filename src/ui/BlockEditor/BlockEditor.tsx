import React from "react";
import "./BlockEditor.scss"
import Blocks, { BlockTypes } from "./Blocks";
import {ReactComponent as DotsIcon} from "../../Images/move.svg";
import {ReactComponent as AddIcon} from "../../Images/add.svg";
import { IconButton } from "../Buttons/Buttons";

type ContentTypes = {
    Type: BlockTypes,
    Content: string,
    Ref?: React.RefObject<any>
}

class BlockEditor extends React.Component {
    WorkArea = React.createRef<any>()

    state = {
        Content: [
            {Type: "text", Content: "", Ref: React.createRef<any>()}
        ] as ContentTypes[],
        DraggedItem: -1
    }

    componentDidMount(): void {
        if (this.state.Content.length === 0) this.AddNewBlockAndActive()
    }

    public AddNewBlockAndActive() {
        this.state.Content.push({Type: "text", Content: "", Ref: React.createRef<any>()})
        this.forceUpdate()
    }

    private onKeyDown(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key === "Enter") {
            key.preventDefault()
            this.AddNewBlockAndActive()
        }
    }

    private StartDrag(Index: number) {
        if (this.state.Content[Index].Ref?.current) {
            this.state.DraggedItem = Index
            this.forceUpdate()
        }
    }

    private StopDrag() {
        this.state.DraggedItem = -1
        this.forceUpdate()
    }

    private handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        // setDraggedItem(id);
        // event.dataTransfer.setData('text/plain', event.currentTarget.id);
    };
    
    private handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.style.opacity = ".2"
    };

    private handleDragLeft = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.style.opacity = ""
    };

    private handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.currentTarget && !isNaN(parseInt(event.currentTarget.id.split("_")[1]))) {
            event.currentTarget.style.opacity = ""
            const where = parseInt(event.currentTarget.id.split("_")[1])
            if (where === this.state.DraggedItem) return
            const updatedContent = [...this.state.Content];
            const draggedItem = updatedContent.splice(this.state.DraggedItem, 1)[0];
            updatedContent.splice(where, 0, draggedItem)
            this.state.Content = updatedContent
            this.state.DraggedItem = -1
            this.forceUpdate()
        }
    };

    render(): React.ReactNode {
        return (
            <div className="Hydra_BlockEdtior_main">
                <div 
                    className="Hydra_BlockEdtior_workarea"
                    onKeyDown={this.onKeyDown.bind(this)}
                    onMouseUp={this.StopDrag.bind(this)}
                    ref={this.WorkArea}
                >
                    {
                        (
                            () => {
                                const tab: React.ReactNode[] = []
                                
                                this.state.Content.forEach(
                                    (e, index) => {
                                        tab.push(
                                            <div 
                                                draggable={index === this.state.DraggedItem} 
                                                onDragStart={this.handleDragStart.bind(this)}
                                                onDragOver={this.handleDragOver.bind(this)}
                                                onDragLeave={this.handleDragLeft.bind(this)}
                                                onDragEnd={this.StopDrag.bind(this)}
                                                onDrop={this.handleDrop.bind(this)}
                                                className="Hydra_BlockEdtior_workarea_block"
                                                id={"Block_" + index.toString()}
                                                key={index}
                                            >
                                                <div className="Hydra_BlockEdtior_workarea_block_options">
                                                    <IconButton Icon={AddIcon} OnClick={this.AddNewBlockAndActive.bind(this)}/>
                                                    <IconButton 
                                                        Icon={DotsIcon} 
                                                        onMouseDown={this.StartDrag.bind(this, index)}
                                                    />
                                                </div>
                                                <Blocks 
                                                    type={e.Type}
                                                    ref={e.Ref}
                                                    content={e.Content}
                                                    onUpdate={(text) => {
                                                        this.state.Content[index].Content = text
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                )

                                return tab
                            }
                        )()
                    }
                </div>
            </div>
        )
    }

}

export default BlockEditor