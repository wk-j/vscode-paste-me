'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PasteMe } from "./paste";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let ins = new PasteMe();

    let texts = vscode.commands.registerCommand('extension.pasteMe.showTexts', () => {
        ins.showItems();
    });

    let files = vscode.commands.registerCommand("extension.pasteMe.showFiles", () => {
        ins.showFiles();
    });

    context.subscriptions.push(texts);
}

// this method is called when your extension is deactivated
export function deactivate() {
}