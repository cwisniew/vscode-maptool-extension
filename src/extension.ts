// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { mapToolAddOn } from "./MapToolAddOn";
import { MapToolAddOnInfoProvider } from "./MapToolAddOnInfoProvider";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "maptool-add-on" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "maptool-add-on.MapToolAddOn",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "maptool-add-on rootPath: " + rootPath
      );
    }
  );

  vscode.commands.registerCommand(
    "maptool-add-on.createSkeleton",
    () => {
      if (rootPath) {
        mapToolAddOn.createSkeleton(rootPath);
        vscode.window.showInformationMessage("Created Add-On Skeleton");
        mapToolAddOnInfoProvider.refresh();
      } else {
        vscode.window.showInformationMessage("No workspace folder");
      }
    }
  )


  context.subscriptions.push(disposable);

  const mapToolAddOnInfoProvider = new MapToolAddOnInfoProvider(rootPath);
  vscode.window.registerTreeDataProvider(
    "mapToolAddOnInfo",
    mapToolAddOnInfoProvider
  );
  vscode.commands.registerCommand(
    "maptool-add-on.refreshView",
    () => mapToolAddOnInfoProvider.refresh()
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
