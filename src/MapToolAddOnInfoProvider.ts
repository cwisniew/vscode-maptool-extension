import path = require("path");
import * as vscode from "vscode";
import * as fs from "fs";

import { LIBRARY_DEFINITON_FILE } from "./constants";
import { workspace } from "vscode";

export class MapToolAddOnInfoProvider
  implements vscode.TreeDataProvider<MTAddOnInfo>
{
  constructor(private workspaceRoot: string | undefined) { }

  getTreeItem(
    element: MTAddOnInfo
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: MTAddOnInfo): vscode.ProviderResult<MTAddOnInfo[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No dependency in empty workspace");
      return Promise.resolve([]);
    }
    if (element) {
      if (element.label === "Library Info") {
        const vals =  Promise.resolve(this.getLibraryInfo());
        return vals
      }
    } else {
      return Promise.resolve([
        new MTAddOnInfo(
          "Library Info",
          "Add-On Library Info",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
        new MTAddOnInfo(
          "Properties",
          "Macro Script Properties",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
        new MTAddOnInfo(
          "Events",
          "Events",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
      ]);
    }
  }

  private getLibraryInfo(): MTAddOnInfo[] {
    let info: MTAddOnInfo[] = [];
    if (this.workspaceRoot) {
      const libInfoFile = path.join(this.workspaceRoot, LIBRARY_DEFINITON_FILE);
      if (this.pathExists(libInfoFile)) {
        const libInfo = JSON.parse(fs.readFileSync(libInfoFile, "utf8"));
        vscode.window.showInformationMessage(libInfo);
        info.push(this.simpleInfoEntry(libInfo, "name"));
        info.push(this.simpleInfoEntry(libInfo, "version"));
        info.push(this.simpleInfoEntry(libInfo, "description"));
        info.push(this.simpleInfoEntry(libInfo, "namespace"));
        if (libInfo["allowsUriAccess"]) {
          info.push(new MTAddOnInfo("Allows URI Access", "Yes", vscode.TreeItemCollapsibleState.None));
        } else {
          info.push(new MTAddOnInfo("Allows URI Access", "No", vscode.TreeItemCollapsibleState.None));
        }
      } else {
        info.push(new MTAddOnInfo("Invalid libary.json file", "", vscode.TreeItemCollapsibleState.None));
      }
    }
    return info;
  }

  private simpleInfoEntry(values: any, name: string): MTAddOnInfo {
    return new MTAddOnInfo(name, values[name], vscode.TreeItemCollapsibleState.None);
  }

  private pathExists(filePath: string): boolean {
    if (!this.workspaceRoot) {
      return false;
    }
    try {
      fs.accessSync(filePath);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class MTAddOnInfo extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  };

}
