import HeadBar from "../Headbar/Headbar";
import SideBar from "../Sidebar/Sidebar";
import TabSystem from "../TabUI/WorkArea";
import "./Main.scss"

function MainView() {
    return (
        <div className="Hydra_mainview">
            <HeadBar/>
            <div className="Hydra_workarea">
                <SideBar/>
                <TabSystem/>
            </div>
        </div>
    )
}

export default MainView;