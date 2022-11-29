export const elementEnable = status => {
  return status
    ? { opacity: '0.6', cursor: 'pointer' }
    : { opacity: '1', cursor: 'default' };
};
