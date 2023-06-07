import React from "react";
import { Commands } from "./BlockEditor";

type BlockProps = {
    type?: typeof Commands[number],
    content?: string,
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
            this.OnStart()
            selection.collapse(this.blockRef.current)
        }

    }

    private onBlur() {
        if (this.blockRef.current && this.blockRef.current.textContent.replaceAll(/[ \n\/]+/g, "").length === 0) {
            this.blockRef.current.innerHTML = `<a class="Hydra_BlockEdtior_workarea_block_placeholder">Zacznij pisac ...</a>`
        }
    }

    private onInput() {
        if (this.blockRef.current && this.props.onUpdate) this.props.onUpdate(this.blockRef.current.textContent)
    }

    private OnStart() {
        if (this.blockRef.current) {
            const el = this.blockRef.current.querySelector(".Hydra_BlockEdtior_workarea_block_placeholder")
            if (el) el.remove()
        }
    }

    private onKeyDown(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key === "Enter") {
            key.preventDefault()
        }
    }

    render(): React.ReactNode {
        switch(this.props.type) {
            case "Text":
                return (
                    <div 
                        contentEditable
                        className="Hydra_BlockEdtior_workarea_blocks"
                        ref={this.blockRef}
                        onClick={this.OnStart.bind(this)}
                        onKeyDown={this.onKeyDown.bind(this)}
                        onInput={this.onInput.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        dangerouslySetInnerHTML={{__html: this.props.content && this.props.content.length > 0 ? this.props.content : `<a class="Hydra_BlockEdtior_workarea_block_placeholder">Zacznij pisac ...</a>`}}
                        spellCheck={false}
                    >
                    </div>
                )
            case "Quote":
                return (
                    <div className="Hydra_BlockEdtior_workarea_blocks">
                        <div className="Hydra_BlockEdtior_workarea_blocks_quoteLine"></div>
                        <div 
                            contentEditable
                            className="Hydra_BlockEdtior_workarea_blocks"
                            ref={this.blockRef}
                            onClick={this.OnStart.bind(this)}
                            onKeyDown={this.onKeyDown.bind(this)}
                            onInput={this.onInput.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            dangerouslySetInnerHTML={{__html: this.props.content && this.props.content.length > 0 ? this.props.content : `<a class="Hydra_BlockEdtior_workarea_block_placeholder">Zacznij pisac ...</a>`}}
                            spellCheck={false}
                        >
                        </div>                        
                    </div>

                )
        }

    }

}

export default Blocks
