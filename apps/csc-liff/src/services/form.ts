import { PostType } from '@/types/post';

export const formatNewPostData = async (data: any) => {
  const {
    address,
    applicants,
    category,
    closeDate,
    description,
    district,
    endDate,
    images,
    location,
    qualification,
    startDate,
    title,
    wage,
    wageUnit,
    workload,
  } = data;

  const formattedLocation = {
    latitude: location[0],
    longitude: location[1],
    address: {
      name: address,
      district: district.value,
    },
  };

  const formattedData = {
    title,
    category,
    description,
    startDate,
    endDate,
    closeDate,
    workload,
    qualification,
    images,
    location: formattedLocation,
    wage: {
      amount: wage,
      unit: wageUnit,
    },
    applicants: {
      number: parseFloat(applicants),
    },
  };

  let fd = new FormData();
  Object.entries(formattedData).map(([key, value]) => {
    if (key === 'images') {
      // fd.append('images', value);
      images.map((image: any) => fd.append(`images`, image));
      return;
    }

    const parsedValue =
      typeof value === 'object' ? JSON.stringify(value) : value + '';
    fd.append(key, parsedValue);
  });

  // Display FormData
  // @ts-ignore
  // for (var pair of fd.entries()) {
  //   console.log('x: ', pair[0] + ', ' + pair[1]);
  // }

  return fd;
};

export const formatUpdatePostData = (data: any) => {
  const {
    title,
    category,
    description,
    wage,
    workload,
    applicants,
    qualification,
    location,
    startDate,
    endDate,
    closeDate,
    images,
  } = data;

  const formattedData = {
    title,
    category: category._id,
    description,
    wage,
    startDate,
    endDate,
    closeDate,
    workload,
    qualification,
    images,
    location,
    applicants: {
      number: parseFloat(applicants.number),
    },
  };

  let fd = new FormData();
  Object.entries(formattedData).map(([key, value]) => {
    if (key === 'images') {
      images?.map((image: any) => fd.append(`images`, image));
      return;
    }

    const parsedValue =
      typeof value === 'object' ? JSON.stringify(value) : value + '';
    fd.append(key, parsedValue);
  });

  // @ts-ignore
  // for (var pair of fd.entries()) {
  //   console.log('x: ', pair[0] + ', ' + pair[1]);
  // }

  return fd;
};
