// import 'intersection-observer';

/* common scroll function */
export function scrollAddClass(classname, classname2, rootMargin, threshold) {
  let targetAddClass = [].slice.call(document.querySelectorAll('.' + classname))
  // console.log(targetAddClass);
  const options = {
    root: null,
    rootMargin: rootMargin,
    threshold: threshold
  }
  if ('IntersectionObserver' in window) {
    const targetAddClassObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let item = entry.target
          //item.classList.remove("c-fade");
          let time = item.dataset.scripttime
          if (time) {
            setTimeout(function () {
              item.classList.add(classname2)
            }, time)
          } else {
            item.classList.add(classname2)
          }
          targetAddClassObserver.unobserve(item)
        }
      })
    }, options)
    targetAddClass.forEach(function (item) {
      targetAddClassObserver.observe(item)
    })
  }
}

/* common scroll function */
export function scrollAddClassTarget(classname, targetClassname, classname2, rootMargin, threshold) {
  let targetAddClass = [].slice.call(document.querySelectorAll('.' + classname))
  let targetClass = [].slice.call(document.querySelectorAll('.' + targetClassname))
  // console.log(targetAddClass);
  const options = {
    root: null,
    rootMargin: rootMargin,
    threshold: threshold
  }
  if ('IntersectionObserver' in window) {
    const targetAddClassObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          let item = entry.target
          //item.classList.remove("c-fade");

          targetClass.forEach(function (item2) {
            let time = item2.dataset.scripttime
            if (time) {
              setTimeout(function () {
                item2.classList.add(classname2)
              }, time)
            } else {
              item2.classList.add(classname2)
            }
          })

          targetAddClassObserver.unobserve(item)
        }
      })
    }, options)
    targetAddClass.forEach(function (item) {
      targetAddClassObserver.observe(item)
    })
  }
}

export function scrollAddClassTargetScroll(classname, targetClassname, classname2, rootMargin, threshold) {
  let targetAddClass = [].slice.call(document.querySelectorAll('.' + classname))
  let targetClass = [].slice.call(document.querySelectorAll('.' + targetClassname))
  const options = {
    root: null,
    rootMargin: rootMargin,
    threshold: threshold
  }
  if ('IntersectionObserver' in window) {
    const targetAddClassObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          let item = entry.target
          let time = item.dataset.scripttime
          if (window.pageYOffset > item.getBoundingClientRect().top + window.pageYOffset) {
            if (time) {
              targetClass.forEach(function (item2) {
                setTimeout(() => {
                  item2.classList.remove(classname2)
                }, time)
              })
            } else {
              targetClass.forEach(function (item2) {
                item2.classList.remove(classname2)
              })
            }
          } else {
            if (time) {
              targetClass.forEach(function (item2) {
                setTimeout(() => {
                  item2.classList.add(classname2)
                }, time)
              })
            } else {
              targetClass.forEach(function (item2) {
                item2.classList.add(classname2)
              })
            }
          }
        }
      })
    }, options)
    targetAddClass.forEach(function (item) {
      targetAddClassObserver.observe(item)
    })
  }
}

export function scrollAddClassChild(classname, classname2, addclass, rootMargin, threshold) {
  let targetAddClass = [].slice.call(document.querySelectorAll('.' + classname))
  // console.log(targetAddClass);
  const options = {
    root: null,
    rootMargin: rootMargin,
    threshold: threshold
  }
  if ('IntersectionObserver' in window) {
    const targetAddClassObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let addClassArr = entry.target.querySelectorAll('.' + classname2)

          addClassArr.forEach(function (elm) {
            if (elm.classList.contains(classname2)) {
              let time = elm.dataset.scripttime
              if (time) {
                setTimeout(function () {
                  elm.classList.add(addclass)
                }, time)
              } else {
                elm.classList.add(addclass)
              }
            }
          })
          targetAddClassObserver.unobserve(entry.target)
        }
      })
    }, options)
    targetAddClass.forEach(function (item) {
      targetAddClassObserver.observe(item)
    })
  }
}
