const infos = [
  {
    img: ["../img/theme-update.jpg", ""],
    date: "Atualização de 10/03/2025",
    title: "THEME UPDATE",
    description:
      "O Snake Game agora tem novos temas! Escolha entre diferentes biomas, como floresta, deserto, neve e caverna, e jogue com um visual renovado.",
  },
];

const createElement = (tag) => document.createElement(tag);

const container = document.getElementById("container"); // O elemento onde os itens serão inseridos

infos.forEach((info) => {
  const div = createElement("div");
  div.style.backgroundImage = `url(${info.img[0]})`;

  const span = createElement("span");
  span.innerText = info.title;

  const div2 = createElement("div");
  const span2 = createElement("span");
  const p = createElement("p");

  span2.innerText = info.date;
  p.innerText = info.description;

  container.appendChild(div);
  div.appendChild(span);
  div.appendChild(div2);
  div2.appendChild(span2);
  div2.appendChild(p);
});
