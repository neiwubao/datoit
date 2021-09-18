const prefixFileUrlWithBackendUrl = fileURL => {
  return !!fileURL && fileURL.startsWith('/') ? `${datoit.backendURL}${fileURL}` : fileURL;
};

export default prefixFileUrlWithBackendUrl;
