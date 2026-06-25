import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// قمنا باستيراد initializeFirestore بدلاً من getFirestore
import { initializeFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzHA2Gc0olnCli51uyoMTMYyHavQMWCM4",
    authDomain: "website-32859.firebaseapp.com",
    projectId: "website-32859",
    storageBucket: "website-32859.firebasestorage.app",
    messagingSenderId: "518244429664",
    appId: "1:518244429664:web:439f8325772d026938b805",
    measurementId: "G-9WKTSZ0N4B"
};

const app = initializeApp(firebaseConfig);

// إجبار قواعد البيانات على استخدام Long Polling لتخطي حظر الـ WebSockets
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

// الآن يمكنك استخدام المتغير db بشكل طبيعي جداً مع addDoc أو غيرها من الدوالي

// عناصر النموذج والصفحة
const form = document.getElementById("bookingForm");
const successMessage = document.getElementById("success");
const submitBtn = document.getElementById("sub");
const langBtn = document.getElementById("langBtn");
const htmlTag = document.getElementById("htmlTag");

// نصوص اللغتين لتبديل المحتوى
const translations = {
    ar: {
        title: "ابدأ موقعك الإلكتروني الآن",
        heading: "صمّم موقعك الإلكتروني لعملك أو شركتك",
        subHeading: "تميز بوجود رقمي واحترافي. املأ البيانات بالأسفل وسأتواصل معك مباشرة للاتفاق على التفاصيل والأسعار المناسبة لمشروعك.",
        namePlace: "الاسم الكريم",
        emailPlace: "البريد الإلكتروني",
        telPlace: "رقم الجوال أو الواتساب",
        optDefault: "ما هو نوع الموقع الذي تحتاجه؟",
        optCompany: "موقع تعريفي لشركة أو نشاط تجاري",
        optStore: "متجر إلكتروني لبيع المنتجات",
        optLanding: "صفحة هبوط (Landing Page) لمنتج أو خدمة",
        optPortfolio: "موقع شخصي أو معرض أعمال (Portfolio)",
        optModify: "تعديل أو تطوير موقعك الحالي",
        morePlace: "اكتب تفاصيل مشروعك بالكامل هنا (مطلوب)",
        priceNotice: "💡 *ملاحظة: الأسعار مرنة ويتم تحديدها والاتفاق عليها بما يتناسب مع حجم مشروعك وميزانيتك أثناء تواصلنا المباشر.*",
        submitBtn: "طلب استشارة واتفاق مجاني",
        successMsg: "✅ تم إرسال طلبك بنجاح! سأتواصل معك قريباً جداً لمناقشة التفاصيل والأسعار.",
        sending: "جاري إرسال طلبك...",
        error: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.",
        langBtnText: "English 🌐"
    },
    en: {
        title: "Start Your Website Now",
        heading: "Design a Website for Your Business or Company",
        subHeading: "Stand out with a professional digital presence. Fill out the details below, and I will contact you directly to agree on the project details and pricing.",
        namePlace: "Full Name",
        emailPlace: "Email Address",
        telPlace: "Phone or WhatsApp Number",
        optDefault: "What type of website do you need?",
        optCompany: "Company or Business Profile Website",
        optStore: "E-commerce Store / Online Shop",
        optLanding: "Landing Page for a product or service",
        optPortfolio: "Personal Website / Portfolio",
        optModify: "Modify or develop an existing website",
        morePlace: "Write your full project details here (Required)",
        priceNotice: "💡 *Note: Prices are flexible and will be determined and agreed upon based on your budget and project scope during our direct contact.*",
        submitBtn: "Request Free Consultation & Quote",
        successMsg: "✅ Your request has been sent successfully! I will contact you very soon to discuss details and pricing.",
        sending: "Sending your request...",
        error: "An unexpected error occurred. Please try again.",
        langBtnText: "العربية 🌐"
    }
};

let currentLang = "ar";

// دالة لتغيير النصوص بناءً على اللغة المختارة
function setLanguage(lang) {
    currentLang = lang;
    if (lang === "en") {
        htmlTag.setAttribute("dir", "ltr");
        htmlTag.setAttribute("lang", "en");
    } else {
        htmlTag.setAttribute("dir", "rtl");
        htmlTag.setAttribute("lang", "ar");
    }

    document.getElementById("pageTitle").innerText = translations[lang].title;
    document.getElementById("mainHeading").innerText = translations[lang].heading;
    document.getElementById("subHeading").innerText = translations[lang].subHeading;
    
    document.getElementById("name").placeholder = translations[lang].namePlace;
    document.getElementById("email").placeholder = translations[lang].emailPlace;
    document.getElementById("tel").placeholder = translations[lang].telPlace;
    
    document.getElementById("optDefault").innerText = translations[lang].optDefault;
    document.getElementById("optCompany").innerText = translations[lang].optCompany;
    document.getElementById("optStore").innerText = translations[lang].optStore;
    document.getElementById("optLanding").innerText = translations[lang].optLanding;
    document.getElementById("optPortfolio").innerText = translations[lang].optPortfolio;
    document.getElementById("optModify").innerText = translations[lang].optModify;
    
    document.getElementById("more").placeholder = translations[lang].morePlace;
    document.getElementById("priceNotice").innerHTML = translations[lang].priceNotice;
    submitBtn.innerText = translations[lang].submitBtn;
    successMessage.innerHTML = translations[lang].successMsg;
    langBtn.innerText = translations[lang].langBtnText;
}

// الاستماع لحدث الضغط على زر تغيير اللغة
langBtn.addEventListener("click", () => {
    const nextLang = currentLang === "ar" ? "en" : "ar";
    setLanguage(nextLang);
});

// التعامل مع إرسال النموذج
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    submitBtn.innerText = translations[currentLang].sending;
    submitBtn.disabled = true;

    try {
        await addDoc(collection(db, "bookings"), {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("tel").value,
            service: document.getElementById("service").value,
            preferredDate: document.getElementById("date").value,
            projectDetails: document.getElementById("more").value,
            languageSubmitted: currentLang, // لحفظ اللغة التي أرسل بها العميل لتعرف كيف تتحدث معه
            createdAt: new Date()
        });

        successMessage.style.display = "block";
        form.reset();
        
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 7000);

    } catch (error) {
        console.error("Error: ", error);
        alert(translations[currentLang].error);
    } finally {
        submitBtn.innerText = translations[currentLang].submitBtn;
        submitBtn.disabled = false;
    }
});