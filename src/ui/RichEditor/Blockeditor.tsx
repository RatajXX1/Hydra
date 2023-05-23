import React from "react";
import "./Richeditor.scss";

class BlockEditor extends React.Component {

    state = {
        Data: [] as any[]
    }

    AddBlockPrompt = () => (
        <div className="Hydra_BlockEditor_AddBlock">
            <a>Zacznij</a>
        </div>
    )

    render(): React.ReactNode  {
        return (
            <div className="Hydra_Richeditor_main">
                <this.AddBlockPrompt/>
            </div>
        )
    }

}

export {
    BlockEditor
}