import { GeoJsonType } from "src/common/enum/geo-json-type.enum";
import { JobPostLocation } from "src/job-posts/schemas/job-post-location.schema";
import { Location } from "../interfaces/location.interface";
import { InternalServerErrorException } from "@nestjs/common";

export function transformLatitudeAndLongitudeToGeoJson(location: JobPostLocation): Location {
    const longitude = parseFloat(location.longitude);
    const latitude = parseFloat(location.latitude);

    if (isNaN(longitude) || isNaN(latitude)) {
        throw new InternalServerErrorException('transfrom lat and long failed');
    }

    return {
        type: GeoJsonType.Point,
        coordinates: [
            longitude, 
            latitude
        ],
    };

}