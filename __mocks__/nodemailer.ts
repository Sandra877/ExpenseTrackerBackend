// __mocks__/nodemailer.ts
const sendMail = jest.fn((_opts, cb) => {
  if (cb) cb(null, { accepted: ["test@example.com"] });
});

const createTransport = jest.fn(() => ({
  sendMail,
}));

export { createTransport, sendMail };
export default { createTransport, sendMail };
