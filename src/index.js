
const carousel = document.querySelector(".carousel");

class Carousel {
  #isDragStart = false;
  #isDragging = false;
  #prevScrollLeft = 0;
  #prevPageX = 0;
  #positionDiff = 0;

  constructor(containerReference) {
    if (!containerReference) throw Error("Please pass a correct element as carousel container.");

    this.containerReference = containerReference;
    this.#setEventListenr();
  }

  #onDragStart(e) {
    this.#isDragStart = true;
    this.#prevPageX = e.pageX || e.touches[0].pageX;
    this.#prevScrollLeft = this.containerReference.scrollLeft;
  }

  #onDragging(e) {
    if (!this.#isDragStart) return;

    e.preventDefault();

    this.#isDragging = true;
    this.containerReference.classList.add("dragging");
    this.#positionDiff = (e.pageX ?? e.touches[0].pageX) - this.#prevPageX;
    this.containerReference.scrollLeft = this.#prevScrollLeft - this.#positionDiff;
    const indicatorInner = document.getElementById("indicatorInner");
    const scrollPercentage = 100 * this.containerReference.scrollLeft / (this.containerReference.scrollWidth - this.containerReference.clientWidth);
    indicatorInner.style.marginLeft = `calc(${scrollPercentage}% - 20px)`;
  }

  #onDragStop() {
    this.#isDragStart = false;
    this.containerReference.classList.remove("dragging");

    if (!this.#isDragging) return;
    this.#isDragging = false;
    this.#autoSlide();
  }

  #autoSlide() {
    if (this.containerReference.scrollLeft - (this.containerReference.scrollWidth - this.containerReference.clientWidth) > -1 || this.containerReference.scrollLeft <= 0) return;
    this.#positionDiff = Math.abs(this.#positionDiff);
    const firstItem = this.containerReference.querySelectorAll(".item")[0];
    let firstItemWidth = firstItem.clientWidth + 14;
    let valDifference = firstItemWidth - this.#positionDiff;
    if (this.containerReference.scrollLeft > this.#prevScrollLeft) {
      return this.containerReference.scrollLeft += this.#positionDiff > firstItemWidth / 4 ? valDifference : -this.#positionDiff;
    }
    this.containerReference.scrollLeft -= this.#positionDiff > firstItemWidth / 4 ? valDifference : -this.#positionDiff;
  }

  #setEventListenr() {
    this.containerReference.addEventListener("mousedown", (e) => this.#onDragStart(e));
    this.containerReference.addEventListener("touchstart", (e) => this.#onDragStart(e));

    this.containerReference.addEventListener("mousemove", (e) => this.#onDragging(e));
    this.containerReference.addEventListener("touchmove", (e) => this.#onDragging(e));

    this.containerReference.addEventListener("mouseup", () => this.#onDragStop());
    this.containerReference.addEventListener("touchend", () => this.#onDragStop());
  }

}

new Carousel(carousel);
