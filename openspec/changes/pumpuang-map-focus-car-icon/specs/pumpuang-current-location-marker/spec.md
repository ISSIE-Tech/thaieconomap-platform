## ADDED Requirements

### Requirement: Map focuses on pumpuang when drawer opens
The main map SHALL animate to the selected pumpuang's latest GPS coordinates when the detail drawer is opened.

#### Scenario: User clicks a pumpuang marker
- **WHEN** user clicks a pumpuang marker on the main map
- **THEN** the map SHALL fly to the selected pumpuang's latest coordinates
- **THEN** the pumpuang detail drawer SHALL open on the right side

#### Scenario: Map centers even if marker is already visible
- **WHEN** user clicks a pumpuang marker that is already visible on screen
- **THEN** the map SHALL still fly to center on that marker's coordinates

### Requirement: Car icon displays current location on drawer map
The embedded route history map inside the detail drawer SHALL display a car icon marker at the vehicle's current real-time location.

#### Scenario: Drawer opens with route history
- **WHEN** the pumpuang detail drawer opens and route history data is loaded
- **THEN** a car icon marker SHALL appear on the embedded map at the vehicle's latest coordinates

#### Scenario: Car icon updates in real-time
- **WHEN** new location data arrives from the polling endpoint (every 1 second)
- **THEN** the car icon marker position SHALL update to the new coordinates without re-rendering the map

#### Scenario: Car icon rotates based on direction
- **WHEN** the vehicle's direction/bearing data is available
- **THEN** the car icon marker SHALL rotate to match the vehicle's heading direction

### Requirement: Car icon renders above route line
The car icon marker SHALL render above the route polyline on the embedded map so it is always visible.

#### Scenario: Route line passes under car icon
- **WHEN** the route polyline and car icon marker overlap on the embedded map
- **THEN** the car icon marker SHALL display on top of the route polyline
