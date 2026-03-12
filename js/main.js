(function ($) {
    "use strict";

    const API_BASE_URL = window.DZIDZO_API_BASE_URL || "http://localhost:4000";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Courses carousel
    $(".courses-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        dots: false,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Team carousel
    $(".team-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
    });


    // Related carousel
    $(".related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    async function api(path, options) {
        const response = await fetch(`${API_BASE_URL}${path}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed.");
        }

        return data;
    }

    function reinitCarousel($element, options) {
        if (!$element.length || typeof $element.owlCarousel !== "function") {
            return;
        }

        if ($element.hasClass("owl-loaded")) {
            $element.trigger("destroy.owl.carousel");
            $element.removeClass("owl-loaded");
            $element.find(".owl-stage-outer").children().unwrap();
        }

        $element.owlCarousel(options);
    }

    async function handleContactForm() {
        const form = document.querySelector(".contact-form form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const inputs = form.querySelectorAll("input, textarea");
            const payload = {
                full_name: inputs[0]?.value.trim() || "",
                email: inputs[1]?.value.trim() || "",
                subject: inputs[2]?.value.trim() || "",
                message: inputs[3]?.value.trim() || ""
            };

            try {
                await api("/api/public/contact-messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                alert("Message sent successfully.");
                form.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    async function attachNewsletterHandlers() {
        const groups = Array.from(document.querySelectorAll(".input-group")).filter((group) => {
            const input = group.querySelector("input");
            const button = group.querySelector("button");

            if (!input || !button) {
                return false;
            }

            const placeholder = (input.getAttribute("placeholder") || "").trim();
            return placeholder === "Welcome to Dzidzo, please enter your email" || placeholder === "Enter email";
        });

        groups.forEach((group, index) => {
            const input = group.querySelector("input");
            const button = group.querySelector("button");
            const anchor = button.querySelector("a");

            const submit = async () => {
                const email = input.value.trim();

                if (!email) {
                    alert("Please enter your email.");
                    return;
                }

                try {
                    await api("/api/public/newsletter-subscriptions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email,
                            source: `${window.location.pathname}#newsletter-${index + 1}`
                        })
                    });

                    if (anchor && anchor.getAttribute("href")) {
                        window.location.href = anchor.getAttribute("href");
                        return;
                    }

                    alert("Subscription saved successfully.");
                    input.value = "";
                } catch (error) {
                    alert(error.message);
                }
            };

            button.addEventListener("click", function (event) {
                event.preventDefault();
                submit();
            });

            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    submit();
                }
            });
        });
    }

    async function hydrateTeamCarousel() {
        const $carousel = $(".team-carousel");

        if (!$carousel.length) {
            return;
        }

        const result = await api("/api/public/team-members");
        const items = result.items || [];

        if (!items.length) {
            return;
        }

        $carousel.html(items.map((member) => `
            <div class="team-item">
                <img class="img-fluid w-100" src="${member.image_url || "img/team-1.jpg"}" alt="${member.full_name}">
                <div class="bg-light text-center p-4">
                    <h5 class="mb-3">${member.full_name}</h5>
                    <p class="mb-2">${member.title || ""}</p>
                    <div class="d-flex justify-content-center">
                        <a class="mx-1 p-1" href="${member.twitter_url || "#"}"><i class="fab fa-twitter"></i></a>
                        <a class="mx-1 p-1" href="${member.facebook_url || "#"}"><i class="fab fa-facebook-f"></i></a>
                        <a class="mx-1 p-1" href="${member.linkedin_url || "#"}"><i class="fab fa-linkedin-in"></i></a>
                        <a class="mx-1 p-1" href="${member.instagram_url || "#"}"><i class="fab fa-instagram"></i></a>
                        <a class="mx-1 p-1" href="${member.youtube_url || "#"}"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        `).join(""));

        reinitCarousel($carousel, {
            autoplay: true,
            smartSpeed: 1000,
            margin: 30,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: { items: 1 },
                576: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }

    async function hydrateTestimonials() {
        const $carousel = $(".testimonial-carousel");

        if (!$carousel.length) {
            return;
        }

        const result = await api("/api/public/testimonials");
        const items = result.items || [];

        if (!items.length) {
            return;
        }

        $carousel.html(items.map((testimonial) => `
            <div class="bg-white p-5">
                <i class="fa fa-3x fa-quote-left text-primary mb-4"></i>
                <p>${testimonial.quote}</p>
                <div class="d-flex flex-shrink-0 align-items-center mt-4">
                    <img class="img-fluid mr-4" src="${testimonial.image_url || "img/testimonial-1.jpg"}" alt="${testimonial.student_name}">
                    <div>
                        <h5>${testimonial.student_name}</h5>
                        <span>${testimonial.student_title || ""}</span>
                    </div>
                </div>
            </div>
        `).join(""));

        reinitCarousel($carousel, {
            autoplay: true,
            smartSpeed: 1500,
            items: 1,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ]
        });
    }

    async function hydrateCourseListPage() {
        const path = window.location.pathname.split("/").pop();

        if (path !== "course.html") {
            return;
        }

        const cards = Array.from(document.querySelectorAll(".col-lg-4.col-md-6.pb-4"));
        const pagination = document.querySelector(".pagination")?.closest(".col-12");

        if (!cards.length || !pagination) {
            return;
        }

        const result = await api("/api/public/courses?limit=6");
        const items = result.items || [];

        cards.forEach((card) => card.remove());

        items.forEach((course) => {
            const wrapper = document.createElement("div");
            wrapper.className = "col-lg-4 col-md-6 pb-4";
            wrapper.innerHTML = `
                <a class="courses-list-item position-relative d-block overflow-hidden mb-2" href="${course.page_path || "detail.html"}">
                    <img class="img-fluid" src="${course.image_url || "img/courses-1.jpg"}" alt="${course.title}">
                    <div class="courses-text">
                        <h4 class="text-center text-white px-3">${course.title}</h4>
                        <div class="border-top w-100 mt-3">
                            <div class="d-flex justify-content-between p-4">
                                <span class="text-white"><i class="fa fa-user mr-2"></i>${course.instructor_name || "Dzidzo"}</span>
                                <span class="text-white"><i class="fa fa-star mr-2"></i>${Number(course.rating_average || 0).toFixed(1)} <small>(${course.rating_count || 0})</small></span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            pagination.parentNode.insertBefore(wrapper, pagination);
        });
    }

    function courseCardMarkup(course) {
        return `
            <a class="courses-list-item position-relative d-block overflow-hidden mb-2" href="${course.page_path || "detail.html"}">
                <img class="img-fluid" src="${course.image_url || "img/courses-1.jpg"}" alt="${course.title}">
                <div class="courses-text">
                    <h4 class="text-center text-white px-3">${course.title}</h4>
                    <div class="border-top w-100 mt-3">
                        <div class="d-flex justify-content-between p-4">
                            <span class="text-white"><i class="fa fa-user mr-2"></i>${course.instructor_name || "Dzidzo"}</span>
                            <span class="text-white"><i class="fa fa-star mr-2"></i>${Number(course.rating_average || 0).toFixed(1)} <small>(${course.rating_count || 0})</small></span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    async function hydrateCourseDetailPage() {
        const path = window.location.pathname.split("/").pop();
        const detailPages = ["detail.html", "classroom_1.html", "classroom_2.html", "business_lobby.html", "class-coming-soon.html"];

        if (!detailPages.includes(path)) {
            return;
        }

        const [courseResult, coursesResult] = await Promise.all([
            api(`/api/public/courses/by-page?page_path=${encodeURIComponent(path)}`),
            api("/api/public/courses?limit=10")
        ]);

        const course = courseResult.item;
        const allCourses = (coursesResult.items || []).filter((item) => item.page_path !== path);

        const headerTitle = document.querySelector(".page-header .display-1");
        const breadcrumbTitle = document.querySelector(".page-header .m-0.text-uppercase:last-child");
        const contentSection = document.querySelector(".container-fluid.py-5 .section-title.position-relative.mb-5");

        if (headerTitle) {
            headerTitle.textContent = course.title;
        }

        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = course.title;
        }

        if (contentSection) {
            const badge = contentSection.querySelector("h6");
            const title = contentSection.querySelector("h1");

            if (badge) {
                badge.textContent = course.category_name || "Course";
            }

            if (title) {
                title.textContent = course.title;
            }
        }

        const descriptionParagraphs = document.querySelectorAll(".col-lg-8 .mb-5 p");
        if (descriptionParagraphs.length > 0 && course.summary) {
            descriptionParagraphs[0].textContent = course.summary;
        }
        if (descriptionParagraphs.length > 1 && course.description) {
            descriptionParagraphs[1].textContent = course.description;
        }

        const image = document.querySelector(".col-lg-8 .mb-5 img");
        if (image && course.image_url) {
            image.src = course.image_url;
            image.alt = course.title;
        }

        const featureRows = document.querySelectorAll(".bg-primary.mb-5.py-3 .d-flex.justify-content-between");
        featureRows.forEach((row) => {
            const label = row.querySelector("h6:first-child")?.textContent?.trim();
            const valueNode = row.querySelector("h6:last-child");

            if (!label || !valueNode) {
                return;
            }

            if (label === "Instructor") valueNode.textContent = course.instructor_name || "Dzidzo";
            if (label === "Rating") valueNode.textContent = `${Number(course.rating_average || 0).toFixed(1)} (${course.rating_count || 0})`;
            if (label === "Lectures") valueNode.textContent = String(course.lecture_count || 0);
            if (label === "Duration") valueNode.textContent = `${course.duration_hours || 0} Hrs`;
            if (label === "Skill level") valueNode.textContent = course.skill_level || "All Levels";
            if (label === "Language") valueNode.textContent = course.language || "English";
        });

        const priceHeading = document.querySelector(".bg-primary.mb-5.py-3 h5");
        if (priceHeading) {
            priceHeading.textContent = `Course Price: ${course.currency_code || "USD"} ${Number(course.price_amount || 0).toFixed(2)}`;
        }

        const relatedCarousel = $(".related-carousel");
        if (relatedCarousel.length) {
            relatedCarousel.html(allCourses.slice(0, 3).map(courseCardMarkup).join(""));
            reinitCarousel(relatedCarousel, {
                autoplay: true,
                smartSpeed: 1000,
                margin: 30,
                dots: false,
                loop: true,
                nav: true,
                navText: [
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                ],
                responsive: {
                    0: { items: 1 },
                    576: { items: 1 },
                    768: { items: 2 }
                }
            });
        }

        const recentList = document.querySelectorAll(".mb-5 a.d-flex.align-items-center.text-decoration-none");
        recentList.forEach((node, index) => {
            const item = allCourses[index];
            if (!item) {
                return;
            }

            node.setAttribute("href", item.page_path || "detail.html");
            const img = node.querySelector("img");
            const title = node.querySelector("h6");
            const meta = node.querySelectorAll("small");

            if (img) {
                img.src = item.image_url || "img/courses-80x80.jpg";
                img.alt = item.title;
            }

            if (title) {
                title.textContent = item.title;
            }

            if (meta[0]) {
                meta[0].innerHTML = `<i class="fa fa-user text-primary mr-2"></i>${item.instructor_name || "Dzidzo"}`;
            }

            if (meta[1]) {
                meta[1].innerHTML = `<i class="fa fa-star text-primary mr-2"></i>${Number(item.rating_average || 0).toFixed(1)} (${item.rating_count || 0})`;
            }
        });
    }

    $(document).ready(function () {
        handleContactForm();
        attachNewsletterHandlers();
        hydrateTeamCarousel().catch(() => {});
        hydrateTestimonials().catch(() => {});
        hydrateCourseListPage().catch(() => {});
        hydrateCourseDetailPage().catch(() => {});
    });
    
})(jQuery);

