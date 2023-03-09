(() => {
  const url =
    "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/cjs/react.development.js";

  fetch(url).then((res) => {
    console.log(res.body);
  });
})();
