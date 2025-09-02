// app/pmtiles.ts
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export async function ensureParisPMTiles(): Promise<string|null> {
  let mod: any;
  try {
    // only valid once the file exists
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mod = require('../assets/maps/paris.pmtiles');
  } catch { return null; }

  const asset = Asset.fromModule(mod);
  await asset.downloadAsync();
  const dest = FileSystem.documentDirectory + 'paris.pmtiles';
  const info = await FileSystem.getInfoAsync(dest);
  if (!info.exists && asset.localUri) {
    await FileSystem.copyAsync({ from: asset.localUri, to: dest });
  }
  return dest;
}
