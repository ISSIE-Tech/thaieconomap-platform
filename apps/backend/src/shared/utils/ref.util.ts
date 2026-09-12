// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRef = any;

/**
 * Serialize a Mongoose ref field for a response DTO: a bare ObjectId becomes its hex
 * string, a populated sub-document is kept as-is (clients read `district.districtName`,
 * `createdBy._id`, `types[].name`, ...). Calling `.toString()` on a populated ref yields
 * "[object Object]".
 */
export const toRef = (value: AnyRef): AnyRef =>
  value === null || typeof value !== 'object' || value._bsontype === 'ObjectId'
    ? value?.toString()
    : value;
