import * as vscode from "vscode";

import { exec } from 'child_process'

export class PasteMe {


    constructor() { }

    async process() {
        let commands = vscode.workspace.getConfiguration("pasteMe").get("commands") as string[];
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

    async showItems() {
        let items = await this.process();
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