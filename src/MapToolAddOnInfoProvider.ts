/*
 * This software Copyright by the RPTools.net development team, and
 * licensed under the Affero GPL Version 3 or, at your option, any later
 * version.
 *
 * MapTool Source Code is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * You should have received a copy of the GNU Affero General Public
 * License * along with this source Code.  If not, please visit
 * <http://www.gnu.org/licenses/> and specifically the Affero license
 * text at <http://www.gnu.org/licenses/agpl.html>.
 */

import path = require('path');
import * as vscode from 'vscode';
import * as fs from 'fs';

import {
  ADDON_CONTENT_DIR,
  EVENTS_DEFINITION_FILE,
  LIBRARY_DEFINITON_FILE,
  MACRO_SCRIPT_PROPERTIES_FILE,
  MTSCRIPT_DIR,
  PUBLIC_DIR,
  SRC_DIR,
} from './constants';
import { workspace } from 'vscode';

/**
 * Provider class for the MapTool Add-On information in the tree view.
 */
export class MapToolAddOnInfoProvider
  implements vscode.TreeDataProvider<MTAddOnInfo>
{
  /**
   * The source directory of the add-on.
   */
  private sourceDir: string | undefined;

  /**
   * Creates a new instance of the provider.
   * @param workspaceRoot the root of the workspace.
   */
  constructor(private workspaceRoot: string | undefined) {
    if (workspaceRoot) {
      this.sourceDir = path.join(workspaceRoot, SRC_DIR);
    }
  }

  /**
   * Returns the tree items for the tree view.
   * @param element the element.
   * @returns tree item containing the information.
   */
  getTreeItem(
    element: MTAddOnInfo,
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  /**
   * Gets the children of the element.
   * @param element the parent element.
   * @returns the children of the element.
   */
  getChildren(element?: MTAddOnInfo): vscode.ProviderResult<MTAddOnInfo[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage(
        'No MapTool Add On in empty workspace',
      );
      return Promise.resolve([]);
    }
    if (element) {
      switch (element.id) {
        case 'Library Info':
          return Promise.resolve(this.getLibraryInfo());
        case 'Macro Properties':
          return Promise.resolve(this.getMacroScriptProperties());
        case 'Events':
          return Promise.resolve(this.getEvents());
        case 'Events List':
          return Promise.resolve(this.getEventsList());
        case 'Legacy Events List':
          return Promise.resolve(this.getLegacyEventsList());
      }
    } else {
      if (
        this.sourceDir &&
        this.pathExists(path.join(this.sourceDir, LIBRARY_DEFINITON_FILE))
      ) {
        vscode.window.showInformationMessage(this.sourceDir);
        return Promise.resolve([
          new MTAddOnInfo(
            'Library Info',
            'Library Info',
            'Add-On Library Info',
            vscode.TreeItemCollapsibleState.Collapsed,
          ),
          new MTAddOnInfo(
            'Macro Properties',
            'Properties',
            'Macro Script Properties',
            vscode.TreeItemCollapsibleState.Collapsed,
          ),
          new MTAddOnInfo(
            'Events',
            'Events',
            'Events',
            vscode.TreeItemCollapsibleState.Collapsed,
          ),
        ]);
      } else {
        vscode.window.showInformationMessage(
          'No MapTool Add On in empty workspace',
        );
        return Promise.resolve([
          new MTAddOnInfo(
            'Create Add-On',
            'Create',
            'Add-On structure',
            vscode.TreeItemCollapsibleState.None,
            {
              command: 'maptool-add-on.createSkeleton',
              title: 'Create Add On Structure',
              arguments: [this.workspaceRoot],
            },
          ),
        ]);
      }
    }
  }

  /**
   * Returns objects that can be used to display the library information.
   * @returns The tree item values.
   */
  private getLibraryInfo(): MTAddOnInfo[] {
    const info: MTAddOnInfo[] = [];
    if (this.sourceDir) {
      const libInfoFile = path.join(this.sourceDir, LIBRARY_DEFINITON_FILE);
      if (this.pathExists(libInfoFile)) {
        const libInfo = JSON.parse(fs.readFileSync(libInfoFile, 'utf8'));
        info.push(
          new MTAddOnInfo(
            'Open library.json',
            'Open',
            'library.json file',
            vscode.TreeItemCollapsibleState.None,
            {
              command: 'vscode.open',
              title: 'Open',
              arguments: [vscode.Uri.file(libInfoFile)],
            },
          ),
        );
        info.push(this.simpleInfoEntry('library name', libInfo, 'name'));
        info.push(this.simpleInfoEntry('library version', libInfo, 'version'));
        info.push(
          this.simpleInfoEntryWithLabel(
            'library short description',
            libInfo,
            'shortDescription',
            'Short Description',
          ),
        );
        info.push(
          this.simpleInfoEntry('library namespace', libInfo, 'namespace'),
        );

        const readMePath = path.join(
          this.sourceDir,
          ADDON_CONTENT_DIR,
          libInfo.readMeFile,
        );
        const readMeItem = this.simpleInfoEntryWithLabel(
          'Read Me File',
          libInfo,
          'readMeFile',
          'Read Me',
          {
            command: 'vscode.open',
            title: 'Open Read Me',
            tooltip: 'Open Read Me',
            arguments: [vscode.Uri.file(readMePath)],
          },
        );
        info.push(readMeItem);

        const licensePath = path.join(
          this.sourceDir,
          ADDON_CONTENT_DIR,
          libInfo.licenseFile,
        );
        const licenseItem = this.simpleInfoEntryWithLabel(
          'License File',
          libInfo,
          'licenseFile',
          'License File',
          {
            command: 'vscode.open',
            title: 'Open License File',
            tooltip: 'Open License File',
            arguments: [vscode.Uri.file(licensePath)],
          },
        );
        info.push(licenseItem);

        if (libInfo['allowsUriAccess']) {
          info.push(
            new MTAddOnInfo(
              'Allow URI',
              'Allows URI Access',
              'Yes',
              vscode.TreeItemCollapsibleState.None,
            ),
          );
        } else {
          info.push(
            new MTAddOnInfo(
              'Allow URI',
              'Allows URI Access',
              'No',
              vscode.TreeItemCollapsibleState.None,
            ),
          );
        }
      } else {
        info.push(
          new MTAddOnInfo(
            'Create library.json',
            'Invalid libary.json file',
            '',
            vscode.TreeItemCollapsibleState.None,
          ),
        );
      }
    }
    return info;
  }

  /**
   * Creates the tree item values for the macro script properties.
   * @returns The tree item values.
   */
  private getMacroScriptProperties(): MTAddOnInfo[] {
    const info: MTAddOnInfo[] = [];
    if (this.sourceDir) {
      const mtsPropertyFile = path.join(
        this.sourceDir,
        MACRO_SCRIPT_PROPERTIES_FILE,
      );
      if (this.pathExists(mtsPropertyFile)) {
        const mtsProperty = JSON.parse(
          fs.readFileSync(mtsPropertyFile, 'utf8'),
        );
        info.push(
          new MTAddOnInfo(
            'Open mts_properties.json',
            'Open',
            'mts_properties.json file',
            vscode.TreeItemCollapsibleState.None,
            {
              command: 'vscode.open',
              title: 'Open',
              arguments: [vscode.Uri.file(mtsPropertyFile)],
            },
          ),
        );
        if (mtsProperty.properties) {
          for (const prop of mtsProperty.properties) {
            const filePath = vscode.Uri.file(
              path.join(
                this.sourceDir,
                ADDON_CONTENT_DIR,
                MTSCRIPT_DIR,
                prop.filename,
              ),
            );
            const entry = new MTAddOnInfo(
              'open property ' + prop.filename,
              'file',
              prop.autoExecute
                ? prop.filename + ' {auto execute}'
                : prop.filename,
              vscode.TreeItemCollapsibleState.None,
              {
                command: 'vscode.open',
                title: 'Open',
                arguments: [filePath],
              },
            );
            entry.tooltip = prop.description;
            info.push(entry);
          }
        }
      }
    }
    return info;
  }

  /**
   * Returns the tree item values for the events.
   * @returns the events details for the tree view.
   */
  private getEvents(): MTAddOnInfo[] {
    const info: MTAddOnInfo[] = [];
    if (this.sourceDir) {
      const eventsFile = path.join(this.sourceDir, EVENTS_DEFINITION_FILE);
      if (this.pathExists(eventsFile)) {
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        info.push(
          new MTAddOnInfo(
            'Open events.json',
            'Open',
            'events.json file',
            vscode.TreeItemCollapsibleState.None,
            {
              command: 'vscode.open',
              title: 'Open',
              arguments: [vscode.Uri.file(eventsFile)],
            },
          ),
        );
        info.push(
          new MTAddOnInfo(
            'Events List',
            'Events',
            '',
            vscode.TreeItemCollapsibleState.Collapsed,
          ),
        );
        info.push(
          new MTAddOnInfo(
            'Legacy Events List',
            'Legacy Events',
            '',
            vscode.TreeItemCollapsibleState.Collapsed,
          ),
        );
      }
    }
    return info;
  }

  /**
   * Returns the tree item values for the legacy events.
   * @returns the legacy events details for the tree view.
   */
  getLegacyEventsList(): MTAddOnInfo[] {
    const info: MTAddOnInfo[] = [];
    if (this.sourceDir) {
      const eventsFile = path.join(this.sourceDir, EVENTS_DEFINITION_FILE);
      if (this.pathExists(eventsFile)) {
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        if (events.legacyEvents) {
          for (const event of events.legacyEvents) {
            const entry = new MTAddOnInfo(
              'open legacy event ' + event.name,
              'file',
              event.name,
              vscode.TreeItemCollapsibleState.None,
              {
                command: 'vscode.open',
                title: 'Open',
                arguments: [vscode.Uri.file(this.findPath(event.mts + '.mts'))],
              },
            );
            entry.tooltip = event.description;
            info.push(entry);
          }
        }
      }
    }
    return info;
  }

  /**
   * Finds and returns the path to the specified file.
   * @param fpath the partial path to find
   * @returns the path for the partial path
   */
  private findPath(fpath: string): string {
    if (!this.sourceDir) {
      return fpath;
    }

    let testPath = path.join(
      this.sourceDir,
      ADDON_CONTENT_DIR,
      MTSCRIPT_DIR,
      PUBLIC_DIR,
      fpath,
    );
    if (this.pathExists(testPath)) {
      return testPath;
    }

    testPath = path.join(
      this.sourceDir,
      ADDON_CONTENT_DIR,
      MTSCRIPT_DIR,
      fpath,
    );
    if (this.pathExists(testPath)) {
      return testPath;
    }

    return fpath;
  }

  /**
   * Creates the tree item values for the events.
   * @returns The tree item values.
   */
  getEventsList(): MTAddOnInfo[] {
    const info: MTAddOnInfo[] = [];
    if (this.sourceDir) {
      const eventsFile = path.join(this.sourceDir, EVENTS_DEFINITION_FILE);
      if (this.pathExists(eventsFile)) {
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        if (events.events) {
          for (const event of events.events) {
            const entry = new MTAddOnInfo(
              'open event ' + event.name,
              'file',
              event.name,
              vscode.TreeItemCollapsibleState.None,
              {
                command: 'vscode.open',
                title: 'Open',
                arguments: [vscode.Uri.file(this.findPath(event.mts + '.mts'))],
              },
            );
            entry.tooltip = event.description;
            info.push(entry);
          }
        }
      }
    }
    return info;
  }

  /**
   * Creates a simple info entry for the tree view.
   * @param id The id of the entry.
   * @param values The object which contains the values to display.
   * @param name  The name of the value.
   * @param command The command to execute.
   * @returns info entry for the tree view.
   */
  private simpleInfoEntry(
    id: string,
    values: any,
    name: string,
    command?: vscode.Command,
  ): MTAddOnInfo {
    return new MTAddOnInfo(
      id,
      name,
      values[name],
      vscode.TreeItemCollapsibleState.None,
      command,
    );
  }

  /**
   * Creates a simple info entry for the tree view.
   * @param id The id of the entry.
   * @param values The object which contains the value to display.
   * @param name The name of the value.
   * @param label The label to display.
   * @param command The command to execute.
   * @returns
   */
  private simpleInfoEntryWithLabel(
    id: string,
    values: any,
    name: string,
    label: string,
    command?: vscode.Command,
  ): MTAddOnInfo {
    return new MTAddOnInfo(
      id,
      label,
      values[name],
      vscode.TreeItemCollapsibleState.None,
      command,
    );
  }

  /**
   * Checks to see if the path/file exists.
   * @param filePath the path to check.
   * @returns true if the path exists.
   */
  private pathExists(filePath: string): boolean {
    if (!this.sourceDir) {
      return false;
    }
    try {
      fs.accessSync(filePath);
    } catch (err) {
      return false;
    }
    return true;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    MTAddOnInfo | undefined | null | void
  > = new vscode.EventEmitter<MTAddOnInfo | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    MTAddOnInfo | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

/**
 *  The class that represents the information for the add-on tree view.
 */
class MTAddOnInfo extends vscode.TreeItem {
  /**
   * Creates a new MTAddOnInfo object.
   * @param label The label to display.
   * @param description The description to display.
   * @param collapsibleState the collapsible state of the tree item.
   */
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command,
  ) {
    super(label, collapsibleState);
    if (command) {
      this.command = command;
    }
  }
}
