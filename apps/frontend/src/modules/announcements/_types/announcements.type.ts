export type AnnouncementTiny = {
  _id: string; // MongoDB ObjectId as a string (assuming it's stored as a string in the DB)
  name: string; // Name of the announcement or event
  startAt: string; // ISO 8601 string format date-time (representing the start date and time)
  endAt: string; // ISO 8601 string format date-time (representing the end date and time)
  isAvailable: boolean; // Availability status of the announcement or event
};

export type Announcement = {
  _id: string; // MongoDB ObjectId as a string
  name: string; // Name of the announcement
  pdfUrl: string; // URL of the PDF document
  detail: string; // Detail or description of the announcement
  districts: {
    _id: string; // MongoDB ObjectId for each district
    provinceName: string; // Name of the province
    districtName: string; // Name of the district
  }[]; // Array of districts
  startAt: string; // ISO 8601 string representing the start date and time
  endAt: string; // ISO 8601 string representing the end date and time
  announcer: string; // Name of the announcer
  phoneNumber: string; // Phone number for the announcement
  createdBy: string; // User ID of who created the announcement
  expiredAutoDelete: string; // ISO 8601 string representing when the announcement will be auto-deleted if expired
  createdAt: string; // ISO 8601 string representing when the announcement was created
  updatedAt: string; // ISO 8601 string representing the last update time of the announcement
  isAvailable: boolean; // Availability status of the announcement
};

export type DistrictOption = {
  id: string;
  label: string;
  provinceName: string;
  provinceId: string;
};
