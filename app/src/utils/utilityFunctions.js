export const simulateLoading = (setter, setter2) => {
  let completed = false;
  setter(true);

  const firstTimeout = setTimeout(() => {
    setter(false);
    if (setter2 === undefined) {
      completed = true;
    }
  }, 3000);

  if (setter2 !== undefined) {
    setter2(true);
    const secondTimeout = setTimeout(() => {
      setter2(false);
      console.log("setter 2");
      completed = true;
    }, 3000);

    // Clear both timeouts
  }
  if (completed) {
    clearInterval(firstTimeout);
    clearInterval(secondTimeout);
  }
};

export const delay = () => {
  return new Promise((resolve) => {
    console.log("delay started");
    setTimeout(() => {
      resolve();
      console.log("delay complete");
    }, 2000);
  });
};

export const Codes = {
  Processing: 5013,
};
