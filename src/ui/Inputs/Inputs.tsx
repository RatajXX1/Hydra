import { Typography } from "../Text/Text"
import "./Inputs.scss";
import {ReactComponent as DownArrowIcon} from "../../Images/emptyarrow.svg";
import { FunctionComponent } from "react";

function Select() {
    return (
        <div className="Hydra_Inputs_Select">
            <Typography>Text</Typography>
            <DownArrowIcon/>
        </div>
    )
}

type TextProps = {
    type: string,
    style?: React.CSSProperties,
    placeholder?: string,
    className?: string,
    Icon?: FunctionComponent,
    OnChangeValue?: (arg: React.ChangeEvent<HTMLInputElement>) => void
}

function InputText(props: TextProps) {
    return (
        <div style={props.style != undefined ? props.style : undefined}  className={"Hydra_Inputs_Text " + (props.className != undefined ? props.className : "")}>
            {
                props.Icon != undefined && <props.Icon/>
            }
            <input
                type={props.type}
                placeholder={props.placeholder}
                onChange={props.OnChangeValue}
            />
        </div>
    )
}

export {
    Select,
    InputText
}