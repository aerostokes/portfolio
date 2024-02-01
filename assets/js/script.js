    var root = document.querySelector(":root");
    var rootStyle = getComputedStyle(root);
    
    var gridSizeVar = "--grid-size-rem"
    var gridBaselineRem = parseFloat(rootStyle.getPropertyValue(gridSizeVar));
    var remSizePx = parseFloat(rootStyle.getPropertyValue("font-size"));
    
    var h1Cell = document.querySelector("h1")
    var h1CellHeightVar = "--h1-cell-height";
    var h1CellWidthVar = "--h1-cell-width";

    var navCellResizerEl = document.getElementById("nav-cell-resizer");
    var navCellHeightVar = "--nav-cell-height";
    var navToggledWidthVar = "--nav-toggled-width"

    var navGroupResizerEl = document.getElementById("nav-group-resizer")
    var navGroupWidthVar = "--nav-group-width";

    var navBarEl = document.querySelector(".navbar");
    var navBarHeightPx = navBarEl.offsetHeight;
    var navBarHeightVar = "--navbar-height"
    var navBarCollapseEl = document.querySelector(".navbar-collapse")
    var posBeforeScroll = window.scrollY;

    // initiate handlers
    window.onload = resizeHandler;
    window.onresize = resizeHandler;
    window.onscroll = scrollHandler;


    // resize grid to align with viewport and resize header cells to align with grid
    function resizeHandler() {
        //reset auto-sized elements
        root.style.setProperty(h1CellHeightVar, "auto")
        root.style.setProperty(h1CellWidthVar, "auto")
        root.style.setProperty(navCellHeightVar, "auto")
        root.style.setProperty(navToggledWidthVar, "auto")
        root.style.setProperty(navGroupWidthVar, "auto")
        

        // show navbar (if hidden), collect auto-sized dimensions, then re-hide navbar
        navBarCollapseEl.classList.add("show");
        var h1CellHeightPx = h1Cell.offsetHeight
        var navCellHeightPx = navCellResizerEl.offsetHeight
        var navToggledWidthPx = navCellResizerEl.offsetWidth
        var navGroupWidthPx = navGroupResizerEl.offsetWidth
        navBarCollapseEl.classList.remove("show");


        // adjust CSS variable for grid-size to an even distribution across viewport
        var vwRem = window.innerWidth / remSizePx
        var gridNewRem = gridBaselineRem + ((vwRem % gridBaselineRem)/Math.floor(vwRem / gridBaselineRem))
        root.style.setProperty(gridSizeVar, gridNewRem + "rem")


        //-- adjust CSS variables for h1-cell-height and h1-cell-width to align with gridlines
        var h1CellHeightGrids = (h1CellHeightPx / remSizePx) / gridNewRem 
        if (h1CellHeightGrids % 1 < 0.2) {
            h1CellHeightGrids = parseInt(h1CellHeightGrids)
        } else {
            h1CellHeightGrids = 1 + parseInt(h1CellHeightGrids)
        }
        root.style.setProperty(h1CellHeightVar, h1CellHeightGrids * gridNewRem + "rem");
        
        var h1CellWidthPx = h1Cell.clientWidth
        var h1CellWidthGrids = (h1CellWidthPx / remSizePx) / gridNewRem 
        if (h1CellWidthGrids % 1 < 0.2) {
            h1CellWidthGrids = parseInt(h1CellWidthGrids)
        } else {
            h1CellWidthGrids = 1 + parseInt(h1CellWidthGrids)
        }
        root.style.setProperty(h1CellWidthVar, h1CellWidthGrids * gridNewRem + "rem")


        //-- adjust CSS variables for nav-cell-height and nav-toggled-width to align with gridlines
        var navCellHeightGrids = (navCellHeightPx / remSizePx) / gridNewRem 
        if (navCellHeightGrids % 1 < 0.2) {
            navCellHeightGrids = parseInt(navCellHeightGrids)
        } else {
            navCellHeightGrids = 1 + parseInt(navCellHeightGrids)
        }
        root.style.setProperty(navCellHeightVar, navCellHeightGrids * gridNewRem + "rem");

        var navToggleWidthGrids = (navToggledWidthPx / remSizePx) / gridNewRem 
        if (navToggleWidthGrids % 1 < 0.2) {
            navToggleWidthGrids = parseInt(navToggleWidthGrids)
        } else {
            navToggleWidthGrids = 1 + parseInt(navToggleWidthGrids)
        }
        root.style.setProperty(navToggledWidthVar, navToggleWidthGrids * gridNewRem + "rem");


        //-- adjust CSS variables for nav-group-width and --navbar-height to align with gridlines
        var navGroupWidthGrids = (navGroupWidthPx / remSizePx) / gridNewRem 
        if (navGroupWidthGrids % 1 < 0.2) {
            navGroupWidthGrids = parseInt(navGroupWidthGrids)
        } else {
            navGroupWidthGrids = 1 + parseInt(navGroupWidthGrids)
        }
        root.style.setProperty(navGroupWidthVar, navGroupWidthGrids * gridNewRem + "rem");
        navBarHeightPx = navBarEl.offsetHeight
        root.style.setProperty(navBarHeightVar, navBarHeightPx + "px");
    }


    function scrollHandler() {
        var posAfterScroll = window.scrollY;

        if (posAfterScroll == 0) {
            // reset at top
            navBarEl.classList.remove("curtain-active");
            navBarEl.classList.remove("curtain-hide");
        } else if (posAfterScroll > navBarHeightPx) {
            // if scrolling below header header height
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
