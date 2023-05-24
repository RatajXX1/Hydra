import React from "react";

type SelectionState = {
    startOffset: number, 
    endOffset: number, 
    lines: Node[],
    range: Range
}

function GetParagraph(Item: Node) {
    let tempItem = Item
    while (tempItem.nodeName.toLowerCase() !== "p") {
        tempItem = tempItem.nextSibling! || tempItem.parentNode!
        if (!tempItem.parentNode && !tempItem.nextSibling) break
    }
    return tempItem
}

function CaretInParagraph() {

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
    // console.log(Selected.lines, Selected.lines[0] as HTMLElement)
    Selected.lines
        .forEach(
            (e, index) => {
                if ((e as HTMLElement).children.length === 0) {
                    (e as HTMLElement).innerHTML = `${(index === 0 ? (e as HTMLElement).textContent!.substring(0, Selected.startOffset) : "")}<${WrapTag} class="${ClassName}">${(e as HTMLElement).textContent?.substring(index === 0 ? Selected.startOffset : 0, index === Selected.lines.length - 1 ? Selected.endOffset : undefined)}</${WrapTag}>`
                } 
                else {
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
    EditSelection
}
