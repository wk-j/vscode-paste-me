import * as vscode from "vscode";
import { PasteMe } from "./paste";

export function activate(context: vscode.ExtensionContext) {
    let ins = new PasteMe();
    let texts = vscode.commands.registerCommand("extension.pasteMe.showTexts", () => {
        ins.showItems();
    });
    let files = vscode.commands.registerCommand("extension.pasteMe.showFiles", () => {
        ins.showFiles();
    });
    let command = vscode.commands.registerCommand("extension.pasteMe.executeCommand", () => {
        ins.executeLineCommand();
    });
    context.subscriptions.push(texts);
}

export function deactivate() { }