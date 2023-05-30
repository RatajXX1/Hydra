import React from "react";

type SelectionState = {
    startOffset: number, 
    endOffset: number, 
    lines: Node[],
    range: Range
}

type CaretPostion = {
    Line: Node,
    StartOffset: number,
    EndOffset: number,
}

function GetParagraph(Item: Node) {
    let tempItem = Item
    while (tempItem.nodeName.toLowerCase() !== "p") {
        tempItem = tempItem.nextSibling! || tempItem.parentNode!
        if (!tempItem.parentNode && !tempItem.nextSibling) break
    }
    return tempItem
}

function CaretInParagraph(): CaretPostion {
    const selection = window.getSelection()
    if (selection) {
        const range = selection.getRangeAt(0)       
        if (range.startContainer === range.endContainer) {
            return {
                Line: GetParagraph(range.startContainer),
                StartOffset: range.startOffset,
                EndOffset: range.endOffset,
            } as CaretPostion
        }
    }
    return {} as CaretPostion
}

function GetSelected(Reference: React.RefObject<any>): SelectionState {
    const selection = window.getSelection()
    if (Reference.current && selection) {
        const range = selection.getRangeAt(0)
        if (range.startContainer === range.endContainer) {
            return {
                startOffset: range.startOffset, 
                endOffset: range.endOffset, 
                lines: [GetParagraph(range.startContainer)],
                range: range.cloneRange()
            } as SelectionState
        } else {
            const allP = Reference.current.querySelectorAll("p")
            let firstP = GetParagraph(range.startContainer)
            let secondP = GetParagraph(range.endContainer)
            if (Array.from(allP).indexOf(firstP) > Array.from(allP).indexOf(secondP)) {
                firstP = GetParagraph(range.endContainer)
                secondP = GetParagraph(range.startContainer)
            }
            console.log(firstP, secondP)
            const Founded = [] as Node[]
            let startSearch = false
            Reference.current.querySelectorAll("p")
                .forEach((e: Node) => {
                    if (e == firstP) startSearch = true 
                    else if (e == secondP) {startSearch = false; Founded.push(e)}
                    if (startSearch) {
                        Founded.push(e)
                    }
                })
            return {
                startOffset: range.startOffset, 
                endOffset: range.endOffset, 
                lines: Founded,
                range: range.cloneRange()
            } as SelectionState
        }
    }
    return {} as SelectionState
}

function EditSelection(Selected: SelectionState, WrapTag: string, ClassName: string) {
    console.log(Selected.startOffset, Selected.endOffset)
    // 3 6
    Selected.lines
        .forEach(
            (e, index) => {
                if ((e as HTMLElement).children.length === 0) {
                    const text = (e as HTMLElement).textContent
                    if (text === null) return
                    (e as HTMLElement).innerHTML = `${(index === 0 ? text.substring(0, Selected.startOffset) : "")}<${WrapTag} class="${ClassName}">${text.substring(index === 0 ? Selected.startOffset : 0, index === Selected.lines.length - 1 ? Selected.endOffset : undefined)}</${WrapTag}>${(index === Selected.lines.length - 1 ? text.substring(Selected.endOffset) : "")}`
                } 
                else {
                    // console.log((e as HTMLElement).childNodes)

                    for(let i = 0; i < e.childNodes.length; i++) {
                        if (e.childNodes[i].nodeName.toLowerCase() === "#text") {
                            const elemnet = document.createElement(WrapTag)
                            elemnet.classList.add(ClassName)
                            if (index == 0 || index == Selected.lines.length - 1){
                                elemnet.textContent = e.childNodes[i].textContent!.substring(index === 0 ? Selected.startOffset : 0, index === Selected.lines.length - 1 ? Selected.endOffset : undefined)
                                const back = e.childNodes[i].textContent!
                                console.log(Selected.startOffset, Selected.endOffset, back)
                                if (e.childNodes[i +1] == undefined) e.insertBefore(elemnet, e.childNodes[i + 1])
                                else e.appendChild(elemnet)
                                if (index == 0 && Selected.startOffset > 0) {
                                    e.childNodes[i].textContent = e.childNodes[i].textContent!.substring(Selected.startOffset)
                                }
                                if (index == Selected.lines.length - 1 && Selected.endOffset > 0) {
                                    const text = document.createTextNode(back.substring(Selected.endOffset))
                                    // e.insertBefore(text, e.childNodes[i + 1])
                                    if (e.childNodes[i +1] == undefined) e.insertBefore(text, e.childNodes[i + 1])
                                    else e.appendChild(text)
                                }
                            }
                            else {
                                elemnet.textContent = e.childNodes[i].textContent!
                                e.replaceChild(elemnet, e.childNodes[i])
                            }
                        }
                        else if (e.childNodes[i].nodeName.toLowerCase() === WrapTag) {
                            if (!(e.childNodes[i] as HTMLElement).classList.contains(ClassName)) {
                                (e.childNodes[i] as HTMLElement).classList.add(ClassName)
                            }
                        }
                    }
                    // <p>dsakd<spna>aksldak</span>sdl;aks</p>
                    // const d = (e as HTMLElement)
                    // for(let i = 0; i < d.children.length; i++) {

                    // }
                }
            }
        )
        
}

function GetSelectedStyle() {
    
}

export {
    GetSelected,
    EditSelection,
    CaretInParagraph
}
