## 1. Update DTO Contracts

- [x] 1.1 Add `ProductTypeDto` interface (`{_id: string, name: string}`) in `packages/contracts/src/dto/response/pumpuangs/pumpuang-response.dto.ts`
- [x] 1.2 Update `PumpuangResponseDto.types` from `string[]` to `ProductTypeDto[]`
- [x] 1.3 Update `PendingPumpuangResponseDto.types` from `string[]` to `ProductTypeDto[]`

## 2. Fix Mapper

- [x] 2.1 Fix `PumpuangMapper.toResponseDto()` line 28 to map types to `{_id, name}` objects instead of calling `.toString()`
- [x] 2.2 Fix `PumpuangMapper.toPendingResponseDto()` line 66 with the same fix

## 3. Build and Verify

- [x] 3.1 Build the backend and contracts package — confirm no type errors
