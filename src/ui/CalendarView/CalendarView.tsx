import React from "react";
import ScrollArea from "../ScrollArea/Scrollarea";
import { IconButton } from "../Buttons/Buttons";
import {ReactComponent as Next} from "../../Images/nextday.svg";
import "./CalendarView.scss";

class CalendarView extends React.Component {

    render(): React.ReactNode {
        return (
            <div className="Hydra_calendarview_main">
                <div className="Hydra_calendarview_header">
                    <div>
                        <div>
                            <IconButton
                                Icon={Next}
                            />
                            <IconButton
                                Icon={Next}
                                style={{
                                    transform: "rotate(180deg)",
                                }}
                            />
                        </div>
                        <h1>1 - 7 kwiecień 2023</h1>                        
                    </div>
                    <div>
                        <span style={{borderRadius: "5px 0 0 5px"}}>Dzień</span>
                        <span>Tydzień</span>
                        <span style={{borderRadius: "0 5px 5px 0"}}>Miesiąc</span>
                    </div>
                </div>
                <div className="Hydra_calendarview_workarea">
                    <div className="Hydra_calendarview_time_headers">
                        <div style={{flexShrink: 0}}></div>
                        {
                            (
                                () => {
                                    const tab: React.ReactNode[] = []
                                    for(let i = 0; i < 7; i++)
                                        tab.push(
                                            <div className="Hydra_calendarview_time_day">
                                                <p>
                                                    <b>Poniedziałek</b>
                                                    <br/>
                                                    01.05.2023
                                                </p>
                                            </div>
                                        )
                                    return tab
                                }
                            )()
                        }

                    </div>
                    <ScrollArea>
                        <div className="Hydra_calendarview_time_area">
                            <div className="Hydra_calendarview_time_area_hours">
                                {
                                    (
                                        () => {
                                            const tab: React.ReactNode[] = []
                                            for(let i = 1; i < 24; i+=1)
                                            {
                                                tab.push(
                                                    <div className="Hydra_calendarview_time_area_hours_item">
                                                        <a>{i.toString().padStart(2, "0")}:00</a>
                                                    </div>
                                                )
                                                tab.push(
                                                    <div className="Hydra_calendarview_time_area_hours_item">
                                                        <a>{i.toString().padStart(2, "0")}:30</a>
                                                    </div>
                                                )
                                            }
                                            return tab
                                        }
                                    )()
                                }
                            </div>
                            {
                                (
                                    () => {
                                        const tab: React.ReactNode[] = []
                                        for(let i = 0; i < 7; i+=1)
                                        {
                                            tab.push(
                                                <div className="Hydra_calendarview_time_area_days">
                                                    {
                                                        (
                                                            () => {
                                                                const tab: React.ReactNode[] = []
                                                                for(let i = 1; i < 24; i+=1)
                                                                {
                                                                    tab.push(
                                                                        <div className="Hydra_calendarview_time_area_days_empty"></div>
                                                                    )
                                                                    tab.push(
                                                                        <div className="Hydra_calendarview_time_area_days_empty"></div>
                                                                    )
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
            </div>
        )
    }
}

export default CalendarView;