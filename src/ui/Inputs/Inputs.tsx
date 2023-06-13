import { Typography } from "../Text/Text"
import "./Inputs.scss";
import {ReactComponent as DownArrowIcon} from "../../Images/emptyarrow.svg";
import React, { FunctionComponent } from "react";
import { MonthNames } from "../CalendarView/CalendarView";
import {ReactComponent as Next} from "../../Images/nextday.svg";
import {ReactComponent as CalendarIcon} from "../../Images/calendar.svg";
import { IconButton } from "../Buttons/Buttons";
import ScrollArea from "../ScrollArea/Scrollarea";

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

type TextAreaProps = {
    style?: React.CSSProperties,
    placeholder?: string,
    className?: string,
    OnChangeValue?: (arg: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function InputTextArea(props: TextAreaProps) {
    return (
        <div style={props.style != undefined ? props.style : undefined}  className={"Hydra_Inputs_Text " + (props.className != undefined ? props.className : "")}>
            <textarea
                spellCheck={false}
                placeholder={props.placeholder}
                onChange={props.OnChangeValue}
            />
        </div>
    )
}

class CalendarWidget extends React.Component {
    calendarbox = React.createRef<any>()

    state = {
        Opened: false,
        SelectedDate: new Date()
    }

    componentDidMount(): void {
        document.addEventListener("click", this.OnClickBack.bind(this))    
    }

    componentWillUnmount(): void {
        document.removeEventListener("click", this.OnClickBack.bind(this))    
    }

    OnClickBack = (event: MouseEvent) => {
        if (
            this.calendarbox.current && 
            this.state.Opened &&
            !this.calendarbox.current.contains(event.target as Node)
        ) 
            {
                this.setState({...this.state, Opened: false})  
            }
    }

    render(): React.ReactNode {
        return (
            <div ref={this.calendarbox} className="Hydra_Inputs_Text">
                <div 
                    onClick={() => {
                        this.setState({...this.state, Opened: true})  
                    }}
                    className="Hydra_Inputs_Text_prompt"
                >
                    <CalendarIcon/>
                    <a>
                        {
                            this.state.SelectedDate.toISOString().split("T")[0]
                        }
                    </a>
                </div>
                {
                    this.state.Opened &&
                    <div  className="Hydra_Inputs_calendarWidger_back">
                        <div className="Hydra_Inputs_calendarWidger_calendar_header">
                            <IconButton
                                Icon={Next}
                                OnClick={() => {
                                    this.state.SelectedDate.setMonth(this.state.SelectedDate.getMonth() - 1)
                                    this.forceUpdate()
                                }}
                            />
                            <a>{MonthNames[this.state.SelectedDate.getMonth()]} {this.state.SelectedDate.getFullYear().toString()}</a>
                            <IconButton
                                Icon={Next}
                                style={{
                                    transform: "rotate(180deg)",
                                }}
                                OnClick={() => {
                                    this.state.SelectedDate.setMonth(this.state.SelectedDate.getMonth() + 1)
                                    this.forceUpdate()
                                }}
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
                                        for(let i = 0; i < (tempDate.getDay() === 0 ? 6 : tempDate.getDay() - 1); i++) {
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

class HourSelector extends React.Component {
    calendarbox = React.createRef<any>()
    HourScroll = React.createRef<any>()
    MinuteScroll = React.createRef<any>()
    Inputs = React.createRef<any>()

    state = {
        Opened: false,
        Value: "00:00"
    }

    componentDidMount(): void {
        document.addEventListener("click", this.OnClickBack.bind(this))    
    }

    componentWillUnmount(): void {
        document.removeEventListener("click", this.OnClickBack.bind(this))    
    }

    OnClickBack = (event: MouseEvent) => {
        if (
            this.calendarbox.current && 
            this.state.Opened &&
            !this.calendarbox.current.contains(event.target as Node)
        ) 
            {
                this.setState({...this.state, Opened: false})  
            }
    }

    onBlur(ev: React.FocusEvent<HTMLInputElement>) {
        const val = ev.target.value
        if (!val.match(/^([0-9]{2}):([0-9]{2})$/)) 
            ev.target.value = "00:00"
    }

    onKeyDonw(ev: React.KeyboardEvent) {
        if (ev.key == "Backspace") return
        if (ev.key == ":" && this.state.Value.split(":").length > 0) ev.preventDefault()
        try {
            if (!parseInt(ev.key)) ev.preventDefault()
            else if (this.state.Value.length >= 5) ev.preventDefault()
        } catch (e) {
            ev.preventDefault()
        }
    }

    ScrollTo() {
        if (this.MinuteScroll.current && this.state.Value.split(":").length == 2) {
            this.MinuteScroll.current.ScrollTo(`Item_select_${this.state.Value.split(":")[1]}`)
        }
        if (this.HourScroll.current && this.state.Value.split(":").length > 0) {
            this.HourScroll.current.ScrollTo(`Item_select_${this.state.Value.split(":")[0]}`)
        }
    }

    onChangeVal(ev: React.ChangeEvent<HTMLInputElement>) {
        let val = ev.target.value
        if (val.length >= 5) {
            ev.target.value = val.substring(0, 5)
            if (!val.match(/^([0-9]{2}):([0-9]{2})$/)) 
                ev.target.value = "00:00"
        }
        if (val.length == 2 && val[val.length - 1] != ':' ) ev.target.value += ":"
        else if (val.length == 2 && val[val.length - 1] == ':' ) ev.target.value = '0' + val
        if (Number(val.split(":")[0]) > 24) ev.target.value = "24:" + val.substring(3, 5)
        if (Number(val.split(":")[1]) > 59) ev.target.value = val.substring(0, 2) + ":59"
        this.state.Value = ev.target.value
        this.ScrollTo()
        this.forceUpdate()
    }

    onClickSet(Index: number, val: number) {
        if (Index === 0) {
            this.state.Value = val.toString().padStart(2, "0") + this.state.Value.substring(2)
        } else {
            this.state.Value = this.state.Value.substring(0, 3) + val.toString().padStart(2, "0")
        }
        if (this.state.Value.split(":").length < 2) this.state.Value += ":00" 
        if (this.Inputs.current) this.Inputs.current.value = this.state.Value
        this.ScrollTo()
        this.forceUpdate()
    }

    render(): React.ReactNode {
        return (
            <div ref={this.calendarbox} className="Hydra_Inputs_Text">
                <div 
                    onClick={() => {
                        this.setState({...this.state, Opened: true})  
                    }}
                    className="Hydra_Inputs_Text_prompt"
                >
                    <input
                        spellCheck={false}
                        ref={this.Inputs}
                        type="text"
                        defaultValue={"00:00"}
                        onKeyDown={this.onKeyDonw.bind(this)}
                        onChange={this.onChangeVal.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                    />
                </div>
                {
                    this.state.Opened &&
                    <div className="Hydra_Inputs_calendarWidger_back">
                        <div className="Hydra_Inputs_calendarWidger_hours_back">
                            <div className="Hydra_Inputs_calendarWidger_hours_column">
                                <ScrollArea ref={this.HourScroll}>
                                    <div className="Hydra_Inputs_calendarWidger_hours_column_item">
                                        {
                                            (
                                                () => {
                                                    const tab: React.ReactNode[] = []
                                                    for(let i = 0; i <= 24; i++) 
                                                        tab.push(
                                                            <a 
                                                                className={
                                                                    (
                                                                        this.state.Value.split(":")[0] != undefined &&
                                                                        Number(this.state.Value.split(":")[0]) == i
                                                                    ) ? "Hydra_Inputs_calendarWidger_hours_column_item_seleted" : ""
                                                                }
                                                                onClick={this.onClickSet.bind(this, 0, i)}
                                                                id={`Item_select_${i}`}
                                                            >{i}</a>
                                                        )
                                                    return tab
                                                }
                                            )()
                                        }
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="Hydra_Inputs_calendarWidger_hours_column">
                                <ScrollArea ref={this.MinuteScroll}>
                                    <div className="Hydra_Inputs_calendarWidger_hours_column_item">
                                        {
                                            (
                                                () => {
                                                    const tab: React.ReactNode[] = []
                                                    for(let i = 1; i <= 59; i++) 
                                                        tab.push(
                                                            <a 
                                                                className={
                                                                    (
                                                                        this.state.Value.split(":")[1] != undefined &&
                                                                        Number(this.state.Value.split(":")[1]) == i
                                                                    ) ? "Hydra_Inputs_calendarWidger_hours_column_item_seleted" : ""
                                                                } 
                                                                onClick={this.onClickSet.bind(this, 1, i)}
                                                                id={`Item_select_${i}`}
                                                            >{i}</a>
                                                        )
                                                    return tab
                                                }
                                            )()
                                        }
                                    </div>
                                </ScrollArea>
                            </div>
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
    HourSelector,
    InputText,
    InputTextArea
}