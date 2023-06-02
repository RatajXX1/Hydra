import React from "react";
import ScrollArea from "../ScrollArea/Scrollarea";
import "./Settiings.scss";
import { Select } from "../Inputs/Inputs";

class SettingsView extends React.Component {
    
    render(): React.ReactNode {
        return (
            <div className="Hydra_settins_main">
                <ScrollArea>
                    <div className="Hydra_settins_main_work_area">
                        <div className="Hydra_settins_main_header">
                            <h1>Ogólne</h1>   
                        </div>
                        <div className="Hydra_settins_main_setting">
                            <h1>Tekst</h1> 
                            <p>
                            In pharetra laoreet velit vel tincidunt. Vestibulum ultricies imperdiet purus, ut imperdiet ante porttitor nec. 
                            </p>
                            <Select/>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        )
    }

}

export default SettingsView