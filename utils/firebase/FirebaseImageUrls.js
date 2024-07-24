const baseUrl =
  "https://firebasestorage.googleapis.com/v0/b/careermate-564aa.appspot.com/o/";

const studentLowProfilePicture = (imageId) => {
  return `${baseUrl}student_profile_picture%2Flow%2F${encodeURIComponent(
    imageId
  )}?alt=media`;
};

const studentHighProfilePicture = (imageId) => {
  return `${baseUrl}student_profile_picture%2Fhigh%2F${encodeURIComponent(
    imageId
  )}?alt=media`;
};

export { studentLowProfilePicture, studentHighProfilePicture };
