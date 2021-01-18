const domains = new Array(30)
  .fill(1)
  .map((_, i) => `avatars${i}.githubusercontent.com`);
console.log(domains);
module.exports = {
  images: {
    domains,
  },
};
