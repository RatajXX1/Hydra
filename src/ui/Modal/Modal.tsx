import React from "react";
import "./Modal.scss";
import ScrollArea from "../ScrollArea/Scrollarea";

type ModalProps = {
    OnClose: () => void,
    isOpen: boolean,
    children: React.ReactNode[] | React.ReactNode
}

class Modal extends React.Component<ModalProps> {
    moddalarea = React.createRef<any>()

    private OnClickBack(event: React.MouseEvent) {
        if (
            this.moddalarea.current && 
            this.props.isOpen &&
            !this.moddalarea.current.contains(event.target as Node)
        ) 
            this.props.OnClose()
    }

    render(): React.ReactNode {
        return (
            <div 
                style={{display: this.props.isOpen ? "block" : "none"}} 
                className="Hydra_Modal_background"
                onClick={this.OnClickBack.bind(this)}
            >
                <ScrollArea>
                    <div ref={this.moddalarea} className="Hydra_Modal_area">
                        {
                            this.props.children
                        }
                    </div>                    
                </ScrollArea>                    
            </div>
        )
    }

}

export default Modal;