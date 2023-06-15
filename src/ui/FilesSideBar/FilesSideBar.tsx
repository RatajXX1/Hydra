import React from "react";
import "./FilesSideBar.scss";
import ScrollArea from "../ScrollArea/Scrollarea";
import { Button, IconButton } from "../Buttons/Buttons";
import {ReactComponent as AddFile} from "../../Images/file.svg";
import {ReactComponent as AddFolder} from "../../Images/addfolder.svg";
import {ReactComponent as ArrowDown} from "../../Images/down.svg";
import Modal from "../Modal/Modal";
import { InputText } from "../Inputs/Inputs";
import BlockEditor from "../BlockEditor/BlockEditor";
import ProjectView from "../Project/ProjectView";

type FilesSideBarProps = {
    Title: string;
    MainPath: string,
    Mode: "notes" | "projects"
}

interface FileStructure {
    [key: string]: string | FileStructure;
}

declare global {
    interface Window {
        files: {
            pathWalk: (arg: string) => Promise<FileStructure>,
            makeDir: (arg: string) => boolean,
            removeFile: (arg: string) => boolean,
            writeFile: (arg: string, arg1: string) => boolean,
        }
    }
}

class FilesSideBar extends React.Component<FilesSideBarProps> {
    FileOpt = React.createRef<any>()
    
    state = {
        Files: {} as FileStructure,
        AddModal: false,
        OptionsMode: 1, // 1 - folder 2 - file
        OptionPath: "",
        FileName: ""
    }

    componentDidMount(): void {
        this.GetFileFromFolder()        
    }

    private GetFileFromFolder() {
        window.files.pathWalk(this.props.MainPath).then(
            e => {
                this.setState({
                    ...this.state,
                    Files: e
                })
            }
        )
    }

    pathJoin(path: string, pathb: string): string {
        if (path[path.length - 1] === "/") return path + pathb
        else return path + "/" + pathb
    }

    private FileOptions(ev: React.MouseEvent, mode: number, path: string, file: boolean) {
        if (this.FileOpt.current && ev.button === 2) {
            this.setState({
                ...this.state,
                OptionsMode: mode,
                OptionPath: path
            })
            const styles = getComputedStyle(this.FileOpt.current)
            if (styles && styles.display !== "flex")
                this.FileOpt.current.style.display = "flex"
            if (ev.clientY + this.FileOpt.current.clientHeight > document.body.clientHeight) 
                this.FileOpt.current.style.top = `${ev.clientY - this.FileOpt.current.clientHeight}px`
            else this.FileOpt.current.style.top = `${ev.clientY - 20}px`
            this.FileOpt.current.style.left = `${ev.clientX - 50}px`
        } else if (ev.button === 0 && file) {
            const name = path.split("/")
            if (this.props.Mode === "notes") {
                window.addTab(name[name.length - 1], <BlockEditor FilePath={path}/>)
            } else {
                window.addTab(name[name.length - 1], <ProjectView FilePath={path}/>)
            }
        }
    }

    private FileOptionsOff() {
        if (this.FileOpt.current) {
            const styles = getComputedStyle(this.FileOpt.current)
            if (styles && styles.display === "flex")
                this.FileOpt.current.style.display = "none" 
        }
    }

    private PrintFilesList(fileStructure: FileStructure) {
        const renderFileStructure = (structure: FileStructure, filepath: string) => {
            return Object.entries(structure).map(([name, value]) => {
              if (typeof value === 'string') {
                return <li onMouseUp={(ev: React.MouseEvent) => this.FileOptions(ev, 2, value, true)} key={name}><span>{name}</span></li>;
              }
        
              return (
                <li key={name}>
                    <div onMouseUp={(ev: React.MouseEvent) => this.FileOptions(ev, 1, this.pathJoin(filepath ,name,), false)}>
                        <ArrowDown/>
                        <a>{name}</a>                        
                    </div>
                    <ul>{renderFileStructure(value, this.pathJoin(filepath ,name))}</ul>
                </li>
              );
            });
        };
        
        return <ul className="Hydra_filesbar_main_list">{renderFileStructure(fileStructure, this.props.MainPath)}</ul>;
    }

    render(): React.ReactNode {
        return (
            <div className="Hydra_filesbar">
                <div className="Hydra_filesbar_header">
                    <b>{this.props.Title}</b>
                    <div className="Hydra_filesbar_header_functions">
                        <IconButton
                            Icon={AddFile}
                        />
                        <IconButton
                            Icon={AddFolder}
                            OnClick={
                                () => {
                                    if (!this.state.AddModal) this.setState({...this.state, AddModal: true})
                                }
                            }
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
                <div 
                    onMouseLeave={this.FileOptionsOff.bind(this)}
                    style={{display: "none"}}
                    ref={this.FileOpt} 
                    className="Hydra_filesbar_workarea_file_options"
                >
                    {
                        this.state.OptionsMode === 2 &&
                        <div className="Hydra_filesbar_workarea_file_options_item">
                            <span>Otwórz</span>
                        </div>
                    }
                    {
                        this.state.OptionsMode === 1 &&
                        <div 
                            onClick={
                                () => {
                                    if (!this.state.AddModal) this.setState({...this.state, AddModal: true})
                                    this.FileOptionsOff()
                                }
                            }
                            className="Hydra_filesbar_workarea_file_options_item">
                            <span>Nowy folder</span>
                        </div>
                    }
                    {
                        this.state.OptionsMode === 1 &&
                        <div 
                            onClick={
                                () => {
                                    if (!this.state.AddModal) this.setState({...this.state,OptionsMode:2, AddModal: true})
                                    this.FileOptionsOff()
                                }
                            }
                            className="Hydra_filesbar_workarea_file_options_item"
                        >
                            <span>Nowy plik</span>
                        </div>
                    }
                    <div className="Hydra_filesbar_workarea_file_options_divider"></div>
                    <div className="Hydra_filesbar_workarea_file_options_item">
                        <span>Usuń</span>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.AddModal}
                    OnClose={
                        () => {
                            if (this.state.AddModal) this.setState({...this.state, AddModal: false})
                        }
                    }
                >
                    <InputText
                        className="Hydra_filesbar_modal_input"
                        Icon={this.state.OptionsMode === 1 ? AddFolder : AddFile}
                        type="text"
                        placeholder={this.state.OptionsMode === 1 ? "Dodaj folder" : "Dodaj nowy plik"}
                        OnChangeValue={(e) => {
                            this.state.FileName = e.target.value
                        }}
                    />
                    <div style={{
                        width: "100%",
                        height: "25px"
                    }}>
                        <Button
                            text="Dodaj"
                            variant="filled"
                            style={{
                                float: "right",
                                marginRight: "5px"
                            }}
                            OnClick={
                                () => {
                                    if (this.state.FileName.trim().length === 0) {
                                        alert("Pole nie moze byc puste!")
                                        return
                                    }
                                    if (this.state.OptionsMode === 1) {
                                        const resp = window.files.makeDir(this.pathJoin(this.state.OptionPath , this.state.FileName))
                                        if (!resp) {
                                            alert("Folder o takiej nazwi juz istnieje!")
                                            return
                                        }
                                    } else {
                                        const resp = window.files.writeFile(this.pathJoin(this.state.OptionPath, this.state.FileName + ".json"), "")
                                        if (!resp) {
                                            alert("Folder o takiej nazwi juz istnieje!")
                                            return
                                        }
                                    }
                                    
                                    if (this.state.AddModal) {
                                        this.setState(
                                            {...this.state, AddModal: false},
                                            () => {
                                                this.GetFileFromFolder()
                                            }
                                        )
                                    }
                                }
                            }
                        />
                        <Button
                            text="Anuluj"
                            style={{
                                float: "right",
                                marginRight: "5px"
                            }}
                            OnClick={
                                () => {
                                    if (this.state.AddModal) this.setState({...this.state, AddModal: false})
                                }
                            }
                        />                        
                    </div>
                </Modal>
            </div>
        )
    }

}

export default FilesSideBar;