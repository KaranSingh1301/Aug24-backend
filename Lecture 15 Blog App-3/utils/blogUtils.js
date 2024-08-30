const blogDataValidation = ({ title, textBody }) => {
  return new Promise((resolve, reject) => {
    if (!title || !textBody) reject("Missing blog data");
    if (typeof title !== "string") reject("title is not a text");
    if (typeof textBody !== "string") reject("textBody is not a text");

    if (title.length < 3 || title.length > 100)
      reject("Length of the title should be 3-100");
    if (textBody.length < 3 || textBody.length > 1000)
      reject("Length of the textBody should be 3-100");

    resolve();
  });
};

module.exports = { blogDataValidation };
