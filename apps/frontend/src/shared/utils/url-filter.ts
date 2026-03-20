import type { Set as ImmutableSet } from 'immutable';

/*
===== feature: filter based on types =====

- fetch types based on url query params
- set url query params based on clicked types
  - set unset
- displayed clicked types based on url query params
- save params when leave page

===== implementation =====

- url query params is saved in zustand as Set (store)
- Set is used to store types' id since has, add, delete is O(1) (store)
- create a function to turn type Set to url query params string (helper)
- turn query params into url (hook)
- saved params based on url change (hook)
- create a hash map type with name (helper)
- just use add/delete when toggle types (store)

this save type on page left
*/

// Type has _id and name
type FilterType = { _id: string; name: string; [key: string]: any };

// create a hash map type with name
export const createTypeNameMap = (filterTypes: FilterType[]) =>
  filterTypes?.reduce(
    (acc, type) => {
      acc[type._id] = type.name;
      return acc;
    },
    {} as Record<string, string>
  );

// turn a Set into a URL query parameters string
export const turnImmutableSetToUrlQuery = (key: string, set: ImmutableSet<string>): string => {
  if (!key || set.isEmpty()) return '';
  const values = set.join(','); // Join elements with a comma
  return `${key}=${encodeURIComponent(values)}`;
};
