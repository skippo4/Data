document.addEventListener('DOMContentLoaded', () => {
  // Toggle navbar
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Hero animation
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('visible');
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.name.value;
      alert(`Thank you, ${name}! We received your message.`);
      contactForm.reset();
    });
  }

  // Application form with Paystack integration
  const applyForm = document.getElementById('applyForm');
  if (applyForm) {
    applyForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btnText = document.querySelector(".btn-text");
      const spinner = document.querySelector(".spinner");
      if (btnText) btnText.textContent = "Processing...";
      if (spinner) spinner.style.display = "inline-block";

      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const course = document.getElementById("course").value;
      const level = document.getElementById("level").value;

      const coursePrices = {
        excel: 100000,
        powerbi: 150000,
        python: 200000
      };

      if (!fullname || !email || !phone || !course || !level) {
        alert("Please fill all fields.");
        return;
      }

      const amount = coursePrices[course];

      const handler = PaystackPop.setup({
        key: 'pk_test_5b46993ec51dbdb81b8685677d267223a8e97420',
        email,
        amount,
        currency: "NGN",
        ref: "XYLEM_" + Math.floor(Math.random() * 1000000000),
        metadata: {
          custom_fields: [
            { display_name: "Full Name", variable_name: "fullname", value: fullname },
            { display_name: "Phone", variable_name: "phone", value: phone },
            { display_name: "Course", variable_name: "course", value: course },
            { display_name: "Level", variable_name: "level", value: level }
          ]
        },
        callback: function (response) {
          fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullname, email, phone, course, level,
              reference: response.reference
            })
          }).then(() => {
            window.location.href = `thank-you.html?ref=${response.reference}`;
          }).catch(() => {
            alert("Payment succeeded but data was not saved.");
          });
        },
        onClose: function () {
          alert("Payment was cancelled.");
        }
      });

      handler.openIframe();
    });
  }

  // Testimonial slider
  const testimonials = document.querySelectorAll('.testimonial-card');
  let current = 0;
  if (testimonials.length) {
    function showNextTestimonial() {
      testimonials[current].classList.remove('active');
      current = (current + 1) % testimonials.length;
      testimonials[current].classList.add('active');
    }
    testimonials[0].classList.add('active');
    setInterval(showNextTestimonial, 5000);
  }
});