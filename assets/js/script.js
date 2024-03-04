    var root = document.querySelector(":root");
    var rootStyle = getComputedStyle(root);
    var remSizePx;
    
    var gridSizeVar = "--grid-size-px";
    var gridBaselinePx = parseFloat(rootStyle.getPropertyValue(gridSizeVar));
    var gridNewPx;
    
    var h1El = document.querySelector("h1");
    var h1HeightVar = "--h1-cell-height";
    var h1WidthVar = "--h1-cell-width";

    var navCellResizerEl = document.getElementById("nav-cell-resizer");
    var navCellHeightVar = "--nav-cell-height";
    var navToggledWidthVar = "--nav-toggled-width";
    var navGroupResizerEl = document.getElementById("nav-group-resizer");
    var navGroupWidthVar = "--nav-group-width";
    
    var navBarEl = document.querySelector(".navbar");
    var navBarHeightVar = "--navbar-height";
    var navBarCollapseEl = document.querySelector(".navbar-collapse");
    var navBarHeightPx;

    var bannerWidthMaxPx = parseFloat(rootStyle.getPropertyValue("--banner-width-max-px"));
    var bannerHeightMaxPx = parseFloat(rootStyle.getPropertyValue("--banner-height-max-px"));
    var bannerClearanceRatio = parseFloat(rootStyle.getPropertyValue("--banner-clearance-ref-px")) / bannerHeightMaxPx;
    var bannerOffsetVar = "--banner-offset-y";
    var parallaxSpacerVar = "--parallax-spacer";

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
        root.style.setProperty(h1HeightVar, "auto");
        root.style.setProperty(h1WidthVar, "auto");
        root.style.setProperty(navCellHeightVar, "auto");
        root.style.setProperty(navToggledWidthVar, "auto");
        root.style.setProperty(navGroupWidthVar, "auto");
        
        // show navbar (if hidden), collect auto-sized dimensions, then re-hide navbar
        navBarCollapseEl.classList.add("show");
        var h1HeightBaselinePx = h1El.offsetHeight;
        var h1WidthBaselinePx = h1El.offsetWidth;
        var navCellHeightBaselinePx = navCellResizerEl.offsetHeight;
        var navToggledWidthBaselinePx = navCellResizerEl.offsetWidth;
        var navGroupWidthBaselinePx = navGroupResizerEl.offsetWidth;
        navBarCollapseEl.classList.remove("show");
        
        // adjust CSS variables for sizing of navbar elements to align with gridlines
        remSizePx = parseFloat(rootStyle.getPropertyValue("font-size"));
        setSizeForGridAlignment(h1HeightBaselinePx, h1HeightVar);
        setSizeForGridAlignment(h1WidthBaselinePx, h1WidthVar);
        setSizeForGridAlignment(navCellHeightBaselinePx, navCellHeightVar);
        setSizeForGridAlignment(navToggledWidthBaselinePx, navToggledWidthVar);
        setSizeForGridAlignment(navGroupWidthBaselinePx, navGroupWidthVar);

        // measure final navbar height and set corresponding CSS variable to control curtain transformation 
        navBarHeightPx = navBarEl.offsetHeight;
        root.style.setProperty(navBarHeightVar, navBarHeightPx + "px");

        // measure required offset for parallax background and spacer height, and set corresponding CSS variables
        var bannerHeightPx = Math.min(bannerHeightMaxPx, viewportWidthPx / bannerWidthMaxPx * bannerHeightMaxPx);
        var bannerOffsetPx = Math.max(h1El.offsetHeight, navBarHeightPx) - (bannerHeightPx * bannerClearanceRatio);
        bannerOffsetPx = Math.max(0, bannerOffsetPx)
        root.style.setProperty(bannerOffsetVar, bannerOffsetPx + "px"); 

        var parallaxSpacerPx = bannerHeightPx - navBarHeightPx + bannerOffsetPx
        root.style.setProperty(parallaxSpacerVar, parallaxSpacerPx + "px"); 
    }

    function setSizeForGridAlignment(sizeBaselinePx, sizeVar) {
        // calculate new size based on rounding baseline up to next gridline, and update the corresponding CSS variable
        var sizeNewGrids = Math.ceil(++sizeBaselinePx / gridNewPx);

        var sizeNewRem = sizeNewGrids * gridNewPx / remSizePx + "rem";
        root.style.setProperty(sizeVar, sizeNewRem);
    }

    function scrollHandler() {
        var posAfterScroll = window.scrollY;
        if (posAfterScroll == 0) {
            // reset at top
            navBarEl.classList.remove("curtain-active");
            navBarEl.classList.remove("curtain-hide");
        } else if (posAfterScroll > navBarHeightPx) {
            // if scrolling below header height
            if (posBeforeScroll < posAfterScroll) {  
                // if scrolling down, hide curtain
                    navBarEl.classList.add("curtain-hide");
                    navBarCollapseEl.classList.remove("show");
            } else {
                // if scrolling up, activate curtain and unhide it
                    navBarEl.classList.add("curtain-active");
                    navBarEl.classList.remove("curtain-hide");
            }
        }
        posBeforeScroll = posAfterScroll;
    }
