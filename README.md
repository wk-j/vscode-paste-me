## Paste Me

[![Version](https://vsmarketplacebadge.apphb.com/version/wk-j.vscode-paste-me.svg)](https://marketplace.visualstudio.com/items?itemName=wk-j.vscode-paste-me) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/wk-j.vscode-paste-me.svg)](https://marketplace.visualstudio.com/items?itemName=wk-j.vscode-paste-me)

Generate list of quick paste items from command line.

![](https://github.com/wk-j/vscode-paste-me/raw/master/images/screen.png)

## Settings

```json
{
    "pasteMe": {
        "files": [
            "mdfind -name .snippet",
        ],
        "commands": [
            "h-extensions",
            "h-reference \"${rootPath}\" \"${fileName}\""
        ]
    }
}
```

##  Usage

### Paste text

- `Command + Shift + J`
- Select item

### Paste file content

- `Command + Shift + U`
- Select file

### Send current line (or selection) to terminal

- `Command + Shift + N`