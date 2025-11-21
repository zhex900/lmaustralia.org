import * as migration_20251121_094848 from './20251121_094848';
import * as migration_20251121_094858 from './20251121_094858';

export const migrations = [
  {
    up: migration_20251121_094848.up,
    down: migration_20251121_094848.down,
    name: '20251121_094848',
  },
  {
    up: migration_20251121_094858.up,
    down: migration_20251121_094858.down,
    name: '20251121_094858'
  },
];
