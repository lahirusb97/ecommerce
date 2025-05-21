// Given a fully loaded ProductVariant with values, option, and value populated
export function getVariantOptionsAsJson(variant: any) {
  if (!variant.values || !Array.isArray(variant.values)) return [];

  return variant.values.map((v: any) => ({
    optionName: v.option?.name, // The option (e.g., "Size", "Color")
    value: v.value?.value, // The value (e.g., "Large", "Red")
  }));
}
