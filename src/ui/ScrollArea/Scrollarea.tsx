import React from "react";
import "./Scrollarea.scss";

type ScrollAreacProps = {
    children: React.ReactNode[] | React.ReactNode
}

// scrollHeight: 500
// ​
// scrollLeft: 0
// ​
// scrollLeftMax: 0
// ​
// scrollTop: 0
// ​
// scrollTopMax: 350
// ​
// scrollWidth: 200

class ScrollArea extends React.Component<ScrollAreacProps> {
    scrollArea = React.createRef<any>()

    state = {
        ScrollYHeight: 0
    }

    constructor(props: ScrollAreacProps) {
        super(props)
    }

    componentDidMount(): void {
        this.ScrollsSize()
    }

    componentDidUpdate(): void {
        this.ScrollsSize()
    }

    private ScrollsSize() {
        if (this.scrollArea.current) {
            const x = this.scrollArea.current.parentNode.querySelector(".Hydra_Scrollarea_scroll_y")
            if (x) {
                this.state.ScrollYHeight = (this.scrollArea.current.clientHeight / this.scrollArea.current.scrollHeight) * 100
                x.style.height = `${this.state.ScrollYHeight}%`
            }
        }
    }

    private UpdateScrollsPos() {
        if (this.scrollArea.current) {
            const x = this.scrollArea.current.parentNode.querySelector(".Hydra_Scrollarea_scroll_y")
            if (x) {
                x.style.top = `${(this.scrollArea.current.scrollTop / (this.scrollArea.current.scrollTopMax + this.state.ScrollYHeight * 4.5)) * 100}%`
            }
        }
    }

    // deltaY
    private ScrollWheel(event: React.WheelEvent) {
        // console.log(event.deltaY)
        if (this.scrollArea.current) {
            this.scrollArea.current.scrollTop += event.deltaY
            this.UpdateScrollsPos()
        }
    }
 
    // H: 877 ScrollH: 1960 scrollTopMax: 1083: scrollTOp: actual 
    private onInput() {
        const OffsetScreen = 20
        const seletion = window.getSelection()
        if (seletion && this.scrollArea.current) {
            const range = seletion.getRangeAt(0)
            const pos = range.getClientRects()
            console.log(pos)
            // if (pos[0]) console.log(pos[0], this.scrollArea.current.scrollTop, this.scrollArea.current.clientHeight + this.scrollArea.current.scrollTop)
            if (
                pos[0] !== undefined &&
                !((document.body.clientHeight - this.scrollArea.current.clientHeight) < pos[0].y - OffsetScreen && this.scrollArea.current.clientHeight > pos[0].y + OffsetScreen)
            ) {
                // console.log("Nie ma na ekranie", pos[0].y)
                if ((document.body.clientHeight - this.scrollArea.current.clientHeight) > pos[0].y - OffsetScreen) this.scrollArea.current.scrollTop -= pos[0].y/2
                else this.scrollArea.current.scrollTop += pos[0].y/2
                this.UpdateScrollsPos()
            }
        }
    }

    public onFocus() {
        const OffsetScreen = 20;
        const selection = window.getSelection();
        
        if (selection && this.scrollArea.current) {
          const range = selection.getRangeAt(0);
          try {
            const focusElement = range.commonAncestorContainer as HTMLElement;
            const elementRect = focusElement.getBoundingClientRect();
            const scrollAreaRect = this.scrollArea.current.getBoundingClientRect();
            
            const topDifference = elementRect.top - scrollAreaRect.top;
            const bottomDifference = scrollAreaRect.bottom - elementRect.bottom;
            
            if (topDifference - OffsetScreen < 0) {
              this.scrollArea.current.scrollTop -= Math.abs(topDifference - OffsetScreen);
            } else if (bottomDifference - OffsetScreen < 0) {
              this.scrollArea.current.scrollTop += Math.abs(bottomDifference - OffsetScreen);
            }
          } catch (e) {
            console.log('Error occurred while setting scroll position');
          }
        }
    }

    render(): React.ReactNode {
        return (
            <div 
                onWheel={this.ScrollWheel.bind(this)}
                onSelect={this.onInput.bind(this)}
                onFocus={this.onFocus.bind(this)}
                className="Hydra_Scrollarea_main"
            >
                <div className="Hydra_Scrollarea_scroll Hydra_Scrollarea_scroll_y"></div>
                <div 
                    className="Hydra_Scrollarea_workarea"   
                    ref={this.scrollArea}>
                    {
                        this.props.children
                    }                    
                </div>
            </div>
        )
    }

}

export default ScrollArea