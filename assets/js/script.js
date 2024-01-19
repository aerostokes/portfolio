
var headerHeight = document.getElementById("header").offsetHeight; 
var posBeforeScroll = window.scrollY;

window.onscroll = function() {
    var posAfterScroll = window.scrollY;
    
    if (posAfterScroll == 0) {
        // reset at top
        document.querySelector(".navbar").classList.remove("curtain-active");
        document.querySelector(".navbar").classList.remove("curtain-hide");
    } else if (posAfterScroll > headerHeight) {
        // if scrolling below header header height
        if (posBeforeScroll < posAfterScroll) {  
            // if scrolling down, hide curtain
                document.querySelector(".navbar").classList.add("curtain-hide");
                document.querySelector(".navbar-collapse").classList.remove("show");
        } else {
            // if scrolling up, activate curtain and unhide it
                document.querySelector(".navbar").classList.add("curtain-active");
                document.querySelector(".navbar").classList.remove("curtain-hide");
        }
    }
    posBeforeScroll = posAfterScroll;
}