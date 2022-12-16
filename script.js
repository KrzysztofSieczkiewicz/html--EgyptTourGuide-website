// SMOOTH SCROLLING
function changeSection(offset) {
    sectionIndex = sectionIndex + offset

    if(sectionIndex < 0) sectionIndex = 0
    if(sectionIndex >= sections.length) sectionIndex = sections.length - 1

    isScrolling = true;
    sections[sectionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
    })

    setTimeout(() => {
        isScrolling = false;
    }, 300)
};

function preventDefaultEvents() {
    function preventDefault(e) {
        e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
        try {
            if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
            }
        } catch(e) {}
    }

    var supportsPassive = false;
    try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; } 
    }));
    } catch(e) {}
    var wheelOpt = supportsPassive ? { passive: false } : false;

    window.addEventListener('wheel', preventDefault, wheelOpt)
    //window.addEventListener('DOMMouseScroll', preventDefault, false)
    window.addEventListener('keydown', preventDefaultForScrollKeys, false)
}

history.scrollRestoration = "manual";
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

preventDefaultEvents()

const sections = document.getElementsByTagName('section')
const navButtons = document.querySelectorAll(".nav-link")
var sectionIndex = 0;
var isScrolling = false;

window.addEventListener('wheel', ({ deltaY }) => {
    const delta = Math.sign(deltaY)

    if(!isScrolling) {
        changeSection(delta)
    }
})

navButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault()
        const targetSection = document.querySelector(button.getAttribute('href'))
        sectionIndex = [...sections].indexOf(targetSection)

        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });

    })
})

// CAROUSELS
function nextSlide() {
    const offset = 1
    const slides = document.querySelector("[data-slides]")
    const activeSlide = document.querySelector("[data-active]")

    let newIndex = [...slides.children].indexOf(activeSlide) + offset

    if(newIndex < 0) newIndex = slides.children.length - 1
    if(newIndex >= slides.children.length) newIndex = 0

    slides.children[newIndex].dataset.active = true
    delete activeSlide.dataset.active
}


const buttons = document.querySelectorAll("[data-carousel-button]")
const interval = 6000

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]")

        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset

        if(newIndex < 0) newIndex = slides.children.length - 1
        if(newIndex >= slides.children.length) newIndex = 0

        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active

        clearInterval(nextSlideInterval)
        nextSlideInterval = setInterval(nextSlide, interval)
    })
})

let nextSlideInterval = window.setInterval(nextSlide, interval)


// FORM VALIDATION
const formElement = document.querySelector('#contact-form')
const nameElement = document.querySelector('#input-name')
const emailElement = document.querySelector('#input-email')
const messageElement = document.querySelector('#input-message')
function validateForm() {
  
    const name = nameElement.value.trim()
    const email = emailElement.value.trim()
    const message = messageElement.value.trim()

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (name === '' || email === '' || message === '') {
      alert('All fields are required. Please fill out the form completely.')
      return false
    } else {
        if(!emailRegex.test(email)) {
            alert('Invalid e-mail format');
            return false
        } else {
            return true
        }
    }
}




// FORM SENDING
function initEmailJs() {
    emailjs.init('4_E4dGEoYe0BXMYvT');
};


initEmailJs()

window.onload = function() {
    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        
        if(validateForm()) {
            emailjs.sendForm('service_s4l9xsk', 'template_tmwy3nr', formElement)
                .then(function() {
                    formElement.reset();
                    alert("Message sent succesfully. We'll contact you as soon as possible");
                    console.log('SUCCESS!');
                }, function(error) {
                    console.log('FAILED...', error);
                });
        }
    });
}