(() => {
  const originalPrint = window.print;

  Object.defineProperty(window, "print", {
    configurable: false,
    writable: false,
    value: function () {
      console.log("window.print() BLOCKED by preload");
    },
  });


  console.log("preload_nested.js loaded: window.print overridden");
})();
