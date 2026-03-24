## Context

The `PumpuangMapper` converts Mongoose documents to response DTOs. The `types` field is a populated array of `ProductType` documents (with `_id` and `name`). The mapper calls `.toString()` on each, which for plain objects produces `"[object Object]"` instead of the desired `{_id, name}` structure.

## Goals / Non-Goals

**Goals:**
- Fix the `types` mapping to return `[{_id, name}]` objects
- Update the DTO type from `string[]` to a proper type object array
- Fix both `toResponseDto()` and `toPendingResponseDto()` mapper methods

**Non-Goals:**
- Changing how `types` are populated from MongoDB
- Modifying the `ProductType` schema

## Decisions

### Decision 1: Map types to `{_id, name}` objects

**Choice**: Replace `t?.toString()` with `{ _id: t?._id?.toString(), name: t?.name }` in the mapper.

**Rationale**: The Flutter app expects and displays the type name. Returning just the ID would require additional API calls to resolve names. The populated Mongoose document already has the data — just need to extract the right fields.

### Decision 2: Create a `ProductTypeDto` interface

**Choice**: Add a `ProductTypeDto` interface (`{_id: string, name: string}`) in the contracts package and use it in `PumpuangResponseDto` and `PendingPumpuangResponseDto`.

**Rationale**: Keeps the DTO type definition accurate and reusable. Better than using inline types.

## Risks / Trade-offs

- **[Risk] Breaking change for other consumers** → The Flutter app already expects objects, so this restores correct behavior rather than breaking it.
- **[Risk] Unpopulated types** → If `types` is not populated (contains raw ObjectIds), `t?.name` would be `undefined`. Add a fallback to handle this case gracefully.
