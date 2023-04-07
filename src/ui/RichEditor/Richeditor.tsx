import React, { KeyboardEventHandler } from "react";
import "./Richeditor.scss";
import { IconButton } from "../Buttons/Buttons";
import {ReactComponent as BoldIcon} from "../../Images/bold.svg";
import {ReactComponent as italicIcon} from "../../Images/italic.svg";
import {ReactComponent as UnderlineIcon} from "../../Images/underline.svg";
import {ReactComponent as StrikeIcon} from "../../Images/strike.svg";
import {ReactComponent as LinkIcon} from "../../Images/link.svg";
import { Select } from "../Inputs/Inputs";
import ReactDOM from 'react-dom';

class RichEditor extends React.Component {
    placholder = <div className="Hydra_Richeditor_editor_placeholder">Zacznij pisać ...</div>
    
    editorRef = React.createRef<HTMLDivElement>()
    textOptionsRef = React.createRef<HTMLDivElement>()

    state = {
        text: "",
        
    };

    handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection && selection.toString() !== "") {
          const range = selection.getRangeAt(0);
          const rects = range.getClientRects();
          const lastRect = rects[rects.length - 1];
          const editorRect = this.editorRef.current!.getBoundingClientRect();
          const top = lastRect.top - editorRect.top + this.editorRef.current!.scrollTop;
          const left = lastRect.left - editorRect.left + this.editorRef.current!.scrollLeft;
          const textOptionsRect = this.textOptionsRef.current!.getBoundingClientRect();
          const maxWidth = editorRect.width - textOptionsRect.width;
          const maxHeight = editorRect.height - textOptionsRect.height;
          const position = {
            top: Math.min(Math.max(top, 0), maxHeight),
            left: Math.min(Math.max(left, 0), maxWidth),
          };
          this.textOptionsRef.current!.style.display = "flex";
          this.textOptionsRef.current!.style.top = `${position.top + 30}px`;
          this.textOptionsRef.current!.style.left = `${position.left}px`;
        } else {
          this.textOptionsRef.current!.style.display = "none";
        }
    };

    onFoucs = () => {
        if (this.editorRef.current) {
            let placeholder = this.editorRef.current.querySelector(".Hydra_Richeditor_editor_placeholder")
            if (placeholder != null) {
                placeholder.remove()
            }
        }
    }

    onBlur = () => {
        if (this.editorRef.current && this.editorRef.current.innerText.replaceAll("\n", "") == "") {
            const placeholderNode = document.createElement("div")
            this.editorRef.current.innerText = ""
            ReactDOM.render(
                this.placholder,
                placeholderNode
            )
            this.editorRef.current.appendChild(placeholderNode)
        }
    }

    render(): React.ReactNode {
        return (
            <div 
                className="Hydra_Richeditor_main"
                onClick={() => {
                    if (this.editorRef.current) this.editorRef.current.focus()
                }}  
            >   
                <div
                    ref={this.textOptionsRef}
                    className="Hydra_Richeditor_textOptions"
                >
                    <IconButton
                        Icon={BoldIcon}
                    />
                    <IconButton
                        Icon={italicIcon}
                    />
                    <IconButton
                        Icon={UnderlineIcon}
                    />
                    <IconButton
                        Icon={StrikeIcon}
                    />
                    <IconButton
                        Icon={LinkIcon}
                    />
                    <Select/>
                </div>

                <div 
                    ref={this.editorRef}
                    className="Hydra_Richeditor_editor" 
                    contentEditable
                    onFocus={this.onFoucs.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    onSelect={this.handleSelectionChange.bind(this)}
                >
                    <div className="Hydra_Richeditor_editor_placeholder">
                        Zacznij pisać ...
                    </div>    
                    
                </div>
            </div>
        )
    }

}

export {
    RichEditor
}