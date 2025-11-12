
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import dinosaurs from '../assets/dinosaurs.json';

describe('Asset Verification', () => {
  it('should have a corresponding image file for every dinosaur in dinosaurs.json', () => {
    const assetsDir = path.resolve(__dirname, '../../public/assets');
    const assetFiles = fs.readdirSync(assetsDir);

    dinosaurs.forEach(dino => {
      const expectedFileName = `${dino.name}.jpg`;
      expect(assetFiles).toContain(expectedFileName);
    });
  });
});
