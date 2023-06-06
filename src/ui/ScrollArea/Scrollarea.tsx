import React from "react";
import "./Scrollarea.scss";

type ScrollAreacProps = {
    BlockY?: boolean,
    BlockX?: boolean,
    children: React.ReactNode[] | React.ReactNode
}

class ScrollArea extends React.Component<ScrollAreacProps> {
    scrollArea = React.createRef<any>()

    state = {
        ScrollYHeight: 0,
        ScrollXHeight: 0,
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
            const y = this.scrollArea.current.parentNode.querySelector(".Hydra_Scrollarea_scroll_x")
            this.state.ScrollYHeight = (this.scrollArea.current.clientHeight / this.scrollArea.current.scrollHeight) * 100
            if (x) x.style.height = `${this.state.ScrollYHeight}%`
            this.state.ScrollXHeight = (this.scrollArea.current.clientWidth / this.scrollArea.current.scrollWidth) * 100
            if (y) y.style.width = `${this.state.ScrollXHeight}%`
            if (this.state.ScrollXHeight >= 95) y.style.opacity = "0"
            else y.style.opacity = "1"
            if (x) if (this.state.ScrollYHeight >= 95) x.style.opacity = "0"
            else x.style.opacity = "1"
        }
    }

    public ScrollTo(element: string) {
        if (this.scrollArea.current) {
            const el = this.scrollArea.current.querySelector(`#${element}`)
            if (el) this.scrollArea.current.scrollTo({
                top: el.offsetTop,
                left: el.offsetLeft,
                behavior: 'smooth',
            })
            this.UpdateScrollsPos()
        }
    }

    private UpdateScrollsPos() {
        if (this.scrollArea.current) {
            const x = this.scrollArea.current.parentNode.querySelector(".Hydra_Scrollarea_scroll_y")
            const y = this.scrollArea.current.parentNode.querySelector(".Hydra_Scrollarea_scroll_x")
            if (x) {
                const scrollHeight = this.scrollArea.current.scrollHeight;
                const clientHeight = this.scrollArea.current.clientHeight;
                const scrollTop = this.scrollArea.current.scrollTop;
                const scrollbarHeight = x.clientHeight;
                const maxScrollTop = scrollHeight - clientHeight;
                const scrollPercentage = (scrollTop / maxScrollTop) * 100;
                const scrollbarPosition = scrollPercentage * (clientHeight - scrollbarHeight) / 100;
                x.style.top = `${scrollbarPosition}px`;
            }

            if (y) {
                const horizontalScrollWidth = this.scrollArea.current.scrollWidth;
                const horizontalClientWidth = this.scrollArea.current.clientWidth;
                const horizontalScrollLeft = this.scrollArea.current.scrollLeft;
        
                const horizontalScrollbarWidth = y.clientWidth;
                const horizontalMaxScrollLeft = horizontalScrollWidth - horizontalClientWidth;
        
                const horizontalScrollPercentage = (horizontalScrollLeft / horizontalMaxScrollLeft) * 100;
                const horizontalScrollbarPosition = horizontalScrollPercentage * (horizontalClientWidth - horizontalScrollbarWidth) / 100;
        
                y.style.left = `${horizontalScrollbarPosition}px`;
            }
        }
    }

    // deltaY
    private ScrollWheel(event: React.WheelEvent) {
        if (this.scrollArea.current) {
            if (!this.props.BlockY) this.scrollArea.current.scrollTop += event.deltaY
            if (!this.props.BlockX) {
                if (this.props.BlockY) this.scrollArea.current.scrollLeft += event.deltaY
                else this.scrollArea.current.scrollLeft += event.deltaX 
            }
            this.UpdateScrollsPos()
        }
    }
 
    // H: 877 ScrollH: 1960 scrollTopMax: 1083: scrollTOp: actual 
    private onInput() {
        const OffsetScreen = 20
        const seletion = window.getSelection()
        if (seletion && this.scrollArea.current) {
            try {
                const range = seletion.getRangeAt(0)
                const pos = range.getClientRects()
                // if (pos[0]) console.log(pos[0], this.scrollArea.current.scrollTop, this.scrollArea.current.clientHeight + this.scrollArea.current.scrollTop)
                if (
                    pos[0] !== undefined &&
                    !((document.body.clientHeight - this.scrollArea.current.clientHeight) < pos[0].y - OffsetScreen && this.scrollArea.current.clientHeight > pos[0].y + OffsetScreen)
                ) {
                    if ((document.body.clientHeight - this.scrollArea.current.clientHeight) > pos[0].y - OffsetScreen) this.scrollArea.current.scrollTop -= pos[0].y/2
                    else this.scrollArea.current.scrollTop += pos[0].y/2
                    this.UpdateScrollsPos()
                }                
            } catch (e) {

            }
        }
    }

    public onFocus() {
        const OffsetScreen = 20;
        const selection = window.getSelection();
        
        if (selection && this.scrollArea.current) {
          try {
            const range = selection.getRangeAt(0);
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
            this.UpdateScrollsPos()
          } catch (e) {
            // console.log('Error occurred while setting scroll position');
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
                {
                    ((this.props.BlockY === undefined || !this.props.BlockY)) && <div className="Hydra_Scrollarea_scroll Hydra_Scrollarea_scroll_y"></div>
                }
                {
                    ((this.props.BlockX === undefined || !this.props.BlockX)) && <div className="Hydra_Scrollarea_scroll Hydra_Scrollarea_scroll_x"></div>
                }
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