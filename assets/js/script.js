// Hello, thanks for stopping by. I enjoy developing elegant solutions that perform complex tasks 
// and I take a lot of pride in ensuring that my code is clear, efficient, and properly annotated.
// So I hope you enjoy perusing my portfolio as much as I did creating it.


    // initiate global variables
    var root = document.querySelector(":root");
    var rootStyle = getComputedStyle(root);
    
    var gridBaselineSizeVar = "--grid-baseline-size-px";
    var gridAdjustedSizeVar = "--grid-adjusted-size-px";
    var gridAdjustedPx, gridAdjustedRem;
    
    var brandBlockEl = document.getElementById("brand-block");
    var brandHeightVar = "--brand-block-height";
    var brandWidthVar = "--brand-block-width";

    var navBlockEl = document.getElementById("nav-block");
    var navWidthVar = "--nav-block-width";
    var navHeightVar = "--nav-block-height";
    var navToggleBarEl = document.getElementById("nav-toggle-bar");
    var navHeightPx;

    var bannerHeightRef = parseFloat(rootStyle.getPropertyValue("--banner-height-ref"));
    var bannerAspectRatio = parseFloat(rootStyle.getPropertyValue("--banner-width-ref")) / bannerHeightRef;
    var bannerHeaderClearanceRatio = parseFloat(rootStyle.getPropertyValue("--banner-header-clearance-ref")) / bannerHeightRef;
    var bannerOffsetVar = "--banner-offset-y";

    var posBeforeScroll = window.scrollY;
    

    // initiate handlers
    window.onload = resizeHandler;
    window.onresize = resizeHandler;
    window.onscroll = scrollHandler;


    // resize grid to align with viewport,
    // resize header cells to align with grid,
    // and adjust banner offset-y for clearance of the airplane wings to the header blocks 
    function resizeHandler() {
        // calculate new grid size based on an even number of grids across viewport and update the corresponding CSS variable
        var viewportWidthPx = window.innerWidth;
        var gridBaselinePx = parseFloat(rootStyle.getPropertyValue(gridBaselineSizeVar));
        var numGrids = Math.floor(viewportWidthPx / gridBaselinePx);
        if (numGrids % 2 != 0) { numGrids++ };
        gridAdjustedPx = viewportWidthPx / numGrids;
        gridAdjustedRem = gridAdjustedPx / parseFloat(rootStyle.getPropertyValue("font-size"));
        root.style.setProperty(gridAdjustedSizeVar, gridAdjustedPx + "px");
        root.style.setProperty(gridAdjustedSizeVar, gridAdjustedPx + "px");
        
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
        setSizeForGridAlignment(brandHeightBaselinePx, brandHeightVar);
        setSizeForGridAlignment(brandWidthBaselinePx, brandWidthVar);
        setSizeForGridAlignment(navWidthBaselinePx, navWidthVar);
        navHeightPx = setSizeForGridAlignment(navHeightBaselinePx, navHeightVar);

        // measure required offset-y of banner to clear header blocks and set corresponding CSS variable
        var bannerHeightPx = Math.min(bannerHeightRef, viewportWidthPx / bannerAspectRatio);
        var bannerOffsetPx = Math.max(brandBlockEl.offsetHeight, navHeightPx) - (bannerHeightPx * bannerHeaderClearanceRatio);
        bannerOffsetPx = Math.max(0, bannerOffsetPx)
        root.style.setProperty(bannerOffsetVar, bannerOffsetPx + "px"); 
    }
    

    // calculate new size based on rounding baseline up to next gridline
    // updates corresponding CSS variables to new size in Rem, returns new size value in Px
    function setSizeForGridAlignment(sizeBaselinePx, sizeVar) {
        var sizeNewGrids = Math.ceil(++sizeBaselinePx / gridAdjustedPx);
        var sizeNewRem = sizeNewGrids * gridAdjustedRem + "rem";
        root.style.setProperty(sizeVar, sizeNewRem);

        var sizeNewPx = sizeNewGrids * gridAdjustedPx;
        return sizeNewPx
    }


    // control navbar visibility based on user scroll position and direction 
    function scrollHandler() {
        var posAfterScroll = window.scrollY;
        if (posAfterScroll == 0) {
            // at the top, reset navbar classes to default values
            navBlockEl.classList.remove("active");
            navBlockEl.classList.remove("hidden");
        } else if (posAfterScroll > navHeightPx) {
            // if scrolling below navbar height, hide/show navbar based on scroll direction
            if (posBeforeScroll < posAfterScroll) {  
                // if scrolling down, hide navbar and collapse (if needed)
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
                // if scrolling up, activate navbar and unhide it
                navBlockEl.classList.add("active");
                navBlockEl.classList.remove("hidden");
            }
        }
        posBeforeScroll = posAfterScroll;
    }
