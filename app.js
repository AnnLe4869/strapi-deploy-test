const getData = async (url) => {
  const data = await (await fetch(url)).json();
  return data;
};

console.log(getData(`localhost:1337/products`));
