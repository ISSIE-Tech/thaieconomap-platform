import { Location } from "src/common/interfaces/location.interface"
import { JobCategoryDocument } from "../schemas/job-category.schema"
import { JobPostAcceptanceStatus } from "../schemas/job-post-status.enum"

export interface ITecJobPostMark {
    _id: string
    title: string
    acceptanceStatus: JobPostAcceptanceStatus
    category?: unknown
    location: Location
    createdAt?: Date
    updatedAt?: Date
}
  