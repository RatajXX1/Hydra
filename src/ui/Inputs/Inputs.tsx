import { Typography } from "../Text/Text"
import "./Inputs.scss";
import {ReactComponent as DownArrowIcon} from "../../Images/emptyarrow.svg";
import React, { FunctionComponent } from "react";
import { MonthNames } from "../CalendarView/CalendarView";
import {ReactComponent as Next} from "../../Images/nextday.svg";
import { IconButton } from "../Buttons/Buttons";

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
                spellCheck={false}
                type={props.type}
                placeholder={props.placeholder}
                onChange={props.OnChangeValue}
            />
        </div>
    )
}

class CalendarWidget extends React.Component {

    state = {
        Opened: false,
        SelectedDate: new Date()
    }

    changeMonth() {
        // this.state.SelectedDate.setMonth(this.state.SelectedDate.getMonth() + 1)
        // this.forceUpdate()
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_Inputs_Text">
                <div 
                    onClick={() => {
                        this.setState({...this.state, Opened: true})  
                    }}
                    className="Hydra_Inputs_Text_prompt"
                >
                    <a>
                        {
                            this.state.SelectedDate.toISOString().split("T")[0]
                        }
                    </a>
                </div>
                {
                    this.state.Opened &&
                    <div className="Hydra_Inputs_calendarWidger_back">
                        <div className="Hydra_Inputs_calendarWidger_calendar_header">
                            <IconButton
                                Icon={Next}
                                OnClick={() => {
                                    this.state.SelectedDate.setMonth(this.state.SelectedDate.getMonth() - 1)
                                }}
                            />
                            <a onClick={() => {console.log("dss1a")}}>{MonthNames[this.state.SelectedDate.getMonth()]}</a>
                            <IconButton
                                Icon={Next}
                                style={{
                                    transform: "rotate(180deg)",
                                }}
                                OnClick={() => {console.log("dsa") }}
                            />
                        </div>
                        <div className="Hydra_Inputs_calendarWidger_calendar_days">
                            <a className="Hydra_Inputs_calendarWidger_calendar_days_block">Pn</a>
                            <a className="Hydra_Inputs_calendarWidger_calendar_days_block">Wt</a>
                            <a className="Hydra_Inputs_calendarWidger_calendar_days_block">Śr</a>
                            <a className="Hydra_Inputs_calendarWidger_calendar_days_block">Cz</a>
                            <a className="Hydra_Inputs_calendarWidger_calendar_days_block">Pt</a>
                            <a className="Hydra_Inputs_calendarWidger_calendar_days_block">So</a>
                            <a className="Hydra_Inputs_calendarWidger_calendar_days_block">Ni</a>
                            {
                                (
                                    () => {
                                        const tab: React.ReactNode[] = []
                                        let tempDate = new Date(this.state.SelectedDate)
                                        tempDate.setDate(1)
                                        for(let i = 0; i < (tempDate.getDay() === 0 ? 7 : tempDate.getDay()); i++) {
                                            tab.push(
                                                <a style={{visibility: "hidden"}}></a>
                                            )
                                        }
                                        tempDate = new Date(this.state.SelectedDate)
                                        tempDate.setMonth(tempDate.getMonth() + 1)
                                        tempDate.setDate(0)
                                        for(let i = 1; i <= tempDate.getDate(); i++) {
                                            tab.push(
                                                <a>{i}</a>
                                            )
                                        }
                                        return tab
                                    }
                                )()
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }    
}

export {
    Select,
    CalendarWidget,
    InputText
}