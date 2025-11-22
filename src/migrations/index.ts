import * as migration_20251121_102631 from './20251121_102631';
import * as migration_20251121_104000 from './20251121_104000';
import * as migration_20251121_104400 from './20251121_103000';

export const migrations = [
  {
    up: migration_20251121_102631.up,
    down: migration_20251121_102631.down,
    name: '20251121_102631',
  },
  {
    up: migration_20251121_104000.up,
    down: migration_20251121_104000.down,
    name: '20251121_104000',
  },
  {
    up: migration_20251121_104400.up,
    down: migration_20251121_104400.down,
    name: '20251121_104400'
  },
];
