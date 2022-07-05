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
import {
  ADDON_CONTENT_DIR,
  EVENTS_DEFINITION_FILE,
  LIBRARY_DEFINITON_FILE,
  MACRO_SCRIPT_PROPERTIES_FILE,
  MTSCRIPT_DIR,
  PUBLIC_DIR,
  SRC_DIR,
} from './constants';
import * as fs from 'fs';
import { Utils } from './utils/Utils';
import { ExtensionContext } from 'vscode';

export class MapToolAddOn {
  constructor(private readonly extensionContext: ExtensionContext) {}

  createSkeleton(workspaceRoot: string): void {
    const sourceDir = path.join(workspaceRoot, SRC_DIR);
    const libraryDir = path.join(sourceDir, ADDON_CONTENT_DIR);
    const publicDir = path.join(libraryDir, PUBLIC_DIR);
    const mtscriptDir = path.join(libraryDir, MTSCRIPT_DIR);
    const mtscriptPublicDir = path.join(mtscriptDir, PUBLIC_DIR);
    const generatedDir = path.join(workspaceRoot, 'generated');
    const buildDir = path.join(workspaceRoot, 'build');

    fs.mkdirSync(sourceDir);
    this.createLibraryFile(sourceDir);

    fs.mkdirSync(libraryDir);
    fs.mkdirSync(publicDir);
    fs.mkdirSync(mtscriptDir);
    fs.mkdirSync(mtscriptPublicDir);
    fs.mkdirSync(generatedDir);
    fs.mkdirSync(buildDir);
  }

  private async createLibraryFile(sourceDir: string): Promise<void> {
    const filePath = path.join(sourceDir, LIBRARY_DEFINITON_FILE);
    await Utils.copyResource(
      'new_library.json',
      filePath,
      this.extensionContext,
    );
  }

  async createMTSProperties(workspaceRoot: string): Promise<void> {
    const sourceDir = path.join(workspaceRoot, SRC_DIR);
    const filePath = path.join(sourceDir, MACRO_SCRIPT_PROPERTIES_FILE);
    await Utils.copyResource(
      'new_mts_properties.json',
      filePath,
      this.extensionContext,
    );
  }

  async createEvents(workspaceRoot: string): Promise<void> {
    const sourceDir = path.join(workspaceRoot, SRC_DIR);
    const filePath = path.join(sourceDir, EVENTS_DEFINITION_FILE);
    await Utils.copyResource(
      'new_events.json',
      filePath,
      this.extensionContext,
    );
  }
}
