/* Docs-only: switch the preview between the Aero and Vista Basic themes. */
(function () {
  var link = document.getElementById("theme-link");
  var button = document.getElementById("theme-toggle");
  if (!link || !button) return;

  var query = link.getAttribute("href").replace(/^[^?]*/, "");
  var themes = ["Vista.css", "Vista-Basic.css"];
  var labels = ["Windows Aero", "Windows Vista Basic"];
  var index = 0;

  button.textContent = labels[index];

  button.addEventListener("click", function () {
    index = (index + 1) % themes.length;
    link.setAttribute("href", themes[index] + query);
    button.textContent = labels[index];
  });
})();

/* Docs-only: highlight the navigation entry for the section in view. */
(function () {
  var nav = document.querySelector(".docs-nav");
  if (!nav || !("IntersectionObserver" in window)) return;

  var items = {};
  Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) {
    items[a.getAttribute("href").slice(1)] = a.parentElement;
  });

  var sections = Object.keys(items)
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function select(id) {
    Object.keys(items).forEach(function (key) {
      items[key].classList.toggle("selected", key === id);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) select(entry.target.id);
      });
    },
    { rootMargin: "-15% 0px -75% 0px" }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
