    var root = document.querySelector(":root");
    var rootStyle = getComputedStyle(root);
    var remSizePx;
    
    var gridSizeVar = "--grid-size-px";
    var gridBaselinePx = parseFloat(rootStyle.getPropertyValue(gridSizeVar));
    var gridNewPx;
    
    var brandBlockEl = document.getElementById("brand-block");
    var brandHeightVar = "--brand-block-height";
    var brandWidthVar = "--brand-block-width";

    var navBlockEl = document.getElementById("nav-block");
    var navWidthVar = "--nav-block-width";
    var navHeightVar = "--nav-block-height";
    var navToggleBarEl = document.getElementById("nav-toggle-bar");
            var navHeightPx;

    var bannerWidthRef = parseFloat(rootStyle.getPropertyValue("--banner-width-ref"));
    var bannerHeightRef = parseFloat(rootStyle.getPropertyValue("--banner-height-ref"));
    var bannerHeaderClearanceRatio = parseFloat(rootStyle.getPropertyValue("--banner-header-clearance-ref")) / bannerHeightRef;
    var bannerOffsetVar = "--banner-offset-y";

    var posBeforeScroll = window.scrollY;
    

    // initiate handlers
    window.onload = resizeHandler;
    window.onresize = resizeHandler;
    window.onscroll = scrollHandler;


    // resize grid to align with viewport and resize header cells to align with grid
    function resizeHandler() {
        // calculate new grid size based on an even number of grids across viewport, and update the corresponding CSS variable
        var viewportWidthPx = window.innerWidth;
        var numGrids = Math.floor(viewportWidthPx / gridBaselinePx);
        if (numGrids % 2 != 0) { numGrids++ };
        gridNewPx = viewportWidthPx / numGrids;
        root.style.setProperty(gridSizeVar, gridNewPx + "px");
        
        // reset auto-sized elements
        root.style.setProperty(brandHeightVar, "auto");
        root.style.setProperty(brandWidthVar, "auto");
        root.style.setProperty(navHeightVar, "auto");
        root.style.setProperty(navWidthVar, "auto");
        
        // expand nav-block (if hidden) and collect auto-sized dimensions, then re-hide navbar and collect the collapsed nav-block height dimension
        navToggleBarEl.classList.add("show");
        var brandHeightBaselinePx = brandBlockEl.offsetHeight;
        var brandWidthBaselinePx = brandBlockEl.offsetWidth;
        var navWidthBaselinePx = navBlockEl.offsetWidth;
        navToggleBarEl.classList.remove("show");
        var navHeightBaselinePx = navBlockEl.offsetHeight;
        
        // adjust CSS variables for sizing of navbar elements to align with gridlines
        remSizePx = parseFloat(rootStyle.getPropertyValue("font-size"));
        setSizeForGridAlignment(brandHeightBaselinePx, brandHeightVar);
        setSizeForGridAlignment(brandWidthBaselinePx, brandWidthVar);
        navHeightPx = setSizeForGridAlignment(navHeightBaselinePx, navHeightVar);
        setSizeForGridAlignment(navWidthBaselinePx, navWidthVar);


        // measure required offset for banner and set corresponding CSS variable
        var bannerHeightPx = Math.min(bannerHeightRef, viewportWidthPx / bannerWidthRef * bannerHeightRef);
        var bannerOffsetPx = Math.max(brandBlockEl.offsetHeight, navHeightPx) - (bannerHeightPx * bannerHeaderClearanceRatio);
        bannerOffsetPx = Math.max(0, bannerOffsetPx)
        root.style.setProperty(bannerOffsetVar, bannerOffsetPx + "px"); 

    }

    function setSizeForGridAlignment(sizeBaselinePx, sizeVar) {
        // calculate new size based on rounding baseline up to next gridline, and update the corresponding CSS variable
        var sizeNewGrids = Math.ceil(++sizeBaselinePx / gridNewPx);

        var sizeNewRem = sizeNewGrids * gridNewPx / remSizePx + "rem";
        root.style.setProperty(sizeVar, sizeNewRem);

return sizeNewGrids * gridNewPx
    }

    function scrollHandler() {
        var posAfterScroll = window.scrollY;
        if (posAfterScroll == 0) {
            // reset at top
            navBlockEl.classList.remove("active");
            navBlockEl.classList.remove("hidden");
        } else if (posAfterScroll > navHeightPx) {
            // if scrolling below header height
            if (posBeforeScroll < posAfterScroll) {  
                // if scrolling down, hide curtain and collapse navbar (if needed)
                navBlockEl.classList.add("hidden");
                if (navToggleBarEl.classList.contains("show")) {
                    navToggleBarEl.classList.add("collapsing");
                    navToggleBarEl.classList.remove("show");
                    navToggleBarEl.classList.remove("collapse");
                    setTimeout(() => {
                        navToggleBarEl.classList.remove("collapsing");
                        navToggleBarEl.classList.add("collapse");
                    }, "350");
                }
            } else {
            // if scrolling up, activate curtain and unhide it
                navBlockEl.classList.add("active");
                navBlockEl.classList.remove("hidden");
            }
        }
        posBeforeScroll = posAfterScroll;
    }
