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

import { ExtensionContext } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class Utils {
  public static getResourcePath(
    file: string,
    extensionContext: ExtensionContext,
  ): string {
    return extensionContext.asAbsolutePath(path.join('resources', file));
  }

  public static readResourceFile(
    file: string,
    extensionContext: ExtensionContext,
  ): string {
    const path = Utils.getResourcePath(file, extensionContext);
    return fs.readFileSync(path, 'utf8');
  }

  public static async copyResource(
    resourceFile: string,
    destination: string,
    extensionContext: ExtensionContext,
  ): Promise<void> {
    const resourcePath = Utils.getResourcePath(resourceFile, extensionContext);
    await fs.promises.copyFile(resourcePath, destination);
  }
}
