var randomColorIndex;
var languageMenuTimeout = null;
var userLoggedIn = false;
$(function() {
    var supportUrl = "https://support.gcfglobal.org/form/";
    $("#support-iframe").attr("src", supportUrl + "?url=" + document.location.href);
    window.addEventListener("message", function(event) {
        var iframeSize = event.data.toString().split(",");
        $("#support-iframe").width(iframeSize[0] + "px");
        $("#support-iframe").height(iframeSize[1] + "px");
    });
    if ($(".searchBox").val() == "") {
        $(".search-button").attr("disabled", true);
    }
    $(".searchBox.new-search").keyup(function() {
        SearchValue($(this));
    });
    $(".searchBox.search-footer").keyup(function() {
        SearchValue($(this));
    });
    $(window).click(function(e) {
        if ($(e.target).closest(".dropdown-wrapper").length === 0 && $(e.target).closest(".subjects-select").length === 0) {
            $(".dropdown-wrapper").fadeOut(350);
        }
        if ($(e.target).closest("footer").length === 0) {
            closeFooter();
        }
        if ($(e.target).closest("#smallSearchbar").length === 0 && $(e.target).closest(".header-search-btn").length === 0) {
            showSearchBar();
        }
    });
    signedOptions();
});
function toggleSubjectsDropdown() {
    var button = $(".subjects-select");
    var menu = $(".dropdown-wrapper");
    menu.fadeToggle(350);
    menu.toggleClass("dropdown-wrapper-expanded");
    if (menu.hasClass("dropdown-wrapper-expanded")) {
        button.attr("aria-expanded", "true");
    } else {
        button.attr("aria-expanded", "false");
        setTimeout(function() {
            button.focus();
        }, 100);
    }
}
function toggleLanguageMenu() {
    if (languageMenuTimeout) {
        clearInterval(languageMenuTimeout);
    }
    if ($(".language-dropdown-expanded").length > 0) {
        $(".language-dropdown").removeClass("language-dropdown-expanded");
        $(".language-dropdown-button").attr("aria-expanded", "false");
        languageMenuTimeout = setTimeout(function() {
            $(".language-dropdown-menu").css("display", "none");
            $("#acc-language-button").focus();
        }, 350);
    } else {
        $(".language-dropdown-menu").css("display", "block");
        $(".language-dropdown-button").attr("aria-expanded", "true");
        setTimeout(function() {
            $(".language-dropdown").addClass("language-dropdown-expanded");
        }, 0);
    }
}
function toggleDropdown() {
    var Menu = $(".dropdown__trigger");
    if (Menu) {
        var Dropdown = Menu.parent().find(".dropdown");
        Menu.click(function() {
            Dropdown.toggleClass("is-open");
        });
    }
}
function signedOptions() {
    asingRootAccountLinks();
    var signWrapper = $("#header-sign-options");
    document.addEventListener("signin_error", (e)=>{
        if (userLoggedIn)
            return;
        var language = window.location.href.includes("/es") ? "es" : window.location.href.includes("/pt") ? "pt" : "en";
        var labels = {
            login: {
                es: "Ingresar",
                pt: "Conecte-se",
                en: "Login",
            },
            register: {
                es: "¡Crea tu cuenta!",
                pt: "Entre de graça!",
                en: "Join for free!",
            },
        };
        var loginWrapper = $(`<div class="sign__actions"></div>`);
        var loginOption = $(`<a href="https://account.gcfglobal.org/" class="sign__action sign__action--login rootAccountLink">${labels.login[language]}</a>`);
        var signUpOption = $(`<a href="https://account.gcfglobal.org/signup" class="sign__action sign__action--up rootAccountLink">${labels.register[language]}</a>`);
        loginOption.appendTo(loginWrapper);
        signUpOption.appendTo(loginWrapper);
        signWrapper.html("").append(loginWrapper);
    }
    );
    document.addEventListener("token_set", (e)=>{
        const userData = e.detail.user;
        const language = window.location.href.includes("/es") ? "es" : window.location.href.includes("/pt") ? "pt" : "en";
        const accountOptions = {
            en: {
                dashboard: "Dashboard",
                profile: "Profile",
                logout: "Logout"
            },
            es: {
                dashboard: "Panel de usuario",
                profile: "Perfil",
                logout: "Cerrar sesión"
            },
            pt: {
                dashboard: "Painel do usuário",
                profile: "Perfil",
                logout: "Fechar Sessão"
            },
        }
        var loggedDropdownWrapper = $(`<div class="sign__actions sign__dropdown dropdown__wrapper is-logged-in">
      </div>`);
        const grettings = language === 'es' ? 'Hola' : language === 'en' ? 'Hi' : 'Oi';
        var userAvatar = userData?.profile?.picture ? `<img src="${userData?.profile?.picture}" class="dropdown__trigger--avatar" />` : "";
        var loggedDropdownTrigger = $(`<button class="dropdown__trigger">
        ${userAvatar}
        <div class="dropdown__trigger--label">${grettings}${userData?.profile?.full_name ? "," + " " + userData.profile.full_name : ""}</div>
        <span class="dropdown__trigger--icon">&#9660;</span>
       </button>`);
        var loggedDropdown = $(`<ul class="dropdown">
            <li class="drodpown__item">
                <a href="https://account.gcfglobal.org/home" class="dropdown__link">${accountOptions[language].dashboard}</a>
            </li>
            <li class="drodpown__item">
                <a href="https://account.gcfglobal.org/profile" class="dropdown__link">${accountOptions[language].profile}</a>
            </li>
            <li class="drodpown__item">
                <a href="https://account.gcfglobal.org/auth/logout" id="header-loggout"  class="dropdown__link">${accountOptions[language].logout}</a>
            </li>
        </ul>`);
        loggedDropdownTrigger.appendTo(loggedDropdownWrapper);
        loggedDropdown.appendTo(loggedDropdownWrapper);
        signWrapper.html("").append(loggedDropdownWrapper);
        userLoggedIn = true;
        toggleDropdown();
        asingRootAccountLinks();
    }
    );
}
function asingRootAccountLinks() {
    const rootinks = document.getElementsByClassName("rootAccountLink");
    Array.prototype.forEach.call(rootinks, function(element) {
        element.href = "https://account.gcfglobal.org/";
    });
}
function adjustDropdownSize(animate) {
    var newHeight = $(".selectedMenuOption.dropdown-inner").height() + $(".menuOptionSelected").height() + 20;
    if (newHeight > 600) {
        newHeight = 600;
        $(".dropdown-wrapper").css({
            overflowY: "scroll"
        });
    } else {
        $(".dropdown-wrapper").css({
            overflowY: "intitial"
        });
    }
    if (animate) {
        $(".dropdown-wrapper").animate({
            height: newHeight + "px",
        }, 500);
    } else {
        $(".dropdown-wrapper").css({
            height: newHeight + "px"
        });
    }
}
function showSearchBar(state) {
    if (state == "open") {
        $("#smallSearchbar").effect("slide", {
            direction: "up",
            mode: "show"
        }, 350, function() {
            $(".topnav-search-field-small").focus();
        });
        $(".header-search-btn").css("display", "none");
        $(".topnav-sls-container .logo-link, .livebutt").fadeOut();
        if (typeof infiniteScroll !== "undefined" || typeof search !== "undefined" || typeof info !== "undefined") {
            $("#subjects-search").animate({
                height: "100px",
            }, 350);
        }
    } else {
        $("#smallSearchbar").effect("slide", {
            direction: "up",
            mode: "hide"
        }, 350);
        $(".topnav-sls-container .logo-link, .livebutt").fadeIn();
        $(".header-search-btn").fadeIn();
        if (typeof infiniteScroll !== "undefined" || typeof search !== "undefined" || typeof info !== "undefined") {
            $("#subjects-search").animate({
                height: "100px",
            }, 350);
        }
    }
}
function showSearchSpinner() {
    $(".search-submit-spinner").show();
    $(".search-submit-btn").hide();
    $(".search-submit-btn-small").hide();
}
function resizeHeaderAnimation(animationTime, delay, wrapperPadding) {
    setTimeout(function() {
        $(".sub-header").animate({
            height: "50px",
        }, animationTime);
        $(".sub-header h1").animate({
            fontSize: "25px",
            paddingTop: "8px",
            top: "100px",
        }, animationTime);
        $(".sub-header h1 a").css({
            textDecoration: "underline",
        });
        $("#page-wrapper").animate({
            paddingTop: wrapperPadding,
        }, animationTime, function() {
            $(".search .search-spinner").remove();
            $(".search .gcf-results").css("display", "block");
            $("#subheaderContentContainer .header-tutorial-link").fadeIn();
        });
        $("#header-img").fadeOut(animationTime / 3);
    }, delay);
}
function closeFooter() {
    if ($("footer").css("bottom") === "0px") {
        toggleFooter();
    }
}
function toggleFooter() {
    var bottomVal = "0px";
    if ($("footer").css("bottom") === "0px") {
        bottomVal = "-380px";
    }
    $(".up-arrow").toggle();
    $(".down-arrow").toggle();
    $("footer").animate({
        bottom: bottomVal,
    }, 500);
}
function toggleMobileFooter() {
    var bottomVal = "0px";
    if ($("footer").css("bottom") === "0px") {
        bottomVal = "-105px";
    }
    $(".up-arrow").toggle();
    $(".down-arrow").toggle();
    $("footer").animate({
        bottom: bottomVal,
    }, 500);
}
$(function() {
    var isEnglish = window.location.href.split("/")[3] === "en";
    if (isEnglish) {
        UserVoice = window.UserVoice || [];
        (function() {
            var uv = document.createElement("script");
            uv.type = "text/javascript";
            uv.async = true;
            uv.src = "//widget.uservoice.com/LrczQSXenENLOU5uXu98AA.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(uv, s);
        }
        )();
        UserVoice.push(["set", {
            locale: 'en',
            accent_color: "#448dd6",
            trigger_color: "white",
            trigger_background_color: "#FFA13A",
        }, ]);
    }
});
var lang = window.location.href.split("/")[3];
$(function() {
    if (lang !== "en") {
        checkLiveButtonStatus();
        setInterval(function() {
            checkLiveButtonStatus();
        }, 1000 * 60 * 3);
    }
});
function checkLiveButtonStatus() {
    $.ajax({
        url: "/tools/livebuttonstatus/",
        cache: false,
        success: function(response) {
            if (response) {
                var data = JSON.parse(response);
                var isAfterStart = new Date() > new Date(data.start);
                var isBeforeEnd = new Date() < new Date(data.end);
                if (data.status === "on" && isAfterStart && isBeforeEnd && data.lang === lang) {
                    $(".topnav-sls-container, #page-top").addClass("button-live");
                    $(".livebutt").attr("href", data.url);
                } else {
                    $(".topnav-sls-container, #page-top").removeClass("button-live");
                }
            }
        },
        error: function(err) {
            console.log(err);
            $(".topnav-sls-container").removeClass("button-live");
        },
    });
}
var scrollObj = {
    y: 0,
    mobilePos: 0,
    width: $(window).width(),
    height: $(window).height(),
    hasScrolled: false,
    active: false,
    disabled: true,
    scrollTimeout: null,
    scrollInterval: null,
    disabledTimeout: null,
    scrollFunctions: function() {
        scrollObj.y = $(window).scrollTop();
        if (!this.disabled) {
            toggleMobileHeader();
        } else {}
    },
};
$(window).scroll(function() {
    if (scrollObj.active) {
        clearTimeout(scrollObj.scrollTimeout);
    } else {
        if (scrollObj.hasScrolled) {
            scrollObj.active = true;
            scrollObj.scrollFunctions();
            scrollObj.scrollInterval = setInterval(function() {
                scrollObj.scrollFunctions();
            }, 100);
        } else {
            scrollObj.hasScrolled = true;
            setTimeout(function() {
                scrollObj.y = $(window).scrollTop();
                scrollObj.mobilePos = $(window).scrollTop();
                $(".search-container").addClass("search-container-transition");
                scrollObj.disabled = false;
            }, 400);
        }
    }
    scrollObj.scrollTimeout = setTimeout(function() {
        scrollObj.active = false;
        clearInterval(scrollObj.scrollInterval);
    }, 100);
});
$(window).resize(function() {
    if ($(window).width() !== scrollObj.width) {
        if (scrollObj.disabled) {
            clearTimeout(scrollObj.disabledTimeout);
        } else {
            scrollObj.disabled = true;
        }
        scrollObj.disabledTimeout = setTimeout(function() {
            scrollObj.disabled = false;
        }, 500);
    }
});
var searchOpen = true;
function handleHeaderOption(option) {
    collapseUnselectedOptions(option);
    setTimeout(()=>{
        toggleSearchCollapse(option === "search" ? true : false);
        toggleAccountNavCollapse(option === "account" ? true : false);
        toggleNavCollapse(option === "nav" ? true : false);
    }
    , 251);
}
function collapseUnselectedOptions(currentOption) {
    const isVisibleNav = $("#navcollapse").is(":visible");
    const isVisibleSearch = $(".searchcontainer").is(":visible");
    const isVisibleAccount = $("#accountNavcollapse").is(":visible");
    switch (currentOption) {
    case "search":
        if (isVisibleNav) {
            $("#navcollapse").slideToggle(250);
        }
        if (isVisibleAccount) {
            $("#accountNavcollapse").slideToggle(250);
        }
        break;
    case "account":
        if (isVisibleNav) {
            $("#navcollapse").slideToggle(250);
        }
        if (isVisibleSearch) {
            $(".searchcontainer").slideToggle(250);
        }
        break;
    case "nav":
        if (isVisibleAccount) {
            $("#accountNavcollapse").slideToggle(250);
        }
        if (isVisibleSearch) {
            $(".searchcontainer").slideToggle(250);
        }
        break;
    }
}
function toggleNavCollapse(iSelected) {
    if (iSelected) {
        $("#navcollapse").slideToggle(250);
    }
}
function toggleSearchCollapse(iSelected) {
    if (iSelected) {
        $(".searchcontainer").slideToggle(250);
        $(".search-container").toggleClass("search-container-collapsed");
        searchOpen = !searchOpen;
    }
}
var mobileScrolls = 0;
$(window).scroll(function() {
    mobileScrolls++;
    var pos = $(window).scrollTop();
    if (pos != undefined && pos >= 0) {
        if (mobileScrolls >= 5 && searchOpen) {
            $(".searchcontainer").stop();
            $(".searchcontainer").slideUp(250);
            searchOpen = false;
        }
        if (pos === 0 && mobileScrolls >= 5 && !searchOpen) {
            $(".searchcontainer").stop();
            $(".searchcontainer").slideDown(250);
            searchOpen = true;
        }
    }
});
function toggleMobileHeader() {
    var threshold = 20;
    var delta = scrollObj.y - scrollObj.mobilePos;
    if (Math.abs(delta) > threshold) {
        if (delta > 0 && scrollObj.y > 40) {
            $(".search-container").addClass("search-container-collapsed");
        } else {
            $(".search-container").removeClass("search-container-collapsed");
        }
        scrollObj.mobilePos = scrollObj.y;
    }
}
function getLanguage() {
    return window.location.href.includes("/es") ? "es" : window.location.href.includes("/pt") ? "pt" : "en";
}
var lessonTools = (function() {
    $(function() {
        checkVideoContainers();
        document.addEventListener("token_set", (e)=>{
            saveTutorialProgress($("#playlist-id").text(), $("#lesson-id").text());
        }
        );
    });
    var checkVideoContainers = function() {
        var iframes = document.getElementsByTagName("iframe");
        for (var f = 0; f < iframes.length; f++) {
            var iframe = iframes[f];
            if (iframe.src.indexOf("youtube.com/embed/") > -1) {
                if (!$(iframe.parentElement).hasClass("video-embed")) {
                    iframe.parentElement.classList.add("video-embed");
                }
            }
        }
    };
    var saveTutorialProgress = function(tutorialId, lessonId) {
        const userToken = localStorage.getItem("userAccessToken");
        if (userToken) {
            $.ajax({
                url: `https://account.gcfglobal.org/api/user-history/${tutorialId}/${lessonId}`,
                cache: false,
                type: "POST",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
                data: JSON.stringify({
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }),
                success: function(data) {
                    console.log("tutorial progess call finished");
                },
                error: function(err) {
                    console.log(err);
                },
            });
        }
    };
    return {
        checkVideoContainers: checkVideoContainers,
        saveTutorialProgress: saveTutorialProgress,
    };
}
)();
$(function() {
    $("#infopages #contactUsQuestion").html("");
    var lastScrollTop = 0;
    var headerExpanded = true;
    var scrolls = 0;
    $(window).scroll(function() {
        scrolls++;
        var newScrollTop = $(window).scrollTop();
        var scrolledEnough = Math.abs(newScrollTop - lastScrollTop) > 10;
        if (newScrollTop > lastScrollTop && headerExpanded && scrolls > 5 && scrolledEnough) {
            $(".primary-header").addClass("primary-header-collapsed");
            headerExpanded = false;
        } else if (newScrollTop < lastScrollTop && !headerExpanded && scrolls > 5 && scrolledEnough) {
            $(".primary-header").removeClass("primary-header-collapsed");
            headerExpanded = true;
        }
        lastScrollTop = newScrollTop;
    });
});
var infiniteScroll = (function() {
    var SPINNER_DELAY = 1000;
    var nextUrl, bottomThreshold, prevUrl, topThreshold, currentLesson, prevLoadDelay, language, lastScrollTop;
    var calledTriggers = [];
    var lessons = [];
    var spinnerCount = 0;
    var firstPrevLoadCalled = false;
    $(function() {
        if (window.location.href.indexOf("/print/") === -1) {
            hideManualNav();
            initScrollingLesson();
            iframeResize();
            $(".infinite-nav").show();
            $(window).scroll(function() {
                var scrollTop = $(window).scrollTop();
                var pos = $(window).height() + scrollTop;
                lastScrollTop = $(window).scrollTop();
                setUrl(scrollTop + $(window).height() / 2);
            });
        }
    });
    function initScrollingLesson() {
        rebuildLessonList();
        prepareNextLesson();
        preparePrevLesson();
        setUrl($(window).scrollTop() + $(window).height() / 2);
        removeLongdesc();
    }
    function iframeResize() {
        if (typeof iFrameResize !== "undefined") {
            iFrameResize({}, "iframe.inline-iframe");
        } else {
            console.log("iFrameResize not found!");
        }
    }
    function hideManualNav() {
        $(".fullpage-nav").hide();
    }
    function handleHeaderAnimation() {
        resizeHeaderAnimation(1250, 1000, "161px");
        setTimeout(function() {
            if (bottomThreshold) {
                bottomThreshold -= 289;
            }
        }, 2250);
    }
    function prepareNextLesson() {
        setTimeout(function() {
            var bottomTrigger = $(".scroll-trigger").last();
            if (bottomTrigger.length > 0) {
                nextUrl = bottomTrigger.text();
                bottomThreshold = bottomTrigger.offset().top;
            }
        }, 1500);
    }
    function preparePrevLesson() {
        var topTrigger = $(".scroll-trigger-top").first();
        if (topTrigger.length > 0) {
            prevUrl = topTrigger.text();
            topThreshold = topTrigger.offset().top;
        }
    }
    function rebuildLessonList() {
        lessons = [];
        $(".lesson-block").each(function() {
            lessons.push({
                url: $(this).attr("id"),
                title: $(this).data("title"),
                topPosition: $(this).offset().top,
            });
        });
    }
    function setUrl(pos) {
        var page = lessons[0];
        for (var i = 0; i < lessons.length; i++) {
            if (pos > lessons[i].topPosition) {
                page = lessons[i];
            }
        }
        if (page.url !== currentLesson) {
            var urlParts = page.url.split("/");
            var queryString = "";
            if (!currentLesson)
                queryString = window.location.search;
            window.history.replaceState("Object", page.title, page.url + queryString);
            if ($(".current-tutorial-title").length == 1) {
                window.document.title = $(".current-tutorial-title").html() + ": " + page.title;
            }
            $("#current-lesson-title").text(page.title);
            setCurrentLessonInDropdown(page.title);
            language = urlParts[1];
            if (currentLesson !== undefined) {
                gcfGA.recordGA();
            }
            currentLesson = page.url;
        }
    }
    function setCurrentLessonInDropdown(title) {
        $(".tutorialMenuOption a").each(function() {
            if ($(this).text() === title) {
                $(this).addClass("current-lesson-nav");
            } else {
                $(this).removeClass("current-lesson-nav");
            }
        });
    }
    function saveLocalHistory(tutorial, lesson) {
        if (localStorage) {
            var loaded = localStorage.getItem(tutorial);
            if (loaded) {
                var savedLessons = JSON.parse(loaded);
                if (savedLessons.indexOf(lesson) === -1) {
                    savedLessons.push(lesson);
                    localStorage.setItem(tutorial, JSON.stringify(savedLessons));
                }
            } else {
                localStorage.setItem(tutorial, JSON.stringify([lesson]));
            }
        }
    }
    function getSpinnerSpecs() {
        return {
            src: "/images/transparent-loading-spinner.gif",
            class: "loading-spinner",
            id: "spinner-" + spinnerCount,
        };
    }
    function handleFirstPrevLoad() {
        firstPrevLoadCalled = true;
        $("#first-divider").show();
    }
    function keyNextLesson(event, playlistId, lessonId) {
        var keyDown = event.key !== undefined ? event.key : event.keyCode;
        if (keyDown === "Enter" || keyDown === 13 || ["Spacebar", " "].indexOf(keyDown) >= 0 || keyDown === 32) {
            event.preventDefault();
            getNextLesson(playlistId, lessonId);
        }
    }
    function getNextLesson(playlistId, lessonId) {
        $(".infinite-nav").last().fadeOut(100);
        var lessonEnd = $(".lesson-block").last();
        lessonEnd.after($("<img>", getSpinnerSpecs()));
        $.ajax({
            url: nextUrl,
            cache: false,
            success: function(data) {
                lessonTools.saveTutorialProgress(playlistId, lessonId);
                setTimeout(function() {
                    var lessonData = JSON.parse(data);
                    $("#spinner-" + spinnerCount).remove();
                    lessonEnd.after(lessonData.html);
                    rebuildLessonList();
                    $(".lesson-block").last().find(".divider-box .infinite-scroll-divider").next().focus();
                    initIndividualLessonLG($(".lesson-block").last());
                    setTimeout(function() {
                        slides.initSlideshows();
                        initMobileLG();
                        initLGKeyboardNav();
                    }, 100);
                    iframeResize();
                    lessonTools.checkVideoContainers();
                    removeLongdesc();
                    activities.initializeActivities();
                    prepareNextLesson();
                    if (lessonData.isLast) {
                        $("footer, .push").show();
                    }
                }, SPINNER_DELAY);
            },
            error: function() {
                $("#spinner-" + spinnerCount).remove();
                $(".nextLoadMore").last().css("display", "block");
            },
        });
    }
    function getPrevLesson() {
        var topLesson = $(".lesson-block").first();
        topLesson.before($("<img>", getSpinnerSpecs()));
        $.ajax({
            url: prevUrl,
            cache: false,
            success: function(data) {
                setTimeout(function() {
                    var lessonData = JSON.parse(data);
                    $("#spinner-" + spinnerCount).remove();
                    $(".nextLoadMore").first().hide();
                    topLesson.before(lessonData.html);
                    window.scrollTo(0, topLesson.offset().top);
                    var oldUrl = prevUrl;
                    rebuildLessonList();
                    initIndividualLessonLG($(".lesson-block").first());
                    setTimeout(function() {
                        slides.initSlideshows();
                        initMobileLG();
                        initLGKeyboardNav();
                    }, 100);
                    iframeResize();
                    lessonTools.checkVideoContainers();
                    preparePrevLesson();
                    if (firstPrevLoadCalled === false) {
                        handleFirstPrevLoad();
                    }
                }, SPINNER_DELAY);
            },
            error: function() {
                $("#spinner-" + spinnerCount).remove();
                $(".prevLoadMore").first().css("display", "block");
            },
        });
    }
    function removeLongdesc() {
        $("img[longdesc]").each(function() {
            if ($(this).attr("longdesc").length === 0) {
                $(this).removeAttr("longdesc");
            }
        });
    }
    return {
        getNextLesson: getNextLesson,
        getPrevLesson: getPrevLesson,
        keyNextLesson: keyNextLesson,
    };
}
)();
var labels = {};
var activities;
var language = window.location.pathname.split('/');
if (language.length > 2 && ['es', 'pt', 'en'].includes(language[1])) {
    language = language[1];
} else {
    language = 'en';
}
$.ajax({
    url: '/' + language + '/api/activities-labels',
    success: function(response) {
        labels = response;
        activities = (function() {
            var homeDomain = 'edu.gcfglobal.org';
            var domain = '/' + language;
            var isApi = false;
            var parameters = '';
            if (window.location.hostname !== homeDomain && window.location.hostname !== 'localhost' && window.location.hostname !== 'gcfglobal-dev.azurewebsites.net' && window.location.hostname !== 'gcfglobal-site-nodejs-staging.azurewebsites.net') {
                isApi = true;
                domain = 'https://edu.gcfglobal.org/en/api';
                parameters = '?id=genericquiz&key=ebpne09a1f6251x4qsua5r75jhagvb';
            }
            var activeActivities = [];
            $(function() {
                initializeActivities();
            });
            function initializeActivities() {
                $('.activity').each(function(index) {
                    if (!$(this).attr('id')) {
                        var id = 'a' + Date.now() + index;
                        $(this).attr('id', id);
                        loadActivity(id, $(this).attr('data-source'), $(this).attr('data-type'));
                    }
                });
            }
            function loadActivity(id, source, type) {
                $.ajax({
                    url: domain + '/activities/' + source + '/' + type + '/' + parameters,
                    cache: false,
                    success: function(html) {
                        $('#' + id).append(html);
                        activeActivities.push(new Activity(id,type));
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
            function selectCategory(select) {
                var activityId = $(select).closest('.activity').attr('id');
                var activity = getActivity(activityId);
                var type = $(select).attr('data-type');
                var sqlId = $(select).val();
                activity.categoryIsLoading = true;
                $.ajax({
                    url: domain + '/activities/sql/' + type + '/' + sqlId + '/data/',
                    success: function(data) {
                        var activity = getActivity(activityId);
                        activity.data = data.words;
                        activity.distractorData = data.distractors;
                        activity.paragraphs = data.paragraphs;
                        activity.dataIndex = 0;
                        activity.progress = 0;
                        activity.next();
                        $('#' + activityId + ' .initial-box').hide();
                        $('#' + activityId + ' .reading select').val(sqlId);
                        $('#' + activityId + ' .reading').css('opacity', 1);
                        activity.categoryIsLoading = false;
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
            function getActivity(id) {
                for (var i = 0; i < activeActivities.length; i++) {
                    if (activeActivities[i].id.toString() === id.toString()) {
                        return activeActivities[i];
                    }
                }
            }
            function Activity(id, type) {
                this.id = id;
                this.type = type;
                this.progress = 0;
                this.initialize();
            }
            Activity.prototype.initialize = function() {
                var id = '#' + this.id + ' ';
                switch (this.type) {
                case 'letter-explorer':
                    initializeLetterExplorer(this, id);
                    break;
                case 'css-input':
                    initializeCSSInput(this, id);
                    break;
                case 'quiz':
                    initializeQuiz(this, id);
                    break;
                case 'word-videos':
                    initializeWordVideos(this, id);
                    break;
                }
            }
            ;
            Activity.prototype.next = function() {
                var id = '#' + this.id + ' ';
                switch (this.type) {
                case 'word-fill':
                    nextWordFill(this, id);
                    break;
                case 'sound-match':
                    nextSoundMatch(this, id);
                    break;
                case 'word-sound':
                    nextWordSound(this, id);
                    break;
                case 'word-explorer':
                    nextWordExplorer(this, id);
                    break;
                case 'letter-explorer':
                    nextLetterExplorer(this, id);
                    break;
                case 'text-explorer':
                    nextTextExplorer(this, id);
                    break;
                }
            }
            ;
            function stopAllAudio(activity) {
                activity.audio1.pause();
                activity.audio2.pause();
                activity.audio3.pause();
                activity.audio1.currentTime = 0;
                activity.audio2.currentTime = 0;
                activity.audio3.currentTime = 0;
            }
            function selectAnswer(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                var delay = 1500;
                switch (activity.type) {
                case 'word-fill':
                    button = activity.selectedAnswer;
                    if ($(id + button).text() === activity.wordFillChoice) {
                        toggleWordFillSuccess(activity);
                        setTimeout(function() {
                            confirmWordFill(button);
                        }, delay);
                    } else {
                        toggleWordFillFailure(activity);
                        setTimeout(function() {
                            resetWordFill(button);
                        }, delay);
                    }
                    break;
                case 'sound-match':
                    button = activity.selectedAnswer;
                    if ($(id + button).attr('data-value') === activity.data[activity.dataIndex].Text) {
                        toggleSoundMatchSuccess(activity);
                    } else {
                        toggleSoundMatchFailure(activity);
                    }
                    break;
                case 'word-sound':
                    button = activity.selectedAnswer;
                    if ($(id + button).text() === activity.data[activity.dataIndex].Text) {
                        toggleWordSoundSuccess(activity);
                    } else {
                        toggleWordSoundFailure(activity);
                    }
                    break;
                }
            }
            function toggleAudio(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                activity.audio.play();
            }
            function nextSoundMatch(activity, id) {
                resetSoundMatch();
                var wordChoice = activity.data[activity.dataIndex];
                var words = [wordChoice];
                var distractor1 = getSimilarWord(activity, wordChoice.Text, null);
                words.push(distractor1);
                var distractor2 = getSimilarWord(activity, wordChoice.Text, distractor1.Text);
                words.push(distractor2);
                $(id + '.word').text(wordChoice.Text);
                shuffleArray(words);
                $(id + '.btn1').attr('data-value', words[0].Text);
                $(id + '.btn2').attr('data-value', words[1].Text);
                $(id + '.btn3').attr('data-value', words[2].Text);
                activity.audio1 = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + words[0].ID + '.mp3');
                activity.audio2 = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + words[1].ID + '.mp3');
                activity.audio3 = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + words[2].ID + '.mp3');
                assignCharacter(id, '.btn1');
                assignCharacter(id, '.btn2');
                assignCharacter(id, '.btn3');
            }
            function assignCharacter(id, btnClass) {
                var character = getRandomFromArray(characters);
                $(id + 'img.charimg' + btnClass).attr('data-character', character);
                $(id + 'img.charimg' + btnClass).attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_default.svg');
            }
            function playSoundMatchAudio(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                stopAllAudio(activity);
                if ($(button).hasClass('btn1')) {
                    activity.audio1.play();
                    toggleCharacter(activity, '.btn1');
                } else if ($(button).hasClass('btn2')) {
                    activity.audio2.play();
                    toggleCharacter(activity, '.btn2');
                } else {
                    activity.audio3.play();
                    toggleCharacter(activity, '.btn3');
                }
            }
            var characters = ['alien', 'braces', 'braidy', 'bunny', 'chimpie', 'fishstick', 'hunka', 'jazzercise', 'memaw', 'meowsers', 'robo', 'shades', 'teenwolf', 'turtleneck', 'willie'];
            function toggleCharacter(activity, btnClass) {
                resetSoundMatch();
                var id = '#' + activity.id + ' ';
                $(id + '.character').hide();
                $(id + '.tryagain').hide();
                $(id + '.box button').show();
                $(id + '.box').removeClass('active');
                $(id + 'button' + btnClass).hide();
                $(id + 'button' + btnClass).parent().addClass('active');
                $(id + '.submitbtn').show();
                activity.selectedAnswer = btnClass;
                $(id + '.character' + btnClass).show();
                var character = $('img.charimg' + btnClass).attr('data-character');
                $(id + 'img.charimg' + btnClass).attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_default.svg');
            }
            function toggleSoundMatchFailure(activity) {
                var btnClass = activity.selectedAnswer;
                var character = $('img.charimg' + btnClass).attr('data-character');
                $('img.charimg' + btnClass).attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_incorrect.svg');
                $('.submitbtn').hide();
                $('.tryagain').show();
            }
            function toggleSoundMatchSuccess(activity) {
                var btnClass = activity.selectedAnswer;
                var character = $('img.charimg' + btnClass).attr('data-character');
                $('img.charimg' + btnClass).attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_correct.svg');
                $('.submitbtn').hide();
                $('.success').show();
            }
            function confirmSoundMatch(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                incrementIndex(activity);
                activity.next();
            }
            function resetSoundMatch() {
                $('.box').removeClass('active');
                $('.submitbtn').hide();
                $('.tryagain').hide();
                $('.success').hide();
                $('.character').hide();
                $('.box button').show();
            }
            function skipSoundMatch(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                incrementIndex(activity);
                nextSoundMatch(activity, '#' + activity.id + ' ');
            }
            function nextWordSound(activity, id) {
                resetWordSound(null, id);
                var wordChoice = activity.data[activity.dataIndex];
                var words = [wordChoice];
                var distractor1 = getSimilarWord(activity, wordChoice.Text, null);
                words.push(distractor1);
                var distractor2 = getSimilarWord(activity, wordChoice.Text, distractor1.Text);
                words.push(distractor2);
                shuffleArray(words);
                $(id + '.btn1').text(words[0].Text);
                $(id + '.btn2').text(words[1].Text);
                $(id + '.btn3').text(words[2].Text);
                var character = getRandomFromArray(characters);
                $(id + 'img.charimg').attr('data-character', character);
                $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_default.svg');
                activity.audio = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + wordChoice.ID + '.mp3');
                activity.audio.play();
            }
            function selectWordSound(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                if ($(button).hasClass('btn1')) {
                    activity.selectedAnswer = '.btn1';
                } else if ($(button).hasClass('btn2')) {
                    activity.selectedAnswer = '.btn2';
                } else {
                    activity.selectedAnswer = '.btn3';
                }
                $('.voice-arrow').hide();
                $('.box').removeClass('selected');
                $(activity.selectedAnswer).closest('.box').addClass('selected');
                $(activity.selectedAnswer).siblings('.voice-arrow').show();
                $('.submitbtn').show();
            }
            function confirmWordSound(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                incrementIndex(activity);
                activity.next();
            }
            function resetWordSound(button, id) {
                if (button) {
                    var activity = getActivity($(button).closest('.activity').attr('id'));
                    id = '#' + activity.id + ' ';
                }
                $('.voice-arrow').hide();
                $('.submitbtn').hide();
                $('.tryagain').hide();
                $('.success').hide();
                $('.box').removeClass('selected');
                var character = $(id + 'img.charimg').attr('data-character');
                $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_default.svg');
            }
            function toggleWordSoundFailure(activity) {
                var id = '#' + activity.id + ' ';
                var btnClass = activity.selectedAnswer;
                var character = $(id + 'img.charimg').attr('data-character');
                $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_incorrect.svg');
                $('.submitbtn').hide();
                $('.tryagain').show();
            }
            function toggleWordSoundSuccess(activity) {
                var id = '#' + activity.id + ' ';
                var btnClass = activity.selectedAnswer;
                var character = $(id + 'img.charimg').attr('data-character');
                $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_correct.svg');
                $('.submitbtn').hide();
                $('.success').show();
            }
            function skipWordSound(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                incrementIndex(activity);
                nextWordSound(activity, '#' + activity.id + ' ');
            }
            function nextWordFill(activity, id) {
                var sentenceNum = getRandomInt(1, 3);
                var sentenceChoice = 'Sentence_' + sentenceNum;
                var wordChoice = activity.data[activity.dataIndex];
                if (!wordChoice[sentenceChoice]) {
                    incrementIndex(activity);
                    activity.next();
                } else {
                    activity.audio = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + wordChoice.ID + '_s' + sentenceNum + '.mp3');
                    activity.audio.play();
                    activity.audio.addEventListener('error', function() {
                        incrementIndex(activity);
                        activity.next();
                    });
                    activity.audio.addEventListener('canplay', function() {
                        resetWordFill(null, id);
                        $(id + '.sentence').html(wordChoice[sentenceChoice].replace(new RegExp(wordChoice.Text,'ig'), '<span class="word-choice">...........</span>'));
                        activity.wordFillChoice = wordChoice.Text;
                        var character = getRandomFromArray(characters);
                        $(id + 'img.charimg').attr('data-character', character);
                        $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_default.svg');
                        var words = [wordChoice];
                        var distractor1 = getSimilarWord(activity, wordChoice.Text, null);
                        words.push(distractor1);
                        words.push(getSimilarWord(activity, wordChoice.Text, distractor1.Text));
                        shuffleArray(words);
                        $(id + '.btn1').text(words[0].Text);
                        $(id + '.btn2').text(words[1].Text);
                        $(id + '.btn3').text(words[2].Text);
                    });
                }
            }
            function selectWordFill(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                if ($(button).hasClass('btn1')) {
                    activity.selectedAnswer = '.btn1';
                } else if ($(button).hasClass('btn2')) {
                    activity.selectedAnswer = '.btn2';
                } else {
                    activity.selectedAnswer = '.btn3';
                }
                $('.voice-arrow').hide();
                $('.box').removeClass('selected');
                $(activity.selectedAnswer).closest('.box').addClass('selected');
                $(activity.selectedAnswer).siblings('.voice-arrow').show();
                $('.submitbtn').show();
            }
            function confirmWordFill(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                incrementIndex(activity);
                activity.next();
            }
            function resetWordFill(button, id) {
                if (button) {
                    var activity = getActivity($(button).closest('.activity').attr('id'));
                    id = '#' + activity.id + ' ';
                }
                $('.voice-arrow').hide();
                $('.submitbtn').hide();
                $('.tryagain').hide();
                $('.success').hide();
                $('.box').removeClass('selected');
                var character = $(id + 'img.charimg').attr('data-character');
                $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_default.svg');
            }
            function toggleWordFillFailure(activity) {
                var id = '#' + activity.id + ' ';
                var btnClass = activity.selectedAnswer;
                var character = $(id + 'img.charimg').attr('data-character');
                $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_incorrect.svg');
                $('.submitbtn').hide();
                $('.tryagain').show();
            }
            function toggleWordFillSuccess(activity) {
                var id = '#' + activity.id + ' ';
                var btnClass = activity.selectedAnswer;
                var character = $(id + 'img.charimg').attr('data-character');
                $(id + 'img.charimg').attr('src', 'https://media.gcflearnfree.org/assets/interactives/reading/redesign2020/chars/' + character + '_correct.svg');
                $('.submitbtn').hide();
                $('.success').show();
            }
            function skipWordFill(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                incrementIndex(activity);
                nextWordFill(activity, '#' + activity.id + ' ');
            }
            function scrollReadingList(activity, list, index) {
                var id = '#' + activity.id + ' ';
                var height = $(id + '.reading-scroll').height();
                var itemHeight = 37;
                var offset = $(id + '.reading-scroll').data('offset') || -2;
                if (activity.scrollsInProgress > 0) {
                    activity.scrollsInProgress++;
                } else {
                    activity.scrollsInProgress = 1;
                }
                var scrollDest = ((height - itemHeight) / 2) - (index * itemHeight) + offset;
                $(list).animate({
                    scrollTop: scrollDest * -1
                }, 350 / activity.scrollsInProgress, function() {
                    activity.scrollsInProgress--;
                });
                if (index === 0) {
                    $(id + '.reading-scroll-arrow-top').addClass('reading-disabled');
                } else {
                    $(id + '.reading-scroll-arrow-top').removeClass('reading-disabled');
                }
                if (index === (list[0].children.length / 2) - 1) {
                    $(id + '.reading-scroll-arrow-bottom').addClass('reading-disabled');
                } else {
                    $(id + '.reading-scroll-arrow-bottom').removeClass('reading-disabled');
                }
            }
            function nextWordExplorer(activity, id) {
                $(id + '.reading-scroll').empty();
                $(id + '.reading-scroll-mobile-select').empty();
                activity.dataSorted = sortObject(activity.data, 'Text');
                var index = $(id + '.reading-scroll').data('index') || 0;
                for (var i = 0; i < activity.data.length; i++) {
                    var word = activity.dataSorted[i];
                    var buttonId = activity.id + '-' + word.ID;
                    $(id + '.reading-scroll').append('<input onclick="activities.selectRadioItem(this, ' + word.ID + ')" type="radio" class="radio-item" id="radio-item-' + buttonId + '" data-word-id=' + word.ID + ' data-sort-order=' + i + ' name="radio-item" value="' + word.Text + '"><label class="radio-item-label" for="radio-item-' + buttonId + '" id="radio-item-label-' + buttonId + '">' + word.Text + '</label>');
                    $(id + '.reading-scroll-mobile-select').append('<option value="' + word.ID + '" id="word-option-' + buttonId + '">' + word.Text + '</option>');
                }
                setTimeout(function() {
                    $(id + '.reading-scroll-mobile-select').val(activity.dataSorted[index].ID);
                }, 0);
                selectRadioItem(null, activity.dataSorted[index].ID, activity);
            }
            function selectRadioItem(button, sqlId, thisActivity) {
                var activity = thisActivity ? thisActivity : getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                var buttonId = activity.id + '-' + sqlId;
                $(id + '.radio-item').removeClass('radio-item-selected');
                $('#radio-item-' + buttonId).addClass('radio-item-selected');
                var index = $('#radio-item-' + buttonId).data('sort-order');
                scrollReadingList(activity, $(id + '.reading-scroll'), index);
                if (activity.type === 'word-explorer') {
                    toggleWordDetails(activity, sqlId);
                } else if (activity.type === 'letter-explorer') {
                    toggleLetterDetails(activity, sqlId);
                }
            }
            function selectDropdownItem(dropdown) {
                var activity = getActivity($(dropdown).closest('.activity').attr('id'));
                if (activity.type === 'word-explorer') {
                    toggleWordDetails(activity, parseInt(dropdown.value));
                } else if (activity.type === 'letter-explorer') {
                    toggleLetterDetails(activity, parseInt(dropdown.value));
                }
            }
            function incrementExplorerWord(button, incBy) {
                if (!incBy) {
                    incBy = 1;
                }
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                var currentIndex = parseInt($(id + '.radio-item-selected').data('sort-order'));
                var newIndex = currentIndex + incBy;
                if (newIndex > -1 && newIndex < activity.dataSorted.length) {
                    var nextId = activity.dataSorted[newIndex].ID;
                    selectRadioItem(null, nextId, activity);
                }
            }
            function toggleWordAudio(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                toggleWordTabs(activity, 'word');
                activity.audio1.play();
            }
            function toggleSentenceAudio(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                toggleWordTabs(activity, 'sentence');
                activity.audio2.play();
            }
            function toggleWordImage(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                toggleWordTabs(activity, 'picture');
            }
            function toggleWordVideo(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                toggleWordTabs(activity, 'video');
                var video = document.querySelector(id + '.word-explorer-video-player');
                if (activity.videoIsPlaying && !video.ended) {
                    video.pause();
                    activity.videoIsPlaying = false;
                    $(id + '.word-explorer-btn-video').attr('aria-pressed', 'false');
                    $(id + '.word-explorer').removeClass('reading-playing');
                } else {
                    video.play();
                    activity.videoIsPlaying = true;
                    $(id + '.word-explorer').addClass('reading-playing');
                    $(id + '.word-explorer-btn-video').attr('aria-pressed', 'true');
                }
            }
            function stopWordVideo(video) {
                var activity = getActivity($(video).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                activity.videoIsPlaying = false;
                $(id + '.word-explorer-btn-video').attr('aria-pressed', 'false');
                $(id + '.word-explorer').removeClass('reading-playing');
            }
            function toggleWordTabs(activity, selected) {
                var id = '#' + activity.id + ' ';
                if (selected !== 'word' && !isNaN(activity.audio1.duration)) {
                    activity.audio1.pause();
                    activity.audio1.currentTime = 0;
                }
                if (selected !== 'sentence' && !isNaN(activity.audio1.duration)) {
                    activity.audio2.pause();
                    activity.audio2.currentTime = 0;
                }
                if (selected !== 'video') {
                    var video = document.querySelector(id + '.word-explorer-video-player');
                    if (!isNaN(video.duration)) {
                        video.pause();
                        video.currentTime = 0;
                    }
                    activity.videoIsPlaying = false;
                    $(id + '.word-explorer-btn-video').attr('aria-pressed', 'false');
                    $(id + '.word-explorer').removeClass('reading-playing');
                }
                $(id + '.word-explorer-media').removeClass('word-explorer-media-selected');
                $(id + '.word-explorer-btn').removeClass('word-explorer-btn-selected');
                $(id + '.word-explorer-media-' + selected).addClass('word-explorer-media-selected');
                $(id + '.word-explorer-btn-' + selected).addClass('word-explorer-btn-selected');
            }
            function toggleWordDetails(activity, sqlId) {
                var id = '#' + activity.id + ' ';
                var word = getWord(activity, sqlId);
                activity.videoIsPlaying = false;
                var sentenceRegex = new RegExp('\\b' + word.Text + '\\b','i');
                var formattedSentence = word.Sentence_1.replace(sentenceRegex, '<strong>$&</strong>');
                $(id + '.word-explorer-media-picture').html('<img class="word-explorer-media-picture-img" src="https://media.gcflearnfree.org/assets/activities/images/' + word.ID + '.png">');
                $(id + '.word-explorer-media-video-inner').html('<video onended="activities.stopWordVideo(this)" class="word-explorer-video-player"><source src="https://media.gcflearnfree.org/assets/activities/videos/' + word.ID + '.m4v">Your browser is unable to play this video.</video>');
                activity.selectedWord = word;
                activity.audio1 = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + word.ID + '.mp3');
                activity.audio2 = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + word.ID + '_s1.mp3');
                $(id + '.word-options').show();
                $(id + '.word-explorer-media-word').html('<div>' + word.Text + '</div>');
                $(id + '.word-explorer-media-sentence').html('<div>' + formattedSentence + '</div>');
                toggleWordTabs(activity, 'word');
            }
            function initializeLetterExplorer(activity, id) {
                var select = $(id + '.initial-box select');
                select.val(20);
                setTimeout(function() {
                    selectCategory(select);
                }, 0);
            }
            function nextLetterExplorer(activity, id) {
                var alphabet = 'abcdefghijklmnopqrstuvwxyz';
                for (var i = 0; i < 26; i++) {
                    var letter = alphabet[i].toUpperCase();
                    var buttonId = activity.id + '-' + i;
                    $(id + '.reading-scroll').append('<input onclick="activities.selectRadioItem(this, ' + i + ')" type="radio" class="radio-item" id="radio-item-' + buttonId + '" data-word-id=' + i + ' data-sort-order=' + i + ' name="radio-item" value="' + letter + '"><label class="radio-item-label" for="radio-item-' + buttonId + '" id="radio-item-label-' + buttonId + '">' + letter + '</label>');
                    $(id + '.reading-scroll-mobile-select').append('<option value="' + i + '" id="word-option-' + buttonId + '">' + letter + '</option>');
                }
                var rareWords = [{
                    Text: "job",
                    ID: 436
                }, {
                    Text: "join",
                    ID: 438
                }, {
                    Text: "jumped",
                    ID: 439
                }, {
                    Text: "just",
                    ID: 440
                }, {
                    Text: "object",
                    ID: 568
                }, {
                    Text: "subject",
                    ID: 804
                }, {
                    Text: "equal",
                    ID: 269
                }, {
                    Text: "equation",
                    ID: 270
                }, {
                    Text: "question",
                    ID: 525
                }, {
                    Text: "quickly",
                    ID: 650
                }, {
                    Text: "quiet",
                    ID: 651
                }, {
                    Text: "quite",
                    ID: 652
                }, {
                    Text: "square",
                    ID: 778
                }, {
                    Text: "size",
                    ID: 744
                }, {
                    Text: "air",
                    ID: 17
                }, {
                    Text: "pair",
                    ID: 592
                }, {
                    Text: "away",
                    ID: 52
                }, {
                    Text: "draw",
                    ID: 235
                }, {
                    Text: "breakfast",
                    ID: 100
                }, {
                    Text: "cry",
                    ID: 982
                }, {
                    Text: "fly",
                    ID: 323
                }, {
                    Text: "friend",
                    ID: 337
                }, {
                    Text: "glass",
                    ID: 352
                }, {
                    Text: "if",
                    ID: 416
                }, {
                    Text: "life",
                    ID: 474
                }, {
                    Text: "know",
                    ID: 448
                }, {
                    Text: "think",
                    ID: 845
                }, {
                    Text: "boy",
                    ID: 97
                }, {
                    Text: "phone",
                    ID: 612
                }, {
                    Text: "sky",
                    ID: 748
                }, {
                    Text: "slowly",
                    ID: 750
                }, {
                    Text: "smile",
                    ID: 752
                }, {
                    Text: "snow",
                    ID: 753
                }, {
                    Text: "spoon",
                    ID: 775
                }, {
                    Text: "two",
                    ID: 882
                }, {
                    Text: "write",
                    ID: 957
                }];
                var tempAllWords = activity.distractorData.concat(rareWords);
                activity.allWords = [];
                tempAllWords.forEach(function(word) {
                    if (!activity.allWords.map(function(wordObj) {
                        return wordObj.Text.toLowerCase();
                    }).includes(word.Text.toLowerCase())) {
                        activity.allWords.push(word);
                    }
                });
                activity.shuffledWords = activity.allWords.slice();
                shuffleArray(activity.shuffledWords);
                var index = $(id + '.reading-scroll').data('index') || 0;
                setTimeout(function() {
                    $(id + '.reading-scroll-mobile-select').val(index);
                }, 0);
                selectRadioItem(null, index, activity);
            }
            function toggleLetterDetails(activity, index) {
                var id = '#' + activity.id + ' ';
                var alphabet = 'abcdefghijklmnopqrstuvwxyz';
                var letterCombos = {
                    a: ['ai', 'air', 'al', 'ar', 'are', 'au', 'aw', 'ay'],
                    b: ['bl', 'br'],
                    c: ['ch', 'cl', 'cr'],
                    d: ['dr'],
                    e: ['ea', 'ear', 'ee', 'er'],
                    f: ['fl', 'fr'],
                    g: ['gl', 'gr'],
                    i: ['if', 'igh', 'ing', 'ir'],
                    k: ['kn'],
                    n: ['nk', 'nt'],
                    o: ['oa', 'oi', 'oo', 'or', 'ou', 'ough', 'ow', 'oy'],
                    p: ['ph', 'pl', 'pr'],
                    s: ['sc', 'sh', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'str'],
                    t: ['th', 'tr', 'tw'],
                    u: ['ur'],
                    w: ['wh', 'wr']
                };
                var audioPath = 'https://media.gcflearnfree.org/assets/interactives/reading/audio/letters/' + alphabet[index] + '.mp3';
                if (activity.audioLetter) {
                    activity.audioLetter.setAttribute('src', audioPath);
                } else {
                    activity.audioLetter = new Audio(audioPath);
                }
                activity.audioLetter.volume = 0.6;
                activity.audioLetter.play();
                var words = getWordsWithLetters(activity, alphabet[index]);
                $(id + '.letter-explorer-words').empty();
                words.forEach(function(word) {
                    $(id + '.letter-explorer-words').append('<button onclick="activities.playLetterExplorerWord(this)" class="letter-explorer-word" id=letter-explorer-word-' + word.ID + ' data-word-id=' + word.ID + '>' + word.Text + '</button>');
                });
                $(id + '.letter-explorer-combos').empty();
                if (letterCombos[alphabet[index]]) {
                    letterCombos[alphabet[index]].forEach(function(combo) {
                        $(id + '.letter-explorer-combos').append('<button onclick="activities.toggleCombo(this)" aria-pressed="false" class="letter-explorer-combo" data-letter-combo=' + combo + '>' + combo.toUpperCase() + '</button>');
                    });
                }
            }
            function getWordsWithLetters(activity, letters) {
                var words = [];
                if (letters.length === 1) {
                    words = activity.shuffledWords.filter(function(word) {
                        return word.Text[0].toLowerCase() === letters[0];
                    }).slice(0, 6);
                }
                words = words.concat(activity.shuffledWords.filter(function(word) {
                    return word.Text.toLowerCase().includes(letters) && !words.map(function(wordObj) {
                        return wordObj.Text.toLowerCase();
                    }).includes(word.Text.toLowerCase());
                }).slice(0, 10 - words.length));
                var characterCount = words.map(function(word) {
                    return word.Text;
                }).join('').length;
                if (characterCount > 60) {
                    words.splice(8, 2);
                } else if (characterCount > 55) {
                    words.splice(9, 1);
                }
                return words;
            }
            function playLetterExplorerWord(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                var wordId = $(button).data('word-id');
                $(id + '.letter-explorer-word').attr('data-is-playing', 'false');
                $(button).attr('data-is-playing', 'true');
                var audioPath = 'https://media.gcflearnfree.org/assets/activities/audio/' + wordId + '.mp3';
                if (activity.audioWord) {
                    activity.audioWord.setAttribute('src', audioPath);
                } else {
                    activity.audioWord = new Audio(audioPath);
                }
                activity.audioWord.play();
                activity.audioWord.onended = function() {
                    $(button).attr('data-is-playing', 'false');
                }
                ;
            }
            function toggleCombo(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                var combo = $(button).data('letter-combo');
                var words;
                if ($(button).attr('aria-pressed') === 'true') {
                    $(id + '.letter-explorer-combo').attr('aria-pressed', 'false');
                    words = getWordsWithLetters(activity, combo[0]);
                } else {
                    $(id + '.letter-explorer-combo').attr('aria-pressed', 'false');
                    $(button).attr('aria-pressed', 'true');
                    words = getWordsWithLetters(activity, combo);
                }
                $(id + '.letter-explorer-words').empty();
                words.forEach(function(word) {
                    $(id + '.letter-explorer-words').append('<button onclick="activities.playLetterExplorerWord(this)" class="letter-explorer-word" id=letter-explorer-word-' + word.ID + ' data-word-id=' + word.ID + '>' + word.Text + '</button>');
                });
            }
            function initializeWordVideos(activity, id) {
                $(id + '.reading').css('opacity', 1);
                var playlists = [{
                    name: 'Basic Conversation',
                    id: 'PL95AA6004EBBB8101'
                }, {
                    name: 'Technology',
                    id: 'PLlvQgkaPZ1ZERjTD-kuS3Lf3OlrNjJ3aR'
                }, {
                    name: 'Time',
                    id: 'PLlvQgkaPZ1ZHB0sUZskxCGPuxwqtAaZx-'
                }, {
                    name: 'Places',
                    id: 'PLlvQgkaPZ1ZEIp0wv-Ow2uoFIr6RLG8jK'
                }, {
                    name: 'Financial',
                    id: 'PL47441848E48D12A0'
                }, {
                    name: 'Danger',
                    id: 'PLDC4908B6882F1268'
                }, {
                    name: 'People',
                    id: 'PL94A1717A22E59333'
                }, {
                    name: 'Transportation',
                    id: 'PLD17736D50AACACC2'
                }, {
                    name: 'Sports',
                    id: 'PL2699B77C15A9EC46'
                }, {
                    name: 'Shapes and Colors',
                    id: 'PL25EC052A030E8313'
                }, {
                    name: 'Question Words',
                    id: 'PL298E7E3494BB8CDB'
                }, {
                    name: 'Plants and Animals',
                    id: 'PL7E64BD5D45BF961C'
                }, {
                    name: 'Numbers',
                    id: 'PLE78DA3F17AD4B8E0'
                }, {
                    name: 'Medical',
                    id: 'PLA4C12DCFA1D4CD46'
                }, {
                    name: 'Food and Beverage',
                    id: 'PL10B87C6E225DCA69'
                }, {
                    name: 'Direction',
                    id: 'PLDD791CB065645B9F'
                }, {
                    name: 'Buildings',
                    id: 'PL61D40D0EF23B63A7'
                }, {
                    name: 'Body',
                    id: 'PL64357AE54B4D40E3'
                }, {
                    name: 'Art',
                    id: 'PL4066FF06ABC1741A'
                }, {
                    name: 'Verbs',
                    id: 'PL769CABD5A2C2DE57'
                }];
                var select = $(id + '.word-videos-select');
                var videoWrapper = $(id + '.word-videos-wrapper');
                var options = playlists.map(function(playlist, index) {
                    return '<option value="' + playlist.id + '">' + playlist.name + '</option>';
                }).join('\n');
                select.append(options);
                videoWrapper.html(getEmbedCode(playlists[0].id));
                $(id + '.word-videos-iframe-wrapper:first-child').addClass('word-videos-selected');
            }
            function getEmbedCode(playlistId) {
                return '<div class="word-videos-iframe-wrapper iframe-wrapper-' + playlistId + '">' + '<iframe src="https://www.youtube.com/embed/videoseries?list=' + playlistId + '" allow="accelerometer; ' + 'autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0">' + '</iframe></div>';
            }
            function selectVideoPlaylist(option) {
                var activity = getActivity($(option).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                var videoWrapper = $(id + '.word-videos-wrapper');
                var playlistId = option.value;
                videoWrapper.append(getEmbedCode(playlistId));
                $(id + '.word-videos-iframe-wrapper').removeClass('word-videos-selected');
                $(id + '.iframe-wrapper-' + playlistId).addClass('word-videos-selected');
                $(id + '.word-videos-instructions').addClass('reading-hidden');
                videoWrapper.children().eq(0).remove();
            }
            function hideInstructions(overlay) {
                var activity = getActivity($(overlay).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                $(id + '.word-videos-instructions').addClass('reading-hidden');
                $(id + '.word-videos-click-overlay').addClass('reading-hidden');
            }
            function nextTextExplorer(activity, id) {
                $(id + '.text').empty();
                stopTextExplorerAudio(activity);
                var voice = activity.audioTrack ? activity.audioTrack : 'female';
                setTextExplorerVoice('.' + voice + '-btn', voice);
                checkForBrokenParagraphs(activity);
                var paragraph = activity.paragraphs[activity.dataIndex];
                var audioPath = 'https://media.gcflearnfree.org/assets/activities/paragraph-audio/' + paragraph.ID + '_' + (activity.audioTrack === 'male' ? 'm' : 'f') + '.mp3';
                if (activity.audio) {
                    activity.audio.setAttribute('src', audioPath);
                } else {
                    activity.audio = new Audio(audioPath);
                }
                activity.audio.removeEventListener('playing', function() {
                    $(id + '.audio-btn').removeClass('btn-loading');
                });
                activity.audio.addEventListener('playing', function() {
                    $(id + '.audio-btn').removeClass('btn-loading');
                });
                processText(activity, id);
            }
            function checkForBrokenParagraphs(activity) {
                var brokenParagraphs = [15, 86];
                for (var i = 0; i < activity.paragraphs.length; i++) {
                    for (var j = 0; j < brokenParagraphs.length; j++) {
                        if (activity.paragraphs[i].ID === brokenParagraphs[j]) {
                            activity.paragraphs.splice(i, 1);
                            if (activity.dataIndex >= i && activity.dataIndex > 0) {
                                activity.dataIndex--;
                            }
                        }
                    }
                }
            }
            function processText(activity, id) {
                var paragraph = activity.paragraphs[activity.dataIndex];
                var text = paragraph.Text;
                var words = text.split(' ');
                var numWords = 0;
                var justWord;
                var isHtml;
                var wordIndex = 0;
                var titleWords = [];
                if (paragraph.Title) {
                    titleWords = paragraph.Title.split(' ');
                }
                for (var i = 0; i < words.length; i++) {
                    isHtml = words[i].match(/^<[^ ]+?>$/);
                    if (words[i].length > 0 && !isHtml) {
                        numWords++;
                    }
                }
                var shouldIncludeTitle = paragraph.Female_Timing.split(',').length > numWords;
                if (shouldIncludeTitle) {
                    for (i = 0; i < titleWords.length; i++) {
                        titleWords[i] = '<span class="text-explorer-word word-' + wordIndex + '">' + titleWords[i] + '</span>';
                        wordIndex++;
                    }
                }
                for (i = 0; i < words.length; i++) {
                    wordBefore = words[i].match(/^<[^ ]+?>/) || '';
                    wordAfter = words[i].match(/<[^ ]+?>$/) || '';
                    justWord = words[i].replace(/<[^ ]+?>/, "").trim();
                    isHtml = words[i].match(/^<[^ ]+?>$/);
                    if (words[i].length > 0 && !isHtml) {
                        if (isExplorableWord(activity, justWord)) {
                            words[i] = wordBefore + '<span onclick="activities.playTextExplorerWord(this, \'' + justWord + '\');" class="explorable text-explorer text-explorer-keyword word-' + wordIndex + '">' + justWord + '</span>' + wordAfter;
                        } else {
                            words[i] = wordBefore + '<span class="text-explorer-word word-' + wordIndex + '">' + justWord + '</span>' + wordAfter;
                        }
                        wordIndex++;
                    }
                }
                activity.lastWordIndex = wordIndex;
                $(id + '.text-explorer-upper-half').css('min-height', '500px');
                text = '<span class="text-explorer-title">' + titleWords.join(' ') + '</span><br>' + words.join(' ');
                $(id + '.text').html(text);
            }
            function incrementParagraph(button, incBy) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                stopTextExplorerAudio(activity);
                if (!incBy) {
                    incBy = 1;
                }
                if (incBy > 0) {
                    activity.progress++;
                }
                activity.dataIndex += incBy;
                if (activity.dataIndex > activity.paragraphs.length - 1) {
                    activity.dataIndex = 0;
                } else if (activity.dataIndex < 0) {
                    activity.dataIndex = activity.paragraphs.length - 1;
                }
                nextTextExplorer(activity, id);
            }
            function isExplorableWord(activity, word) {
                for (var i = 0; i < activity.data.length; i++) {
                    var explorableWord = activity.data[i];
                    if (explorableWord.Text === word) {
                        return true;
                    }
                }
                return false;
            }
            function toggleTextExplorerAudio(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                if (activity.categoryIsLoading) {
                    return;
                }
                if (activity.playing) {
                    stopTextExplorerAudio(activity);
                } else {
                    $(id + '.text-explorer').addClass('text-explorer-playing');
                    $(id + '.audio-btn').addClass('btn-loading');
                    $(id + '.audio-btn').attr('aria-pressed', 'true');
                    activity.playing = true;
                    activity.audio.play();
                    var text = activity.paragraphs[activity.dataIndex];
                    var timing = (activity.audioTrack === 'male' ? text.Male_Timing : text.Female_Timing).split(',');
                    var wordsHighlighted = 0;
                    activity.textExplorerInterval = setInterval(function() {
                        if (parseFloat(timing[wordsHighlighted]) < activity.audio.currentTime) {
                            $(id + '.word-' + wordsHighlighted).addClass('text-explorer-read text-explorer-current');
                            $(id + '.word-' + (wordsHighlighted - 1)).removeClass('text-explorer-current');
                            wordsHighlighted++;
                            if (wordsHighlighted >= activity.lastWordIndex) {
                                activity.paragraphEndTimeout = setTimeout(function() {
                                    stopTextExplorerAudio(activity);
                                }, 1000);
                            }
                        }
                    }, 25);
                }
            }
            function setTextExplorerVoice(button, audioTrack) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                stopTextExplorerAudio(activity);
                activity.audioTrack = audioTrack;
                var paragraph = activity.paragraphs[activity.dataIndex];
                $('.text-explorer-voice-icon').removeClass('text-explorer-voice-icon-selected');
                $('.' + audioTrack + '-btn').addClass('text-explorer-voice-icon-selected');
                activity.audio = new Audio('https://media.gcflearnfree.org/assets/activities/paragraph-audio/' + paragraph.ID + '_' + (activity.audioTrack === 'male' ? 'm' : 'f') + '.mp3');
            }
            function stopTextExplorerAudio(activity) {
                var id = '#' + activity.id + ' ';
                activity.playing = false;
                clearInterval(activity.textExplorerInterval);
                clearTimeout(activity.paragraphEndTimeout);
                $(id + '.audio-btn').attr('aria-pressed', 'false');
                $(id + '.text-explorer').removeClass('text-explorer-playing');
                $(id + 'span.text-explorer-read').removeClass('text-explorer-read');
                $(id + 'span.text-explorer-current').removeClass('text-explorer-current');
                if (activity.audio) {
                    activity.audio.pause();
                    activity.audio.currentTime = 0;
                }
            }
            function playTextExplorerWord(textButton, wordText) {
                var activity = getActivity($(textButton).closest('.activity').attr('id'));
                if (!activity.playing) {
                    wordId = getWord(activity, null, wordText).ID;
                    activity.wordAudio = new Audio('https://media.gcflearnfree.org/assets/activities/audio/' + wordId + '.mp3');
                    activity.wordAudio.play();
                }
            }
            function addHtmlInput(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                $(id + '.htmldemo').empty();
                $(id + '.htmldemo').append($(id + 'textarea').val());
                $(id + '.htmldemo2').empty();
                $(id + '.htmldemo2').append($(id + 'textarea').val());
            }
            function toggleHTMLStyles(input) {
                var activity = getActivity($(input).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                $(id + '.htmldemo, ' + id + '.htmldemo2').toggle();
            }
            function runScriptInput(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                $(id + '.htmldemo').empty();
                $(id + '.htmldemo').removeClass('error');
                var code = $(id + 'textarea').val();
                code = code.replace(/console.log/g, '$("' + id + '.htmldemo").append');
                try {
                    eval(code);
                } catch (err) {
                    $(id + '.htmldemo').addClass('error');
                    $(id + '.htmldemo').append('<p class="scriptInputError">There is a problem with your code</p>');
                }
            }
            function initializeCSSInput(activity, id) {
                var selector = $(id).attr('data-selector');
                $(id + '.selector-type').text(selector);
                var sampleId = $(id).attr('data-id');
                $(id + '.samples').each(function(sample) {
                    if (!$(this).hasClass(sampleId)) {
                        $(this).remove();
                    }
                });
            }
            function runCSSInput(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                var styles = $(id + 'textarea').val().split(';');
                for (var i = 0; i < styles.length; i++) {
                    var style = styles[i].split(':');
                    if (style && style.length === 2) {
                        var s1 = style[0].replace(/"/g, "").replace(/\n/g, "").replace(/\r/g, "");
                        var s2 = style[1].replace(/"/g, "").replace(/\n/g, "").replace(/\r/g, "");
                        $(id + '.samples').css(s1, s2);
                    }
                }
            }
            function clearCSS(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                $(id + 'textarea').val("");
                $(id + '.samples').removeAttr("style");
            }
            function initializeQuiz(activity, id) {
                activity.quizId = $(id).attr('data-id');
                $(id + ' .answers').submit(function(event) {
                    event.preventDefault();
                    submitAnswer(activity);
                });
                $.ajax({
                    url: domain + '/quizdata/' + activity.quizId + '/' + parameters,
                    success: function(data) {
                        addQuizData(activity, data);
                        assembleQuestions(data, activity);
                        activity.quizType = data.quizType;
                        $(id + ' .quiz-header').attr('id', activity.quizId + '-header');
                        if (activity.quizType !== 'practice') {
                            $(id).addClass('final');
                            $(id + ' .quiz-header').text(labels.quiz.quiz || 'Quiz');
                        } else {
                            $(id).addClass('practice');
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
            function retryQuiz(button) {
                var activity = getActivity($(button).closest('.activity').attr('id'));
                var id = '#' + activity.id + ' ';
                addQuizData(activity, activity.originalData);
                $(id + '.choices').empty();
                assembleQuestions(activity.originalData, activity);
                $(id + ' .answer-submit').val(labels.quiz.submit || 'Submit');
                $(id + '.quiz').show();
                $(id + '.quiz-results').hide();
            }
            function addQuizData(activity, data) {
                activity.originalData = data;
                activity.questions = [];
                activity.currentQuestion = 0;
                activity.quizName = data.name;
                activity.passThreshold = data.passThreshold;
                activity.quizType = data.quizType;
                activity.correct = 0;
                activity.wrong = 0;
            }
            function Question(q, activity) {
                this.type = q.type;
                this.question = q.question;
                this.randomized = q.randomized;
                this.allAnswers = q.answers;
                this.image = q.image;
                this.answers = getRandomAnswers(q.answers, 4);
                this.activity = activity;
                this.activityId = '#' + activity.id + ' ';
                this.loadQuestion = function() {
                    $(this.activityId + '.counter').text((labels.quiz.question || 'Question') + ' ' + (this.activity.currentQuestion + 1) + ' ' + labels.quiz.questionOf + ' ' + this.activity.questions.length);
                    $(this.activityId + '.question').html('<div>' + this.question + '</div>');
                    if (this.image) {
                        $(this.activityId + '.question').append('<div><img src="' + this.image + '"></div>');
                        $(this.activityId + '.question').addClass('with-image');
                    } else {
                        $(this.activityId + '.question').removeClass('with-image');
                    }
                    switch (this.type) {
                    case 'multiple-choice':
                        addQuestionsToHTML(this.activityId, this.answers, 'multiple-choice', 'radio');
                        break;
                    case 'multiple-choice-img':
                        addQuestionsToHTML(this.activityId, this.answers, 'choice-img', 'radio');
                        break;
                    case 'select-all':
                        addQuestionsToHTML(this.activityId, this.answers, 'select-all', 'checkbox');
                        break;
                    case 'select-all-img':
                        addQuestionsToHTML(this.activityId, this.answers, 'choice-img', 'checkbox');
                        break;
                    }
                }
                ;
            }
            function submitAnswer(activity) {
                var id = '#' + activity.id;
                if (noInput(id)) {
                    return;
                }
                if (activity.reviewing) {
                    activity.reviewing = false;
                    $(id).removeClass('reviewing');
                    $(id + ' .feedback').hide();
                    if (activity.currentQuestion + 1 < activity.questions.length) {
                        $(id + ' .answer-submit').val(labels.quiz.submit || 'Submit');
                        $(id + ' .choices').empty();
                        activity.currentQuestion++;
                        activity.questions[activity.currentQuestion].loadQuestion();
                        if ($(window).width() < 960) {
                            $('html, body').animate({
                                scrollTop: $('#' + activity.quizId + '-header').offset().top - 65
                            }, 250, 'linear');
                        }
                    } else {
                        showResults(id, activity);
                    }
                } else {
                    if (validateAnswer(id)) {
                        activity.correct++;
                        $(id + ' .feedback-correct').show();
                    } else {
                        activity.wrong++;
                        $(id + ' .feedback-incorrect').show();
                    }
                    activity.reviewing = true;
                    $(id).addClass('reviewing');
                    $(id + ' .answer-submit').val(activity.currentQuestion + 1 === activity.questions.length ? (labels.quiz.seeResults || 'See results') : (labels.quiz.nextQuestion || 'Next question'));
                }
            }
            function showResults(id, activity) {
                $(id + ' .correct-answers').text(activity.correct);
                $(id + ' .total-questions').text(activity.questions.length);
                $(id + ' .quiz').hide();
                $(id + ' .quiz-results').show();
                var total = Math.round((activity.correct / activity.questions.length) * 100);
                var pass = total >= parseInt(activity.passThreshold);
                $(id + ' .final-score').text(total);
                if (activity.quizType === 'practice') {
                    $(id + ' .completion-message').text((labels.quiz.result || 'Result'));
                } else {
                    $(id + ' .completion-message').text(pass ? (labels.quiz.great || 'Great job!') : (labels.quiz.tryAgain || 'Try again!'));
                    var tutorialId = $('#playlist-id').text();
                    saveQuizResults(tutorialId, total, {
                        quizId: activity.quizId,
                        quizName: activity.quizName,
                        passThreshold: activity.passThreshold,
                    });
                }
                $('.circle-progress').circleProgress({
                    value: total / 100,
                    thickness: 40,
                    size: 200,
                    fill: pass ? '#38CFCA' : '#e15526'
                });
            }
            function saveQuizResults(id, total, quiz) {
                const userToken = localStorage.getItem('userAccessToken');
                if (userToken) {
                    $.ajax({
                        url: 'https://account.gcfglobal.org/api/user-history/quiz-result',
                        cache: false,
                        type: "POST",
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            playlistId: id,
                            score: total,
                            quiz,
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        }),
                        success: function(data) {
                            console.log('quiz results saved');
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                }
            }
            function validateAnswer(id) {
                var answers = $(id + ' .answers').serializeArray();
                var allCorrect = false;
                var correctNeeded = 0;
                var correctFound = 0;
                var wrongFound = false;
                $(id + ' .choices input').each(function(item) {
                    if ($(this).val() === 'true') {
                        correctNeeded++;
                        $(this).addClass('correct');
                    }
                    if ($(this).is(':checked')) {
                        if ($(this).val() === 'true') {
                            correctFound++;
                        } else {
                            wrongFound = true;
                        }
                    }
                });
                return !wrongFound && correctNeeded === correctFound;
            }
            function noInput(id) {
                var answers = $(id + ' .answers').serializeArray();
                return answers.length === 0;
            }
            function addQuestionsToHTML(id, answers, typeClass, type) {
                toggleTypeClass(id, typeClass);
                if (answers[0] && answers[0].content === 'False') {
                    var second = answers[0];
                    answers[0] = answers[1];
                    answers[1] = second;
                }
                for (var i = 0; i < answers.length; i++) {
                    var answer = answers[i];
                    if (answers[i]) {
                        $(id + '.choices').append('<input type="' + type + '" id="' + (id + i) + '" name="answers" value="' + answer.correct + '">');
                        if (typeClass === 'choice-img') {
                            $(id + '.choices').append('<label style="background-image:url(' + answer.content + ')" for="' + (id + i) + '"></label>');
                        } else {
                            $(id + '.choices').append('<label for="' + (id + i) + '"><div>' + answer.content + '</div></label>');
                        }
                    }
                }
            }
            function toggleTypeClass(id, type) {
                var choices = $(id + '.choices');
                choices.removeClass();
                choices.addClass('choices');
                choices.addClass(type);
            }
            function assembleQuestions(data, activity) {
                var qs = data.questions;
                for (var i = 0; i < qs.length; i++) {
                    var questionData = qs[i];
                    activity.questions.push(new Question(questionData,activity));
                }
                activity.questions[0].loadQuestion();
            }
            function getRandomAnswers(answers, numberOfChoices) {
                var array = [];
                var answersAdded = 0;
                var correctAnswers = answers.filter(function(answer) {
                    return answer.correct === true;
                });
                answersAdded += correctAnswers.length;
                for (var j = 0; j < correctAnswers.length; j++) {
                    array.push(correctAnswers[j]);
                }
                shuffleArray(answers);
                for (var i = 0; i < answers.length; i++) {
                    if (!answers[i].correct && answersAdded < answers.length) {
                        array.push(answers[i]);
                        answersAdded++;
                    }
                }
                shuffleArray(array);
                return array;
            }
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function getWord(activity, id, wordText) {
                for (var i = 0; i < activity.data.length; i++) {
                    var word = activity.data[i];
                    if (id ? (word.ID === id) : (word.Text === wordText)) {
                        return word;
                    }
                }
            }
            function shuffleArray(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
            function sortObject(object, sortBy) {
                return object.slice().sort(function(a, b) {
                    if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase())
                        return -1;
                    if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase())
                        return 1;
                    return 0;
                });
            }
            function getRandomFromArray(array) {
                return array[getRandomInt(0, array.length - 1)];
            }
            function incrementIndex(activity) {
                activity.progress++;
                if (activity.dataIndex < activity.data.length - 1) {
                    activity.dataIndex++;
                } else {
                    activity.dataIndex = 0;
                }
            }
            function getSimilarWord(activity, word, avoidWord) {
                var bestWords = [];
                var sameLengthWords = [];
                var sameLetterWords = [];
                for (var i = 0; i < activity.distractorData.length; i++) {
                    var possibility = activity.distractorData[i].Text;
                    if (possibility !== avoidWord && possibility[0] === word[0] && possibility.length === word.length) {
                        bestWords.push(activity.distractorData[i]);
                    } else if (possibility !== avoidWord && possibility.length === word.length) {
                        sameLengthWords.push(activity.distractorData[i]);
                    } else if (possibility !== avoidWord && possibility[0] === word[0]) {
                        sameLetterWords.push(activity.distractorData[i]);
                    }
                }
                if (activity.progress > 15 && bestWords.length > 0) {
                    return getRandomFromArray(bestWords);
                } else if (activity.progress > 10 && sameLengthWords.length > 0) {
                    return getRandomFromArray(sameLengthWords);
                } else if (activity.progress > 5 && sameLetterWords.length > 0) {
                    return getRandomFromArray(sameLetterWords);
                } else {
                    return getRandomFromArray(activity.distractorData);
                }
            }
            return {
                initializeActivities: initializeActivities,
                selectCategory: selectCategory,
                selectAnswer: selectAnswer,
                playSoundMatchAudio: playSoundMatchAudio,
                resetSoundMatch: resetSoundMatch,
                confirmSoundMatch: confirmSoundMatch,
                skipSoundMatch: skipSoundMatch,
                selectWordSound: selectWordSound,
                confirmWordSound: confirmWordSound,
                resetWordSound: resetWordSound,
                skipWordSound: skipWordSound,
                selectWordFill: selectWordFill,
                confirmWordFill: confirmWordFill,
                resetWordFill: resetWordFill,
                skipWordFill: skipWordFill,
                incrementExplorerWord: incrementExplorerWord,
                toggleAudio: toggleAudio,
                toggleWordAudio: toggleWordAudio,
                toggleSentenceAudio: toggleSentenceAudio,
                toggleWordImage: toggleWordImage,
                toggleWordVideo: toggleWordVideo,
                stopWordVideo: stopWordVideo,
                selectRadioItem: selectRadioItem,
                selectDropdownItem: selectDropdownItem,
                playLetterExplorerWord: playLetterExplorerWord,
                toggleCombo: toggleCombo,
                selectVideoPlaylist: selectVideoPlaylist,
                hideInstructions: hideInstructions,
                incrementParagraph: incrementParagraph,
                playTextExplorerWord: playTextExplorerWord,
                setTextExplorerVoice: setTextExplorerVoice,
                toggleTextExplorerAudio: toggleTextExplorerAudio,
                addHtmlInput: addHtmlInput,
                runScriptInput: runScriptInput,
                runCSSInput: runCSSInput,
                clearCSS: clearCSS,
                toggleHTMLStyles: toggleHTMLStyles,
                retryQuiz: retryQuiz
            };
        }
        )();
    },
    error: function(err) {
        console.log(err);
    }
});
$(document).ready(function() {
    bindInteractiveButtons();
});
$(window).on('resize', function() {
    interactivesRefresh();
});
$(window).on('load', function() {
    interactivesRefresh();
    $(".butt_instruc_geogebra").on("click", function() {
        $(this).parent().find(".win_instruc_geogebra").fadeIn();
    });
    $(".closewin").on("click", function() {
        $(this).closest(".iframecontainer").find(".win_instruc_geogebra").fadeOut();
    });
});
var category = {
    TECHNOLOGY: 'technology',
    ENGLISH: 'english',
    MATHEMATICS: 'mathematics',
    EVERY_DAY_LIFE: 'every_day_life'
};
function loadInteractives() {
    $('.gcf_interactive').each(function(index, interactive) {
        var $interactive = $(interactive);
        if (!$interactive.hasClass('loaded')) {
            var url = $interactive.data('url');
            $.ajax({
                url: url,
                success: function(response) {
                    var $response = $(response);
                    if ($response.filter('.append_html').length > 0) {
                        var baseurl = url.replace('index.html', '');
                        $response.find('img').each(function(index, image) {
                            var s = $(image).attr('src');
                            if (s.indexOf('/') === 0) {
                                s = s.substring(1, s.length);
                            }
                            $(image).attr('src', baseurl + s);
                        });
                        $response.find('.audio_source').each(function() {
                            var s = $(this).attr('src');
                            if (s.indexOf('/') === 0) {
                                s = s.substring(1, s.length);
                            }
                            $(this).attr('src', baseurl + s + ".mp3");
                        });
                        var $append = $response.filter('.append_html');
                        var type = $append.data('type');
                        if (type == 'tabs') {
                            $append.tabs({
                                heightStyle: "auto"
                            });
                        } else if (type == 'accordion') {
                            $append.accordion({
                                collapsible: true,
                                active: false
                            });
                        } else if (type == 'screen') {
                            interactive_screen();
                        }
                        $interactive.html($response);
                        if ($response.filter('.gcfaudio').length > 0) {
                            GCFAudio.load($interactive);
                        }
                        interactivesRefresh();
                    } else {
                        $interactive.html('<iframe src="' + url + '"class="iframehtml5" style="width:100%;"></iframe>');
                    }
                    $interactive.addClass('loaded');
                }
            });
        }
    });
}
function interactivesRefresh() {
    $(document).find('.append_html').each(function() {
        var $append = $(this);
        var type = $append.data('type');
        if (type == 'tabs') {
            try {
                $append.tabs('refresh');
            } catch (e) {}
        } else if (type == 'accordion') {
            try {
                $append.accordion('refresh');
            } catch (e) {}
        } else if (type == 'screen') {
            interactive_screen();
        }
    });
}
function getInteractiveTag(url) {
    return '<div class="gcf_interactive" data-url="' + url + '"></div>';
}
function interactive_screen() {
    $(".screen_pin_dot").hover(function() {
        var target = $(this).data("info");
        $(".pin_normal." + target).hide();
        $(".pin_hover." + target).show();
    }, function() {
        var target = $(this).data("info");
        $(".pin_hover." + target).hide();
        $(".pin_normal." + target).show();
    });
    $(".screen_pin_dot").on("click", function() {
        var $parent = $(this).closest(".descriptive_image");
        $parent.find(".screen_pin_dot").show();
        var hide = $parent.data("hide");
        var target = $(this).data("info");
        if (hide == "y") {
            $parent.find(".screen_gray").show();
            $parent.find(".screen_pin_dot").hide();
        } else {
            $parent.find(".screen_area").hide();
            $parent.find(".hidephone .screen_info").hide();
            $parent.find(".hidephone .screen_info").stop();
        }
        $parent.find(".screen_pin_dot." + target).hide();
        $parent.find(".screen_area." + target).show();
        $parent.find(".hidephone .screen_info." + target).fadeIn();
    });
    $(".screen_close").on("click", function() {
        var $parent = $(this).closest(".descriptive_image");
        $parent.find(".screen_gray").hide();
        $parent.find(".screen_pin_dot").show();
        $parent.find(".screen_area").fadeOut();
        $parent.find(".hidephone .screen_info").fadeOut();
    });
    $(".message_hide").on("click", function() {
        var $parent = $(this).closest(".descriptive_image");
        $parent.find(".screen_gray").hide();
        $parent.find(".screen_pin_dot").show();
        $parent.find(".screen_info").fadeOut();
    });
    $(".screen_gray").on("click", function() {
        var $parent = $(this).closest(".descriptive_image");
        $parent.find(".screen_gray").hide();
        $parent.find(".screen_pin_dot").show();
        $parent.find(".screen_area").hide();
        $parent.find(".hidephone .screen_info").hide();
    });
    $('.hidephone .screen_info').each(function() {
        var $parent = $(this).closest(".descriptive_image");
        var $desktop = $(this);
        $parent.find('.showphone .screen_info').each(function() {
            var $phone = $(this);
            var $d = $($desktop.attr('class').split(/\s+/));
            var $p = $($phone.attr('class').split(/\s+/));
            $d.each(function() {
                var dc = this;
                $p.each(function() {
                    var pc = this;
                    if (pc != "screen_info" && dc != "screen_info") {
                        if (String(pc) == String(dc)) {
                            $phone.html($desktop.html());
                        }
                    }
                });
            });
        });
    });
    $(".showphone .screen_info .screen_close").remove();
    $(".showphone .screen_info").css("position", "inherit");
    $(".showphone .screen_info .text_right").removeClass("text_right");
    $(".showphone .screen_info").show();
}
function getInteractiveUrlBase($elem) {
    return $elem.closest(".gcf_interactive").data("url").replace("index.html", "");
}
function getAudioFile($elem) {
    return getInteractiveUrlBase($elem) + $elem.attr("id") + ".mp3";
}
function trackInteractiveStart(category) {
    if (typeof ga === 'function') {
        ga('send', 'event', 'interactives', 'start', category);
    }
}
function trackInteractiveEnd(category) {
    if (typeof ga === 'function') {
        ga('send', 'event', 'interactives', 'end', category);
    }
}
function trackAudioStart() {
    if (typeof ga === 'function') {
        ga('send', 'event', 'interactives', 'start', 'audio');
    }
}
function trackAudioEnd() {
    if (typeof ga === 'function') {
        ga('send', 'event', 'interactives', 'end', 'audio');
    }
}
function trackInteractiveAgain(category) {
    if (typeof ga === 'function') {
        ga('send', 'event', 'interactives', 'try_again', category);
    }
}
function shuffleArray(array) {
    var j, x, i;
    for (i = array.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function translateHtml($interactive) {
    var lang = currentLanguage();
    $interactive.find('.translate').each(function() {
        var $i = $(this);
        $i.html($i.data(lang));
    });
    $interactive.find('.translate_href').each(function() {
        var $i = $(this);
        $i.attr("href", $i.data(lang));
    });
    $interactive.find('.translate_src').each(function() {
        var $i = $(this);
        $i.attr("src", $i.data(lang));
    });
}
function currentLanguage() {
    if (window.location.href.indexOf('/es/') > 0) {
        return 'es';
    } else if (window.location.href.indexOf('/pt/') > 0) {
        return 'pt';
    } else if (window.location.href.indexOf('/en/') > 0) {
        return 'en';
    } else {
        return 'es';
    }
}
function getContent(url, callback) {
    var lang = currentLanguage();
    $.get(url + 'content/' + lang + '.json', function(response) {
        callback(response);
    });
}
function bindInteractiveButtons() {
    $(document).on("click", '.up-open', function(e) {
        e.preventDefault();
        var u = window.location.href;
        if ((u.indexOf('admin') > 0 && u.indexOf('preview') > 0) || (u.indexOf('admin') < 0)) {
            loadInteractives();
            var $container = $(this).closest(".wrapperpopup").find(".containerpopup");
            var $overlay = $(this).closest(".wrapperpopup").find(".up-overlay");
            var $modal = $(this).closest(".wrapperpopup").find(".up-modal");
            $container.show();
            $overlay.show();
            $overlay.animate({
                'opacity': '1'
            }, 250, function() {
                $modal.show();
                $modal.animate({
                    'margin-top': '+=20px',
                    'opacity': '1'
                }, 200, function() {});
            });
            e.stopImmediatePropagation();
            return false;
        }
    });
    $(document).on("click", ".up-close", function(e) {
        e.preventDefault();
        var $container = $(this).closest(".wrapperpopup").find(".containerpopup");
        var $overlay = $(this).closest(".wrapperpopup").find(".up-overlay");
        var $modal = $(this).closest(".wrapperpopup").find(".up-modal");
        $modal.animate({
            'margin-top': '-=20px',
            'opacity': '0'
        }, 200, function() {
            $modal.hide();
            $overlay.animate({
                'opacity': '0'
            }, 100, function() {
                $overlay.hide();
                $container.hide();
            });
        });
        e.stopImmediatePropagation();
        return false;
    });
    $(document).on("click", ".up-overlay", function(e) {
        e.preventDefault();
        var $container = $(this).closest(".wrapperpopup").find(".containerpopup");
        var $overlay = $(this).closest(".wrapperpopup").find(".up-overlay");
        var $modal = $(this).closest(".wrapperpopup").find(".up-modal");
        $modal.animate({
            'margin-top': '-=20px',
            'opacity': '0'
        }, 200, function() {
            $modal.hide();
            $overlay.animate({
                'opacity': '0'
            }, 100, function() {
                $overlay.hide();
                $container.hide();
            });
        });
        e.stopImmediatePropagation();
        return false;
    });
}
var GCFAudio = (function() {
    function getAudioPlayerTag() {
        var tag = '<div class="player"><div class="playtogglewrapper"><span class="playtoggle"/></div><span class="gutter"><span class="handle ui-slider-handle"/></span><span class="timeleft"/></div>';
        return tag;
    }
    function getNativeAudioPlayerTag() {
        var tag = '<audio controls><source src=""></audio>';
        return tag;
    }
    function showNative() {
        var nav = navigator.userAgent.toLowerCase();
        return (nav.indexOf("android") > -1 || nav.indexOf("msie") > -1 || nav.indexOf("edge") > -1);
    }
    function load($interactive) {
        if ($interactive.find(".gcf_audio_player").length == 0) {
            return;
        }
        var $player = $interactive.find(".gcf_audio_player");
        var url = $interactive.closest(".gcf_interactive").data("url").replace("index.html", "");
        if (showNative()) {
            $player.html(getNativeAudioPlayerTag()).find("audio").find("source").attr("src", url + $player.data("file"));
        } else {
            $player.html(getAudioPlayerTag());
            var audio = new Audio(url + $player.data("file"));
            var sliding = false;
            $interactive.find('.player .gutter').slider({
                value: 0,
                step: 1,
                orientation: "horizontal",
                range: "min",
                animate: false,
                start: function() {
                    sliding = true;
                },
                stop: function(e, ui) {
                    sliding = false;
                    audio.currentTime = ui.value;
                }
            });
            $(audio).on("loadedmetadata", function() {
                $interactive.find('.player .gutter').slider("option", "max", audio.duration);
            });
            $(audio).on('timeupdate', function() {
                var rem = parseInt(audio.duration - audio.currentTime, 10)
                  , pos = audio.currentTime
                  , mins = Math.floor(rem / 60, 10)
                  , secs = rem - mins * 60;
                timeleft.text('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
                if (!sliding) {
                    $interactive.find('.player .gutter').slider("option", "value", pos);
                }
            });
            $(audio).on('play', function() {
                trackAudioStart();
            });
            $(audio).on('ended', function() {
                $interactive.find(".playtoggle").removeClass('playing');
                trackAudioEnd();
            });
            audio.load();
            var timeleft = $interactive.find('.player #timeleft');
            $interactive.find(".playtogglewrapper").click(function() {
                if (audio.paused) {
                    audio.play();
                    $interactive.find(".playtoggle").addClass('playing');
                } else {
                    audio.pause();
                    $interactive.find(".playtoggle").removeClass('playing');
                }
            });
        }
    }
    return {
        load: load
    };
}
)();
(function(b) {
    b.support.touch = "ontouchend"in document;
    if (!b.support.touch) {
        return;
    }
    var c = b.ui.mouse.prototype, e = c._mouseInit, a;
    function d(g, h) {
        if (g.originalEvent.touches.length > 1) {
            return;
        }
        g.preventDefault();
        var i = g.originalEvent.changedTouches[0]
          , f = document.createEvent("MouseEvents");
        f.initMouseEvent(h, true, true, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, false, false, false, false, 0, null);
        g.target.dispatchEvent(f);
    }
    c._touchStart = function(g) {
        var f = this;
        if (a || !f._mouseCapture(g.originalEvent.changedTouches[0])) {
            return;
        }
        a = true;
        f._touchMoved = false;
        d(g, "mouseover");
        d(g, "mousemove");
        d(g, "mousedown");
    }
    ;
    c._touchMove = function(f) {
        if (!a) {
            return;
        }
        this._touchMoved = true;
        d(f, "mousemove");
    }
    ;
    c._touchEnd = function(f) {
        if (!a) {
            return;
        }
        d(f, "mouseup");
        d(f, "mouseout");
        if (!this._touchMoved) {
            d(f, "click");
        }
        a = false;
    }
    ;
    c._mouseInit = function() {
        var f = this;
        f.element.bind("touchstart", b.proxy(f, "_touchStart")).bind("touchmove", b.proxy(f, "_touchMove")).bind("touchend", b.proxy(f, "_touchEnd"));
        e.call(f);
    }
    ;
}
)(jQuery);
$(document).ready(function() {
    initAudioControls();
});
function initAudioControls() {
    var audios = [];
    var id = 0;
    var current;
    $(document).on('click', '.pButton', function() {
        var $audioElement = $(this);
        if ($audioElement.parent().data('audio-id') == undefined) {
            $audioElement.parent().data('audio-id', id);
            id++;
            var audioUrl = $audioElement.parent().data('url');
            var audioSource = new Audio(audioUrl);
            audioSource.load();
            var data = {};
            data.source = audioSource;
            data.pButton = $audioElement.parent().find('.pButton').get(0);
            data.playhead = $audioElement.parent().find('.playhead').get(0);
            data.timeline = $audioElement.parent().find('.timeline').get(0);
            data.timelineWidth = data.timeline.offsetWidth - data.playhead.offsetWidth;
            data.timeline.onclick = function(event) {
                moveplayhead(event);
                current.source.currentTime = current.source.duration * clickPercent(event);
            }
            ;
            data.source.ontimeupdate = function() {
                var playPercent = current.timelineWidth * (current.source.currentTime / current.source.duration);
                current.playhead.style.marginLeft = playPercent + "px";
            }
            ;
            data.source.onended = function() {
                current.pButton.className = "pButton play";
            }
            ;
            audios.push(data);
            current = data;
            play();
        } else {
            current = audios[parseInt($audioElement.parent().data('audio-id'))];
            play();
        }
        function clickPercent(event) {
            return (event.clientX - getPosition(current.timeline)) / current.timelineWidth;
        }
        function moveplayhead(event) {
            var newMargLeft = event.clientX - getPosition(current.timeline);
            if (newMargLeft >= 0 && newMargLeft <= current.timelineWidth) {
                current.playhead.style.marginLeft = newMargLeft + "px";
            }
            if (newMargLeft < 0) {
                current.playhead.style.marginLeft = "0px";
            }
            if (newMargLeft > current.timelineWidth) {
                current.playhead.style.marginLeft = current.timelineWidth + "px";
            }
        }
        function play() {
            if (current.source.paused) {
                current.source.play();
                current.pButton.className = "pButton pause";
            } else {
                current.source.pause();
                current.pButton.className = "pButton play";
            }
        }
        function getPosition(el) {
            return el.getBoundingClientRect().left;
        }
    });
}
!function(i) {
    if ("function" == typeof define && define.amd)
        define(["jquery"], i);
    else if ("object" == typeof module && module.exports) {
        var t = require("jquery");
        i(t),
        module.exports = t
    } else
        i(jQuery)
}(function(i) {
    function t(i) {
        this.init(i)
    }
    t.prototype = {
        value: 0,
        size: 100,
        startAngle: -Math.PI,
        thickness: "auto",
        fill: {
            gradient: ["#3aeabb", "#fdd250"]
        },
        emptyFill: "rgba(0, 0, 0, .1)",
        animation: {
            duration: 1200,
            easing: "circleProgressEasing"
        },
        animationStartValue: 0,
        reverse: !1,
        lineCap: "butt",
        insertMode: "prepend",
        constructor: t,
        el: null,
        canvas: null,
        ctx: null,
        radius: 0,
        arcFill: null,
        lastFrameValue: 0,
        init: function(t) {
            i.extend(this, t),
            this.radius = this.size / 2,
            this.initWidget(),
            this.initFill(),
            this.draw(),
            this.el.trigger("circle-inited")
        },
        initWidget: function() {
            this.canvas || (this.canvas = i("<canvas>")["prepend" == this.insertMode ? "prependTo" : "appendTo"](this.el)[0]);
            var t = this.canvas;
            if (t.width = this.size,
            t.height = this.size,
            this.ctx = t.getContext("2d"),
            window.devicePixelRatio > 1) {
                var e = window.devicePixelRatio;
                t.style.width = t.style.height = this.size + "px",
                t.width = t.height = this.size * e,
                this.ctx.scale(e, e)
            }
        },
        initFill: function() {
            function t() {
                var t = i("<canvas>")[0];
                t.width = e.size,
                t.height = e.size,
                t.getContext("2d").drawImage(g, 0, 0, r, r),
                e.arcFill = e.ctx.createPattern(t, "no-repeat"),
                e.drawFrame(e.lastFrameValue)
            }
            var e = this
              , a = this.fill
              , n = this.ctx
              , r = this.size;
            if (!a)
                throw Error("The fill is not specified!");
            if ("string" == typeof a && (a = {
                color: a
            }),
            a.color && (this.arcFill = a.color),
            a.gradient) {
                var s = a.gradient;
                if (1 == s.length)
                    this.arcFill = s[0];
                else if (s.length > 1) {
                    for (var l = a.gradientAngle || 0, o = a.gradientDirection || [r / 2 * (1 - Math.cos(l)), r / 2 * (1 + Math.sin(l)), r / 2 * (1 + Math.cos(l)), r / 2 * (1 - Math.sin(l))], h = n.createLinearGradient.apply(n, o), c = 0; c < s.length; c++) {
                        var d = s[c]
                          , u = c / (s.length - 1);
                        i.isArray(d) && (u = d[1],
                        d = d[0]),
                        h.addColorStop(u, d)
                    }
                    this.arcFill = h
                }
            }
            if (a.image) {
                var g;
                a.image instanceof Image ? g = a.image : (g = new Image,
                g.src = a.image),
                g.complete ? t() : g.onload = t
            }
        },
        draw: function() {
            this.animation ? this.drawAnimated(this.value) : this.drawFrame(this.value)
        },
        drawFrame: function(i) {
            this.lastFrameValue = i,
            this.ctx.clearRect(0, 0, this.size, this.size),
            this.drawEmptyArc(i),
            this.drawArc(i)
        },
        drawArc: function(i) {
            if (0 !== i) {
                var t = this.ctx
                  , e = this.radius
                  , a = this.getThickness()
                  , n = this.startAngle;
                t.save(),
                t.beginPath(),
                this.reverse ? t.arc(e, e, e - a / 2, n - 2 * Math.PI * i, n) : t.arc(e, e, e - a / 2, n, n + 2 * Math.PI * i),
                t.lineWidth = a,
                t.lineCap = this.lineCap,
                t.strokeStyle = this.arcFill,
                t.stroke(),
                t.restore()
            }
        },
        drawEmptyArc: function(i) {
            var t = this.ctx
              , e = this.radius
              , a = this.getThickness()
              , n = this.startAngle;
            i < 1 && (t.save(),
            t.beginPath(),
            i <= 0 ? t.arc(e, e, e - a / 2, 0, 2 * Math.PI) : this.reverse ? t.arc(e, e, e - a / 2, n, n - 2 * Math.PI * i) : t.arc(e, e, e - a / 2, n + 2 * Math.PI * i, n),
            t.lineWidth = a,
            t.strokeStyle = this.emptyFill,
            t.stroke(),
            t.restore())
        },
        drawAnimated: function(t) {
            var e = this
              , a = this.el
              , n = i(this.canvas);
            n.stop(!0, !1),
            a.trigger("circle-animation-start"),
            n.css({
                animationProgress: 0
            }).animate({
                animationProgress: 1
            }, i.extend({}, this.animation, {
                step: function(i) {
                    var n = e.animationStartValue * (1 - i) + t * i;
                    e.drawFrame(n),
                    a.trigger("circle-animation-progress", [i, n])
                }
            })).promise().always(function() {
                a.trigger("circle-animation-end")
            })
        },
        getThickness: function() {
            return i.isNumeric(this.thickness) ? this.thickness : this.size / 14
        },
        getValue: function() {
            return this.value
        },
        setValue: function(i) {
            this.animation && (this.animationStartValue = this.lastFrameValue),
            this.value = i,
            this.draw()
        }
    },
    i.circleProgress = {
        defaults: t.prototype
    },
    i.easing.circleProgressEasing = function(i) {
        return i < .5 ? (i = 2 * i,
        .5 * i * i * i) : (i = 2 - 2 * i,
        1 - .5 * i * i * i)
    }
    ,
    i.fn.circleProgress = function(e, a) {
        var n = "circle-progress"
          , r = this.data(n);
        if ("widget" == e) {
            if (!r)
                throw Error('Calling "widget" method on not initialized instance is forbidden');
            return r.canvas
        }
        if ("value" == e) {
            if (!r)
                throw Error('Calling "value" method on not initialized instance is forbidden');
            if ("undefined" == typeof a)
                return r.getValue();
            var s = arguments[1];
            return this.each(function() {
                i(this).data(n).setValue(s)
            })
        }
        return this.each(function() {
            var a = i(this)
              , r = a.data(n)
              , s = i.isPlainObject(e) ? e : {};
            if (r)
                r.init(s);
            else {
                var l = i.extend({}, a.data());
                "string" == typeof l.fill && (l.fill = JSON.parse(l.fill)),
                "string" == typeof l.animation && (l.animation = JSON.parse(l.animation)),
                s = i.extend(l, s),
                s.el = a,
                r = new t(s),
                a.data(n, r)
            }
        })
    }
});
var slides = (function() {
    var browserWidth = $(window).width();
    var resizeTimeout = null;
    $(window).load(function() {
        setTimeout(initSlideshows, 0);
    });
    $.fn.createSlideshows = function() {
        $('.slideshowlist:not(.slides-done)').each(function() {
            var numSlides = $(this).find('li').length;
            $(this).addClass('slides-done');
            $(this).attr('data-slides', numSlides);
            $(this).attr('data-current-slide', 0);
            $(this).find('li:first-of-type').addClass('slides-current');
            $(this).find('li').attr('tabindex', '-1');
            $(this).find('.slides-current').attr('tabindex', '0');
            $(this).find('li a').attr('tabindex', '-1');
            $(this).find('.slides-current a').attr('tabindex', '0');
            $(this).prepend('<button tabindex="0" aria-label="previous slide" onclick="slides.incSlides(this, -1)" class="slides-arrow-button slides-arrow-button-previous"><span class="material-icons slides-arrow slides-arrow-previous">arrow_back_ios</span></button>');
            $(this).append('<button tabindex="0" aria-label="next slide" onclick="slides.incSlides(this, 1)" class="slides-arrow-button slides-arrow-button-next"><span class="material-icons slides-arrow slides-arrow-next">arrow_back_ios</span></button>');
            var slidesWithoutText = numSlides - $(this).find('li p').length;
            if (slidesWithoutText === 1 && $(this).find('li:last-of-type p').length === 0) {
                $(this).addClass('slides-has-end-slide');
            }
            var lastAltText = $(this).find('li:last-of-type img').attr('alt');
            if (lastAltText) {
                if (lastAltText.toLowerCase().includes('gcf') && lastAltText.toLowerCase().includes('logo')) {
                    $(this).addClass('slides-has-end-slide');
                }
            }
            if (slidesWithoutText === numSlides) {
                $(this).addClass('slides-no-text');
            }
            createDots($(this));
            rewordChevron($(this));
        });
        resetSlideHeights();
    }
    ;
    $(window).resize(function() {
        if ($(window).width() !== browserWidth) {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function() {
                browserWidth = $(window).width();
                resetSlideHeights();
            }, 300);
        }
    });
    function initSlideshows() {
        $('.slideshowlist').createSlideshows();
    }
    function createDots(slideshow) {
        $(slideshow).append('<div class="slides-dots-wrapper"></div>');
        var dotsWrapper = $(slideshow).find('.slides-dots-wrapper');
        var numSlides = $(slideshow).find('li').length;
        for (var i = 0; i < numSlides; i++) {
            dotsWrapper.append('<button tabindex="-1" onclick="slides.goToSlide(this, ' + i + ')" class="slides-dot-button"><div class="slides-dot"></div></button>');
        }
        dotsWrapper.find('button').removeClass('slides-dot-button-current');
        dotsWrapper.find('button:first-of-type').addClass('slides-dot-button-current');
    }
    function rewordChevron(slideshow) {
        var prev = $(slideshow).prev();
        if (prev.hasClass('chevron')) {
            prev.addClass('slides-chevron-click');
            var newText = prev.text().replace(/Click.+?the slideshow (below )?/, 'View the slides below ');
            prev.after('<p class="chevron slides-chevron-view">' + newText + '</p>');
        }
    }
    function resetSlideHeights() {
        setTimeout(function() {
            $('.slideshowlist').each(function() {
                var maxTextHeight = 0;
                $(this).find('li').css('height', 'auto');
                $(this).find('li').each(function() {
                    if ($(this).height() > maxTextHeight) {
                        maxTextHeight = $(this).height();
                    }
                });
                $(this).find('li').css('height', maxTextHeight);
            });
        }, 0);
    }
    function incSlides(button, incBy) {
        var slideshow;
        if ($(button).hasClass('slides-arrow-button')) {
            slideshow = $(button).parent();
        }
        var numSlides = parseInt(slideshow.attr('data-slides'));
        var newSlide = (parseInt(slideshow.attr('data-current-slide')) + parseInt(incBy) + numSlides) % numSlides;
        slideshow.find('li').removeClass('slides-current');
        slideshow.find('li:nth-of-type(' + (newSlide + 1) + ')').addClass('slides-current');
        slideshow.attr('data-current-slide', newSlide);
        slideshow.find('li').attr('tabindex', '-1');
        slideshow.find('.slides-current').attr('tabindex', '0');
        slideshow.find('.slides-dots-wrapper button').removeClass('slides-dot-button-current');
        slideshow.find('.slides-dots-wrapper button:nth-of-type(' + (newSlide + 1) + ')').addClass('slides-dot-button-current');
    }
    function goToSlide(button, index) {
        var slideshow = $(button).parent().parent();
        slideshow.find('li').removeClass('slides-current');
        slideshow.find('li:nth-of-type(' + (index + 1) + ')').addClass('slides-current');
        slideshow.attr('data-current-slide', index);
        slideshow.find('li').attr('tabindex', '-1');
        slideshow.find('slides-current').attr('tabindex', '0');
        slideshow.find('.slides-dots-wrapper button').removeClass('slides-dot-button-current');
        $(button).addClass('slides-dot-button-current');
    }
    return {
        initSlideshows: initSlideshows,
        resetSlideHeights: resetSlideHeights,
        incSlides: incSlides,
        goToSlide: goToSlide
    };
}
)();
$(function() {
    $('.ict').each(function() {
        if ($(this).hasClass('tooltip')) {
            $('.hotspot-content').each(function() {
                $(this).css('display', 'none');
            });
            $('.hotspot.active-hs').each(function() {
                $(this).removeClass('active-hs');
            });
        }
    });
    $('.ict').each(function() {
        $('.hotspot-content').each(function() {
            if ($(this).find('h2').length == 0) {
                $(this).find('p').css('border-top', '2px solid #B6B9BC');
            }
        });
    });
    $('body').on('click', '.hotspot', function(e) {
        toggleHotspot($(this));
    });
});
function toggleHotspot(hotspot) {
    console.log(hotspot)
    var content = hotspot.next('.hotspot-content');
    var parent = hotspot.parent('.ict');
    if (parent.hasClass('callout') == false) {
        if (hotspot.hasClass('active-hs')) {
            hotspot.removeClass('active-hs');
            content.removeClass('active-content');
            content.hide();
            hotspot.attr('aria-expanded', 'false');
        } else {
            $('.hotspot').each(function() {
                $(this).removeClass('active-hs');
                $(this).next('.hotspot-content').removeClass('active-content');
                $(this).next('.hotspot-content').hide();
                $(this).attr('aria-expanded', 'false');
            });
            hotspot.addClass('active-hs');
            content.addClass('active-content');
            content.show();
            hotspot.attr('aria-expanded', 'true');
        }
    }
}
function initLGKeyboardNav() {
    var lgs = $('.ict.tooltip').parent();
    lgs.each(function() {
        if (!$(this).hasClass('lg-keyboard-done')) {
            $(this).attr('aria-label', 'labeled graphic');
            $(this).find('.hotspot').each(function() {
                var index = lgData.hotspotIndex;
                var hotspot = $(this);
                hotspot.attr('tabindex', 0);
                hotspot.attr('role', 'button');
                hotspot.attr('aria-haspopup', 'true');
                hotspot.attr('aria-expanded', 'false');
                hotspot.attr('data-index', index);
                hotspot.attr('id', 'hotspot-' + index);
                hotspot.attr('aria-controls', 'hotspot-content-' + index);
                hotspot.on('keydown', function(event) {
                    keyHotspot(event, index);
                });
                var content = $(this).next();
                var titleElement = content.find('h2');
                titleElement.attr('id', 'hotspot-title-' + index);
                content.attr('id', 'hotspot-content-' + index);
                titleElement.attr('aria-hidden', 'true');
                hotspot.attr('aria-labelledby', 'hotspot-title-' + index);
                hotspot.attr('aria-label', titleElement.text());
                lgData.hotspotIndex++;
            });
            sortHotspots($(this));
            $(this).addClass('lg-keyboard-done');
        }
    });
}
function sortHotspots(lg) {
    var lgInnerWrapper = lg.find('.ict.tooltip');
    var hotspots = lg.find('.hotspot, .hotspot-content');
    hotspots.each(function() {
        $(this).prop('xPc', $(this).attr('data-hotspot-x'));
        $(this).prop('yPc', $(this).attr('data-hotspot-y'));
    });
    hotspots.detach();
    hotspots.sort(function(a, b) {
        return customLGSort(a, b, 100);
    });
    lgInnerWrapper.append(hotspots);
}
function keyHotspot(event, index) {
    var keyDown = event.key !== undefined ? event.key : event.keyCode;
    if ((keyDown === 'Enter' || keyDown === 13) || (['Spacebar', ' '].indexOf(keyDown) >= 0 || keyDown === 32)) {
        toggleHotspot($('#hotspot-' + index));
    }
}
var lgData = {
    resizeTimeout: null,
    nextLessonTimeout: null,
    cropWidth: 499,
    cropHeight: 200,
    hotspotIndex: 0
}
$(document).ready(function() {
    $(window).load(function() {
        $('.mobile-lg').remove();
        $('.lg-preserve-width').removeClass('lg-preserve-width lg-hidden lg-done');
        setTimeout(function() {
            initMobileLG();
            initLGKeyboardNav();
        }, 0)
    });
});
$(window).resize(function() {
    if (lgData.resizeTimeout) {
        clearTimeout(lgData.resizeTimeout);
    }
    lgData.resizeTimeout = setTimeout(recropMobileLG, 300);
});
function initMobileLG() {
    var lgs = $('.ict.tooltip').parent();
    lgs.each(function() {
        if (!$(this).hasClass('lg-processed')) {
            $(this).addClass('lg-processed');
            var hotspotsData = getHotspots($(this));
            if (!$(this).find('.tooltip').hasClass('lg-no-mobile')) {
                createMobileLabels($(this), hotspotsData);
            }
        }
    });
}
function recropMobileLG() {
    var newLGWidth = $('.mobile-lg').width();
    if (newLGWidth !== lgData.cropWidth) {
        lgData.cropWidth = newLGWidth;
        var lgs = $('.lg-processed');
        lgs.each(function() {
            if ($(this).next().hasClass('mobile-lg')) {
                cropLGImages($(this).next());
            }
        });
    }
}
function getHotspots(lg) {
    var data = [];
    if (lg.prev().hasClass('chevron')) {
        lg.prev().addClass('lg-hidden');
    }
    lg.addClass('lg-preserve-width');
    var img = lg.find('img').first();
    var width = img.width();
    var height = img.height();
    lg.attr('data-img-width', width);
    lg.attr('data-img-height', height);
    lg.find('.hotspot').each(function() {
        var obj = {};
        var position = $(this).position();
        obj.xPc = Math.round((position.left + 11) / width * 10000) / 10000;
        obj.yPc = Math.round((position.top + 11) / height * 10000) / 10000;
        $(this).attr('data-hotspot-x', obj.xPc);
        $(this).attr('data-hotspot-y', obj.yPc);
        $(this).next().attr('data-hotspot-x', obj.xPc);
        $(this).next().attr('data-hotspot-y', obj.yPc);
        if ($(this).next().hasClass('hotspot-content')) {
            obj.content = $(this).next().html();
        }
        data.push(obj);
    });
    data.sort(function(a, b) {
        return customLGSort(a, b, 100);
    });
    return data;
}
function customLGSort(a, b, roundTo) {
    var aRoundedY = Math.round(a.yPc * roundTo) / roundTo;
    var bRoundedY = Math.round(b.yPc * roundTo) / roundTo;
    if (aRoundedY < bRoundedY) {
        return -1;
    } else if (aRoundedY > bRoundedY) {
        return 1;
    }
    if (a.xPc < b.xPc) {
        return -1;
    } else if (a.xPc > b.xPc) {
        return 1;
    }
    return 0;
}
function createMobileLabels(lg, data) {
    lg.after('<div class="mobile-lg"></div>');
    var container = lg.next();
    var img = lg.find('img').first();
    var imgWidth = img.width();
    var imgHeight = img.height();
    for (var i = 0; i < data.length; i++) {
        var contentWrapper = $('<div>', {
            class: 'mobile-lg-content-wrapper'
        });
        contentWrapper.html(data[i].content);
        var outerWrapper = $('<div>', {
            class: 'mobile-lg-outer-wrapper'
        });
        var innerWrapper = $('<div>', {
            class: 'mobile-lg-inner-wrapper'
        });
        innerWrapper.attr('data-hotspot-x', data[i].xPc);
        innerWrapper.attr('data-hotspot-y', data[i].yPc);
        var newImg = img.clone();
        innerWrapper.append(newImg);
        var x = Math.min(data[i].xPc * imgWidth, imgWidth - 13);
        var y = Math.min(data[i].yPc * imgHeight, imgHeight - 13);
        var callout = $('<div>', {
            class: 'mobile-lg-hotspot'
        });
        callout.css({
            'left': x + 'px',
            'top': y + 'px'
        });
        innerWrapper.append(callout);
        outerWrapper.append(innerWrapper);
        container.append(contentWrapper);
        container.append(outerWrapper);
    }
    lg.addClass('lg-hidden lg-done');
    container.attr('data-img-width', imgWidth);
    container.attr('data-img-height', imgHeight);
    cropLGImages(container);
}
function cropLGImages(container) {
    lgData.cropWidth = Math.min($('.mobile-lg').width(), container.attr('data-img-width'));
    if (lgData.cropWidth > 0) {
        container.find('.mobile-lg-inner-wrapper').each(function() {
            var xPc = $(this).attr('data-hotspot-x');
            var yPc = $(this).attr('data-hotspot-y');
            var imgWidth = container.attr('data-img-width');
            var imgHeight = container.attr('data-img-height');
            $(this).parent().css({
                width: lgData.cropWidth + 'px',
                height: lgData.cropHeight + 'px'
            });
            var cropData = getMobileCropData(xPc, yPc, imgWidth, imgHeight);
            $(this).css({
                'width': imgWidth + 'px',
                'height': imgHeight + 'px',
                'left': cropData.slideX + 'px',
                'top': cropData.slideY + 'px'
            });
        });
    } else {
        setTimeout(function() {
            cropLGImages(container);
        }, 2000)
    }
}
function getMobileCropData(xPc, yPc, imgWidth, imgHeight) {
    var data = {};
    var maxX = imgWidth - lgData.cropWidth / 2;
    var minX = lgData.cropWidth / 2;
    var maxY = imgHeight - lgData.cropHeight / 2;
    var minY = lgData.cropHeight / 2;
    var rawX = imgWidth * xPc;
    var rawY = imgHeight * yPc;
    var maxSlideX = -maxX + minX;
    var maxSlideY = -maxY + minY;
    if (rawX < minX) {
        data.slideX = 0;
    } else if (rawX > maxX) {
        data.slideX = maxSlideX;
    } else {
        data.slideX = -rawX + minX;
    }
    if (rawY < minY) {
        data.slideY = 0;
    } else if (rawY > maxY) {
        data.slideY = maxSlideY;
    } else {
        data.slideY = -rawY + minY;
    }
    return data;
}
(function(e) {
    e._spritely = {
        instances: {},
        animate: function(t) {
            var n = e(t.el);
            var r = n.attr("id");
            if (!e._spritely.instances[r]) {
                return this
            }
            t = e.extend(t, e._spritely.instances[r] || {});
            if (t.type == "sprite" && t.fps) {
                if (t.play_frames && !e._spritely.instances[r]["remaining_frames"]) {
                    e._spritely.instances[r]["remaining_frames"] = t.play_frames + 1
                } else if (t.do_once && !e._spritely.instances[r]["remaining_frames"]) {
                    e._spritely.instances[r]["remaining_frames"] = t.no_of_frames
                }
                var i;
                var s = function(n) {
                    var s = t.width
                      , o = t.height;
                    if (!i) {
                        i = [];
                        total = 0;
                        for (var u = 0; u < t.no_of_frames; u++) {
                            i[i.length] = 0 - total;
                            total += s
                        }
                    }
                    if (e._spritely.instances[r]["current_frame"] == 0) {
                        if (t.on_first_frame) {
                            t.on_first_frame(n)
                        }
                    } else if (e._spritely.instances[r]["current_frame"] == i.length - 1) {
                        if (t.on_last_frame) {
                            t.on_last_frame(n)
                        }
                    }
                    if (t.on_frame && t.on_frame[e._spritely.instances[r]["current_frame"]]) {
                        t.on_frame[e._spritely.instances[r]["current_frame"]](n)
                    }
                    if (t.rewind == true) {
                        if (e._spritely.instances[r]["current_frame"] <= 0) {
                            e._spritely.instances[r]["current_frame"] = i.length - 1
                        } else {
                            e._spritely.instances[r]["current_frame"] = e._spritely.instances[r]["current_frame"] - 1
                        }
                    } else {
                        if (e._spritely.instances[r]["current_frame"] >= i.length - 1) {
                            e._spritely.instances[r]["current_frame"] = 0
                        } else {
                            e._spritely.instances[r]["current_frame"] = e._spritely.instances[r]["current_frame"] + 1
                        }
                    }
                    var a = e._spritely.getBgY(n);
                    n.css("background-position", i[e._spritely.instances[r]["current_frame"]] + "px " + a);
                    if (t.bounce && t.bounce[0] > 0 && t.bounce[1] > 0) {
                        var f = t.bounce[0];
                        var l = t.bounce[1];
                        var c = t.bounce[2];
                        n.animate({
                            top: "+=" + f + "px",
                            left: "-=" + l + "px"
                        }, c).animate({
                            top: "-=" + f + "px",
                            left: "+=" + l + "px"
                        }, c)
                    }
                };
                if (e._spritely.instances[r]["remaining_frames"] && e._spritely.instances[r]["remaining_frames"] > 0) {
                    e._spritely.instances[r]["remaining_frames"]--;
                    if (e._spritely.instances[r]["remaining_frames"] == 0) {
                        e._spritely.instances[r]["remaining_frames"] = -1;
                        delete e._spritely.instances[r]["remaining_frames"];
                        return this
                    } else {
                        s(n)
                    }
                } else if (e._spritely.instances[r]["remaining_frames"] != -1) {
                    s(n)
                }
            } else if (t.type == "pan") {
                if (!e._spritely.instances[r]["_stopped"]) {
                    var o = t.speed || 1
                      , u = e._spritely.instances[r]["l"] || parseInt(e._spritely.getBgX(n).replace("px", ""), 10) || 0
                      , a = e._spritely.instances[r]["t"] || parseInt(e._spritely.getBgY(n).replace("px", ""), 10) || 0;
                    if (t.do_once && !e._spritely.instances[r].remaining_frames || e._spritely.instances[r].remaining_frames <= 0) {
                        switch (t.dir) {
                        case "up":
                        case "down":
                            e._spritely.instances[r].remaining_frames = Math.floor((t.img_height || 0) / o);
                            break;
                        case "left":
                        case "right":
                            e._spritely.instances[r].remaining_frames = Math.floor((t.img_width || 0) / o);
                            break
                        }
                        e._spritely.instances[r].remaining_frames++
                    } else if (t.do_once) {
                        e._spritely.instances[r].remaining_frames--
                    }
                    switch (t.dir) {
                    case "up":
                        o *= -1;
                    case "down":
                        if (!e._spritely.instances[r]["l"])
                            e._spritely.instances[r]["l"] = u;
                        e._spritely.instances[r]["t"] = a + o;
                        if (t.img_height)
                            e._spritely.instances[r]["t"] %= t.img_height;
                        break;
                    case "left":
                        o *= -1;
                    case "right":
                        if (!e._spritely.instances[r]["t"])
                            e._spritely.instances[r]["t"] = a;
                        e._spritely.instances[r]["l"] = u + o;
                        if (t.img_width)
                            e._spritely.instances[r]["l"] %= t.img_width;
                        break
                    }
                    var f = e._spritely.instances[r]["l"].toString();
                    if (f.indexOf("%") == -1) {
                        f += "px "
                    } else {
                        f += " "
                    }
                    var l = e._spritely.instances[r]["t"].toString();
                    if (l.indexOf("%") == -1) {
                        l += "px "
                    } else {
                        l += " "
                    }
                    e(n).css("background-position", f + l);
                    if (t.do_once && !e._spritely.instances[r].remaining_frames) {
                        return this
                    }
                }
            }
            e._spritely.instances[r]["options"] = t;
            e._spritely.instances[r]["timeout"] = window.setTimeout(function() {
                e._spritely.animate(t)
            }, parseInt(1e3 / t.fps))
        },
        randomIntBetween: function(e, t) {
            return parseInt(rand_no = Math.floor((t - (e - 1)) * Math.random()) + e)
        },
        getBgUseXY: function() {
            try {
                return typeof e("body").css("background-position-x") == "string"
            } catch (t) {
                return false
            }
        }(),
        getBgY: function(t) {
            if (e._spritely.getBgUseXY) {
                return e(t).css("background-position-y") || "0"
            } else {
                return (e(t).css("background-position") || " ").split(" ")[1]
            }
        },
        getBgX: function(t) {
            if (e._spritely.getBgUseXY) {
                return e(t).css("background-position-x") || "0"
            } else {
                return (e(t).css("background-position") || " ").split(" ")[0]
            }
        },
        get_rel_pos: function(e, t) {
            var n = e;
            if (e < 0) {
                while (n < 0) {
                    n += t
                }
            } else {
                while (n > t) {
                    n -= t
                }
            }
            return n
        },
        _spStrip: function(e, t) {
            while (e.length) {
                var n, r, i = false, s = false;
                for (n = 0; n < t.length; n++) {
                    var o = e.slice(0, 1);
                    r = e.slice(1);
                    if (t.indexOf(o) > -1)
                        e = r;
                    else
                        i = true
                }
                for (n = 0; n < t.length; n++) {
                    var u = e.slice(-1);
                    r = e.slice(0, -1);
                    if (t.indexOf(u) > -1)
                        e = r;
                    else
                        s = true
                }
                if (i && s)
                    return e
            }
            return ""
        }
    };
    e.fn.extend({
        spritely: function(t) {
            var n = e(this)
              , r = n.attr("id")
              , t = e.extend({
                type: "sprite",
                do_once: false,
                width: null,
                height: null,
                img_width: 0,
                img_height: 0,
                fps: 12,
                no_of_frames: 2,
                play_frames: 0
            }, t || {})
              , i = new Image
              , s = e._spritely._spStrip(n.css("background-image") || "", 'url("); ');
            if (!e._spritely.instances[r]) {
                if (t.start_at_frame) {
                    e._spritely.instances[r] = {
                        current_frame: t.start_at_frame - 1
                    }
                } else {
                    e._spritely.instances[r] = {
                        current_frame: -1
                    }
                }
            }
            e._spritely.instances[r]["type"] = t.type;
            e._spritely.instances[r]["depth"] = t.depth;
            t.el = n;
            t.width = t.width || n.width() || 100;
            t.height = t.height || n.height() || 100;
            i.onload = function() {
                t.img_width = i.width;
                t.img_height = i.height;
                t.img = i;
                var n = function() {
                    return parseInt(1e3 / t.fps)
                };
                if (!t.do_once) {
                    setTimeout(function() {
                        e._spritely.animate(t)
                    }, n(t.fps))
                } else {
                    setTimeout(function() {
                        e._spritely.animate(t)
                    }, 0)
                }
            }
            ;
            i.src = s;
            return this
        },
        sprite: function(t) {
            var t = e.extend({
                type: "sprite",
                bounce: [0, 0, 1e3]
            }, t || {});
            return e(this).spritely(t)
        },
        pan: function(t) {
            var t = e.extend({
                type: "pan",
                dir: "left",
                continuous: true,
                speed: 1
            }, t || {});
            return e(this).spritely(t)
        },
        flyToTap: function(t) {
            var t = e.extend({
                el_to_move: null,
                type: "moveToTap",
                ms: 1e3,
                do_once: true
            }, t || {});
            if (t.el_to_move) {
                e(t.el_to_move).active()
            }
            if (e._spritely.activeSprite) {
                if (window.Touch) {
                    e(this)[0].ontouchstart = function(t) {
                        var n = e._spritely.activeSprite;
                        var r = t.touches[0];
                        var i = r.pageY - n.height() / 2;
                        var s = r.pageX - n.width() / 2;
                        n.animate({
                            top: i + "px",
                            left: s + "px"
                        }, 1e3)
                    }
                } else {
                    e(this).click(function(t) {
                        var n = e._spritely.activeSprite;
                        e(n).stop(true);
                        var r = n.width();
                        var i = n.height();
                        var s = t.pageX - r / 2;
                        var o = t.pageY - i / 2;
                        n.animate({
                            top: o + "px",
                            left: s + "px"
                        }, 1e3)
                    })
                }
            }
            return this
        },
        isDraggable: function(t) {
            if (!e(this).draggable) {
                return this
            }
            var t = e.extend({
                type: "isDraggable",
                start: null,
                stop: null,
                drag: null
            }, t || {});
            var n = e(this).attr("id");
            if (!e._spritely.instances[n]) {
                return this
            }
            e._spritely.instances[n].isDraggableOptions = t;
            e(this).draggable({
                start: function() {
                    var t = e(this).attr("id");
                    e._spritely.instances[t].stop_random = true;
                    e(this).stop(true);
                    if (e._spritely.instances[t].isDraggableOptions.start) {
                        e._spritely.instances[t].isDraggableOptions.start(this)
                    }
                },
                drag: t.drag,
                stop: function() {
                    var t = e(this).attr("id");
                    e._spritely.instances[t].stop_random = false;
                    if (e._spritely.instances[t].isDraggableOptions.stop) {
                        e._spritely.instances[t].isDraggableOptions.stop(this)
                    }
                }
            });
            return this
        },
        active: function() {
            e._spritely.activeSprite = this;
            return this
        },
        activeOnClick: function() {
            var t = e(this);
            if (window.Touch) {
                t[0].ontouchstart = function(n) {
                    e._spritely.activeSprite = t
                }
            } else {
                t.click(function(n) {
                    e._spritely.activeSprite = t
                })
            }
            return this
        },
        spRandom: function(t) {
            var t = e.extend({
                top: 50,
                left: 50,
                right: 290,
                bottom: 320,
                speed: 4e3,
                pause: 0
            }, t || {});
            var n = e(this).attr("id");
            if (!e._spritely.instances[n]) {
                return this
            }
            if (!e._spritely.instances[n].stop_random) {
                var r = e._spritely.randomIntBetween;
                var i = r(t.top, t.bottom);
                var s = r(t.left, t.right);
                e("#" + n).animate({
                    top: i + "px",
                    left: s + "px"
                }, t.speed)
            }
            window.setTimeout(function() {
                e("#" + n).spRandom(t)
            }, t.speed + t.pause);
            return this
        },
        makeAbsolute: function() {
            return this.each(function() {
                var t = e(this);
                var n = t.position();
                t.css({
                    position: "absolute",
                    marginLeft: 0,
                    marginTop: 0,
                    top: n.top,
                    left: n.left
                }).remove().appendTo("body")
            })
        },
        spSet: function(t, n) {
            var r = e(this).attr("id");
            e._spritely.instances[r][t] = n;
            return this
        },
        spGet: function(t, n) {
            var r = e(this).attr("id");
            return e._spritely.instances[r][t]
        },
        spStop: function(t) {
            this.each(function() {
                var n = e(this)
                  , r = n.attr("id");
                if (e._spritely.instances[r]["options"]["fps"]) {
                    e._spritely.instances[r]["_last_fps"] = e._spritely.instances[r]["options"]["fps"]
                }
                if (e._spritely.instances[r]["type"] == "sprite") {
                    n.spSet("fps", 0)
                }
                e._spritely.instances[r]["_stopped"] = true;
                e._spritely.instances[r]["_stopped_f1"] = t;
                if (t) {
                    var i = e._spritely.getBgY(e(this));
                    n.css("background-position", "0 " + i)
                }
            });
            return this
        },
        spStart: function() {
            e(this).each(function() {
                var t = e(this).attr("id");
                var n = e._spritely.instances[t]["_last_fps"] || 12;
                if (e._spritely.instances[t]["type"] == "sprite") {
                    e(this).spSet("fps", n)
                }
                e._spritely.instances[t]["_stopped"] = false
            });
            return this
        },
        spToggle: function() {
            var t = e(this).attr("id");
            var n = e._spritely.instances[t]["_stopped"] || false;
            var r = e._spritely.instances[t]["_stopped_f1"] || false;
            if (n) {
                e(this).spStart()
            } else {
                e(this).spStop(r)
            }
            return this
        },
        fps: function(t) {
            e(this).each(function() {
                e(this).spSet("fps", t)
            });
            return this
        },
        goToFrame: function(t) {
            var n = e(this).attr("id");
            if (e._spritely.instances && e._spritely.instances[n]) {
                e._spritely.instances[n]["current_frame"] = t - 1
            }
            return this
        },
        spSpeed: function(t) {
            e(this).each(function() {
                e(this).spSet("speed", t)
            });
            return this
        },
        spRelSpeed: function(t) {
            e(this).each(function() {
                var n = e(this).spGet("depth") / 100;
                e(this).spSet("speed", t * n)
            });
            return this
        },
        spChangeDir: function(t) {
            e(this).each(function() {
                e(this).spSet("dir", t)
            });
            return this
        },
        spState: function(t) {
            e(this).each(function() {
                var r = (t - 1) * e(this).height() + "px";
                var i = e._spritely.getBgX(e(this));
                var s = i + " -" + r;
                e(this).css("background-position", s)
            });
            return this
        },
        lockTo: function(t, n) {
            e(this).each(function() {
                var r = e(this).attr("id");
                if (!e._spritely.instances[r]) {
                    return this
                }
                e._spritely.instances[r]["locked_el"] = e(this);
                e._spritely.instances[r]["lock_to"] = e(t);
                e._spritely.instances[r]["lock_to_options"] = n;
                e._spritely.instances[r]["interval"] = window.setInterval(function() {
                    if (e._spritely.instances[r]["lock_to"]) {
                        var t = e._spritely.instances[r]["locked_el"];
                        var n = e._spritely.instances[r]["lock_to"];
                        var i = e._spritely.instances[r]["lock_to_options"];
                        var s = i.bg_img_width;
                        var o = n.height();
                        var u = e._spritely.getBgY(n);
                        var a = e._spritely.getBgX(n);
                        var f = parseInt(a) + parseInt(i["left"]);
                        var l = parseInt(u) + parseInt(i["top"]);
                        f = e._spritely.get_rel_pos(f, s);
                        e(t).css({
                            top: l + "px",
                            left: f + "px"
                        })
                    }
                }, n.interval || 20)
            });
            return this
        },
        destroy: function() {
            var t = e(this);
            var n = e(this).attr("id");
            if (e._spritely.instances[n] && e._spritely.instances[n]["timeout"]) {
                window.clearTimeout(e._spritely.instances[n]["timeout"])
            }
            if (e._spritely.instances[n] && e._spritely.instances[n]["interval"]) {
                window.clearInterval(e._spritely.instances[n]["interval"])
            }
            delete e._spritely.instances[n];
            return this
        }
    })
}
)(jQuery);
try {
    document.execCommand("BackgroundImageCache", false, true)
} catch (err) {}
var activeID = 0;
var init = false;
$(function() {
    initHotspots();
});
function initIndividualLessonLG(lesson) {
    lesson.find('.lgcanvas div.hs').click(function() {
        hsClick($(this));
    }).each(function() {
        $(this).sprite({
            fps: 30,
            no_of_frames: 71
        });
    });
}
function initHotspots() {
    var lgcanvas = $('.lgcanvas div.hs').click(function() {
        hsClick($(this));
    }).each(function() {
        $(this).sprite({
            fps: 30,
            no_of_frames: 71
        });
    });
}
function hsClick(hs) {
    if (activeID > 0) {
        var currhs = $('#' + 'hs_' + activeID);
        $('#' + 'pu_' + activeID).fadeOut(200, function() {
            currhs.css('z-index', '99');
        });
        currhs.spState(3).goToFrame(0).spStart().spSet('on_frame', {
            10: function(obj) {
                obj.spStop().spSet('rewind', true);
            }
        });
    }
    var hsID = hs.attr('id').split('_')[1];
    if (activeID != hsID) {
        activeID = hsID;
        var pu = $('#' + 'pu_' + activeID).fadeIn(400);
        if (!hs.data('clicked'))
            hs.css('z-index', '101').goToFrame(0).spState(2).spSet('on_frame', {
                10: function(obj) {
                    obj.spStop();
                }
            }).data('clicked', true);
        else
            hs.css('z-index', '101').spStart().spSet('on_frame', {
                1: function(obj) {
                    obj.spStop().spSet('rewind', false);
                }
            });
    } else
        activeID = 0;
}
$(function() {
    var prev, curr = "";
    var initHeight = 0;
    $(document).on({
        mouseenter: function() {
            initHeight = $(this).height();
            prev = $(this).html();
            curr = $(this).attr('data-translation');
            $(this).html(curr);
            if ($(this).height() < initHeight) {
                $(this).css("height", initHeight);
            }
        },
        mouseleave: function() {
            $(this).html(prev);
        }
    }, ".languageRollover");
});
function playAudio(audio) {
    var soundFile = new Audio(audio);
    soundFile.play();
}
/*! iFrame Resizer (iframeSizer.min.js ) - v3.5.5 - 2016-06-16
* Desc: Force cross domain iframes to size to content.
* Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
* Copyright: (c) 2016 David J. Bradshaw - dave@bradshaw.net
* License: MIT
*/
!function(a) {
    "use strict";
    function b(b, c, d) {
        "addEventListener"in a ? b.addEventListener(c, d, !1) : "attachEvent"in a && b.attachEvent("on" + c, d)
    }
    function c(b, c, d) {
        "removeEventListener"in a ? b.removeEventListener(c, d, !1) : "detachEvent"in a && b.detachEvent("on" + c, d)
    }
    function d() {
        var b, c = ["moz", "webkit", "o", "ms"];
        for (b = 0; b < c.length && !N; b += 1)
            N = a[c[b] + "RequestAnimationFrame"];
        N || h("setup", "RequestAnimationFrame not supported")
    }
    function e(b) {
        var c = "Host page: " + b;
        return a.top !== a.self && (c = a.parentIFrame && a.parentIFrame.getId ? a.parentIFrame.getId() + ": " + b : "Nested host page: " + b),
        c
    }
    function f(a) {
        return K + "[" + e(a) + "]"
    }
    function g(a) {
        return P[a] ? P[a].log : G
    }
    function h(a, b) {
        k("log", a, b, g(a))
    }
    function i(a, b) {
        k("info", a, b, g(a))
    }
    function j(a, b) {
        k("warn", a, b, !0)
    }
    function k(b, c, d, e) {
        !0 === e && "object" == typeof a.console && console[b](f(c), d)
    }
    function l(d) {
        function e() {
            function a() {
                s(V),
                p(W)
            }
            g("Height"),
            g("Width"),
            t(a, V, "init")
        }
        function f() {
            var a = U.substr(L).split(":");
            return {
                iframe: P[a[0]].iframe,
                id: a[0],
                height: a[1],
                width: a[2],
                type: a[3]
            }
        }
        function g(a) {
            var b = Number(P[W]["max" + a])
              , c = Number(P[W]["min" + a])
              , d = a.toLowerCase()
              , e = Number(V[d]);
            h(W, "Checking " + d + " is in range " + c + "-" + b),
            c > e && (e = c,
            h(W, "Set " + d + " to min value")),
            e > b && (e = b,
            h(W, "Set " + d + " to max value")),
            V[d] = "" + e
        }
        function k() {
            function a() {
                function a() {
                    var a = 0
                      , d = !1;
                    for (h(W, "Checking connection is from allowed list of origins: " + c); a < c.length; a++)
                        if (c[a] === b) {
                            d = !0;
                            break
                        }
                    return d
                }
                function d() {
                    var a = P[W].remoteHost;
                    return h(W, "Checking connection is from: " + a),
                    b === a
                }
                return c.constructor === Array ? a() : d()
            }
            var b = d.origin
              , c = P[W].checkOrigin;
            if (c && "" + b != "null" && !a())
                throw new Error("Unexpected message received from: " + b + " for " + V.iframe.id + ". Message was: " + d.data + ". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");
            return !0
        }
        function l() {
            return K === ("" + U).substr(0, L) && U.substr(L).split(":")[0]in P
        }
        function w() {
            var a = V.type in {
                "true": 1,
                "false": 1,
                undefined: 1
            };
            return a && h(W, "Ignoring init message from meta parent page"),
            a
        }
        function y(a) {
            return U.substr(U.indexOf(":") + J + a)
        }
        function z(a) {
            h(W, "MessageCallback passed: {iframe: " + V.iframe.id + ", message: " + a + "}"),
            N("messageCallback", {
                iframe: V.iframe,
                message: JSON.parse(a)
            }),
            h(W, "--")
        }
        function A() {
            var b = document.body.getBoundingClientRect()
              , c = V.iframe.getBoundingClientRect();
            return JSON.stringify({
                iframeHeight: c.height,
                iframeWidth: c.width,
                clientHeight: Math.max(document.documentElement.clientHeight, a.innerHeight || 0),
                clientWidth: Math.max(document.documentElement.clientWidth, a.innerWidth || 0),
                offsetTop: parseInt(c.top - b.top, 10),
                offsetLeft: parseInt(c.left - b.left, 10),
                scrollTop: a.pageYOffset,
                scrollLeft: a.pageXOffset
            })
        }
        function B(a, b) {
            function c() {
                u("Send Page Info", "pageInfo:" + A(), a, b)
            }
            x(c, 32)
        }
        function C() {
            function d(b, c) {
                function d() {
                    P[g] ? B(P[g].iframe, g) : e()
                }
                ["scroll", "resize"].forEach(function(e) {
                    h(g, b + e + " listener for sendPageInfo"),
                    c(a, e, d)
                })
            }
            function e() {
                d("Remove ", c)
            }
            function f() {
                d("Add ", b)
            }
            var g = W;
            f(),
            P[g].stopPageInfo = e
        }
        function D() {
            P[W] && P[W].stopPageInfo && (P[W].stopPageInfo(),
            delete P[W].stopPageInfo)
        }
        function E() {
            var a = !0;
            return null === V.iframe && (j(W, "IFrame (" + V.id + ") not found"),
            a = !1),
            a
        }
        function F(a) {
            var b = a.getBoundingClientRect();
            return o(W),
            {
                x: Math.floor(Number(b.left) + Number(M.x)),
                y: Math.floor(Number(b.top) + Number(M.y))
            }
        }
        function G(b) {
            function c() {
                M = g,
                H(),
                h(W, "--")
            }
            function d() {
                return {
                    x: Number(V.width) + f.x,
                    y: Number(V.height) + f.y
                }
            }
            function e() {
                a.parentIFrame ? a.parentIFrame["scrollTo" + (b ? "Offset" : "")](g.x, g.y) : j(W, "Unable to scroll to requested position, window.parentIFrame not found")
            }
            var f = b ? F(V.iframe) : {
                x: 0,
                y: 0
            }
              , g = d();
            h(W, "Reposition requested from iFrame (offset x:" + f.x + " y:" + f.y + ")"),
            a.top !== a.self ? e() : c()
        }
        function H() {
            !1 !== N("scrollCallback", M) ? p(W) : q()
        }
        function I(b) {
            function c() {
                var a = F(g);
                h(W, "Moving to in page link (#" + e + ") at x: " + a.x + " y: " + a.y),
                M = {
                    x: a.x,
                    y: a.y
                },
                H(),
                h(W, "--")
            }
            function d() {
                a.parentIFrame ? a.parentIFrame.moveToAnchor(e) : h(W, "In page link #" + e + " not found and window.parentIFrame not found")
            }
            var e = b.split("#")[1] || ""
              , f = decodeURIComponent(e)
              , g = document.getElementById(f) || document.getElementsByName(f)[0];
            g ? c() : a.top !== a.self ? d() : h(W, "In page link #" + e + " not found")
        }
        function N(a, b) {
            return m(W, a, b)
        }
        function O() {
            switch (P[W].firstRun && T(),
            V.type) {
            case "close":
                n(V.iframe);
                break;
            case "message":
                z(y(6));
                break;
            case "scrollTo":
                G(!1);
                break;
            case "scrollToOffset":
                G(!0);
                break;
            case "pageInfo":
                B(P[W].iframe, W),
                C();
                break;
            case "pageInfoStop":
                D();
                break;
            case "inPageLink":
                I(y(9));
                break;
            case "reset":
                r(V);
                break;
            case "init":
                e(),
                N("initCallback", V.iframe),
                N("resizedCallback", V);
                break;
            default:
                e(),
                N("resizedCallback", V)
            }
        }
        function Q(a) {
            var b = !0;
            return P[a] || (b = !1,
            j(V.type + " No settings for " + a + ". Message was: " + U)),
            b
        }
        function S() {
            for (var a in P)
                u("iFrame requested init", v(a), document.getElementById(a), a)
        }
        function T() {
            P[W].firstRun = !1
        }
        var U = d.data
          , V = {}
          , W = null;
        "[iFrameResizerChild]Ready" === U ? S() : l() ? (V = f(),
        W = R = V.id,
        !w() && Q(W) && (h(W, "Received: " + U),
        E() && k() && O())) : i(W, "Ignored: " + U)
    }
    function m(a, b, c) {
        var d = null
          , e = null;
        if (P[a]) {
            if (d = P[a][b],
            "function" != typeof d)
                throw new TypeError(b + " on iFrame[" + a + "] is not a function");
            e = d(c)
        }
        return e
    }
    function n(a) {
        var b = a.id;
        h(b, "Removing iFrame: " + b),
        a.parentNode.removeChild(a),
        m(b, "closedCallback", b),
        h(b, "--"),
        delete P[b]
    }
    function o(b) {
        null === M && (M = {
            x: void 0 !== a.pageXOffset ? a.pageXOffset : document.documentElement.scrollLeft,
            y: void 0 !== a.pageYOffset ? a.pageYOffset : document.documentElement.scrollTop
        },
        h(b, "Get page position: " + M.x + "," + M.y))
    }
    function p(b) {
        null !== M && (a.scrollTo(M.x, M.y),
        h(b, "Set page position: " + M.x + "," + M.y),
        q())
    }
    function q() {
        M = null
    }
    function r(a) {
        function b() {
            s(a),
            u("reset", "reset", a.iframe, a.id)
        }
        h(a.id, "Size reset requested by " + ("init" === a.type ? "host page" : "iFrame")),
        o(a.id),
        t(b, a, "reset")
    }
    function s(a) {
        function b(b) {
            a.iframe.style[b] = a[b] + "px",
            h(a.id, "IFrame (" + e + ") " + b + " set to " + a[b] + "px")
        }
        function c(b) {
            H || "0" !== a[b] || (H = !0,
            h(e, "Hidden iFrame detected, creating visibility listener"),
            y())
        }
        function d(a) {
            b(a),
            c(a)
        }
        var e = a.iframe.id;
        P[e] && (P[e].sizeHeight && d("height"),
        P[e].sizeWidth && d("width"))
    }
    function t(a, b, c) {
        c !== b.type && N ? (h(b.id, "Requesting animation frame"),
        N(a)) : a()
    }
    function u(a, b, c, d) {
        function e() {
            var e = P[d].targetOrigin;
            h(d, "[" + a + "] Sending msg to iframe[" + d + "] (" + b + ") targetOrigin: " + e),
            c.contentWindow.postMessage(K + b, e)
        }
        function f() {
            i(d, "[" + a + "] IFrame(" + d + ") not found"),
            P[d] && delete P[d]
        }
        function g() {
            c && "contentWindow"in c && null !== c.contentWindow ? e() : f()
        }
        d = d || c.id,
        P[d] && g()
    }
    function v(a) {
        return a + ":" + P[a].bodyMarginV1 + ":" + P[a].sizeWidth + ":" + P[a].log + ":" + P[a].interval + ":" + P[a].enablePublicMethods + ":" + P[a].autoResize + ":" + P[a].bodyMargin + ":" + P[a].heightCalculationMethod + ":" + P[a].bodyBackground + ":" + P[a].bodyPadding + ":" + P[a].tolerance + ":" + P[a].inPageLinks + ":" + P[a].resizeFrom + ":" + P[a].widthCalculationMethod
    }
    function w(a, c) {
        function d() {
            function b(b) {
                1 / 0 !== P[w][b] && 0 !== P[w][b] && (a.style[b] = P[w][b] + "px",
                h(w, "Set " + b + " = " + P[w][b] + "px"))
            }
            function c(a) {
                if (P[w]["min" + a] > P[w]["max" + a])
                    throw new Error("Value for min" + a + " can not be greater than max" + a)
            }
            c("Height"),
            c("Width"),
            b("maxHeight"),
            b("minHeight"),
            b("maxWidth"),
            b("minWidth")
        }
        function e() {
            var a = c && c.id || S.id + F++;
            return null !== document.getElementById(a) && (a += F++),
            a
        }
        function f(b) {
            return R = b,
            "" === b && (a.id = b = e(),
            G = (c || {}).log,
            R = b,
            h(b, "Added missing iframe ID: " + b + " (" + a.src + ")")),
            b
        }
        function g() {
            h(w, "IFrame scrolling " + (P[w].scrolling ? "enabled" : "disabled") + " for " + w),
            a.style.overflow = !1 === P[w].scrolling ? "hidden" : "auto",
            a.scrolling = !1 === P[w].scrolling ? "no" : "yes"
        }
        function i() {
            ("number" == typeof P[w].bodyMargin || "0" === P[w].bodyMargin) && (P[w].bodyMarginV1 = P[w].bodyMargin,
            P[w].bodyMargin = "" + P[w].bodyMargin + "px")
        }
        function k() {
            var b = P[w].firstRun
              , c = P[w].heightCalculationMethod in O;
            !b && c && r({
                iframe: a,
                height: 0,
                width: 0,
                type: "init"
            })
        }
        function l() {
            Function.prototype.bind && (P[w].iframe.iFrameResizer = {
                close: n.bind(null, P[w].iframe),
                resize: u.bind(null, "Window resize", "resize", P[w].iframe),
                moveToAnchor: function(a) {
                    u("Move to anchor", "moveToAnchor:" + a, P[w].iframe, w)
                },
                sendMessage: function(a) {
                    a = JSON.stringify(a),
                    u("Send Message", "message:" + a, P[w].iframe, w)
                }
            })
        }
        function m(c) {
            function d() {
                u("iFrame.onload", c, a),
                k()
            }
            b(a, "load", d),
            u("init", c, a)
        }
        function o(a) {
            if ("object" != typeof a)
                throw new TypeError("Options is not an object")
        }
        function p(a) {
            for (var b in S)
                S.hasOwnProperty(b) && (P[w][b] = a.hasOwnProperty(b) ? a[b] : S[b])
        }
        function q(a) {
            return "" === a || "file://" === a ? "*" : a
        }
        function s(b) {
            b = b || {},
            P[w] = {
                firstRun: !0,
                iframe: a,
                remoteHost: a.src.split("/").slice(0, 3).join("/")
            },
            o(b),
            p(b),
            P[w].targetOrigin = !0 === P[w].checkOrigin ? q(P[w].remoteHost) : "*"
        }
        function t() {
            return w in P && "iFrameResizer"in a
        }
        var w = f(a.id);
        t() ? j(w, "Ignored iFrame, already setup.") : (s(c),
        g(),
        d(),
        i(),
        m(v(w)),
        l())
    }
    function x(a, b) {
        null === Q && (Q = setTimeout(function() {
            Q = null,
            a()
        }, b))
    }
    function y() {
        function b() {
            function a(a) {
                function b(b) {
                    return "0px" === P[a].iframe.style[b]
                }
                function c(a) {
                    return null !== a.offsetParent
                }
                c(P[a].iframe) && (b("height") || b("width")) && u("Visibility change", "resize", P[a].iframe, a)
            }
            for (var b in P)
                a(b)
        }
        function c(a) {
            h("window", "Mutation observed: " + a[0].target + " " + a[0].type),
            x(b, 16)
        }
        function d() {
            var a = document.querySelector("body")
              , b = {
                attributes: !0,
                attributeOldValue: !1,
                characterData: !0,
                characterDataOldValue: !1,
                childList: !0,
                subtree: !0
            }
              , d = new e(c);
            d.observe(a, b)
        }
        var e = a.MutationObserver || a.WebKitMutationObserver;
        e && d()
    }
    function z(a) {
        function b() {
            B("Window " + a, "resize")
        }
        h("window", "Trigger event: " + a),
        x(b, 16)
    }
    function A() {
        function a() {
            B("Tab Visable", "resize")
        }
        "hidden" !== document.visibilityState && (h("document", "Trigger event: Visiblity change"),
        x(a, 16))
    }
    function B(a, b) {
        function c(a) {
            return "parent" === P[a].resizeFrom && P[a].autoResize && !P[a].firstRun
        }
        for (var d in P)
            c(d) && u(a, b, document.getElementById(d), d)
    }
    function C() {
        b(a, "message", l),
        b(a, "resize", function() {
            z("resize")
        }),
        b(document, "visibilitychange", A),
        b(document, "-webkit-visibilitychange", A),
        b(a, "focusin", function() {
            z("focus")
        }),
        b(a, "focus", function() {
            z("focus")
        })
    }
    function D() {
        function a(a, c) {
            function d() {
                if (!c.tagName)
                    throw new TypeError("Object is not a valid DOM element");
                if ("IFRAME" !== c.tagName.toUpperCase())
                    throw new TypeError("Expected <IFRAME> tag, found <" + c.tagName + ">")
            }
            c && (d(),
            w(c, a),
            b.push(c))
        }
        var b;
        return d(),
        C(),
        function(c, d) {
            switch (b = [],
            typeof d) {
            case "undefined":
            case "string":
                Array.prototype.forEach.call(document.querySelectorAll(d || "iframe"), a.bind(void 0, c));
                break;
            case "object":
                a(c, d);
                break;
            default:
                throw new TypeError("Unexpected data type (" + typeof d + ")")
            }
            return b
        }
    }
    function E(a) {
        a.fn ? a.fn.iFrameResize = function(a) {
            function b(b, c) {
                w(c, a)
            }
            return this.filter("iframe").each(b).end()
        }
        : i("", "Unable to bind to jQuery, it is not fully loaded.")
    }
    var F = 0
      , G = !1
      , H = !1
      , I = "message"
      , J = I.length
      , K = "[iFrameSizer]"
      , L = K.length
      , M = null
      , N = a.requestAnimationFrame
      , O = {
        max: 1,
        scroll: 1,
        bodyScroll: 1,
        documentElementScroll: 1
    }
      , P = {}
      , Q = null
      , R = "Host Page"
      , S = {
        autoResize: !0,
        bodyBackground: null,
        bodyMargin: null,
        bodyMarginV1: 8,
        bodyPadding: null,
        checkOrigin: !0,
        inPageLinks: !1,
        enablePublicMethods: !0,
        heightCalculationMethod: "bodyOffset",
        id: "iFrameResizer",
        interval: 32,
        log: !1,
        maxHeight: 1 / 0,
        maxWidth: 1 / 0,
        minHeight: 0,
        minWidth: 0,
        resizeFrom: "parent",
        scrolling: !1,
        sizeHeight: !0,
        sizeWidth: !1,
        tolerance: 0,
        widthCalculationMethod: "scroll",
        closedCallback: function() {},
        initCallback: function() {},
        messageCallback: function() {
            j("MessageCallback function not defined")
        },
        resizedCallback: function() {},
        scrollCallback: function() {
            return !0
        }
    };
    a.jQuery && E(jQuery),
    "function" == typeof define && define.amd ? define([], D) : "object" == typeof module && "object" == typeof module.exports ? module.exports = D() : a.iFrameResize = a.iFrameResize || D()
}(window || {});
