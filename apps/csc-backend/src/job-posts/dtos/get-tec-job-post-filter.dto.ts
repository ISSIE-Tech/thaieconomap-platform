import { IsMongoId, IsOptional } from "class-validator";

export class GetTECJobPostsFilterDto {
    @IsMongoId()
    @IsOptional()
    category?: string;

    @IsMongoId()
    @IsOptional()
    district?: string;
}