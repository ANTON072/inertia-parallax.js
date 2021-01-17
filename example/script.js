const iParallax = new window.InertiaParallax();
iParallax.resume();

setTimeout(() => {
  iParallax.pause();
}, 5000);
