const listItem = document.querySelectorAll(".nav-item");
const menuBackDrop = document.querySelector("#menu-backdrop");

listItem.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const rect = item.getBoundingClientRect();

    menuBackDrop.style.left = `${rect.left}px`;
    menuBackDrop.style.top = `${rect.top + window.scrollY}px`;
    menuBackDrop.style.width = `${rect.width}px`;
    menuBackDrop.style.height = `${rect.height}px`;

    menuBackDrop.classList.add("active");
  });

  item.addEventListener("mouseleave", () => {
    menuBackDrop.classList.remove("active");
    menuBackDrop.style.top='50%'
    menuBackDrop.style.bottom='0px'
  });
})