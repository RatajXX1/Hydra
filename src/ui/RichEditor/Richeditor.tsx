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

type StyledClass = {
    Hydra_Richeditor_editor_bold : boolean,
    Hydra_Richeditor_editor_italic : boolean,
    Hydra_Richeditor_editor_underline : boolean,
    Hydra_Richeditor_editor_strike : boolean,
}

class RichEditor extends React.Component {
    placholder = <div className="Hydra_Richeditor_editor_placeholder">Zacznij pisać ...</div>
    editorRef = React.createRef<HTMLDivElement>()
    textOptionsRef = React.createRef<HTMLDivElement>()
    commmandPrompt = React.createRef<HTMLDivElement>()

    state = {
        LastWord: "",
        Content: `<div class="Hydra_Richeditor_editor_placeholder">Zacznij pisać ...</div>`,
        SeletedTextInfo: {            
            Hydra_Richeditor_editor_bold: false,
            Hydra_Richeditor_editor_italic: false,
            Hydra_Richeditor_editor_underline: false,
            Hydra_Richeditor_editor_strike: false,
        } as StyledClass
    };

    componentWillUnmount(): void {
        if (this.editorRef.current) {
            this.state.Content = this.editorRef.current.innerHTML
        }
    }

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
        //   this.GetSelectedTextInfo()
          this.state.SeletedTextInfo = this.IsStyled()
          this.forceUpdate()
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

    CommandStart = () => { 
        const selection = window.getSelection();     
        if (this.editorRef.current && selection) {
            const text = this.editorRef.current.innerText;
            if (text == null) return
            // Find the position of the cursor
            const range = selection.getRangeAt(0);
            let currentPosition = range.startOffset;  
            let rects = range.getClientRects()
            const lastRect = rects[rects.length - 1];
            if (lastRect == undefined) return
            const editorRect = this.editorRef.current!.getBoundingClientRect();
            const textOptionsRect = this.textOptionsRef.current!.getBoundingClientRect();
            const left = lastRect.left - editorRect.left + this.editorRef.current!.scrollLeft;
            const maxWidth = editorRect.width - textOptionsRect.width;
            const position = {
                left: Math.min(Math.max(left, 0), maxWidth),
            };
            this.state.LastWord = this.getLastWordInContentEditableDiv()
            if (rects[0] != undefined && lastRect != undefined && this.state.LastWord != "") {
                // console.log("Slowo", this.getLastWordInContentEditableDiv(), "POS X" , currentPosition, "POX Y", rects[0].y)
                if (this.commmandPrompt.current) {
                    // this.commmandPrompt.current.style.display = "block"
                    this.commmandPrompt.current.style.left = `${position.left}px` 
                    this.commmandPrompt.current.style.top = `${rects[0].y - 30}px`
                    this.forceUpdate()
                }
            }
        }

    }

    getLastWordInContentEditableDiv(): string {
        const sel = window.getSelection();
        // Sprawdź, czy wybrano tekst w contenteditable div
        if (sel && sel.rangeCount > 0 && this.editorRef.current) {
            const range = sel.getRangeAt(0).cloneRange();
            range.collapse(true);
            if (range == null || !range.startContainer.textContent) return ""
            else  {
                const precedingText = range.startContainer.textContent.slice(0, range.startOffset).split(/[\s]+/);
                return precedingText[precedingText.length - 1]
            }
        }
      
        return "";
    }

    SetInTag(classname?: string ) {
        const selection = window.getSelection();
        if (selection) {
            const range = selection.getRangeAt(0);
            const newElement = document.createElement("a");
            if (classname) {
                Object.keys(this.state.SeletedTextInfo).forEach(
                    e => {
                        if (this.state.SeletedTextInfo[e as keyof StyledClass]) 
                            newElement.classList.add(e as keyof StyledClass)
                    }
                )
                newElement.classList.add(classname)
            }
            newElement.appendChild(document.createTextNode(range.toString()));
            range.deleteContents();
            range.insertNode(newElement);
            const newRange = document.createRange();
            newRange.setStart(newElement as Node, 0);
            newRange.setEnd(range.endContainer, range.endOffset);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    }

    ClearTag() {
        const selection = window.getSelection();
        if (selection) {
            const range = selection.getRangeAt(0);
            const newElement = document.createTextNode(range.toString());
            range.deleteContents();
            range.insertNode(newElement);
            selection.removeAllRanges();
            selection.addRange(range); 
        }
    }


    IsStyled(): StyledClass {
        var range;
        const Output = {
            Hydra_Richeditor_editor_bold: false,
            Hydra_Richeditor_editor_italic: false,
            Hydra_Richeditor_editor_underline: false,
            Hydra_Richeditor_editor_strike: false,
        } as StyledClass
        if (window.getSelection) {
          var selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            if (div.firstElementChild) {
                Object.keys(Output).forEach(
                    (e) => {
                        if (div.firstElementChild?.classList.contains(e as keyof StyledClass)) 
                            Output[e as keyof StyledClass] = true
                    }
                )
                return Output
            }
            else return Output;
          }
          else {
            return Output;
          }
        }
        else {
          return Output;
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
                        OnClick={() => {
                            if (!this.state.SeletedTextInfo.Hydra_Richeditor_editor_bold) 
                                this.SetInTag("Hydra_Richeditor_editor_bold")
                            else this.ClearTag()
                        }}
                        Seleted={this.state.SeletedTextInfo.Hydra_Richeditor_editor_bold}
                    />
                    <IconButton
                        Icon={italicIcon}
                        OnClick={() => {
                            if (!this.state.SeletedTextInfo.Hydra_Richeditor_editor_italic) 
                                this.SetInTag("Hydra_Richeditor_editor_italic")
                            else this.ClearTag()
                        }}
                        Seleted={this.state.SeletedTextInfo.Hydra_Richeditor_editor_italic}
                    />
                    <IconButton
                        Icon={UnderlineIcon}
                        OnClick={() => {
                            if (!this.state.SeletedTextInfo.Hydra_Richeditor_editor_underline) 
                                this.SetInTag("Hydra_Richeditor_editor_underline")
                            else this.ClearTag()
                        }}
                        Seleted={this.state.SeletedTextInfo.Hydra_Richeditor_editor_underline}
                    />
                    <IconButton
                        Icon={StrikeIcon}
                        OnClick={() => {
                            if (!this.state.SeletedTextInfo.Hydra_Richeditor_editor_strike) 
                                this.SetInTag("Hydra_Richeditor_editor_strike")
                            else this.ClearTag()
                        }}
                        Seleted={this.state.SeletedTextInfo.Hydra_Richeditor_editor_strike}
                    />
                    <IconButton
                        Icon={LinkIcon}
                        // Seleted={this.state.SeletedTextInfo.Hydra_Richeditor_editor_bold}
                    />
                    <Select/>
                </div>

                <div
                    ref={this.commmandPrompt}
                    className="Hydra_Richeditor_textOptions"
                >
                    {
                        this.state.LastWord
                    }
                </div>

                <div 
                    ref={this.editorRef}
                    className="Hydra_Richeditor_editor" 
                    contentEditable
                    onFocus={this.onFoucs.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    onSelect={this.handleSelectionChange.bind(this)}
                    onInput={this.CommandStart.bind(this)}
                    dangerouslySetInnerHTML={{__html: this.state.Content}}
                >

                </div>
            </div>
        )
    }

}

export {
    RichEditor
}