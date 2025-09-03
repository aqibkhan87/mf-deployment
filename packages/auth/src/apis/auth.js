let users = [
  {
    name: "aqib",
    password: "aqib123",
    email: "aqib@gmail.com",
    mobile: "8791232678",
  },
  {
    name: "nitin",
    password: "nitin123",
    email: "nitin@gmail.com",
    mobile: "1234567890",
  },
  {
    name: "sumit",
    password: "sumit123",
    email: "sumit@gmail.com",
    mobile: "0987654321",
  },
];

export const login = ({ contact, password }) => {
  const user = users.find(
    (user) => user?.email === contact || user?.mobile === contact
  );
  if (user) {
    if (user?.password === password) {
      localStorage.setItem("user", JSON.stringify(user));
      return Promise.resolve({
        user,
        status: 200,
        message: "User Login Successfully",
      });
    }
  }
  return Promise.reject({
    message: "User Doesn't exist",
    user: null,
    status: 404,
  });
};

export const signup = (data) => {
  const { email, password, mobile, name } = data;
  const user = users.find((user) => user?.email === email);
  if (user) {
    return {
      message: "User already register.",
      user: null,
      status: 404,
    };
  } else if (!user) {
    if (email && password && mobile && name) {
      const newUser = {
        email,
        password,
        mobile,
        name,
      };
      users.push(newUser);
      return {
        user: newUser,
        status: 200,
        message: "User register successfully.",
      };
    }
  }
  return {
    message: "User Doesn't exist",
    user: null,
    status: 404,
  };
};
