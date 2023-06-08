import React from "react";
import "./BlockEditor.scss"
import Blocks from "./Blocks";
import {ReactComponent as DotsIcon} from "../../Images/move.svg";
import {ReactComponent as AddIcon} from "../../Images/add.svg";
import { IconButton } from "../Buttons/Buttons";
import ScrollArea from "../ScrollArea/Scrollarea";

const Commands = [
    "Text",
    "Quote",
    "Tags",
    "Gallery",
    "Image",
    "file",
    "checkbox",
    "list",
    "Title",
]

type ContentTypes = {
    Type: typeof Commands[number],
    Content: string,
    Ref?: React.RefObject<any>
}

type EdtorProps = {
    FilePath: string,
    BlockEdit?: boolean
}

class CommandPropmpt extends React.Component {
    ScrollAlrea = React.createRef<any>()

    state = {
        Command: "",
        Selected: 0,
        Arr: [] as string[]
    }

    public SetCommand(command: string) {
        this.setState({
            Selected: 0,
            Command: command.replaceAll("/", ""),
            Arr: this.SortCommnad(Commands, this.state.Command)
        })
    }
    
    SortCommnad(arr: string[], commnad: string) {
        function compareBySimilarity(a: string, b: string): number {
            function calculateSimilarity(str: string, target: string): number {
                let count = 0;
                for (let i = 0; i < str.length; i++) {
                    if (
                        str[i] !== undefined &&
                        target[i] !== undefined &&
                        str[i].toLowerCase() === target[i].toLowerCase()
                        ) {
                        count++;
                    }
                }
                return count;
            }
            
            const similarityA = calculateSimilarity(a, commnad);
            const similarityB = calculateSimilarity(b, commnad);
            
            if (similarityA < similarityB) {
                return -1;
            } else if (similarityA > similarityB) {
                return 1;
            } else {
                return 0;
            }
        }

        return arr.sort(compareBySimilarity).reverse()
    }

    public ArrowToNext(Up:boolean) {
        if (Up && this.state.Selected - 1 < 0) return
        else if (!Up && this.state.Selected + 1 > Commands.length - 1) return
        this.setState(
            {...this.state, Selected: (Up ? this.state.Selected - 1 : this.state.Selected + 1)},
            () => {
                if (this.ScrollAlrea.current) this.ScrollAlrea.current.ScrollTo("Hydra_BlockEdtior_commnad_workarea_item_" + this.state.Arr[this.state.Selected])
            }
        )
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_BlockEdtior_commnad_work">
                <ScrollArea ref={this.ScrollAlrea}>
                    <div className="Hydra_BlockEdtior_commnad_workarea">
                        {
                            (this.state.Command !== undefined) &&
                                this.state.Arr.map(
                                    (e, index) => <div id={"Hydra_BlockEdtior_commnad_workarea_item_" + e} className={"Hydra_BlockEdtior_commnad_workarea_item" + (this.state.Selected === index ? " Hydra_BlockEdtior_commnad_workarea_item_selected" : "")}>
                                            <a>
                                                {
                                                    e
                                                }
                                            </a>
                                        </div>
                                )
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
            {Type: "Text", Content: "", Ref: React.createRef<any>()}
        ] as ContentTypes[],
        DraggedItem: -1,
        Command: ""
    }

    componentDidMount(): void {
        if (this.state.Content.length === 0) this.AddNewBlockAndActive()
    }

    public AddNewBlockAndActive() {
        this.state.Content.push({Type: "Text", Content:  "", Ref: React.createRef<any>()})
        this.forceUpdate()
    }

    private onInput() {
        const selection = window.getSelection()
        if (selection && this.state.Command.length > 0 && this.CommnadBox.current) {
            const range = selection.getRangeAt(0)
            const pos = range.getClientRects()
            if (pos[0]) {
                this.CommnadBox.current.style.top = `${(pos[0].top - 20).toString()}px`
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

    private RemoveCommand(IndexItem: number) {
        const seletion = window.getSelection()
        if (seletion) {
            const range = seletion.getRangeAt(0)
            const el = range.commonAncestorContainer
            let textContent = el.textContent!.slice(0, range.startOffset)
            textContent = textContent.slice(0 , textContent.length - this.state.Command.length) + el.textContent!.slice(range.endOffset, el.textContent!.length)
            this.state.Content[IndexItem].Content = textContent
        }
    }

    private GetCurrentBlockIndex():number {
        const selection = window.getSelection()
        if (selection) {
            const range = selection.getRangeAt(0)
            let el = range.commonAncestorContainer as HTMLElement
            while (el.id == undefined || !el.id.startsWith("Block_")) {
                if (el.parentElement == undefined) break
                el = el.parentElement
            }
            if (
                el.id != undefined ||
                (el.id as string).startsWith("Block_")
                ) 
                return parseInt(el.id.split("_")[1])
            else return -1
        }
        return -1
    }

    private onKeyDown(key: React.KeyboardEvent<HTMLDivElement>) {
        const styles = getComputedStyle(this.CommnadBox.current)
        if (key.key === "Enter") {
            key.preventDefault()
            if (this.state.Command !== "" && styles.display !== "none") {
                const index = this.GetCurrentBlockIndex()
                if (index >= 0 && this.Commnads.current) {
                    if (this.state.Content[index].Type !== Commands[this.Commnads.current.state.Selected]) {
                        this.RemoveCommand(index)
                        this.state.Content[index].Type = Commands[this.Commnads.current.state.Selected]
                        if (styles.display !== "none") this.CommnadBox.current.style.display = ""
                        if (this.state.Command !== "") this.state.Command = ""
                        this.forceUpdate()                        
                    }
                }
            } else {
                if (styles.display !== "none") this.CommnadBox.current.style.display = ""
                if (this.state.Command !== "") this.state.Command = ""
                this.AddNewBlockAndActive()                
            }
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
                if (styles.display === "none") this.CommnadBox.current.style.display = "block"
                this.state.Command = "/"
            }
        } else if (key.key === " ") {
            if (styles.display !== "none") this.CommnadBox.current.style.display = ""
            if (this.state.Command !== "") {
                this.state.Command = ""
                // this.forceUpdate()
            }
        } else if (key.key === "ArrowUp") {
            if (this.state.Command !== "" && styles.display !== "none") {
                if (this.Commnads.current) this.Commnads.current.ArrowToNext(true)
                key.preventDefault()
            }
        } else if (key.key === "ArrowDown") {
            if (this.state.Command !== "" && styles.display !== "none") {
                if (this.Commnads.current) this.Commnads.current.ArrowToNext(false)
                key.preventDefault()
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

export {
    Commands
}
export default BlockEditor