import * as vscode from "vscode";
import { exec } from 'child_process'
import * as fs from "fs";
import * as ncp  from "copy-paste";

export class PasteMe {

    constructor() { }

    async process(section: string) {
        let commands = vscode.workspace.getConfiguration("pasteMe").get(section) as string[];
        let newCommands = commands.map(this.replaceVar);
        let nestedItems = await Promise.all(newCommands.map(async x => await this.executeCommand(x)));
        let items = nestedItems.reduce((a,b) => a.concat(b), []);
        return items;
    }

    private async executeCommand(command: string) {
        var that = this;
        return new Promise<vscode.QuickPickItem[]>(resolve => {
            let items: vscode.QuickPickItem[] = [];
            exec(command, (err, stdout, stderr) => {
                if (!err) {
                    let results = stdout.split('\n').filter(x => x.trim() != "").map(that.creatItem);
                    results.forEach(x => items.push(x));
                }
                resolve(items);
            });
        })
    }

    private replaceVar(command: string) {
        var name = vscode.window.activeTextEditor.document.fileName;
        var root = vscode.workspace.rootPath;
        return command.replace("${fileName}", name).replace("${rootPath}", root);
    }

    private creatItem(title: string) {
        let item = { label: title, description: "" };
        return item;
    }

    async executeLineCommand() {
        let editor = vscode.window.activeTextEditor;
        if(editor) {
            let position = editor.selection.start
            let line = editor.document.lineAt(position)
            let text = line.text

            ncp.copy(text + '\n', function () {
               vscode.commands.executeCommand("workbench.action.terminal.paste"); 
               editor.show();
            });
        }
    }

    async showFiles() {
        let items = await this.process("files");
        let options = { placeholder: "Select file" };
        let quickPick = vscode.window.showQuickPick(items, options);
        quickPick.then(result => {
            if(result) {
                let file = result.label;
                fs.readFile(file, "utf8", function (err,data) {
                    if(err) console.log(err);
                    else {
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

    async showItems() {
        let items = await this.process("commands");
        let options = { placeholder: "Select text" };
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