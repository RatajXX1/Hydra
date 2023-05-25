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
import { CaretInParagraph, EditSelection, GetSelected } from "../../Lib/Selection";

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
            // GetSelected(this.editorRef)
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
        //   this.state.SeletedTextInfo = this.IsStyled()
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
                this.editorRef.current.innerHTML = ""
                this.CaretInPargraph()
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
        // const AddToChildNodes = (elments: NodeListOf<ChildNode>) => {
        //     elments.forEach(
        //         (e) => {
        //             if (e.textContent == "") return
        //             if (e.nodeName.toLowerCase() == "#text") {
        //                 const el = document.createElement("span")
        //                 el.textContent = e.textContent
        //                 el.classList.add(classname!)
        //                 e.parentNode!.replaceChild(el, e)
        //             } else if (e.nodeName.toLowerCase() == "p") {
        //                 if (e.childNodes.length > 0) {
        //                     AddToChildNodes(e.childNodes)
        //                 }
        //             }
        //         }
        //     )
        // }

        // const selection = window.getSelection();
        // if (selection) {
        //     const range = selection.getRangeAt(0);
        //     // console.log(range.startContainer, range.endContainer, range.commonAncestorContainer)
        //     const extracted = range.extractContents()
        //     console.log(extracted)
        //     AddToChildNodes(extracted.childNodes)
        //     range.insertNode(extracted)
        // }

        const selected = GetSelected(this.editorRef)
        if (selected.lines.length > 0) EditSelection(selected, "span", classname!)
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
        const Output = {
            Hydra_Richeditor_editor_bold: false,
            Hydra_Richeditor_editor_italic: false,
            Hydra_Richeditor_editor_underline: false,
            Hydra_Richeditor_editor_strike: false,
        } as StyledClass

        const CheckAllChilds = (elments: NodeListOf<ChildNode>, addIndex?: number) => {
            if (addIndex === undefined) addIndex = 0
            elments.forEach(
                (e, index) => {
                    if (e.textContent == "") return
                    if (e.nodeName.toLowerCase() == "#text") {
                        if (e.parentNode!.nodeName.toLowerCase() == "span" ) {
                            Object.keys(Output).forEach(
                                d => {
                                    if ((e.parentNode as HTMLElement).classList.contains(d)) {
                                        if (index + addIndex! == 0 && !Output[d as keyof StyledClass]) {
                                            Output[d as keyof StyledClass] = true
                                        }
                                    } else Output[d as keyof StyledClass] = false
                                }
                            )
                        } else Object.keys(Output).forEach(d => Output[d as keyof StyledClass] = false)
                    } else if (e.nodeName.toLowerCase() == "p") {
                        if (e.childNodes.length > 0) {
                            CheckAllChilds(e.childNodes, index)
                        }
                    } else if (e.nodeName.toLowerCase() == "span") {
                        Object.keys(Output).forEach(
                            d => {
                                if ((e as HTMLElement).classList.contains(d)) {
                                    if (index + addIndex! == 0 && !Output[d as keyof StyledClass]) {
                                        Output[d as keyof StyledClass] = true
                                    }
                                } else Output[d as keyof StyledClass] = false
                            }
                        )
                    }
                }
            )
            
        }

        const selection = window.getSelection()
        if (selection) {
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const clonedSelection = range.cloneContents();
                // console.log(clonedSelection)
                CheckAllChilds(clonedSelection.childNodes)
            }
        }
        return Output
    }

    private CaretInPargraph() {  
        const {Line, EndOffset, StartOffset} = CaretInParagraph()            
        const p = document.createElement("p")
        if (EndOffset !== 0) {
            p.textContent = Line.textContent!.substring(StartOffset)
            Line.textContent = Line.textContent!.substring(0, StartOffset)
        }
        const selection = window.getSelection()
        if (Line?.nextSibling !== null) {
            if (this.editorRef.current) this.editorRef.current.insertBefore(p, Line?.nextSibling!);
        } else this.editorRef.current!.append(p)
        if (selection) selection.collapse(p, 0)
    }

    OnKeDown(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key === 'Enter') {
            key.preventDefault();
            this.CaretInPargraph()
        }
    }

    OnKeUP(key: React.KeyboardEvent<HTMLDivElement>) {
        if (key.key == "Backspace") {
            if (this.editorRef.current!.innerHTML.replaceAll(/<\/?br>|[\s]+/gi, "") === "") {
                this.CaretInPargraph()
            }
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
                    onKeyDown={this.OnKeDown.bind(this)}
                    onKeyUp={this.OnKeUP.bind(this)}
                >
                </div>
            </div>
        )
    }

}

export {
    RichEditor
}