import md5 from 'crypto-js/md5';

const gravatarAPI = (email) => {
  const hashCreated = md5(email);
  const urlImage = `https://www.gravatar.com/avatar/${hashCreated}`;
  return urlImage;
};

export default gravatarAPI;
