const urlField = document.querySelector('#url');
const issuesOutput = document.querySelector('#issues');

// fetch accessbl. issues
const testAccessibility = async (e) => {
  e.preventDefault();

  const url = urlField.value;

  if (url === '') {
    alert('Please add a url');
  } else {
    setLoading();

    const response = await fetch(`api/test?url=${url}`);

    if (response.status !== 200) {
      setLoading(false);
      alert('Something went wrong');
    } else {
      const { issues } = await response.json();
      addIssuesToDOM(issues);
      setLoading(false);
    }
  }
};
// add issues to DOM

const addIssuesToDOM = (issues) => {
  const issuesOutput = document.querySelector('#issues');
  issuesOutput.innerHTML = '';

  if (issues.length === 0) {
    issuesOutput.innerHTML = '<h4>Hooray! No Issues Found</h4>';
  } else {
    issues.forEach((issue) => {
      const output = `
      <div class="card mb-5">
      <div class="card-body">
        <h4>${issue.message}</h4>
        <p class="bg-light p-3 my-3">
          ${escapeHTML(issue.context)}
        </p>
        <p class="bg-secondary text-light p-2">
          CODE: ${issue.code}
        </p>
      </div>
    </div>
      `;

      issuesOutput.innerHTML += output;
    });
  }
};

function setIntervalImmediately(func, interval) {
  func();
  return setInterval(func, interval);
}

// show messages------------
let intervalID = null;
let i = 0;

const launchMessageShow = (stop = false) => {
  const msgBox = document.querySelector('#message');
  const sampleMessages = [
    'This might take a while..',
    'Do not close the window..',
    'Testing in progress..',
    "We're almost done..",
    'Assembling results..',
  ];
  function showMessage() {
    msgBox.innerHTML = sampleMessages[i];
    i++;
    if (i == sampleMessages.length) {
      clearInterval(intervalID);
    }
  }

  if (stop) {
    clearInterval(intervalID);
    msgBox.innerHTML = '';
    i = 0;
  } else {
    intervalID = setIntervalImmediately(showMessage, 3000);
  }
};
// show messages end -------------------------------

// set loading state
const setLoading = (isLoading = true) => {
  const loader = document.querySelector('.loader');
  if (isLoading) {
    loader.style.display = 'block';
    launchMessageShow();
  } else {
    loader.style.display = 'none';
    launchMessageShow(stop);
  }
};

// escape HTML
function escapeHTML(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const clearTestInfo = () => {
  urlField.value = '';
  issuesOutput.innerHTML = '';
};

document.querySelector('#form').addEventListener('submit', testAccessibility);
document.querySelector('#clear').addEventListener('click', clearTestInfo);
