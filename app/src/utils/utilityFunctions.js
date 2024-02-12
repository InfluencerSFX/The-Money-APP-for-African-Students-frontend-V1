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
  Processing: "5013",
  Success: "0810",
};

export const getBalance = (bal) => {
  let sum = 0;
  for (const chain in bal) {
    for (const asset in bal[chain]) {
      sum += bal[chain][asset];
    }
  }
  return sum;
};

export const filterMarker = (marker) =>
  marker.filter((m) => m === "USDT" || m === "USDC");

export const paramsToObject = (params) => {
  const obj = {};
  for (const pair of params.split("&")) {
    const [key, value] = pair.split("=");
    obj[key] = value;
  }
  return obj;
};
