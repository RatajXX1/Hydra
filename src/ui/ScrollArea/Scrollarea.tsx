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

    private onInput() {
        const seletion = window.getSelection()
        if (seletion) {
            const range = seletion.getRangeAt(0)
            if (this.scrollArea.current) {
                // console.log((range.commonAncestorContainer as HTMLElement).parentElement?.getBoundingClientRect())
                this.scrollArea.current.scrollTop = (range.commonAncestorContainer as HTMLElement).parentElement?.getBoundingClientRect().y
                this.UpdateScrollsPos()
            }
        }
    }

    render(): React.ReactNode {
        return (
            <div 
                onWheel={this.ScrollWheel.bind(this)}
                onInput={this.onInput.bind(this)}
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