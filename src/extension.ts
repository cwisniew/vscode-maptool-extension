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

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { mapToolAddOn } from './MapToolAddOn';
import { MapToolAddOnInfoProvider } from './MapToolAddOnInfoProvider';

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
    'Congratulations, your extension "maptool-add-on" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'maptool-add-on.MapToolAddOn',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        'maptool-add-on rootPath: ' + rootPath,
      );
    },
  );

  vscode.commands.registerCommand('maptool-add-on.createSkeleton', () => {
    if (rootPath) {
      mapToolAddOn.createSkeleton(rootPath);
      vscode.window.showInformationMessage('Created Add-On Skeleton');
      mapToolAddOnInfoProvider.refresh();
    } else {
      vscode.window.showInformationMessage('No workspace folder');
    }
  });

  context.subscriptions.push(disposable);

  const mapToolAddOnInfoProvider = new MapToolAddOnInfoProvider(rootPath);
  vscode.window.registerTreeDataProvider(
    'mapToolAddOnInfo',
    mapToolAddOnInfoProvider,
  );
  vscode.commands.registerCommand('maptool-add-on.refreshView', () =>
    mapToolAddOnInfoProvider.refresh(),
  );
}

// this method is called when your extension is deactivated
export function deactivate() { }
