import React from "react";
import { Commands } from "./BlockEditor";
import { CaretInParagraph } from "../../Lib/Selection";

type ContentObject = {
    text?: string,
    var?:number
}

type BlockProps = {
    type?: typeof Commands[number],
    content: string,
    onUpdate?: (text: string) => void,
}

class Blocks extends React.Component<BlockProps> {
    blockRef = React.createRef<any>()

    constructor(props: BlockProps) {
        super(props)
    }

    componentDidMount(): void {
        const selection = window.getSelection()
        if (this.blockRef.current && selection) {
            // this.OnStart()
            selection.collapse(this.blockRef.current)
        }

    }

    private onBlur() {
        if (this.blockRef.current && this.blockRef.current.textContent.replaceAll(/[ \n\/]+/g, "").length === 0) {
            this.blockRef.current.innerHTML = `<a class="Hydra_BlockEdtior_workarea_block_placeholder">Zacznij pisac ...</a>`
        }
    }

    private onInput() {
        if ( this.blockRef.current && this.props.onUpdate) switch(this.props.type) {
            case "Tags":
                    this.props.onUpdate(this.blockRef.current.innerHTML)
                break
            default: 
                this.props.onUpdate(this.blockRef.current.textContent)
                break
        }            
        // if (this.blockRef.current && this.props.onUpdate) this.props.onUpdate(this.props.content)
    }

    private OnStart() {
        if (this.blockRef.current) {
            const el = this.blockRef.current.querySelector(".Hydra_BlockEdtior_workarea_block_placeholder")
            if (el) {
                el.remove()
                switch(this.props.type) {
                    case "Tags":
                        this.MakeTag()
                        break
                }            
            
            }

        }
    }

    private MakeTag() {
        if (this.blockRef.current) {
            const {Line, EndOffset, StartOffset} = CaretInParagraph()  
            const p = document.createElement("p")
            p.classList.add("Hydra_BlockEdtior_workarea_blocks_tagItem")
             const seletion = window.getSelection()
            if (this.blockRef.current.innerHTML.trim() === "" || Line.textContent == null) {
                this.blockRef.current.append(p)
                if (seletion) seletion.collapse(p, 0)
                return
            }
            const text = Line.textContent!
            if (EndOffset !== text.length) {
                Line.textContent = text.substring(0, StartOffset)
                p.textContent = text.substring(EndOffset, text.length)
                if (Line.nextSibling != undefined)
                    this.blockRef.current.insertBefore(p, Line.nextSibling)
                else this.blockRef.current.append(p)
            } 
            if (Line.nextSibling != undefined)
                this.blockRef.current.insertBefore(p, Line.nextSibling)
            else this.blockRef.current.append(p)
            if (seletion) seletion.collapse(p, 0)
        }        
    }

    private onKeyDown(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key === "Enter") {
            key.preventDefault()
        }
        switch(this.props.type) {
            case "Tags":
                if (key.key === " ") {
                    key.preventDefault()
                    this.MakeTag()
                }
                break
        }
    }

    private onKeyUP(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key === "Enter") {
            key.preventDefault()
        }
        switch(this.props.type) {
            case "Tags":
                if (key.key === "Backspace") {
                    if (this.blockRef.current!.innerHTML.replaceAll(/<\/?br>|[\s]+/gi, "") === "") {
                        this.MakeTag()
                    }
                }
                break
        }
    }
    render(): React.ReactNode {
        switch(this.props.type) {
            default:
                return (
                    <div 
                        contentEditable
                        className="Hydra_BlockEdtior_workarea_blocks"
                        ref={this.blockRef}
                        onClick={this.OnStart.bind(this)}
                        onKeyDown={this.onKeyDown.bind(this)}
                        onInput={this.onInput.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        dangerouslySetInnerHTML={{__html: this.props.content != undefined && this.props.content.length > 0 ? this.props.content : `<a class="Hydra_BlockEdtior_workarea_block_placeholder">Zacznij pisac ...</a>`}}
                        spellCheck={false}
                    >
                    </div>
                )
            case "Quote":
                return (
                    <div className="Hydra_BlockEdtior_workarea_blocks_flex">
                        <div className="Hydra_BlockEdtior_workarea_blocks_quoteLine"></div>
                        <div 
                            contentEditable
                            className="Hydra_BlockEdtior_workarea_blocks_width"
                            ref={this.blockRef}
                            onClick={this.OnStart.bind(this)}
                            onKeyDown={this.onKeyDown.bind(this)}
                            onInput={this.onInput.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            dangerouslySetInnerHTML={{__html: this.props.content != undefined && this.props.content.length > 0 ? this.props.content : `<a class="Hydra_BlockEdtior_workarea_block_placeholder">Zacznij pisac ...</a>`}}
                            spellCheck={false}
                        >
                        </div>                        
                    </div>
                )
            case "Tags":
                return (
                    <div className="Hydra_BlockEdtior_workarea_blocks_flex">
                        <div 
                            contentEditable
                            className="Hydra_BlockEdtior_workarea_blocks_width"
                            ref={this.blockRef}
                            onClick={this.OnStart.bind(this)}
                            onKeyDown={this.onKeyDown.bind(this)}
                            onKeyUp={this.onKeyUP.bind(this)}
                            onInput={this.onInput.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            dangerouslySetInnerHTML={{__html: this.props.content != undefined && this.props.content.length > 0 ? this.props.content : `<a class="Hydra_BlockEdtior_workarea_block_placeholder">Zacznij pisac ...</a>`}}
                            spellCheck={false}
                        >
                        </div>                        
                    </div>
                )
        }

    }

}

export default Blocks
