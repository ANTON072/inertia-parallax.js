export default class InertiaParallax {
  defaultOptions = {
    wrapper: "#inertia_parallax",
    targets: ".js-iparallax-item",
    wrapperSeed: 0.08,
    targetSpeed: 0.02,
    targetPercentage: 0.1,
  };

  constructor(userOptions = {}) {
    this.settings = { ...this.defaultOptions, ...userOptions };

    this.targets = [];

    this.wrapper = document.querySelector(this.settings.wrapper);

    if (!this.wrapper) {
      throw new Error("Wrapper is Not Found.");
    }
  }

  resume() {
    this.wrapperOffset = 0;

    this.isAnimate = false;
    this.isResize = false;
    this.scrollId = undefined;
    this.resizeId = undefined;

    this.targetElems = document.querySelectorAll(this.settings.targets);
    document.body.style.height = `${this.wrapper.clientHeight}px`;

    this.windowHeight = window.clientHeight;

    this._bindEvent();
    this._setup();
    this._animate();
    this._resize();
  }

  pause() {
    window.cancelAnimationFrame(this.resizeId);
    window.cancelAnimationFrame(this.scrollId);
    this.wrapper.removeAttribute("style");
    this.targets.forEach((target) => {
      target.elem.removeAttribute("style");
    });
    this.wrapper = undefined;
    this.targets = [];
    this.windowHeight = 0;
    this.wrapperOffset = 0;
    this.isResize = false;
    this.scrollId = undefined;
    this.resizeId = undefined;
  }

  _setup() {
    this.wrapper.style.width = "100%";
    this.wrapper.style.position = "fixed";

    const targetElems = Array.prototype.slice.call(this.targetElems, 0);
    targetElems.forEach((elem) => {
      this.targets.push({
        elem,
        offset: parseInt(elem.dataset.offset, 10) || 0,
        horizontal: parseInt(elem.dataset.horizontal, 10) || 0,
        top: 0,
        left: 0,
        speedX: parseInt(elem.dataset.speedX, 10) || 1,
        speedY: parseInt(elem.dataset.speedY, 10) || 1,
        percentage: parseInt(elem.dataset.percentage, 10) || 0,
      });
    });
  }

  _animate() {
    this._scroll();
    this.scrollId = window.requestAnimationFrame(this._animate.bind(this));
  }

  _scroll() {
    this.scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    this.wrapperOffset +=
      (this.scrollTop - this.wrapperOffset) * this.settings.wrapperSeed;

    this.wrapper.style.transform = `translate3d(0, ${
      Math.round(-this.wrapperOffset * 100) / 100
    }px, 0)`;

    this.targets.forEach((target) => {
      this._updateTarget(target);
    });
  }

  _updateTarget(target) {
    target.top +=
      (this.scrollTop * this.settings.targetSpeed * target.speedY -
        target.top) *
      this.settings.targetPercentage;
    target.left +=
      (this.scrollTop * this.settings.targetSpeed * target.speedX -
        target.left) *
      this.settings.targetPercentage;
    const targetOffsetTop = target.percentage - target.top - target.offset;
    const offsetY = Math.round(targetOffsetTop * -100) / 100;
    let offsetX = 0;
    if (target.horizontal) {
      const targetOffsetLeft = target.percentage - target.left - target.offset;
      offsetX = Math.round(targetOffsetLeft * -100) / 100;
    }
    target.elem.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  }

  _bindEvent() {
    window.addEventListener("resize", () => {
      if (!this.isResize) {
        window.cancelAnimationFrame(this.resizeId);
        window.cancelAnimationFrame(this.scrollId);

        this.isResize = true;

        setTimeout(() => {
          this.isResize = false;
          this.resizeId = window.requestAnimationFrame(this._resize.bind(this));
          this.scrollId = window.requestAnimationFrame(
            this._animate.bind(this)
          );
        }, 200);
      }
    });
  }

  _resize() {
    this.windowHeight =
      window.innerHeigh || document.documentElement.clientHeight || 0;

    if (this.wrapper.clientHeight !== document.body.style.height) {
      document.body.style.height = `${this.wrapper.clientHeight}px`;
    }
    this.resizeId = window.requestAnimationFrame(this._resize.bind(this));
  }
}
