function createConfirmationModal(message, triggerButton) {
  const modalHTML = `
    <div id="confirmationModal" style="display:none; position:absolute; background:#ffffff; padding:20px; border:1px solid #34568B; box-shadow:0 4px 8px rgba(0,0,0,0.2); border-radius:8px; z-index:1001;">
      <p style="margin:0; font-size:16px; color:#333;">${message}?</p>
      <div style="margin-top:20px; text-align:center;">
        <button id="confirmYes" style="background:#34568B; color:#ffffff; border:none; border-radius:4px; padding:10px 20px; font-size:16px; cursor:pointer; margin-right:10px;">Так</button>
        <button id="confirmNo" style="background:#e0e0e0; color:#34568B; border:none; border-radius:4px; padding:10px 20px; font-size:16px; cursor:pointer;">Ні</button>
      </div>
    </div>
    <div id="overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;"></div>
  `

  document.body.insertAdjacentHTML('beforeend', modalHTML)

  return new Promise((resolve) => {
    const modal = document.getElementById('confirmationModal')
    const overlay = document.getElementById('overlay')

    const rect = triggerButton.getBoundingClientRect()
    modal.style.top = `${rect.top + window.scrollY + 35}px`
    modal.style.left = `${rect.left + window.scrollX}px`

    modal.style.display = 'block'
    overlay.style.display = 'block'

    document.getElementById('confirmYes').onclick = () => {
      modal.style.display = 'none'
      overlay.style.display = 'none'
      modal.remove()
      overlay.remove()
      location.reload()
      resolve(true)
    }

    document.getElementById('confirmNo').onclick = () => {
      modal.style.display = 'none'
      overlay.style.display = 'none'
      modal.remove()
      overlay.remove()
      location.reload()
      resolve(false)
    }
  })
}

function showAlertModal(message, triggerButton) {
  const alertHTML = `
    <div id="alertModal" style="display:none; position:absolute; background:#ffffff; padding:20px; border:1px solid #34568B; box-shadow:0 4px 8px rgba(0,0,0,0.2); border-radius:8px; z-index:1001;">
      <p style="margin:0; font-size:16px; color:#333;">${message}</p>
      <div style="margin-top:20px; text-align:center;">
        <button id="alertOk" style="background:#34568B; color:#ffffff; border:none; border-radius:4px; padding:10px 20px; font-size:16px; cursor:pointer;">OK</button>
      </div>
    </div>
    <div id="overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;"></div>
  `

  document.body.insertAdjacentHTML('beforeend', alertHTML)

  const alertModal = document.getElementById('alertModal')
  const overlay = document.getElementById('overlay')

  const rect = triggerButton.getBoundingClientRect()
  alertModal.style.top = `${rect.top + window.scrollY + 35}px`
  alertModal.style.left = `${rect.left + window.scrollX}px`

  alertModal.style.display = 'block'
  overlay.style.display = 'block'

  document.getElementById('alertOk').onclick = () => {
    alertModal.style.display = 'none'
    overlay.style.display = 'none'
    alertModal.remove()
    overlay.remove()
    location.reload()
  }
}

document.getElementById('sendButton').addEventListener('click', async (event) => {
  event.preventDefault()

  const name = document.getElementById('nameField').value
  const email = document.getElementById('emailField').value
  const message = document.getElementById('messageField').value

  const redirectApiHost = 'https://gateway.silver-service.com.ua:8008/api/liqpay/callback/send-msg/'

  const apiAddress = `${redirectApiHost}?name=${name}&email=${email}&message=${message}`
  try {
    const response = await fetch(apiAddress, {
      method: "GET",
      mode: "cors",
      cache: "no-cache"
    })

    const urlParams = new URLSearchParams(window.location.search)
    const language = urlParams.get('lang') || 'en'
    console.log('language-for-button', language)

    let successMessage, errorMessage;

    if (language === 'uk') {
      successMessage = 'Повідомлення успішно надіслано'
      errorMessage = 'Помилка при відправці повідомлення'
    } else if (language === 'pl') {
      successMessage = 'Wiadomość została pomyślnie wysłana'
      errorMessage = 'Błąd podczas wysyłania wiadomości'
    } else if (language === 'de') {
      successMessage = 'Nachricht erfolgreich gesendet'
      errorMessage = 'Fehler beim Senden der Nachricht'
    } else {
      successMessage = 'Message sent successfully'
      errorMessage = 'Error sending message'
    }

    console.log('response', response)
    if (response.ok) {
      //createConfirmationModal(successMessage, event.target);
      showAlertModal(successMessage, event.target)
    } else {
      showAlertModal(errorMessage, event.target)
    }
  } catch (error) {
    console.error('Fetch error:', error);
    showAlertModal('An error occurred while sending the message. Please try again later.', event.target)
  }
})


function updateVideoBasedOnLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const language = urlParams.get('lang') || 'en';
  console.log('language-for-video', language);
  const videoFrame = document.getElementById('videoFrame');
  const videoLinks = {
    'en': './images/en-point.mp4',
    'uk': './images/uk-point.mp4',
    'pl': './images/pl-point.mp4',
    'de': './images/de-point.mp4'
  };

  if (videoFrame) {
    if (videoLinks[language]) {
      videoFrame.src = videoLinks[language];
    } else {
      videoFrame.src = videoLinks['en'];
    }
  } else {
    console.error('Element with id "videoFrame" not found');
  }
}

document.addEventListener('DOMContentLoaded', updateVideoBasedOnLanguage)