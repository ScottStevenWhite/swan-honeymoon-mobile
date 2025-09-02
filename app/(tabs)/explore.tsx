import { Camera, MapView } from '@maplibre/maplibre-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ensureParisPMTiles } from '../pmtiles';

export default function Explore() {
  const [styleJSON, setStyleJSON] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      let baseStyle: any | null = null;
      try {
        // add later if you place one in assets/styles
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        baseStyle = require('../../assets/styles/protomaps_light.json');
      } catch {}
      const pmPath = await ensureParisPMTiles();

      if (baseStyle && pmPath) {
        const s = JSON.parse(JSON.stringify(baseStyle));
        const srcKeys = Object.keys(s.sources || {});
        const vecKey = srcKeys.find((k) => s.sources[k].type === 'vector');
        if (vecKey) s.sources[vecKey].url = `pmtiles://file://${pmPath}`;
        setStyleJSON(s);
        return;
      }
      setStyleJSON(null);
    })();
  }, []);

  const FALLBACK = 'https://demotiles.maplibre.org/style.json';
  const mapProps = styleJSON ? { styleJSON } : { styleURL: FALLBACK };

  return (
    <View style={styles.root}>
      <MapView style={StyleSheet.absoluteFill} {...mapProps}>
        <Camera zoomLevel={12} centerCoordinate={[2.3522, 48.8566]} />
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({ root: { flex: 1 } });
