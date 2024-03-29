import React from "react";
import ScrollArea from "../ScrollArea/Scrollarea";
import { Button, IconButton } from "../Buttons/Buttons";
import {ReactComponent as Next} from "../../Images/nextday.svg";
import {ReactComponent as Add} from "../../Images/add.svg";
import "./CalendarView.scss";
import Modal from "../Modal/Modal";
import { CalendarWidget, HourSelector, InputText, InputTextArea } from "../Inputs/Inputs";

const MonthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
]

const DaysNames = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota"
]

class CalendarView extends React.Component {
    WorkAreaScroll = React.createRef<any>()

    state = {
        ActaulDate: new Date(),
        WeekDay: [] as Date[],
        Mode: 2, // 1 - day 2 - week 3 - month
        AddModal: false,
    }

    componentDidMount(): void {
        this.scrollToHour()
    }

    private scrollToHour() {
        if (this.WorkAreaScroll.current) {
            const time = [
                this.state.ActaulDate.getHours(),
                this.state.ActaulDate.getMinutes()
            ]
            this.WorkAreaScroll.current.ScrollTo(`Hydra_calendarview_time_area_hours_item_${time[1] > 30 ? time[0] : time[0] + 1}${time[1] > 30 ? "00": "30"}`)
        }
    }

    public ChangeView(mode: number) {
        this.setState({...this.state, Mode: mode})
    }

    private GetLastDayOfMonth():Date {
        return new Date(new Date(this.state.ActaulDate).getTime() - 1);
    }
    
    getWeekCountOfMonth(year: number, month: number): number {
        // Create a new date object for the first day of the month
        const firstDayOfMonth = new Date(year, month, 1);
        
        // Get the day of the week for the first day of the month
        const firstDayOfWeek = firstDayOfMonth.getDay();
        
        // Calculate the number of days in the month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const totalDays = lastDayOfMonth.getDate();
        
        // Calculate the number of weeks
        const offset = (7 - firstDayOfWeek + 1) % 7; // Adjust for partial week at the beginning
        const weeks = Math.ceil((totalDays - offset) / 7) + 1; // Add one for the partial week at the end
        
        return weeks;
    }
      
    getMondaysOfMonth(day: number, max: number): Date[] {
        const RepDay = [
            1,
            2,
            3,
            4,
            5,
            6,
            0
        ]
        const mondays: Date[] = [];
        const date = new Date(this.state.ActaulDate.getFullYear(), this.state.ActaulDate.getMonth(), 1);
      
        // Find the first Monday of the month
        while (date.getDay() !== RepDay[day]) {
          date.setDate(date.getDate() + 1);
        }
      
        // Add all the Mondays of the month
        while (date.getMonth() === this.state.ActaulDate.getMonth()) {
          mondays.push(new Date(date));
          date.setDate(date.getDate() + 7);
        }
      
        return mondays;
    }

    private GetWeekDays(): Date[] {
        const daysOfWeek: Date[] = [];
        const currentDate = new Date(this.state.ActaulDate);
        currentDate.setDate(currentDate.getDate() - (currentDate.getDay() - 1));
        for (let i = 0; i < 7; i++) {
          const day = new Date(currentDate);
          daysOfWeek.push(day);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return daysOfWeek;
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_calendarview_main">
                <div className="Hydra_calendarview_header">
                    <div>
                        <div>
                            <IconButton
                                Icon={Next}
                                OnClick={() => {
                                    if (this.state.Mode === 1) 
                                        this.state.ActaulDate.setDate(this.state.ActaulDate.getDate() - 1)
                                    else if (this.state.Mode === 2)
                                        this.state.ActaulDate.setDate(this.state.ActaulDate.getDate() - 7)
                                    else 
                                        this.state.ActaulDate.setMonth(this.state.ActaulDate.getMonth() - 1)
                                    this.state.WeekDay = this.GetWeekDays()
                                    this.forceUpdate()
                                }}
                            />
                            <IconButton
                                Icon={Next}
                                style={{
                                    transform: "rotate(180deg)",
                                }}
                                OnClick={() => {
                                    if (this.state.Mode === 1) 
                                        this.state.ActaulDate.setDate(this.state.ActaulDate.getDate() + 1)
                                    else if (this.state.Mode === 2)
                                        this.state.ActaulDate.setDate(this.state.ActaulDate.getDate() + 7)
                                    else 
                                        this.state.ActaulDate.setMonth(this.state.ActaulDate.getMonth() + 1)
                                    this.state.WeekDay = this.GetWeekDays()
                                    this.forceUpdate()
                                }}
                            />
                        </div>
                        <h1>
                            {
                                (
                                    () => {
                                        switch(this.state.Mode) {
                                            case 1:
                                                return `${this.state.ActaulDate.getDate()} ${MonthNames[this.state.ActaulDate.getMonth()]} ${this.state.ActaulDate.getFullYear()}`
                                            case 2:
                                                if (this.state.WeekDay[0] == undefined) this.state.WeekDay = this.GetWeekDays()
                                                return `${this.state.WeekDay[0].getDate()} - ${this.state.WeekDay[this.state.WeekDay.length - 1].getDate()} ${MonthNames[this.state.ActaulDate.getMonth()]} ${this.state.ActaulDate.getFullYear()}`
                                            case 3:
                                                return `${MonthNames[this.state.ActaulDate.getMonth()]} ${this.state.ActaulDate.getFullYear()}`
                                        }
                                    }
                                )()
                            }
                        </h1>                        
                    </div>
                    <div>
                        <div 
                            onClick={() => {
                                this.setState({...this.state, AddModal: true})
                            }}
                            className="Hydra_calendarview_floatadd"
                        >
                            <a>Dodaj</a>
                            <Add/>
                        </div>
                        <span 
                            onClick={this.ChangeView.bind(this, 1)}
                            style={{borderRadius: "5px 0 0 5px"}}
                        >Dzień</span>
                        <span
                            onClick={this.ChangeView.bind(this, 2)}
                        >Tydzień</span>
                        <span 
                            onClick={this.ChangeView.bind(this, 3)}
                            style={{borderRadius: "0 5px 5px 0"}}
                        >Miesiąc</span>
                    </div>
                </div>

                <div className="Hydra_calendarview_workarea">
                    <div className="Hydra_calendarview_time_headers">
                        {this.state.Mode !== 3 && <div style={{flexShrink: 0}}></div>}
                        {
                            (
                                () => {
                                    const tab: React.ReactNode[] = []
                                    for(let i = 0; i < (this.state.Mode === 1 ? 1: 7); i++)
                                        tab.push(
                                            <div className="Hydra_calendarview_time_day">
                                                <p>
                                                    <b>{DaysNames[(this.state.Mode === 1 ? this.state.ActaulDate : this.state.WeekDay[i]).getDay()]}</b>
                                                    <br/>
                                                    {this.state.Mode !== 3 && (this.state.Mode === 1 ? this.state.ActaulDate : this.state.WeekDay[i]).toISOString().split("T")[0]}
                                                </p>
                                            </div>
                                        )
                                    return tab
                                }
                            )()
                        }
                    </div>
                    <ScrollArea ref={this.WorkAreaScroll}>
                        <div className="Hydra_calendarview_time_area">
                            {
                                this.state.Mode !== 3 && <div className="Hydra_calendarview_time_area_hours">
                                    {
                                        (
                                            () => {
                                                const tab: React.ReactNode[] = []
                                                for(let i = 1; i < 24; i+=1)
                                                {
                                                    tab.push(
                                                        <div id={`Hydra_calendarview_time_area_hours_item_${i}00`} className="Hydra_calendarview_time_area_hours_item">
                                                            <a>{i.toString().padStart(2, "0")}:00</a>
                                                        </div>
                                                    )
                                                    tab.push(
                                                        <div id={`Hydra_calendarview_time_area_hours_item_${i}30`} className="Hydra_calendarview_time_area_hours_item">
                                                            <a>{i.toString().padStart(2, "0")}:30</a>
                                                        </div>
                                                    )
                                                }
                                                return tab
                                            }
                                        )()
                                    }
                                </div>
                            }
                            {
                                (
                                    () => {
                                        const tab: React.ReactNode[] = []
                                        const max = this.getWeekCountOfMonth(this.state.ActaulDate.getFullYear(), this.state.ActaulDate.getMonth())
                                        let firsDay = new Date(this.state.ActaulDate)
                                        firsDay.setDate(0)
                                        firsDay.setDate(firsDay.getDate() - (firsDay.getDay() - 1))
                                        let maked = false

                                        for(let i = 0; i < (this.state.Mode === 1 ? 1: 7); i+=1)
                                        {
                                            let days = this.getMondaysOfMonth(i, max)
                                            if (days[0].getDate() !== 1 && !maked) {
                                                days = [new Date(firsDay)].concat(days)
                                                firsDay.setDate(firsDay.getDate() + 1)
                                            } else if (!maked) {
                                                maked = true
                                                firsDay = new Date(this.state.ActaulDate)
                                                firsDay.setMonth(firsDay.getMonth() + 1)
                                                firsDay.setDate(1)
                                            }

                                            tab.push(
                                                <div className="Hydra_calendarview_time_area_days">
                                                    {
                                                        (
                                                            () => {
                                                                const tab: React.ReactNode[] = []
                                                                for(let d = (this.state.Mode !== 3 ? 1: 0); d < (this.state.Mode !== 3 ? 24: max ) ; d+=1)
                                                                {
                                                                    if (this.state.Mode !== 3) {
                                                                        tab.push(
                                                                            <div className="Hydra_calendarview_time_area_days_empty"></div>
                                                                        )
                                                                    }
                                                                    tab.push(
                                                                        <div 
                                                                            className={"Hydra_calendarview_time_area_days_empty" + (this.state.Mode === 3 ? " Hydra_calendarview_time_area_days_empty_bit" : "")}>
                                                                            {
                                                                                (this.state.Mode === 3 && days[d] !== undefined) && <a className={(!maked && d === 0 )? "Hydra_calendarview_time_area_days_empty_notmonth" : ""}>{days[d].getDate()}</a>
                                                                            }
                                                                            {
                                                                                (this.state.Mode === 3 && days[d] === undefined ) && <a className="Hydra_calendarview_time_area_days_empty_notmonth">{firsDay.getDate()}</a>
                                                                            }
                                                                        </div>
                                                                    )
                                                                    if (this.state.Mode === 3 && days[d] === undefined) firsDay.setDate(firsDay.getDate() + 1)
                                                                }
                                                                return tab
                                                            }
                                                        )()
                                                    }
                                                </div>
                                            )
                                        }
                                        return tab
                                    }
                                )()
                            }
                        </div>
                    </ScrollArea>
                </div>
                <Modal
                    isOpen={this.state.AddModal}
                    OnClose={() => {
                        this.setState({...this.state, AddModal: false})
                    }}
                >
                    <form>
                        <InputText
                            placeholder="Nazwa"
                            type="text"
                        />
                        <div className="Hydra_calendarview_addmodal_timeselect">
                            <CalendarWidget/>
                            <HourSelector/>
                            <a>-</a>
                            <CalendarWidget/>
                            <HourSelector/>
                        </div>
                        <InputTextArea
                            placeholder="Opis"
                            style={{
                                marginTop: "10px",
                                height: "100px"
                            }}
                        />
                    </form>
                    <div style={{height: "30px", marginTop: "10px"}}>
                        <Button
                            text="Dodaj"
                            variant="filled"
                            style={{
                                float: "right"
                            }}
                        />
                        <Button
                            text="anuluj"
                            OnClick={() => {
                                this.setState({...this.state, AddModal: false})
                            }}
                            style={{
                                float: "right"
                            }}
                        />                        
                    </div>
                </Modal>
            </div>
        )
    }
}

export default CalendarView;
export {
    MonthNames
}