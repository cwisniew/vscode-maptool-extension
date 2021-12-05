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
  LIBRARY_DEFINITON_FILE,
  MTSCRIPT_DIR,
  PUBLIC_DIR,
  SRC_DIR,
} from './constants';
import * as fs from 'fs';

class MapToolAddOn {
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

  private createLibraryFile(sourceDir: string): void {
    const filePath = path.join(sourceDir, LIBRARY_DEFINITON_FILE);
    const content = {
      name: 'add-on name',
      version: '1.0.0',
      website: 'www.example.com',
      gitUrl: 'github.com/user/repository',
      authors: ['Your name here'],
      license: 'License Name',
      namespace: 'com.example.myaddon',
      description: 'add-on description',
      shortDescription: 'add-on short description',
      allowsUriAccess: true,
      readMeFile: 'readme.md',
      licenseFile: 'license.txt',
    };
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}

export const mapToolAddOn = new MapToolAddOn();
