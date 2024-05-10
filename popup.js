// add event listener to the button
let scrapePage = document.getElementById("scrapePage");
scrapePage.addEventListener("click", async () => {
  // get current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script to scrape LinkedIn Page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeLinkedInPage,
  });
});

let list = document.getElementById("list");
let list2 = document.getElementById("list2");
let name_div = document.getElementById("name");
let job_title_div = document.getElementById("title");

// handler to receive the messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let name = request.name;
  name_div.innerHTML = name;
  let job_title = request.job_title;
  job_title.innerHTML = job_title;
  list.innerHTML = "Experiences";
  list2.innerHTML = "Education";
  let experiences = request.experiences;
  let education_experiences = request.education_experiences;

  // update the popup to display the information
  experiences.forEach((experience) => {
    let experience_li = document.createElement("li");
    experience_li.innerHTML = experience.join("\n");
    list.appendChild(experience_li);
  });

  education_experiences.forEach((education) => {
    let education_li = document.createElement("li");
    education_li.innerHTML = education.join("\n");
    list2.appendChild(education_li);
  });
});

// main function to search the HTML and scrape the LinkedIn Page
function scrapeLinkedInPage() {
  let name = document.querySelector("h1").innerText;
  let job_title = document.querySelector(
    ".text-body-medium.break-words"
  ).innerText;

  // find all work history items
  let experiences = [];
  let education_experiences = [];
  let experience_list = document.querySelector("#experience~div ul");
  console.log(experience_list);
  let work_history_items = experience_list.querySelectorAll(
    "#experience~div>ul>li"
  );
  work_history_items.forEach((item) => {
    title = item.querySelector("span");
    company = item.querySelector("span span");
    time = item.querySelectorAll("span span")[2];
    let result = [];
    if (title) {
      console.log(title.innerHTML.replace(/<!--.*?-->/g, ""));
      result.push(title.innerHTML.replace(/<!--.*?-->/g, ""));
    }
    if (company) {
      console.log(company.innerHTML.replace(/<!--.*?-->/g, ""));
      result.push(company.innerHTML.replace(/<!--.*?-->/g, ""));
    }
    if (time) {
      console.log(time.innerHTML.replace(/<!--.*?-->/g, ""));
      result.push(time.innerHTML.replace(/<!--.*?-->/g, ""));
    }
    if (result && result.length != 0) {
      experiences.push(result);
    }
  });

  // find all education history items
  let education_list = document
    .querySelector("#education~div ul")
    .querySelectorAll("#education~div ul li");
  education_list.forEach((item) => {
    school = item.querySelector(
      "div.display-flex.align-items-center.mr1.t-bold span"
    );
    degree = item.querySelector("[class='t-14 t-normal']");
    degree_time = item.querySelector("span.t-14.t-normal.t-black--light span");
    let result2 = [];
    if (school) {
      // console.log(school.innerHTML.replace(/<!--.*?-->/g, ""));
      result2.push(school.innerHTML.replace(/<!--.*?-->/g, ""));
    }
    if (degree) {
      /*
      console.log(
        degree.innerHTML
          .replace(/<.*?>/g, "")
          .trim()
          .slice(0, degree.innerHTML.replace(/<.*?>/g, "").trim().length / 2)
      );
      */
      result2.push(
        degree.innerHTML
          .replace(/<.*?>/g, "")
          .trim()
          .slice(0, degree.innerHTML.replace(/<.*?>/g, "").trim().length / 2)
      );
    }
    if (degree_time) {
      //console.log(degree_time.innerHTML.replace(/<!--.*?-->/g, ""));
      result2.push(degree_time.innerHTML.replace(/<!--.*?-->/g, ""));
    }
    if (result2 && result2.length != 0) {
      education_experiences.push(result2);
    }
  });
  console.log("Here is the information: ");
  console.log(name);
  console.log(job_title);
  console.log(experiences);
  console.log(education_experiences);

  // send data to be displayed
  chrome.runtime.sendMessage({
    name: name,
    job_title: job_title,
    experiences: experiences,
    education_experiences: education_experiences,
  });

  // this will be the json we could use
  let data = {
    name: name,
    job_title: job_title,
    experiences: experiences,
    education_experiences: education_experiences,
  };
}
