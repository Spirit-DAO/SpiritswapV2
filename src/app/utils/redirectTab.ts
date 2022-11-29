export const openInNewTab = url => {
  const newWindow = window.open(url, 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

export const openInSelfTab = url => {
  window.location.assign(url);
};

export const onClickUrl =
  (url: string | undefined): (() => void) =>
  () =>
    openInNewTab(url);
