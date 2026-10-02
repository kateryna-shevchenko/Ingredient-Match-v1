function menu (){
  const here = window.location.pathname
  const on = "text-amber-700 font-bold overline py-4"
  const off = "text-amber-900/80 py-4"
  let homeClass = off
  let savedClass = off
  let basketClass = off
  if (here === "/pages/home-page.html"){
    homeClass = on
  }
  if (here === "/pages/saved.html"){
    savedClass = on
  }
  if (here === "/pages/basket.html"){
    basketClass = on
  }

    return `<nav class="w-full absolute bottom-0 bg-amber-50/35 flex justify-around">
      <a class ="${homeClass}" href="/pages/home-page.html">Home</a>
      <a class = "${savedClass}" href="/pages/saved.html">Saved</a>
      <a class = "${basketClass}"href="/pages/basket.html">Basket</a>
    </nav>`
}
const space = document.querySelector("#menu-space")
space.innerHTML = menu()