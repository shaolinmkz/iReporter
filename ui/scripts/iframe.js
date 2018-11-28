/**
 * Enlarge picture
 */
window.addEventListener("click", (e) => {
    if (e.target.className == "picture-evidence") {
        document.getElementsByClassName("image-enlarge")[0].src = e.target.src;
        document.getElementsByClassName("outer-modal")[0].style.display = "block";
    } else if (e.target.className == "outer-modal") {
        document.getElementsByClassName("outer-modal")[0].style.display = "none";
    }
});

/**
 * edit comment
 */
const editComment = (event) => {
    const initialComment = event.target.parentNode.children[0].innerHTML.trim();

    if(/edit-comment/gm.test(event.target.className)) {
        //target the parent node of the target element
        const target = event.target.parentNode;

        //hide the paragragh inside the div with a class="story"
        target.children[0].style.display = "none";

        //Insert HTML mark-up into the the second child of the target element
        target.children[1].innerHTML = `
            <textarea class="editing-tag" id="updatedComment">${initialComment}</textarea>
            <span class="editing-tag"><a class="red edit cancel">cancel</a> <span>&nbsp;</span><a class="blue edit">update</a></span>
            `
    }

}
window.addEventListener("click", editComment);




/**
 * hide an element
 * @param { elem } elem - html element/tag
 */
const hideMe = (elem) => {
    elem.style.display = "none";
}


const cancelCommentUpdate = () => {
    if (/cancel/gm.test(event.target.className)) {
        const target = event.target.parentNode.parentNode.parentNode;
        const childrenLength = target.children.length;
        
        //display the paragragh inside the div with a class="story"
        target.children[0].style.display = "block";

        //display the update button feature
        target.children[childrenLength - 1].style.display = "inline-block";
        
        //remove the content inside the div with class= "insert-editing-tag-here"
        target.children[1].innerHTML = "";
    }
}

window.addEventListener("click", cancelCommentUpdate);


const editLocation = (event) => {
    
    if (/edit-location/gm.test(event.target.className)) {
       //target the parent node of the target element
        const target = event.target.parentNode;
        const initialLoaction = target.children[12];
        
        //hide the initial location field
        initialLoaction.style.display = "none";

        //insert the string of mark-up into the HTML element with class="insert-location-editing-tag-here"
        target.children[14].innerHTML += `
        <input type="text" class="location-input" value="${initialLoaction.innerHTML}" />
        <span class="editing-button-tag">
         <a class="red edit exit">cancel</a> 
         <span>&nbsp;</span><a class="blue edit">update</a></span> `
    }
    

}

window.addEventListener("click", editLocation);


const cancelLocationUpdate = (event) => {
    if (/exit/gm.test(event.target.className)) {
        const target = event.target.parentNode;
        
        //set the location back to default
        target.parentNode.parentNode.children[12].style.display = "inline-block";

        //set the modify button back to its original position
        target.parentNode.parentNode.children[15].style.display = "inline-block";

        //Remove the edit location input field
        target.parentNode.innerHTML = "";       
    }
}

window.addEventListener("click", cancelLocationUpdate);



