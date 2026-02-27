const { User } = require("../models");

exports.createUser = async (data) => {
  if (!data.email || !data.name) {
    throw new Error("Name and email are required");
  }

  const existingUser = await User.findOne({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  return await User.create({
    name: data.name,
    email: data.email
  });
};