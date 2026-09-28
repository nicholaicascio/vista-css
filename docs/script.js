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
