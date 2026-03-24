## Why

The pumpuang profile `types` field returns `["[object Object]"]` instead of `[{"_id": "...", "name": "..."}]`. This breaks the Flutter mobile app which expects type objects, causing `type 'String' is not a subtype of type 'Map<String, dynamic>'`. The mapper calls `.toString()` on populated Mongoose documents, and the DTO incorrectly declares `types` as `string[]`.

## What Changes

- **BREAKING**: Update `types` field in `PumpuangResponseDto` and `PendingPumpuangResponseDto` from `string[]` to `{_id: string, name: string}[]`
- Fix `PumpuangMapper.toResponseDto()` (line 28) to map each type to `{_id, name}` instead of calling `.toString()`
- Fix `PumpuangMapper.toPendingResponseDto()` (line 66) with the same fix

## Capabilities

### New Capabilities

_None — this is a bug fix._

### Modified Capabilities

_No spec-level behavior changes — fixing incorrect serialization of existing data._

## Impact

- **DTO contracts**: `PumpuangResponseDto.types` and `PendingPumpuangResponseDto.types` in `@thaieconomap/contracts` package change from `string[]` to object array
- **Mapper**: `pumpuang.mapper.ts` lines 28 and 66
- **Downstream**: `PumpuangAuthResponseDto.profile` (OTP verify response) includes `PumpuangResponseDto`, so this fix resolves the Flutter client-side error
- **Clients**: Flutter pumpuang app expects this object format — this restores correct behavior
