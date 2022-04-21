let backendAddress = "http://localhost:4002";

let apiAccess = {
  addCustomer: (name, email, password) => {
    return fetch(`${backendAddress}/register`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((x) => x.json())
      .then((x) => {
        console.log(x);
        return x;
      });
  },

  login: (email, password) => {
    return fetch(`${backendAddress}/login`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((x) => x.json())
      .then((x) => {
        console.log(x);
        return x;
      });
  },

  getFlowers: () => {
    return fetch(`${backendAddress}/flowers`)
      .then((x) => x.json())
      .then((x) => {
        console.log(x);
        return x.result;
      });
  },

  getQuiz: (name) => {
    return fetch(`${backendAddress}/ quiz/${name}`)
      .then((x) => x.json())
      .then((x) => {
        console.log(x);
        return x.result;
      });
  },
};

export default apiAccess;
