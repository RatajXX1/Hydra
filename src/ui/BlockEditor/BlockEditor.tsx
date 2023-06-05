import React from "react";
import "./BlockEditor.scss"
import Blocks, { BlockTypes } from "./Blocks";
import {ReactComponent as DotsIcon} from "../../Images/move.svg";
import {ReactComponent as AddIcon} from "../../Images/add.svg";
import { IconButton } from "../Buttons/Buttons";
import ScrollArea from "../ScrollArea/Scrollarea";

type ContentTypes = {
    Type: BlockTypes,
    Content: string,
    Ref?: React.RefObject<any>
}

type EdtorProps = {
    FilePath: string,
    BlockEdit?: boolean
}

const Commands = [
    "Text",
    "Quote",
    "Tags",
    "Gallery",
    "Image",
    "file",
]

class CommandPropmpt extends React.Component {

    state = {
        Command: ""
    }


    public SetCommand(command: string) {
        this.setState({...this.state, Command: command})
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_BlockEdtior_commnad_work">
                <ScrollArea>
                    <div className="Hydra_BlockEdtior_commnad_workarea">
                        {
                            (
                                () => {
                                    const tab: React.ReactNode[] = []
                                    if (this.state.Command !== undefined && this.state.Command.length > 0)  
                                        Commands.forEach(
                                            e => {
                                                tab.push(
                                                    <div className="Hydra_BlockEdtior_commnad_workarea_item">
                                                        <a>
                                                            {
                                                                e
                                                            }
                                                        </a>
                                                    </div>
                                                )
                                            }
                                        )
                                        
                                    return tab
                                }
                            )()
                        }                             
                    </div>
                </ScrollArea>
            </div>
        )
    }

}

class BlockEditor extends React.Component<EdtorProps> {
    WorkArea = React.createRef<any>()
    CommnadBox = React.createRef<any>()
    Commnads = React.createRef<any>()

    state = {
        Content: [
            {Type: "text", Content: "", Ref: React.createRef<any>()}
        ] as ContentTypes[],
        DraggedItem: -1,
        Command: ""
    }

    componentDidMount(): void {
        if (this.state.Content.length === 0) this.AddNewBlockAndActive()
    }

    public AddNewBlockAndActive() {
        this.state.Content.push({Type: "text", Content: "", Ref: React.createRef<any>()})
        this.forceUpdate()
    }

    private onInput() {
        const selection = window.getSelection()
        if (selection && this.state.Command.length > 0 && this.CommnadBox.current) {
            const range = selection.getRangeAt(0)
            const pos = range.getClientRects()
            if (pos[0]) {
                this.CommnadBox.current.style.top = `${pos[0].top.toString()}px`
                this.CommnadBox.current.style.left = `${(pos[0].left - 400).toString()}px`   
                const word = this.GetTextBefore().split("/")
                this.state.Command = `/${word[word.length - 1]}`  
                if (this.Commnads.current) this.Commnads.current.SetCommand(this.state.Command)
                // this.forceUpdate()
                // console.log(range.commonAncestorContainer)
            }
        }
    }

    private GetTextBefore(): string {
        const seletion = window.getSelection()
        if (seletion) {
            const range = seletion.getRangeAt(0)
            const el = range.commonAncestorContainer
            return el.textContent!.slice(0, range.startOffset)
        }
        return ""
    }

    private onKeyDown(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key === "Enter") {
            const styles = getComputedStyle(this.CommnadBox.current)
            if (styles.display !== "none") this.CommnadBox.current.style.display = ""
            if (this.state.Command !== "") this.state.Command = ""
            key.preventDefault()
            this.AddNewBlockAndActive()
        } else if (key.key === "Backspace") {
            const styles = getComputedStyle(this.CommnadBox.current)
            const lasttext = this.GetTextBefore()
            const Words = this.GetTextBefore().split(" ")
            if (lasttext[lasttext.length - 1] === " " || lasttext[lasttext.length - 1] === "/") {
                if (styles.display !== "none") {
                    this.CommnadBox.current.style.display = ""
                    this.state.Command = ""
                }
            } else if (Words[Words.length - 1].includes("/")) {
                this.state.Command = Words[Words.length - 1].slice(Words[Words.length - 1].indexOf("/"))
                if (styles.display == "none") this.CommnadBox.current.style.display = "block"
            } else {
                if (styles.display !== "none") {
                    this.CommnadBox.current.style.display = ""
                    this.state.Command = ""
                }
            }
        } else if (key.key === "/") {
            if (this.CommnadBox.current) {
                const styles = getComputedStyle(this.CommnadBox.current)
                if (styles.display === "none") this.CommnadBox.current.style.display = "block"
                this.state.Command = "/"
            }
        } else if (key.key === " ") {
            const styles = getComputedStyle(this.CommnadBox.current)
            if (styles.display !== "none") this.CommnadBox.current.style.display = ""
            if (this.state.Command !== "") {
                this.state.Command = ""
                // this.forceUpdate()
            }
        }
    }

    private onKeyUp(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key === "Backspace") {
            const styles = getComputedStyle(this.CommnadBox.current)
            if (this.GetTextBefore().length === 0) {
                this.state.Command = ""
                if (this.state.Command.length === 0 && styles.display !== "none") this.CommnadBox.current.style.display = ""
            }
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
                <ScrollArea>
                    <div 
                        className="Hydra_BlockEdtior_workarea"
                        onKeyDown={this.onKeyDown.bind(this)}
                        onMouseUp={this.StopDrag.bind(this)}
                        ref={this.WorkArea}
                    >
                        <div ref={this.CommnadBox} className="Hydra_BlockEdtior_commnad_main">
                            <CommandPropmpt ref={this.Commnads}/>
                        </div>

                        {
                            (
                                () => {
                                    const tab: React.ReactNode[] = []
                                    
                                    this.state.Content.forEach(
                                        (e, index) => {
                                            tab.push(
                                                <div 
                                                    draggable={index === this.state.DraggedItem} 
                                                    onDragOver={this.handleDragOver.bind(this)}
                                                    onDragLeave={this.handleDragLeft.bind(this)}
                                                    onDragEnd={this.StopDrag.bind(this)}
                                                    onDrop={this.handleDrop.bind(this)}
                                                    onInput={this.onInput.bind(this)}
                                                    onKeyUp={this.onKeyUp.bind(this)}
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
                </ScrollArea>

            </div>
        )
    }

}

export default BlockEditor