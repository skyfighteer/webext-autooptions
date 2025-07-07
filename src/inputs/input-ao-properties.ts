export const AOPropertyPrefix = 'data-ao';

const AOValueProperties = ['category', 'value'] as const;
const AOFlagProperties = ['default', 'ignore'] as const;

export type AOValueProperty = typeof AOValueProperties[number];
export type AOFlagProperty = typeof AOFlagProperties[number];