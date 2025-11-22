import * as migration_20251121_102631 from './20251121_102631';
import * as migration_20251121_103000 from './20251121_103000';
import * as migration_20251121_104000 from './20251121_104000';
import * as migration_20251122_125018 from './20251122_125018';
import * as migration_20251122_132510 from './20251122_132510';

export const migrations = [
  {
    up: migration_20251121_102631.up,
    down: migration_20251121_102631.down,
    name: '20251121_102631',
  },
  {
    up: migration_20251121_103000.up,
    down: migration_20251121_103000.down,
    name: '20251121_103000',
  },
  {
    up: migration_20251121_104000.up,
    down: migration_20251121_104000.down,
    name: '20251121_104000',
  },
  {
    up: migration_20251122_125018.up,
    down: migration_20251122_125018.down,
    name: '20251122_125018',
  },
  {
    up: migration_20251122_132510.up,
    down: migration_20251122_132510.down,
    name: '20251122_132510'
  },
];
