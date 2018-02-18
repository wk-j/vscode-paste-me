import { exec } from "child_process"
import * as fs from "fs";
import * as vscode from "vscode";

import { QuickPickOptions } from "vscode"
import { Executor } from "./executor";

export class PasteMe {

    constructor() { }

    private async process(section: string) {
        let commands = vscode.workspace.getConfiguration("pasteMe").get(section) as string[];
        let newCommands = commands.map(this.replaceVar);
        let nestedItems = await Promise.all(newCommands.map(async x => await this.executeCommand(x)));
        let items = nestedItems.reduce((a, b) => a.concat(b), []);
        return items;
    }

    private async executeCommand(command: string) {
        let that = this;
        return new Promise<vscode.QuickPickItem[]>(resolve => {
            let items: vscode.QuickPickItem[] = [];
            exec(command, (err, stdout, stderr) => {
                if (!err) {
                    let results = stdout.split("\n").filter(x => x.trim() !== "").map(that.creatItem);
                    results.forEach(x => items.push(x));
                }
                resolve(items);
            });
        })
    }

    private replaceVar(command: string) {
        let name = vscode.window.activeTextEditor.document.fileName;
        let root = vscode.workspace.rootPath;
        return command.replace("${fileName}", name).replace("${rootPath}", root);
    }

    private creatItem(title: string) {
        let item = { label: title, description: "" };
        return item;
    }

    public async executeLineCommand() {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let start = editor.selection.start.line;
            let end = editor.selection.end.line;
            if (end - start > 0) {
                // tslint:disable-next-line:max-line-length
                let range = new vscode.Range(editor.selection.anchor.line, editor.selection.anchor.character, editor.selection.active.line, editor.selection.active.character)
                let text = editor.document.getText(range)
                Executor.runInTerminal(text)
            } else {
                let position = editor.selection.start
                let line = editor.document.lineAt(position)
                let text = line.text
                Executor.runInTerminal(text)
            }
        }
    }

    public async showFiles() {
        let items = await this.process("files");
        let options = { placeHolder: "Select file" };
        let quickPick = vscode.window.showQuickPick(items, options);
        quickPick.then(result => {
            if (result) {
                let file = result.label;
                fs.readFile(file, "utf8", (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let editor = vscode.window.activeTextEditor;
                        if (editor) {
                            editor.edit(et => {
                                et.insert(editor.selection.start, data);
                            });
                        }
                    }
                });
            }
        });
    }

    public async showItems() {
        let items = await this.process("commands");
        let options = { placeHolder: "Select text" };
        let quickPick = vscode.window.showQuickPick(items, options);
        quickPick.then(result => {
            if (result) {
                let text = result.label;
                let editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit(et => {
                        et.insert(editor.selection.start, text);
                    });
                }
            }
        });
    }
}