/**
 * Indicates Current records switch
 * @param {object} event - event object
 * @return {undefined}
 */
const injectRedflagRecords = () => {
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);
  let incidentURL;
  const recordId = localStorage.getItem("recordId");
  const loader = document.querySelector("#homeLoaderContainer .homeLoader");
  loader.style.display = "inline-block";

  if (RegExp("/displayrecord").test(location.href)) {
    incidentURL = `${redflagURL}/${recordId}`;
  } else {
    incidentURL = redflagURL;
  }

  fetch(`${incidentURL}`, {
    method: "GET",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/json",
      "authorization": token
    }
  })
    .then((res) => res.json())
    .then((responseData) => {
      const { status, data } = responseData;
      if (data.length < 1) {
        document.getElementsByClassName("post-display")[0].innerHTML = `
          <h1 style='margin-bottom: 50%; color:grey; padding: 3em 0 0 0; text-align:center; font-size:2em'>NO RED-FLAG RECORDS</h1>
          `;
        loader.style.display = "none";
      } else if (status === 200) {
        data.forEach((obj) => {
          document.getElementsByClassName("post-display")[0].innerHTML +=
            `
                `;

          if (decoded.id !== obj.createdby) {
            const editComment = document.querySelectorAll("button.edit-comment");
            const editLocation = document.querySelectorAll("button.edit-location");
            const deleteButton = document.querySelectorAll("button.delete");

            forEachRemove(editComment);
            forEachRemove(editLocation);
            forEachRemove(deleteButton);
          }
        });
      }
      loader.style.display = "none";
    });
};


window.addEventListener("load", ()=>{
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);
  let image = decoded.profileImage;
  const profile = document.querySelectorAll("div.profile-image-container");
  const newImage = localStorage.getItem("profileimage");
  if (newImage !== null) {
    image = newImage;
  }

  if (profile.length > 0) {
    profile[0].innerHTML = `
    <div class="profile-details-border">
            <img src="${image}" alt="avatar" class="large-avatar"/> <br>
            <label for="uploadProfileImage" class="theme-orange hover">change image</label>
            <input type="file" id="uploadProfileImage" accept="image/*"/>
            <img src="../images/loader_blue.GIF" class="profileLoader" />
            <h1>${decoded.firstname}, ${decoded.lastname}</h1>

        <div class="profile-details">
            <label class="blue">Username:</label> <span>${decoded.username}</span> <br>
            <label class="blue">Email:</label> <a href="mailto:${decoded.email}">${decoded.email}</a> <br>
            <label class="blue">Phone:</label> <a href="tel:${decoded.phoneNumber}">${decoded.phoneNumber}</a> <br>
        </div>
    </div>`;
  }
});


let imageURL;
/**
 * PATCH profile image
 * @param {object} event
 */
const updateProfilePicture = () => {
  const token = localStorage.getItem("token");
  const loader = document.querySelectorAll(".profileLoader")[0];
  const updateURL = imageURL;
  loader.style.display = "block";
  fetch(profileImageUploadURL, {
    method: "PATCH",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/json",
      "authorization": token
    },
    body: JSON.stringify({ profileImage: updateURL })
  })
    .then((res) => res.json())
    .then((responseData) => {
      const { status, data, error } = responseData;
      if (status === 200) {
        loader.style.display = "none";
        localStorage.setItem("profileimage", updateURL);
        toggleGeneralMessage(data[0].message, true);
        setTimeout(() => {
          toggleGeneralMessage("Reauthenticate to effect full change", false);
        }, 5000);
      } else {
        loader.style.display = "none";
        toggleGeneralMessage(error, false);
      }
    });
};



/**
 * Upload image to cloudinary
 * @param {object} event event object
 */
const changeProfileImage = (event) => {
  const loader = document.querySelectorAll(".profileLoader")[0];
  loader.style.display = "block";
  const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/shaolinmkz/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "opnviynn";
  if (event.target.id === "uploadProfileImage"){
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (typeof data.secure_url !== "undefined") {
          loader.style.display = "none";
          toggleGeneralMessage("Almost completed", false);
          console.log(data.secure_url);
          imageURL = data.secure_url;
          updateProfilePicture();
        } else {
          loader.style.display = "none";
          toggleGeneralMessage("uploading failed", false);
        }
      });
  }
};

window.addEventListener("change", changeProfileImage);



/**
 * LOAD redflag status count
 * @param {object} event
 */
const loadRedflagStatusCount = () => {
  const token = localStorage.getItem("token");
  fetch(`${redflagURL}/profile/status`, {
    method: "GET",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/json",
      "authorization": token
    }
  })
    .then((res) => res.json())
    .then((responseData) => {
      const { status, data } = responseData;
      if (status === 200) {
        document.getElementById("rf-draft").innerHTML = data[0].draft;
        document.getElementById("rf-resolved").innerHTML = data[0].resolved;
        document.getElementById("rf-under-investigation").innerHTML = data[0].underInvestigation;
        document.getElementById("rf-rejected").innerHTML = data[0].rejected;
      }
    });
};

window.addEventListener("load", () => {
  const recordCount = document.querySelectorAll(".record-count");
  if (recordCount.length > 0) {
    loadRedflagStatusCount();
  }
});


/**
 * LOAD intervention status count
 * @param {object} event
 */
const loadInterventionStatusCount = () => {
  const token = localStorage.getItem("token");
  fetch(`${interventionURL}/profile/status`, {
    method: "GET",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/json",
      "authorization": token
    }
  })
    .then((res) => res.json())
    .then((responseData) => {
      const { status, data } = responseData;
      if (status === 200) {
        document.getElementById("int-draft").innerHTML = data[0].draft;
        document.getElementById("int-resolved").innerHTML = data[0].resolved;
        document.getElementById("int-under-investigation").innerHTML = data[0].underInvestigation;
        document.getElementById("int-rejected").innerHTML = data[0].rejected;
      }
    });
};

window.addEventListener("load", () => {
  const recordCount = document.querySelectorAll(".record-count");
  if (recordCount.length > 0) {
    loadInterventionStatusCount();
  }
});
