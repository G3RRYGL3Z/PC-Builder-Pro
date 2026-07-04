// src/utils/buildMapper.ts
// Converts the AI assistant's component ID map (e.g. { processor: "cpu-4" })
// into the full component objects that App.tsx expects in selectedComponents.

import { componentDatabase } from '../data/components';

type ComponentSlot =
  | 'processor'
  | 'cpu-cooler'
  | 'motherboard'
  | 'gpu'
  | 'memory'
  | 'storage'
  | 'power-supply'
  | 'case';

// Maps AI slot names to componentDatabase keys
const SLOT_TO_DB_KEY: Record<ComponentSlot, keyof typeof componentDatabase> = {
  processor:       'processor',
  'cpu-cooler':    'cpu-cooler',
  motherboard:     'motherboard',
  gpu:             'gpu',
  memory:          'memory',
  storage:         'storage',
  'power-supply':  'power-supply',
  case:            'case',
};

/**
 * Takes the AI's build map (slot → component ID) and returns a
 * selectedComponents object with full component data ready to load into state.
 *
 * Example input:  { processor: "cpu-4", gpu: "gpu-3", ... }
 * Example output: { processor: { id: "cpu-4", name: "Ryzen 5 7600X", price: 229, ... }, ... }
 */
export function mapBuildToComponents(
  aiBuild: Record<string, string>
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [slot, componentId] of Object.entries(aiBuild)) {
    const dbKey = SLOT_TO_DB_KEY[slot as ComponentSlot];
    if (!dbKey) {
      console.warn(`Unknown slot from AI: ${slot}`);
      continue;
    }

    const options = componentDatabase[dbKey] as any[];
    if (!options) {
      console.warn(`No database entry for: ${dbKey}`);
      continue;
    }

    const component = options.find((c: any) => c.id === componentId);
    if (!component) {
      console.warn(`Component ID not found: ${componentId} in ${dbKey}`);
      continue;
    }

    result[slot] = component;
  }

  return result;
}
