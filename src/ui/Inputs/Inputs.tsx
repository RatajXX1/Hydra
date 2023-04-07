import { Typography } from "../Text/Text"
import "./Inputs.scss";
import {ReactComponent as DownArrowIcon} from "../../Images/emptyarrow.svg";


function Select() {
    return (
        <div className="Hydra_Inputs_Select">
            <Typography>Text</Typography>
            <DownArrowIcon/>
        </div>
    )
}

export {
    Select
}