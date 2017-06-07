import * as vscode from "vscode";

import { exec } from 'child_process'

export class PasteMe {

    items: vscode.QuickPickItem[] = [];

    constructor() {
        this.clearItems();
        let commands = vscode.workspace.getConfiguration("pasteMe").get("commands") as string[];
        let newCommands = commands.map(this.replaceVar);
        newCommands.forEach(x => this.executeCommand(x));
    }

    private executeCommand(command: string) {
        var that = this;
        exec(command, (err, stdout, stderr) => {
            if (!err) {
                let results = stdout.split('\n').map(that.creatItem);
                this.appends(results);
            }
        });
    }

    private appends(items: vscode.QuickPickItem[]) {
        items.forEach(x => this.items.push(x));
    }

    private replaceVar(command: string) {
        var name = vscode.window.activeTextEditor.document.fileName;
        var root = vscode.workspace.rootPath;
        return command.replace("${fileName}", name).replace("${rootPath}", root);
    }

    private clearItems() {
        this.items = [];
    }

    private creatItem(title: string) {
        let item = { label: title, description: "" };
        return item;
    }

    showItems() {
        let options = { placeholder: "Select text" };
        let quickPick = vscode.window.showQuickPick(this.items, options);
        quickPick.then(result => {
            let text = result.label;
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(et => {
                    et.insert(editor.selection.start, text);
                });
            }
        });
    }
}