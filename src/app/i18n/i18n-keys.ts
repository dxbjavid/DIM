import type { BucketSortType } from 'app/inventory/inventory-buckets';

/**
 * Single source of truth for i18n keys that used to be built dynamically from a
 * prefix plus a runtime value (with a metadata hint for the scanner). The runtime
 * app, the derived key types, and the i18next-scanner build step all read from
 * here so there's exactly one place to add a new value.
 *
 * This module is intentionally pure data (only `import type`, which is erased at
 * runtime) so the Node-based scanner can transpile and load it standalone,
 * without pulling in app runtime code.
 */

/**
 * The top-level inventory sort categories. These mirror BucketSortType (the
 * `satisfies` below enforces that) because the inventory/loadout views render
 * `Bucket.<sortType>` titles for whatever categories exist.
 */
export const BUCKETS = [
  'General',
  'Inventory',
  'Postmaster',
  'Progress',
  'Unknown',
  'Weapons',
  'Armor',
] as const satisfies readonly BucketSortType[];

/** Pursuit groupings rendered as `Progress.<group>` titles. */
export const PROGRESS_GROUPS = ['Bounties', 'Items', 'Quests'] as const;

/** Socket categories rendered as `Sockets.Insert.<kind>` / `Sockets.Select.<kind>`. */
export const SOCKET_KINDS = [
  'Mod',
  'Ability',
  'Shader',
  'Ornament',
  'Fragment',
  'Aspect',
  'Projection',
  'Transmat',
  'Super',
] as const;

/** D1 activity difficulties rendered as `Activities.<difficulty>`. */
export const DIFFICULTIES = ['Normal', 'Hard'] as const;

/**
 * Registry of `Prefix -> values`. The scanner flattens this to `Prefix.Value`
 * keys; the app builds the same keys type-safely via {@link i18nKey}.
 */
export const I18N_KEYS = {
  Bucket: BUCKETS,
  Progress: PROGRESS_GROUPS,
  'Sockets.Insert': SOCKET_KINDS,
  'Sockets.Select': SOCKET_KINDS,
  Activities: DIFFICULTIES,
} as const;

/**
 * Registry of i18next context variants, keyed by the base key. The scanner emits
 * a `BaseKey_<context>` key for each entry; the app selects one at runtime via
 * the native i18next `context` option.
 */
export const I18N_CONTEXTS = {
  'Countdown.Days': ['compact'],
  'Stats.TierProgress': ['Max'],
} as const;

type Prefix = keyof typeof I18N_KEYS;

/** Every generated `Prefix.Value` key, inferred from {@link I18N_KEYS}. */
export type GeneratedI18nKey = {
  [P in Prefix]: `${P}.${(typeof I18N_KEYS)[P][number]}`;
}[Prefix];

/**
 * Build a `Prefix.Value` translation key type-safely. The value is constrained
 * to the registered values for the prefix, and the return type is the exact key,
 * so it's assignable to i18next's key union without a cast at the call site.
 */
export function i18nKey<P extends Prefix>(
  prefix: P,
  value: (typeof I18N_KEYS)[P][number],
): `${P}.${(typeof I18N_KEYS)[P][number]}` {
  return `${prefix}.${value}`;
}
