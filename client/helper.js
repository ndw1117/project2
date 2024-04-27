
/* Takes in an success message. Sets the success message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in success.
*/
const handleSuccess = (message) => {
  let messageElement = document.getElementById('errorMessage');
  messageElement.textContent = message;
  messageElement.style.color = 'green';
  messageElement.classList.remove('hidden');
};


/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorMessage').classList.remove('hidden');
};

/* Sends post requests with form data to the server using fetch. Will look for various
 entries in the response JSON object, and will handle them appropriately.
*/
const sendFormData = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  });

  const result = await response.json();
  document.getElementById('errorMessage').classList.add('hidden');

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }

  return result;
};

/* Sends post requests to the server using fetch. Will look for various
 entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('errorMessage').classList.add('hidden');

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }

  return result;
};

const hideError = () => {
  document.getElementById('errorMessage').classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  hideError,
  handleSuccess,
  sendFormData,
};