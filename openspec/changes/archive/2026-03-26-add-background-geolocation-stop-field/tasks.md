## 1. Contract Update

- [x] 1.1 Add `background_geolocation: string[]` field to `PumpuangLocationTrackingResponseDto` in `packages/contracts/src/dto/response/pumpuangs/pumpuang-response.dto.ts`

## 2. Backend Implementation

- [x] 2.1 Update pumpuang tracking service to populate `background_geolocation` field — return `["stop"]` when status is INACTIVE, `[]` when RUNNING
- [x] 2.2 Update the `POST app/tracking` controller/response to include the new field in the response

## 3. Verification

- [x] 3.1 Verify the tracking endpoint returns `background_geolocation: ["stop"]` when pumpuang is INACTIVE
- [x] 3.2 Verify the tracking endpoint returns `background_geolocation: []` when pumpuang is RUNNING
