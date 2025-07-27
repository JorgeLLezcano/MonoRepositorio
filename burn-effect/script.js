const article = document.querySelector('.burn-card')
const feFuncA = document.querySelector('[in=grayscaleNoise] feFuncA')

const playBurnEffect = () => {
  const targetIntercept = -100 * 0.2 // Controla la "desintegración"
  gsap.to(feFuncA, {
    attr: { intercept: targetIntercept },
    duration: 2,
    ease: 'power1.out',
    onComplete: () => {
      article.style.opacity = 0 // Se desvanece la card visualmente
      setTimeout(() => {
            gsap.set(feFuncA, { attr: { intercept: -85 } }) // restauramos
            article.style.opacity = 1 // reaparece
          }, 2000)
    }
  })
}
article.addEventListener('click', playBurnEffect)
