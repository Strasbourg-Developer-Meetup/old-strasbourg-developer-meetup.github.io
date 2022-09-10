const textArc = (id: string) => {
  const ele = document.getElementById(id);
  if (!ele) {
    console.warn(`Could not find element with id ${id}`);
    return;
  }

  const elements = ele
    ?.textContent
    ?.trim()
    ?.split("").map((c) => `<span>${c}</span>`) ?? [];

  ele.innerHTML = elements.join("");

  const offset = -135;
  const halfCircleDegrees = 360 / elements.length / 2;

  ele.querySelectorAll("span").forEach((span, i) =>
    span.style.transform = `rotate(${offset + (i * halfCircleDegrees)}deg)`
  );
};

export default textArc;
