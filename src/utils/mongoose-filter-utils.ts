export function createSortObj(sortKey: string, sortValue: string) {
  if (sortKey && sortValue) {
    return { [sortKey]: sortValue };
  }

  return {};
}

export function createMongooseQuery(fields: string[], search: string) {
  if (!search || search === '') {
    return undefined;
  }

  return fields.reduce(
    (acc, field) => ({
      $or: [
        ...acc.$or,
        {
          [field]: {
            $regex: search,
            $options: 'i',
          },
        },
      ],
    }),
    { $or: [] },
  );
}
