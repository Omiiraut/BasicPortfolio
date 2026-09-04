const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navbar = document.querySelector(".navbar");
const contactForm = document.getElementById("contactForm");
const animatedRoles = document.querySelector(".animated-roles");
const revealTargets = document.querySelectorAll(".section, .highlight-card, .project-card, .glass-card, .metric-card, .contact-item");
const tiltTargets = document.querySelectorAll("[data-tilt]");
const heroTitle = document.querySelector(".hero-title");
const heroDescription = document.querySelector(".hero-description");
const heroActions = document.querySelector(".hero-actions");
const heroMetrics = document.querySelectorAll(".metric-card");
const cursorAura = document.querySelector(".cursor-aura");
const backgroundLogo = document.querySelector(".background-logo-svg");

const roles = ["Developer", "Creator", "Builder", "Problem Solver"];
let roleIndex = 0;
let ticking = false;

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        const isActive = navMenu.classList.toggle("active");
        hamburger.classList.toggle("active", isActive);
        hamburger.setAttribute("aria-expanded", String(isActive));
        document.body.classList.toggle("menu-open", isActive);
    });
}

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        if (!hamburger || !navMenu) {
            return;
        }

        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

function updateScrollEffects() {
    const scrollY = window.scrollY;

    if (navbar) {
        navbar.classList.toggle("scrolled", scrollY > 24);
    }

    if (backgroundLogo) {
        const rotateY = scrollY * 0.16;
        const rotateX = Math.sin(scrollY * 0.003) * 8;
        const scale = 1 + Math.min(scrollY / 12000, 0.04);
        backgroundLogo.style.transform = `perspective(1600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
    }

    ticking = false;
}

window.addEventListener("scroll", () => {
    if (ticking) {
        return;
    }

    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
});

function updateRole() {
    if (!animatedRoles) {
        return;
    }

    animatedRoles.classList.remove("role-visible");

    window.setTimeout(() => {
        animatedRoles.textContent = roles[roleIndex];
        animatedRoles.classList.add("role-visible");
        roleIndex = (roleIndex + 1) % roles.length;
    }, 90);
}

if (animatedRoles) {
    updateRole();
    window.setInterval(updateRole, 1500);
}

updateScrollEffects();

function typeHeroTitle() {
    if (!heroTitle) {
        return;
    }

    const fullHTML = heroTitle.innerHTML;
    const temp = document.createElement("div");
    temp.innerHTML = fullHTML;
    const plainText = temp.textContent || "";
    let index = 0;

    heroTitle.textContent = "";

    function type() {
        if (index < plainText.length) {
            heroTitle.textContent += plainText.charAt(index);
            index += 1;
            window.setTimeout(type, 18);
            return;
        }

        heroTitle.innerHTML = fullHTML;
        heroTitle.classList.add("hero-ready");
    }

    type();
}

window.addEventListener("load", () => {
    typeHeroTitle();

    heroDescription?.classList.add("hero-visible");
    heroActions?.classList.add("hero-visible");

    heroMetrics.forEach((card, index) => {
        window.setTimeout(() => {
            card.classList.add("hero-visible");
        }, 140 + index * 90);
    });
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const stagger = Number(entry.target.dataset.delay || 0);
            window.setTimeout(() => {
                entry.target.classList.add("reveal", "is-visible");
            }, stagger);

            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.14,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.dataset.delay = String((index % 4) * 65);
    revealObserver.observe(target);
});

const skillsSection = document.querySelector(".skills");
const skillObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.querySelectorAll(".skill-progress").forEach((bar, index) => {
                const targetWidth = bar.style.width;
                bar.style.width = "0%";
                window.setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 80 + index * 100);
            });

            skillObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.35
    }
);

if (skillsSection) {
    skillObserver.observe(skillsSection);
}

if (!("ontouchstart" in window)) {
    if (cursorAura) {
        window.addEventListener("mousemove", (event) => {
            cursorAura.style.opacity = "1";
            cursorAura.animate(
                {
                    left: `${event.clientX}px`,
                    top: `${event.clientY}px`
                },
                {
                    duration: 220,
                    fill: "forwards",
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)"
                }
            );
        });

        document.addEventListener("mouseleave", () => {
            cursorAura.style.opacity = "0";
        });
    }

    tiltTargets.forEach((element) => {
        element.addEventListener("mousemove", (event) => {
            const rect = element.getBoundingClientRect();
            const percentX = (event.clientX - rect.left) / rect.width;
            const percentY = (event.clientY - rect.top) / rect.height;
            const rotateY = (percentX - 0.5) * 12;
            const rotateX = (0.5 - percentY) * 12;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
        });

        element.addEventListener("mouseleave", () => {
            element.style.transform = "";
        });
    });
}

document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const ripple = document.createElement("span");
        ripple.className = "btn-ripple";

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        button.appendChild(ripple);

        window.setTimeout(() => {
            ripple.remove();
        }, 520);
    });
});

if (window.emailjs) {
    emailjs.init("p8FPzKTB7DgBZmYEw");
}

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonLabel = submitButton?.querySelector(".btn-label");
        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !subject || !message) {
            showNotification("Please fill in all fields before sending your message.", "error");
            return;
        }

        if (!isValidEmail(email)) {
            showNotification("Please enter a valid email address.", "error");
            return;
        }

        if (!window.emailjs) {
            showNotification("Email service is unavailable right now. Please use the direct email link instead.", "error");
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
        }

        if (buttonLabel) {
            buttonLabel.textContent = "Sending...";
        }

        try {
            await emailjs.send("service_u35pplg", "template_pxgj8ql", {
                from_name: name,
                from_email: email,
                subject,
                message,
                to_email: "omraut404@gmail.com",
                reply_to: email
            });

            contactForm.reset();
            showNotification("Message sent successfully. It should arrive at omraut404@gmail.com.", "success");
        } catch (error) {
            console.error("EmailJS error:", error);
            showNotification("Message could not be sent from the form. Please try again or email omraut404@gmail.com directly.", "error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }

            if (buttonLabel) {
                buttonLabel.textContent = "Send Message";
            }
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = "info") {
    const existing = document.querySelector(".notification");
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-inner">
            <span>${message}</span>
            <button type="button" aria-label="Close notification">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    const closeButton = notification.querySelector("button");
    closeButton?.addEventListener("click", () => notification.remove());

    window.setTimeout(() => {
        notification.remove();
    }, 4500);
}
