import React from "react";
import "./FilesSideBar.scss";
import ScrollArea from "../ScrollArea/Scrollarea";
import { IconButton } from "../Buttons/Buttons";
import {ReactComponent as AddFile} from "../../Images/file.svg";
import {ReactComponent as AddFolder} from "../../Images/addfolder.svg";
import {ReactComponent as ArrowDown} from "../../Images/down.svg";

interface FileStructure {
    [key: string]: string | FileStructure;
}

declare global {
    interface Window {
        files: {
            pathWalk: (arg: string) => Promise<void>
        }
    }
}

class FilesSideBar extends React.Component {

    state = {
        Files: {
            "Folder 1": {
                "Plik 1#1": "dsadklsaj",
                "Plik 1#2": "dsadklsaj",
                "Folder 1#1": {
                    "Plik 1#2": "dsadklsaj",
                } as FileStructure
            } as FileStructure,
            "Plik1" : "dsa"
        } as FileStructure
    }

    componentDidMount(): void {
        const resp = window.files.pathWalk("/Users/michalratajewski/hydra/src/").then(
            e => {
                console.log("front", e)
            }
        )
        

    }

    private PrintFilesList(fileStructure: FileStructure) {
        const renderFileStructure = (structure: FileStructure) => {
            return Object.entries(structure).map(([name, value]) => {
              if (typeof value === 'string') {
                return <li key={name}><span>{name}</span></li>;
              }
        
              return (
                <li key={name}>
                    <div>
                        <ArrowDown/>
                        <a>{name}</a>                        
                    </div>
                    <ul>{renderFileStructure(value)}</ul>
                </li>
              );
            });
          };
        
        return <ul className="Hydra_filesbar_main_list">{renderFileStructure(fileStructure)}</ul>;
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_filesbar">
                <div className="Hydra_filesbar_header">
                    <b>Projekty</b>
                    <div className="Hydra_filesbar_header_functions">
                        <IconButton
                            Icon={AddFile}
                        />
                        <IconButton
                            Icon={AddFolder}
                        />
                    </div>
                </div>
                <div className="Hydra_filesbar_workarea">
                    <ScrollArea>
                        {
                            this.PrintFilesList(this.state.Files)
                        }
                    </ScrollArea>
                </div>
            </div>
        )
    }

}

export default FilesSideBar;